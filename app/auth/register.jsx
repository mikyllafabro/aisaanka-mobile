import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@env";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setName] = useState("");
  const [nameVerify, setNameVerify] = useState(false);
  const [email, setEmail] = useState("");
  const [emailVerify, setEmailVerify] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation()
  function handleSubmit() {
    const userData={
      username: username,
      email,
      password,
    };
    if (nameVerify && emailVerify && passwordVerify){
      axios
      .post(`${BASE_URL}/register`, userData)
      .then(res => {console.log(res.data)
        if (res.data.status === "ok") {
          alert("Registered successfully");
          router.push("/auth/login");
        } else {
          alert(JSON.stringify(res.data));
        }

      })
      .catch(e=>console.log(e));
    }
    else {
      alert("Please fill in all fields correctly.");
    }
  }
  function handleName(nameVar) {
    setName(nameVar);
    setNameVerify(nameVar.length > 1);
  }

  function handleEmail(emailVar) {
    setEmail(emailVar);
    setEmailVerify(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar));
  }

  function handlePassword(passwordVar) {
    setPassword(passwordVar);
    setPasswordVerify(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar));
  }

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always">
      <View className="flex-1 items-center justify-center bg-[#0b617e] px-6">
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: 200, height: 200, marginBottom: -20, marginTop: -50 }}
          resizeMode="contain"
        />

        <Text className="text-white text-3xl font-bold mb-6">Create Account</Text>

        <View className="w-full bg-white flex-row items-center px-4 py-3 rounded-full mb-4 shadow-md">
          <FontAwesome name="user" size={25} color="#4E5D6C" />
          <TextInput
            placeholder="Enter your full name"
            placeholderTextColor="#4E5D6C"
            className="ml-3 flex-1 text-black"
            onChangeText={handleName}
          />
          {username.length > 0 && ( nameVerify ? (
            <Feather name="check-circle" color="green" size={20} />
          ) : (
            <Feather name="x-circle" color="red" size={20} />
          )
          )}
        </View>
        {username.length > 0 && !nameVerify && (
          <Text style={{ marginLeft: 20, color: "red" }}>
            Name should be more than 1 character.
          </Text>
        )}

        <View className="w-full bg-white flex-row items-center px-4 py-3 rounded-full mb-4 shadow-md">
          <FontAwesome name="envelope" size={20} color="#4E5D6C" />
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#4E5D6C"
            className="ml-3 flex-1 text-black"
            value={email}
            onChangeText={handleEmail}
          />
          {email.length > 0 && ( emailVerify ? (
            <Feather name="check-circle" color="green" size={20} />
          ) : (
            <Feather name="x-circle" color="red" size={20} />
          )
          )}
        </View>
        {email.length > 0 && !emailVerify && (
          <Text style={{ marginLeft: 20, color: "red" }}>
            Enter Proper Email Address.
          </Text>
        )}

        <View className="w-full bg-white flex-row items-center px-4 py-3 rounded-full mb-4 shadow-md">
          <FontAwesome name="lock" size={25} color="#4E5D6C" />
          <TextInput
            placeholder="Create a password"
            placeholderTextColor="#4E5D6C"
            className="ml-3 flex-1 text-black"
            value={password}
            onChangeText={handlePassword}
            secureTextEntry={showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {password.length < 1 ? null : !showPassword ? (
              <Feather
              name="eye-off"
              style={{ marginRight: 2 }}
              color={passwordVerify ? 'green' : 'red'}
              size={23}
            />
            ) : (
            <Feather
              name="eye"
              style={{ marginRight: 2 }}
              color={passwordVerify ? 'green' : 'red'}
              size={23}
            />
            )}
          </TouchableOpacity>
        </View>
        {password.length > 0 && !passwordVerify && (
          <Text 
            style={{ 
              marginLeft: 20, 
              color: "red" 
          }}>
            Uppercase, Lowercase, Number and minimum of 6 characters.
          </Text>
        )}
        <TouchableOpacity
          className="w-full py-3 rounded-full mb-4 shadow-md"
          style={{ backgroundColor: "#0b998f" }}
          onPress={handleSubmit}  // Call the handleSubmit directly here
        >
          <Text className="text-center text-white text-lg font-semibold"  style={{ color: '#fff' }}>
            Sign Up
          </Text>
        </TouchableOpacity>


        <View className="w-full flex-row items-center justify-center mb-4">
          <View className="flex-1 h-[1px] bg-white opacity-50" />
          <Text className="text-white mx-2">OR</Text>
          <View className="flex-1 h-[1px] bg-white opacity-50" />
        </View>

         {/* Google Login Button */}
      <TouchableOpacity 
        className="w-full bg-white py-3 rounded-full flex-row items-center justify-center shadow-md" 
        style={{ backgroundColor: "#fff" }}
      >
        <FontAwesome name="google" size={24} color="#0b998f" style={{ marginRight: 12 }} />
        <Text className="text-lg font-semibold" style={{ color: '#0b617e' }}>
          Login with Google
        </Text>
      </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/login")} className="mt-4">
          <Text className="text-white text-sm">
            Already have an account? <Text style={{ color: '#0b998f' }} className="font-semibold">Log In</Text>
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