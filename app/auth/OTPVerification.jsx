import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swal from "sweetalert2";

const OTPVerification = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("emailForOTP");
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        navigation.navigate("Register"); // Redirect if no email is found
      }
    };
    fetchEmail();
  }, [navigation]);

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < 5) {
        const nextInput = `otp-${index + 1}`;
        const nextInputRef = this[nextInput];
        if (nextInputRef) {
          nextInputRef.focus();
        }
      }
    }
  };

  const handleSubmit = async () => {
    console.log("🔍 Button Clicked: Verifying OTP...");

    if (otp.some((digit) => digit === "")) {
      console.error("❌ Error: OTP fields are empty.");
      setError("Please enter all six digits.");
      Swal.fire("Error", "Please enter all six digits.", "error");
      return;
    }

    setLoading(true);
    setError("");
    console.log("📡 Sending OTP to Backend...");

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join("") }),
      });

      console.log("🔍 Raw Response:", response);

      const data = await response.json();
      console.log("✅ Response Data:", data);

      setLoading(false);

      if (response.ok) {
        Swal.fire("Success!", "OTP Verified Successfully!", "success").then(() => {
          AsyncStorage.removeItem("emailForOTP"); // ✅ Clear stored email after verification
          navigation.navigate("Login"); // ✅ Redirect user to login
        });
      } else {
        setError(data.message);
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      setLoading(false);
      setError("Something went wrong. Please try again.");
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      console.log("📡 Resend OTP Response:", data);

      // Check if response is successful
      if (response.ok && data.message === "A new OTP has been sent to your email.") {
        Swal.fire("Success!", "A new OTP has been sent to your email.", "success");
      } else {
        setError(data.message);
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      setLoading(false);
      setError("Failed to resend OTP. Please try again.");
      Swal.fire("Error", "Failed to resend OTP. Please try again.", "error");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Verify Your Email</Text>
      <Text style={styles.description}>
        Enter the 6-digit OTP sent to <Text style={styles.email}>{email}</Text>
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(input) => (this[`otp-${index}`] = input)}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleChange(index, value)}
            keyboardType="numeric"
            maxLength={1}
          />
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.verifyButton} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.verifyButtonText}>Verify OTP</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResendOtp}>
        <Text style={styles.resendText}>Resend OTP</Text>
      </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0b617e",
  },
  exportButton: {
    backgroundColor: "#0b617e",
    padding: 10,
    borderRadius: 5,
  },
  exportButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0b617e",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#B7BAC3",
    marginBottom: 20,
    textAlign: "center",
  },
  email: {
    fontWeight: "bold",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#0b617e",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: "#0b617e",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resendText: {
    color: "#0b617e",
    fontWeight: "bold",
    marginTop: 20,
  },
});

export default OTPVerification;