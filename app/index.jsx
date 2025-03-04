import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Link } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { StatusBar } from "expo-status-bar";
import { RootLayout } from "../app/_layout";
import { Image } from "expo-image";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("../assets/images/1.gif"),
    text: "Find Your Way with Real-Time\nRoutes and Traffic Insights",
  },
  {
    id: "2",
    image: require("../assets/images/2.gif"),
    text: "Get Step-by-Step Directions\nfor Your Journey",
  },
  {
    id: "3",
    image: require("../assets/images/3.gif"),
    text: "Stay Safe with Live Traffic Updates\nand Best Route Suggestions",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: '#0b617e', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 30 }}>
      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 50 }}>Ai SaanKa?</Text>
      <Carousel
        loop={false}
        width={width}
        height={height * 0.6}
        autoPlay={false}
        data={slides}
        scrollAnimationDuration={800}
        onProgressChange={(_, absoluteProgress) => setCurrentIndex(Math.round(absoluteProgress))}
        renderItem={({ item }) => (
          <View style={{ width, alignItems: 'center', justifyContent: 'flex-start' }}>
            <Image
              source={item.image}
              style={{ width: width * 0.8, height: height * 0.6, marginBottom: 10, marginTop: -40 }}
              resizeMode="contain"
            />
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center', fontFamily: 'Arial', marginTop: -90 }}>
              {item.text}
            </Text>
          </View>
        )}
      />

      <View style={{ flexDirection: 'row', space: 10, marginTop: 20 }}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={{
              width: 10,
              height: 10,
              borderRadius: 15,
              backgroundColor: index === currentIndex ? "white" : "gray",
              opacity: index === currentIndex ? 1 : 0.5,
            }}
          />
        ))}
      </View>

      <View style={{ width: '100%', alignItems: 'center' }}>
        <Link href="/auth/homescreen" asChild>
          <TouchableOpacity style={{ width: '100%', backgroundColor: '#0b998f', paddingVertical: 15, borderRadius: 30, marginTop: 30}}>
            <Text style={{ textAlign: 'center', color: '#fff', fontWeight: '600', fontSize: 18 }}>Get Started</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/auth/login" asChild>
          <TouchableOpacity style={{ width: '100%', backgroundColor: '#fff', paddingVertical: 15, borderRadius: 30, marginTop: 15 }}>
            <Text style={{ textAlign: 'center', color: '#0b998f', fontWeight: '600', fontSize: 18 }}>Log in</Text>
          </TouchableOpacity>
        </Link>

        <Text style={{ color: 'white', fontSize: 12, textAlign: 'center', marginTop: 15 }}>
          By continuing you agree to <Text style={{ color: '#0b998f' }}>Terms of Service</Text> and <Text style={{ color: '#0b998f' }}>Privacy Policy</Text>
        </Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}