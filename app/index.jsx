import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { Link } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";


const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("../assets/images/1.gif"),
    title: "Real-Time Navigation",
    text: "Find your way with accurate routes and live traffic insights",
  },
  {
    id: "2",
    image: require("../assets/images/2.gif"),
    title: "Step-by-Step Directions",
    text: "Clear instructions for every stage of your journey",
  },
  {
    id: "3",
    image: require("../assets/images/3.gif"),
    title: "Smart Route Planning",
    text: "Stay safe with traffic updates and best route suggestions",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={styles.container}>
      {/* Logo and App Name */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/logo.png")} 
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.appName}>Ai SaanKa?</Text>
      </View>

      {/* Carousel */}
      <Carousel
        loop={false}
        width={width}
        height={height * 0.55}
        autoPlay={false}
        data={slides}
        scrollAnimationDuration={800}
        onProgressChange={(_, absoluteProgress) => setCurrentIndex(Math.round(absoluteProgress))}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image
                source={item.image}
                style={styles.slideImage}
                contentFit="contain"
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideText}>{item.text}</Text>
            </View>
          </View>
        )}
      />

      {/* Pagination Indicators */}
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive
            ]}
          />
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Link href="/Screen/Main" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/Auth/Login" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Log In</Text>
          </TouchableOpacity>
        </Link>

        <Text style={styles.termsText}>
          By continuing you agree to{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 50,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0b617e',
    letterSpacing: 0.5,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  imageContainer: {
    width: '100%',
    height: height * 0.38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9f0',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0f0e0',
  },
  slideImage: {
    width: '85%',
    height: '85%',
  },
  textContainer: {
    paddingVertical: 25,
    alignItems: 'center',
    width: '100%',
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0b617e',
    marginBottom: 10,
    textAlign: 'center',
  },
  slideText: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '90%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dddddd',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    width: 24,
    height: 8,
    backgroundColor: '#0b617e',
    borderRadius: 4,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#0b617e',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  primaryButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: '#0b617e',
  },
  secondaryButtonText: {
    textAlign: 'center',
    color: '#0b617e',
    fontWeight: '600',
    fontSize: 18,
  },
  termsText: {
    color: '#777777',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
  termsLink: {
    color: '#0b617e',
    fontWeight: '500',
  },
});