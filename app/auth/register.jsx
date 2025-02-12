import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-[#4E5D6C] px-6">
      
      {/* Logo */}
      <Image 
        source={require("../../assets/images/logo.png")}  
        style={{ width: 100, height: 100, marginBottom: 10 }}
        resizeMode="contain"
      />

      {/* App Name */}
      <Text className="text-white text-3xl font-bold mb-6">Register</Text>

      {/* Name Input */}
      <View className="w-full bg-white flex-row items-center px-4 py-3 rounded-full mb-4 shadow-md">
        <FontAwesome name="user" size={20} color="#4E5D6C" />
        <TextInput
          placeholder="Enter your full name"
          placeholderTextColor="#4E5D6C"
          className="ml-3 flex-1 text-black"
        />
      </View>

      {/* Email Input */}
      <View className="w-full bg-white flex-row items-center px-4 py-3 rounded-full mb-4 shadow-md">
        <FontAwesome name="envelope" size={20} color="#4E5D6C" />
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#4E5D6C"
          className="ml-3 flex-1 text-black"
        />
      </View>

      {/* Password Input */}
      <View className="w-full bg-white flex-row items-center px-4 py-3 rounded-full mb-4 shadow-md">
        <FontAwesome name="lock" size={20} color="#4E5D6C" />
        <TextInput
          placeholder="Create a password"
          placeholderTextColor="#4E5D6C"
          secureTextEntry
          className="ml-3 flex-1 text-black"
        />
      </View>

      {/* Create Account Button */}
      <TouchableOpacity 
        className="w-full bg-black py-3 rounded-full mb-4 shadow-md"
        onPress={() => router.push("/auth/login")} // ✅ Navigates to Main
      >
        <Text className="text-center text-white text-lg font-semibold">Create Account</Text>
      </TouchableOpacity>

      {/* OR Separator */}
      <View className="w-full flex-row items-center justify-center mb-4">
        <View className="flex-1 h-[1px] bg-white opacity-50" />
        <Text className="text-white mx-2">OR</Text>
        <View className="flex-1 h-[1px] bg-white opacity-50" />
      </View>

      {/* Google Sign Up Button */}
      <TouchableOpacity className="w-full bg-white py-3 rounded-full flex-row items-center justify-center shadow-md">
        <Image 
          source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/0/09/Google_favicon_2015.png" }}  
          style={{ width: 24, height: 24, marginRight: 12 }}
        />
        <Text className="text-black text-lg font-semibold">Sign Up with Google</Text>
      </TouchableOpacity>

      {/* Back to Login Link */}
      <TouchableOpacity onPress={() => router.push("/auth/login")} className="mt-4">
        <Text className="text-white text-sm">
          Already have an account? <Text className="text-blue-300 font-semibold">Log In</Text>
        </Text>
      </TouchableOpacity>

      {/* Terms & Privacy Policy */}
      <Text className="text-white text-xs text-center mt-6 leading-5">
        By continuing you agree to{" "}
        <Text className="text-blue-300">Terms of Service</Text> and{" "}
        <Text className="text-blue-300">Privacy Policy</Text>
      </Text>
    </View>
  );
}
