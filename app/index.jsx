import { useState } from "react";
import { View, Image, Text, TouchableOpacity, Dimensions } from "react-native";
import { Link } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { StatusBar } from "expo-status-bar";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("../assets/images/map.png"),
    text: "Find Your Way with Real-Time\nRoutes and Traffic Insights",
  },
  {
    id: "2",
    image: require("../assets/images/path.png"),
    text: "Get Step-by-Step Directions\nfor Your Journey",
  },
  {
    id: "3",
    image: require("../assets/images/empty.png"),
    text: "Stay Safe with Live Traffic Updates\nand Best Route Suggestions",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View className="flex-1 bg-[#4E5D6C] justify-between items-center px-6 pb-10">
      {/* Carousel */}
      <Carousel
        loop={false}
        width={width}
        height={height * 0.6}
        autoPlay={false}
        data={slides}
        scrollAnimationDuration={800}
        onProgressChange={(_, absoluteProgress) => setCurrentIndex(Math.round(absoluteProgress))}
        renderItem={({ item }) => (
          <View className="items-center justify-center" style={{ width }}>
            {/* Centered Image */}
            <Image 
              source={item.image} 
              style={{ width: width * 0.5, height: height * 0.5, marginBottom: 20 }} 
              resizeMode="contain" 
            />
            {/* Centered Text */}
            <Text className="text-white text-xl font-semibold text-center">
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View className="flex-row space-x-2 mt-4">
        {slides.map((_, index) => (
          <View
            key={index}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: index === currentIndex ? "white" : "gray",
              opacity: index === currentIndex ? 1 : 0.5,
            }}
          />
        ))}
      </View>

      {/* Bottom Section - Always Visible */}
      <View className="w-full items-center">
        <TouchableOpacity className="w-full bg-[#89A6B9] py-3 rounded-full mt-6">
          <Text className="text-center text-black font-semibold text-lg">Get Started</Text>
        </TouchableOpacity>

        <Link href="/auth/login" asChild>
          <TouchableOpacity className="w-full bg-black py-3 rounded-full mt-4">
            <Text className="text-center text-white font-semibold text-lg">Log in</Text>
          </TouchableOpacity>
        </Link>

        {/* Terms and Privacy Policy */}
        <Text className="text-white text-xs text-center mt-4 leading-5">
          By continuing you agree to{" "}
          <Text className="text-blue-300">Terms of Service</Text> and{" "}
          <Text className="text-blue-300">Privacy Policy</Text>
        </Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
