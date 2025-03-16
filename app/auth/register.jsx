import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import  baseURL from "../../assets/common/baseUrl";

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [category, setCategory] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Validation states
  const [fullNameVerify, setFullNameVerify] = useState(false);
  const [usernameVerify, setUsernameVerify] = useState(false);
  const [emailVerify, setEmailVerify] = useState(false);
  const [ageVerify, setAgeVerify] = useState(false);
  const [categoryVerify, setCategoryVerify] = useState(false);
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [confirmPasswordVerify, setConfirmPasswordVerify] = useState(false);
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Categories from your User model
  const categoryOptions = ["Student", "Daily Commuter", "Tourist"];

  async function handleSubmit() {
    if (!isSignUpEnabled) return;
    
    try {
      setIsLoading(true);
      setErrorMessage("");
      
      // Create user object matching your model schema
      const userData = {
        name: fullName,          // maps to name in your model
        username: username,      // maps to username in your model
        email: email,           // maps to email in your model
        age: parseInt(age, 10),  // maps to age in your model
        category: category,      // maps to category in your model
        password: password,      // maps to password in your model
      };

      console.log("Submitting registration data:", {...userData, password: "****"});
      
      // Send registration request to your backend
      const response = await axios.post(`${baseURL}/api/auth/signup`, userData);
      
      console.log("Registration successful:", response.data);
      
      // Show success message
      Alert.alert(
        "Registration Successful",
        "Account created successfully! Please verify your email to continue.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/auth/login")
          }
        ]
      );
      
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle different error types
      if (error.response) {
        // Server responded with an error status
        setErrorMessage(error.response.data.message || "Registration failed. Please try again.");
        Alert.alert("Registration Failed", error.response.data.message || "Please check your information and try again.");
      } else if (error.request) {
        // Request made but no response received
        setErrorMessage("Network error. Please check your connection and try again.");
        Alert.alert("Connection Error", "Unable to connect to server. Please check your internet connection.");
      } else {
        // Something else happened
        setErrorMessage("An unexpected error occurred. Please try again.");
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }
  
  function handleFullName(value) {
    setFullName(value);
    setFullNameVerify(value.length > 1);
  }

  function handleUsername(value) {
    setUsername(value);
    setUsernameVerify(value.length >= 4 && value.length <= 10); // Max 10 per your model
  }

  function handleEmail(value) {
    setEmail(value);
    setEmailVerify(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(value));
  }

  function handleAge(value) {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '');
    setAge(numericValue);
    
    // Validate age per your model (min 1, max 120)
    const ageNum = parseInt(numericValue, 10);
    setAgeVerify(ageNum >= 1 && ageNum <= 120);
  }

  function handleCategory(value) {
    setCategory(value);
    setCategoryVerify(true);
    setShowCategoryDropdown(false);
  }

  function handlePassword(value) {
    setPassword(value);
    const isValid = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(value);
    setPasswordVerify(isValid);
    
    // Update confirm password verification when password changes
    if (confirmPassword) {
      setConfirmPasswordVerify(confirmPassword === value);
    }
  }
  
  function handleConfirmPassword(value) {
    setConfirmPassword(value);
    setConfirmPasswordVerify(value === password);
  }

  const isSignUpEnabled = fullNameVerify && usernameVerify && emailVerify && 
    ageVerify && categoryVerify && passwordVerify && confirmPasswordVerify;
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={18} color="#06b71e" />
          </TouchableOpacity>
          
          <View style={styles.contentContainer}>
            {/* Logo and Title */}
            <View style={styles.headerContainer}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Fill in your details to get started</Text>
            </View>

            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              </View>
            ) : null}

            <View style={styles.formContainer}>
              {/* Full Name Input */}
              <View style={styles.inputWrapper}>
                <View style={[
                  styles.inputContainer,
                  fullName.length > 0 && !fullNameVerify && styles.inputError
                ]}>
                  <FontAwesome name="user" size={20} color="#06b71e" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Full Name"
                    placeholderTextColor="#9e9e9e"
                    style={styles.input}
                    onChangeText={handleFullName}
                    value={fullName}
                  />
                  {fullName.length > 0 && (
                    fullNameVerify ? (
                      <Feather name="check-circle" color="#06b71e" size={20} />
                    ) : (
                      <Feather name="x-circle" color="#ff6b6b" size={20} />
                    )
                  )}
                </View>
                {fullName.length > 0 && !fullNameVerify && (
                  <Text style={styles.errorText}>
                    Name should be more than 1 character
                  </Text>
                )}
              </View>

              {/* Username Input */}
              <View style={styles.inputWrapper}>
                <View style={[
                  styles.inputContainer,
                  username.length > 0 && !usernameVerify && styles.inputError
                ]}>
                  <FontAwesome name="at" size={20} color="#06b71e" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Username (max 10 chars)"
                    placeholderTextColor="#9e9e9e"
                    style={styles.input}
                    autoCapitalize="none"
                    onChangeText={handleUsername}
                    value={username}
                    maxLength={10}
                  />
                  {username.length > 0 && (
                    usernameVerify ? (
                      <Feather name="check-circle" color="#06b71e" size={20} />
                    ) : (
                      <Feather name="x-circle" color="#ff6b6b" size={20} />
                    )
                  )}
                </View>
                {username.length > 0 && !usernameVerify && (
                  <Text style={styles.errorText}>
                    Username should be 4-10 characters
                  </Text>
                )}
              </View>

              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <View style={[
                  styles.inputContainer,
                  email.length > 0 && !emailVerify && styles.inputError
                ]}>
                  <FontAwesome name="envelope" size={18} color="#06b71e" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Email Address"
                    placeholderTextColor="#9e9e9e"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={handleEmail}
                    value={email}
                  />
                  {email.length > 0 && (
                    emailVerify ? (
                      <Feather name="check-circle" color="#06b71e" size={20} />
                    ) : (
                      <Feather name="x-circle" color="#ff6b6b" size={20} />
                    )
                  )}
                </View>
                {email.length > 0 && !emailVerify && (
                  <Text style={styles.errorText}>
                    Please enter a valid email address
                  </Text>
                )}
              </View>

              {/* Age Input */}
              <View style={styles.inputWrapper}>
                <View style={[
                  styles.inputContainer,
                  age.length > 0 && !ageVerify && styles.inputError
                ]}>
                  <FontAwesome name="calendar" size={18} color="#06b71e" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Age (1-120)"
                    placeholderTextColor="#9e9e9e"
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={3}
                    onChangeText={handleAge}
                    value={age}
                  />
                  {age.length > 0 && (
                    ageVerify ? (
                      <Feather name="check-circle" color="#06b71e" size={20} />
                    ) : (
                      <Feather name="x-circle" color="#ff6b6b" size={20} />
                    )
                  )}
                </View>
                {age.length > 0 && !ageVerify && (
                  <Text style={styles.errorText}>
                    Age should be between 1 and 120
                  </Text>
                )}
              </View>

              {/* Category Dropdown */}
              <View style={styles.inputWrapper}>
                <TouchableOpacity 
                  style={[
                    styles.inputContainer, 
                    styles.dropdownContainer
                  ]}
                  onPress={() => setShowCategoryDropdown(true)}
                >
                  <FontAwesome name="users" size={18} color="#06b71e" style={styles.inputIcon} />
                  <Text style={category ? styles.input : styles.placeholderText}>
                    {category || "Select Category"}
                  </Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#06b71e" />
                </TouchableOpacity>
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <View style={[
                  styles.inputContainer,
                  password.length > 0 && !passwordVerify && styles.inputError
                ]}>
                  <FontAwesome name="lock" size={20} color="#06b71e" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Create Password"
                    placeholderTextColor="#9e9e9e"
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    onChangeText={handlePassword}
                    value={password}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color={password.length > 0 ? (passwordVerify ? "#06b71e" : "#ff6b6b") : "#9e9e9e"}
                    />
                  </TouchableOpacity>
                </View>
                {password.length > 0 && !passwordVerify && (
                  <Text style={styles.errorText}>
                    Password must contain uppercase, lowercase, number and be at least 6 characters
                  </Text>
                )}
              </View>
              
              {/* Confirm Password Input */}
              <View style={styles.inputWrapper}>
                <View style={[
                  styles.inputContainer,
                  confirmPassword.length > 0 && !confirmPasswordVerify && styles.inputError
                ]}>
                  <FontAwesome name="lock" size={20} color="#06b71e" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor="#9e9e9e"
                    style={styles.input}
                    secureTextEntry={!showConfirmPassword}
                    onChangeText={handleConfirmPassword}
                    value={confirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Feather
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={20}
                      color={confirmPassword.length > 0 ? (confirmPasswordVerify ? "#06b71e" : "#ff6b6b") : "#9e9e9e"}
                    />
                  </TouchableOpacity>
                </View>
                {confirmPassword.length > 0 && !confirmPasswordVerify && (
                  <Text style={styles.errorText}>
                    Passwords do not match
                  </Text>
                )}
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[
                  styles.signUpButton,
                  !isSignUpEnabled && styles.disabledButton
                ]}
                onPress={handleSubmit}
                disabled={!isSignUpEnabled || isLoading}
              >
                <Text style={styles.signUpButtonText}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>
                Already have an account?{' '}
                <Text 
                  style={styles.signInLink}
                  onPress={() => router.push("/auth/login")}
                >
                  Sign In
                </Text>
              </Text>
            </View>

            {/* Terms Text */}
            <Text style={styles.termsText}>
              By continuing you agree to{" "}
              <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Dropdown Modal */}
      <Modal
        visible={showCategoryDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCategoryDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          onPress={() => setShowCategoryDropdown(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <View style={styles.modalDivider} />
            {categoryOptions.map((option, index) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionItem,
                  index === categoryOptions.length - 1 && { borderBottomWidth: 0 }
                ]}
                onPress={() => handleCategory(option)}
              >
                <Text style={[
                  styles.optionText,
                  category === option && { color: '#06b71e', fontWeight: '600' }
                ]}>
                  {option}
                </Text>
                {category === option && (
                  <Feather name="check" size={20} color="#06b71e" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 183, 30, 0.1)',
    marginTop: 15,
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#06b71e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    width: '100%',
  },
  errorMessage: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 16,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  dropdownContainer: {
    backgroundColor: '#f8f8f8',
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
    color: '#9e9e9e',
  },
  inputError: {
    borderColor: '#ff6b6b',
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 12,
  },
  signUpButton: {
    backgroundColor: '#06b71e',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#06b71e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#c8e6c9',
    shadowOpacity: 0,
    elevation: 0,
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  signInContainer: {
    marginVertical: 20,
  },
  signInText: {
    fontSize: 15,
    color: '#555555',
  },
  signInLink: {
    color: '#06b71e',
    fontWeight: '600',
  },
  termsText: {
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 20,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  termsLink: {
    color: '#06b71e',
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    padding: 20,
    textAlign: 'center',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
});