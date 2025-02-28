import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import { BASE_URL } from "@env";

const Charts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/users`) // Fetch users from backend
      .then((response) => {
        setUsers(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  // Count Users & Admins
  const totalUsers = users.length;
  const userCount = users.filter((user) => user.role === 1).length;
  const adminCount = users.filter((user) => user.role === 0).length;

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>📊 Charts</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00df82" />
      ) : (
        <View style={styles.statsContainer}>
          {/* Active Users Card */}
          <View style={[styles.card, styles.greenCard]}>
            <Text style={styles.cardTitle}>Active Users</Text>
            <Text style={styles.cardNumber}>{totalUsers}</Text>
          </View>

          {/* Total Users Card */}
          <View style={[styles.card, styles.blueCard]}>
            <Text style={styles.cardTitle}>Total Users</Text>
            <Text style={styles.cardNumber}>{userCount}</Text>
          </View>

          {/* Total Admins Card */}
          <View style={[styles.card, styles.orangeCard]}>
            <Text style={styles.cardTitle}>Total Admins</Text>
            <Text style={styles.cardNumber}>{adminCount}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", paddingTop: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#03624c", textAlign: "center", marginBottom: 20 },

  // Stats Container
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    marginTop: 20,
  },

  // Card Styling
  card: {
    width: "45%",
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  cardNumber: { fontSize: 30, fontWeight: "bold", color: "#fff", marginTop: 5 },

  // Custom Colors for Each Card
  greenCard: { backgroundColor: "#00df82" },
  blueCard: { backgroundColor: "#3380FF" },
  orangeCard: { backgroundColor: "#FF5733" },
});

export default Charts;
