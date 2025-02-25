import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "@env";

const getCommuteSteps = async (origin, destination) => {
  if (!origin || !destination) {
    return { status: "error", message: "Please select both origin and destination." };
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=transit&alternatives=true&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.status !== "OK") {
      return { status: "error", message: "No available route found." };
    }

    let alternativeRoutes = [];

    response.data.routes.slice(0, 3).forEach((route, index) => {
      let steps = [];
      let routeCoordinates = [];

      route.legs[0].steps.forEach((step) => {
        const travelMode = step.travel_mode;
        let instruction = step.html_instructions.replace(/<[^>]+>/g, ""); // Remove HTML tags

        let commuteDetail = {
          mode: travelMode,
          instruction: instruction,
          polyline: step.polyline.points,
          details: null,
        };

        if (step.transit_details) {
          const transit = step.transit_details;
          commuteDetail.details = {
            line: transit.line.name,
            vehicle: transit.line.vehicle.type,
            from: transit.departure_stop.name,
            to: transit.arrival_stop.name,
            departureTime: transit.departure_time.text,
            duration: step.duration.text,
            fare: transit.fare ? `PHP ${transit.fare.value.toFixed(2)}` : "Unknown",
            icon: transit.line.vehicle.icon,
          };
        }

        steps.push(commuteDetail);
        routeCoordinates.push(step.polyline.points);
      });

      alternativeRoutes.push({
        id: index,
        steps: steps,
        polyline: routeCoordinates,
        summary: route.summary,
        duration: route.legs[0].duration.text,
        fare: route.fare ? `PHP ${route.fare.text}` : "Unknown",
      });
    });

    return { status: "success", routes: alternativeRoutes };
  } catch (error) {
    console.error("Error fetching commute steps:", error);
    return { status: "error", message: "Failed to fetch commuting details." };
  }
};

export default getCommuteSteps;
