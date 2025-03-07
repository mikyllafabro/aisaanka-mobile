import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swal from "sweetalert2";
import { BASE_URL } from "@env";

const OTPVerification = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  
  // Create an array of refs for the OTP inputs
  const otpRefs = useRef([]);
  otpRefs.current = Array(6).fill().map((_, i) => otpRefs.current[i] || React.createRef());

  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("emailForOTP");
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        router.push("/auth/register");
        //navigation.navigate("Register"); //Redirect if no email is found
      }
    };
    fetchEmail();
  }, [router]);

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Focus on the next input if the current one is filled
      if (value !== "" && index < 5) {
        otpRefs.current[index + 1].current.focus();
      }
    }
  };

  const handleSubmit = async () => {
    if (otp.some((digit) => digit === "")) {
        setError("Please enter all six digits.");
        alert("Error", "Please enter all six digits.", "error");
        return;
    }

    setLoading(true);
    setError("");

    try {
        const response = await fetch(`${BASE_URL}/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp: otp.join("") }),
        });

        const data = await response.json();

        console.log("Response data:", data);

        setLoading(false);

        if (response.ok && data.message === "OTP verified successfully") {
            alert("Success!", "OTP Verified Successfully!", "success");
            AsyncStorage.removeItem("emailForOTP");
            router.push("/auth/login");
                // navigation.navigate("Login");
        } else {
            setError(data.message);
            alert("Error", data.message, "error");
        }
    } catch (error) {
        setLoading(false);
        setError("Something went wrong. Please try again.");
        alert("Error", "Something went wrong. Please try again.", "error");
    }
};

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch(`${BASE_URL}/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      setLoading(false);
  
      console.log("📡 Resend OTP Response:", data);
  
      // Check if response is successful
      if (response.ok && data.message === "A new OTP has been sent to your email.") {
        alert("Success!", "A new OTP has been sent to your email.", "success");
      } else {
        setError(data.message);
        alert("Error", data.message, "error");
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      setLoading(false);
      setError("Failed to resend OTP. Please try again.");
      alert("Error", "Failed to resend OTP. Please try again.", "error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Verify Your Email</Text>
      <Text style={styles.description}>
        Enter the 6-digit OTP sent to <Text style={styles.email}>{email}</Text>
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={otpRefs.current[index]} // Use the ref for each OTP input
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
