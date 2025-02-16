import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, Dimensions } from "react-native";
import { Link } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { StatusBar } from "expo-status-bar";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import HomeScreen from './auth/homescreen';

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
    <View style={{ flex: 1, backgroundColor: '#4E5D6C', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 30 }}>
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
          <View style={{ width, alignItems: 'center', justifyContent: 'center' }}>
            <Image 
              source={item.image} 
              style={{ width: width * 0.5, height: height * 0.5, marginBottom: 20 }} 
              resizeMode="contain" 
            />
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={{ flexDirection: 'row', space: 10, marginTop: 20 }}>
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
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Link href="/auth/homescreen" asChild>
          <TouchableOpacity style={{ width: '100%', backgroundColor: '#89A6B9', paddingVertical: 15, borderRadius: 30, marginTop: 20 }}>
            <Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 18 }}>Get Started</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/auth/login" asChild>
          <TouchableOpacity style={{ width: '100%', backgroundColor: 'black', paddingVertical: 15, borderRadius: 30, marginTop: 15 }}>
            <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600', fontSize: 18 }}>Log in</Text>
          </TouchableOpacity>
        </Link>

        <Text style={{ color: 'white', fontSize: 12, textAlign: 'center', marginTop: 15 }}>
          By continuing you agree to <Text style={{ color: '#007AFF' }}>Terms of Service</Text> and <Text style={{ color: '#007AFF' }}>Privacy Policy</Text>
        </Text>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}
