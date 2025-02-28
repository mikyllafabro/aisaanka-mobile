import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import { BASE_URL } from "@env";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/users`) // Fetch from backend
      .then((response) => {
        setUsers(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Users List</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#03624c" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={[styles.userCard, item.role === 1 ? styles.userRole : styles.adminRole]}>
              <View style={styles.userDetails}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>
              <View style={[styles.roleTag, item.role === 1 ? styles.userTag : styles.adminTag]}>
                <Text style={styles.roleText}>{item.role === 1 ? "User" : "Admin"}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f4f4" },
  title: { fontSize: 24, fontWeight: "bold", color: "#03624c", textAlign: "center", marginBottom: 15 },

  // User Card Styling (Horizontal Layout)
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },

  userRole: { backgroundColor: "#00df82" }, // Green for Users
  adminRole: { backgroundColor: "#03624c" }, // Dark Green for Admins

  userDetails: { flex: 1 },

  username: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  email: { fontSize: 14, color: "#fff", marginTop: 2 },

  // Role Tag (Now in Horizontal Layout)
  roleTag: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },

  userTag: { backgroundColor: "#030f0f" },
  adminTag: { backgroundColor: "#f4f4f4" },

  roleText: { fontSize: 14, fontWeight: "bold", color: "#fff" },
});

export default Users;
