import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@env";

export default function Profile() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState({ username: "", email: "", password: "" });
  const [currentPassword, setCurrentPassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log("Fetching user profile...");
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch(`${BASE_URL}/userdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Profile Data:", data);
      setProfile(data.data); // Adjusted to access the data object correctly
      setEditData({ username: data.data.username, email: data.data.email, password: "" });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      console.log("Updating profile...");
      console.log("User Email:", editData.email);

      const token = await AsyncStorage.getItem("token");
  
      const response = await fetch(`${BASE_URL}/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editData.username,
          email: editData.email,
          password: editData.password,
          currentPassword,
        }),
      });
  
      const responseText = await response.text();  // Read response as text first
      console.log("Response Text:", responseText);  // Log the raw response
  
      let data;
      try {
        data = JSON.parse(responseText);  // Try parsing JSON manually
      } catch (error) {
        throw new Error("Failed to parse JSON response.");
      }
  
      if (!response.ok) {
        throw new Error(data.message || "Profile update failed.");
      }
  
      console.log("Profile updated:", data);
      Alert.alert("Success", "Profile updated successfully!");
      setModalOpen(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Error updating profile: " + error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0b617e" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <Text style={styles.username}>@{profile.username}</Text>
            <Text style={styles.email}>{profile.email}</Text>
            <Text style={styles.password}>Password: ********</Text>
            <TouchableOpacity style={styles.button} onPress={() => setModalOpen(true)}>
              <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Profile Update Modal */}
      <Modal animationType="slide" transparent={true} visible={modalOpen} onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              value={editData.username}
              onChangeText={(text) => setEditData({ ...editData, username: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: "#f1f1f1" }]}
              placeholder="Email"
              value={editData.email}
              editable={false}
              
            />
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={editData.password}
              onChangeText={(text) => setEditData({ ...editData, password: text })}
            />

            <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalOpen(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9FAF5",
  },
  profileContainer: {
    maxWidth: "100%",  // Ensuring it fits within the sidebar
    paddingHorizontal: 15,
    width: "100%", // Ensure it doesn't overflow horizontally
  },
  profileHeader: {
    alignItems: "center",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0b617e",
  },
  email: {
    fontSize: 16,
    color: "#333",
  },
  password: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#0b617e",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#B7BAC3",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#B7BAC3",
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

