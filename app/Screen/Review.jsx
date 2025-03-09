import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native"; // For navigation
import { BASE_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Review = () => {
  const [suggestion, setSuggestion] = useState("");
  const [issue, setIssue] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (rating === 0) {
      Alert.alert("Rating Required", "Please provide a star rating before submitting!", [
        { text: "OK", style: "cancel" },
      ]);
      return;
    }
  
    setLoading(true);
  
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/review`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  // Ensure correct format
      },
        body: JSON.stringify({ suggestion, issue, rating }),
    });

  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert("Review Submitted", "Thank you for your feedback!", [
          { text: "OK", onPress: () => navigation.navigate("index") }, // Optionally go back after submission
        ]);
  
        // Reset form fields
        setSuggestion("");
        setIssue("");
        setRating(0);
      } else {
        throw new Error(data.message || "Failed to submit review");
      }
    } catch (error) {
      Alert.alert("Error", error.message, [
        { text: "OK", style: "cancel" },
      ]);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.card}>
      <Text style={styles.header}>Leave a Review</Text>

      {/* Suggestion Input */}
      <TextInput
        placeholder="Your Suggestion"
        style={styles.textInput}
        multiline
        value={suggestion}
        onChangeText={setSuggestion}
      />
      
      {/* Issue Input */}
      <TextInput
        placeholder="Report an Issue"
        style={styles.textInput}
        multiline
        value={issue}
        onChangeText={setIssue}
      />

      {/* Star Rating Selection */}
      <Text style={styles.ratingText}>Star Rating:</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            {star <= rating ? (
              <Icon name="star" size={30} color="#fbc02d" />
            ) : (
              <Icon name="star-border" size={30} color="#ccc" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <Button
        title={loading ? "Submitting..." : "Submit Review"}
        onPress={handleSubmit}
        disabled={loading}
        color={loading ? "#b0bec5" : "#0b617e"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    maxWidth: 500,
    alignSelf: "center",
    marginTop: 50,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%", // Adapt width for different devices
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0b617e",
    textAlign: "center",
    marginBottom: 20,
  },
  textInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
});

export default Review;
