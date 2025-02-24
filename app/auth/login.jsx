import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons"; 
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@env";

export default function LoginScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  function handleSubmit() {
    console.log(email, password);  // Make sure email and password are correctly set.
    const userData = {
      email: email,
      password,
    };
  
    axios
      .post(`${BASE_URL}/login`, userData)
      .then(res => {
        console.log("Response from server: ", res.data);
        if (res.data.status === "ok") {
          console.log("Login successful! Token: ", res.data.data);
          Alert.alert("Login successful!");
          AsyncStorage.setItem("token", res.data.data);

          router.push("/Screen/main");
        } else {
          console.log("Login failed: ", res.data.data);
        }
      })
      .catch(error => {
        console.error("Login error: ", error.response ? error.response.data : error.message);
      });
  }
  

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
    <View className="flex-1 items-center justify-center bg-[#4E5D6C] px-6">
      
      {/* Logo */}
      <Image 
        source={require("../../assets/images/logo.png")}  
        style={{ width: 80, height: 80, marginBottom: 10 }}
        resizeMode="contain"
      />

      {/* App Name */}
      <Text className="text-white text-3xl font-bold mb-8">Ai SaanKa?</Text>

      {/* Email Input */}
      <View className="w-full bg-white flex-row items-center px-4 py-3 rounded-full mb-4 shadow-md">
        <FontAwesome name="envelope" size={20} color="#4E5D6C" />
        <TextInput
          placeholder="Enter your email or username"
          placeholderTextColor="#4E5D6C"
          className="ml-3 flex-1 text-black"
          onChange={e => setEmail(e.nativeEvent.text)}
        />
      </View>

      {/* Password Input */}
      <View className="w-full bg-white flex-row items-center px-4 py-3 rounded-full mb-4 shadow-md">
        <FontAwesome name="lock" size={20} color="#4E5D6C" />
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#4E5D6C"
          secureTextEntry
          className="ml-3 flex-1 text-black"
          onChange={e => setPassword(e.nativeEvent.text)}
        />
      </View>

      {/* Sign In Button (Navigates to Main) */}
      <TouchableOpacity 
        className="w-full bg-black py-3 rounded-full mb-4 shadow-md"
        onPress={() => handleSubmit()} 
      >
        <Text className="text-center text-white text-lg font-semibold">Login</Text>
      </TouchableOpacity>

      {/* OR Separator */}
      <View className="w-full flex-row items-center justify-center mb-4">
        <View className="flex-1 h-[1px] bg-white opacity-50" />
        <Text className="text-white mx-2">OR</Text>
        <View className="flex-1 h-[1px] bg-white opacity-50" />
      </View>

      {/* Google Login Button */}
      <TouchableOpacity className="w-full bg-white py-3 rounded-full flex-row items-center justify-center shadow-md">
        <Image 
          source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/0/09/Google_favicon_2015.png" }}  
          style={{ width: 24, height: 24, marginRight: 12 }}
        />
        <Text className="text-black text-lg font-semibold">Login with Google</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <TouchableOpacity onPress={() => router.push("/auth/register")} className="mt-4">
        <Text className="text-white text-sm">
          Don't have an account? <Text className="text-blue-300 font-semibold">Sign Up</Text>
        </Text>
      </TouchableOpacity>

      {/* Terms & Privacy Policy */}
      <Text className="text-white text-xs text-center mt-6 leading-5">
        By continuing you agree to{" "}
        <Text className="text-blue-300">Terms of Service</Text> and{" "}
        <Text className="text-blue-300">Privacy Policy</Text>
      </Text>
    </View>
  </ScrollView>
  );

}
