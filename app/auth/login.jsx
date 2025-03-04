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
    console.log(email, password); 
    const userData = {
      email: email,
      password,
    };
  
    axios
      .post(`${BASE_URL}/login`, userData)
      .then(res => {
        console.log("Response from server: ", res.data);
        if (res.data.status === "ok") {
          const { token, role } = res.data.data;
          console.log("Login successful! Token: ", token, " Role: ", role);
          Alert.alert("Login successful!");
          AsyncStorage.setItem("token", token);

          if (role === 0) {
            router.push("/admin/dashboard");
          } else {
            router.push("/Screen/main");
          }
        } else {
          console.log("Login failed: ", res.data.data);
        }
      })
      .catch(error => {
        console.error("Login error: ", error.response ? error.response.data : error.message);
      });
  }

  function LoginAsUser() {
    router.push("../Screen/main"); 
  }

  function LoginAsAdmin() {
    router.push("../admin/dashboard");
  }
  
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
    <View className="flex-1 items-center justify-center bg-[#0b617e] px-6">
      
      {/* Logo */}
      <Image 
        source={require("../../assets/images/logo.png")}  
        style={{ width: 200, height: 200, marginBottom: -20, marginTop: -50 }}
        resizeMode="contain"
      />

      {/* App Name */}
      <Text className="text-white text-3xl font-bold mb-8">Sign In</Text>

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
          onChange={e => setPassword(e.nativeEvent.text.trim())}
        />
      </View>

      {/* Sign In Button */}
      <TouchableOpacity 
        className="w-full py-3 rounded-full mb-4 shadow-md"
        style={{ backgroundColor: "#0b998f" }}
        onPress={() => handleSubmit()} 
      >
        <Text className="text-center text-white text-lg font-semibold" 
        style={{ color: '#fff'}}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="w-full bg-black py-3 rounded-full mb-4 shadow-md"
        onPress={() => LoginAsUser()} 
      >
        <Text className="text-center text-white text-lg font-semibold" 
        style={{ color: '#0b998f'}}> UI </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="w-full bg-black py-3 rounded-full mb-4 shadow-md"
        onPress={() => LoginAsAdmin()} 
      >
        <Text className="text-center text-white text-lg font-semibold" 
        style={{ color: '#0b998f'}}> Admin</Text>
      </TouchableOpacity>

      {/* OR Separator */}
      <View className="w-full flex-row items-center justify-center mb-4">
        <View className="flex-1 h-[1px] bg-white opacity-50" />
        <Text className="text-white mx-2">OR</Text>
        <View className="flex-1 h-[1px] bg-white opacity-50" />
      </View>

      {/* Google Login Button */}
      <TouchableOpacity 
        className="w-full bg-white py-3 rounded-full flex-row items-center justify-center shadow-md" 
      >
        <FontAwesome name="google" size={24} color="#0b998f" style={{ marginRight: 12 }} />
        <Text className="text-lg font-semibold" style={{ color: '#0b617e' }}>
          Login with Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/register")} className="mt-4">
        <Text className="text-white text-sm">
          Don't have an account? <Text style={{ color: '#0b998f' }} className="font-semibold">Sign Up</Text>
        </Text>
      </TouchableOpacity>

      <Text className="text-white text-xs text-center mt-6 leading-5">
        By continuing you agree to{" "}
        <Text style={{ color: '#0b998f' }}>Terms of Service</Text> and{" "}
        <Text style={{ color: '#0b998f' }}>Privacy Policy</Text>
      </Text>
    </View>
  </ScrollView>
  );
}