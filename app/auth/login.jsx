import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons"; 

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit() {
    setIsLoading(true);
    console.log("Bypassing authentication for frontend testing");
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      router.push("../Screen/main");
    }, 800);
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={18} color="#0b617e" />
          </TouchableOpacity>

          <View style={styles.contentContainer}>
            {/* Logo and App Name */}
            <View style={styles.logoContainer}>
              <Image 
                source={require("../../assets/images/logo.png")}  
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.appName}>Ai SaanKa?</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>Welcome back! Please enter your details</Text>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <FontAwesome name="envelope" size={18} color="#0b617e" style={styles.inputIcon} />
                <TextInput
                  placeholder="Email or Username"
                  placeholderTextColor="#9e9e9e"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={18} color="#0b617e" style={styles.inputIcon} />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#9e9e9e"
                  secureTextEntry
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              
              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity 
                style={[
                  styles.signInButton,
                  (!email || !password) && styles.disabledButton
                ]}
                onPress={handleSubmit} 
                disabled={!email || !password || isLoading}
              >
                <Text style={styles.signInButtonText}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* OR Separator */}
            <View style={styles.separatorContainer}>
              <View style={styles.separator} />
              <Text style={styles.separatorText}>OR</Text>
              <View style={styles.separator} />
            </View>

            {/* Sign Up Link */}
            <TouchableOpacity 
              style={styles.signUpContainer} 
              onPress={() => router.push("/Auth/Register")}
            >
              <Text style={styles.signUpText}>
                Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>

            {/* Terms */}
            <Text style={styles.termsText}>
              By continuing you agree to{" "}
              <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 183, 30, 0.1)',
    marginTop: 15,
    marginBottom: 15,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0b617e',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#757575',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#0b617e',
    fontSize: 14,
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: '#0b617e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0b617e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#c5c6d0',
    shadowOpacity: 0,
    elevation: 0,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 24,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  separatorText: {
    color: '#757575',
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  signUpContainer: {
    marginBottom: 30,
  },
  signUpText: {
    fontSize: 15,
    color: '#555555',
  },
  signUpLink: {
    color: '#0b617e',
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  termsLink: {
    color: '#0b617e',
    fontWeight: '500',
  },
});