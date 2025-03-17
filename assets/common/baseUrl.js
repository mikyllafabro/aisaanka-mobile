import {Platform} from 'react-native';

let baseURL = Platform.OS === "android"
  ? "http://192.168.1.59:3000"  // Match backend port
  : "http://localhost:3000";    // For local testing in web/desktop


export default baseURL;