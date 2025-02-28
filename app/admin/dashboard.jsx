import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import Icon from "react-native-vector-icons/Feather"; // Feather Icons
import Home from "./home";
import Users from "./users";
import History from "./history";
import Charts from "./charts";

const dashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activePage, setActivePage] = useState("Home");
  const colorScheme = useColorScheme(); // Built-in Dark Mode detection

  // Toggle Sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Load the correct page inside the dashboard
  const renderContent = () => {
    switch (activePage) {
      case "Users List":
        return <Users />;
      case "History":
        return <History />;
      case "Charts":
        return <Charts />;
      default:
        return <Home />;
    }
  };

  // Apply Dark Mode Styling
  const isDarkMode = colorScheme === "dark";
  const backgroundColor = isDarkMode ? "#030f0f" : "#f4f4f4";
  const sidebarColor = isDarkMode ? "#03624c" : "#030f0f";
  const activeItemColor = "#00df82";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Hamburger Menu */}
      <TouchableOpacity onPress={toggleSidebar} style={styles.hamburger}>
        <Icon name={sidebarVisible ? "x" : "menu"} size={28} color="#fff" />
      </TouchableOpacity>

      {/* Sidebar Navigation */}
      {sidebarVisible && (
        <View style={[styles.sidebar, { backgroundColor: sidebarColor }]}>
          <Text style={styles.title}>Admin Panel</Text>
          {["Home", "Users List", "History", "Charts"].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                setActivePage(item);
                setSidebarVisible(false); // Close sidebar after selection
              }}
              style={[
                styles.navItem,
                activePage === item && { backgroundColor: activeItemColor },
              ]}
            >
              <Text style={styles.navText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  hamburger: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 10,
    backgroundColor: "#03624c",
    padding: 10,
    borderRadius: 5,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    width: 250,
    height: "100%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    zIndex: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  navItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#03624c",
  },
  navText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default dashboard;
