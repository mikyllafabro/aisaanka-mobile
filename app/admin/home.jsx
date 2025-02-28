import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Welcome to the Admin Dashboard</Text>
      <Text style={styles.text}>
        Manage users, track activity history, and analyze data with charts.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#03624c" },
  text: { fontSize: 16, textAlign: "center", color: "#030f0f", marginTop: 10 },
});

export default Home;
