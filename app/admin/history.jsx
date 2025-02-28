import React from "react";
import { View, Text, StyleSheet } from "react-native";

const History = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🕒 Activity History</Text>
      <Text style={styles.text}>- User John logged in</Text>
      <Text style={styles.text}>- User Maria updated settings</Text>
      <Text style={styles.text}>- Admin removed a user</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#03624c" },
  text: { fontSize: 16, color: "#030f0f", marginTop: 10 },
});

export default History;
