import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import InputBox from "../../components/Forms/InputBox";
import SubmitButton from "../../components/Forms/SubmitButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Login = ({ navigation }) => {
  // global state
  const [state, setState] = useContext(AuthContext);

  // states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // functions
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!email || !password) {
        Alert.alert("Lütfen tüm alanları doldurunuz");
        setLoading(false);
        return;
      }
      const { data } = await axios.post("/auth/login", { email, password });
      setState(data);
      await AsyncStorage.setItem("@auth", JSON.stringify(data));
      alert(data && data.message);
      navigation.navigate("Home");
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
      console.log(error);
    }
  };

  // temporary function to check local storage data
  const getLocalStorageData = async () => {
    let data = await AsyncStorage.getItem("@auth");
  };
  getLocalStorageData();

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Giriş Yap</Text>
      <View style={{ marginHorizontal: 20 }}>
        <InputBox
          inputTitle={"Email"}
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          setValue={setEmail}
        />
        <InputBox
          inputTitle={"Şifre"}
          secureTextEntry={true}
          autoComplete="password"
          value={password}
          setValue={setPassword}
        />
      </View>
      <SubmitButton
        btnTitle="Giriş Yap"
        loading={loading}
        handleSubmit={handleSubmit}
      />
      <Text style={styles.linkText}>
        Hesabınız yok mu ?{" "}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("Register")}
        >
          Kayıt Olun
        </Text>{" "}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e6e6fa',
    padding: 20,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
  },
  inputBox: {
    height: 45,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingLeft: 15,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  linkText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  link: {
    color: '#333', // New color for "Kayıt Olun"
    fontWeight: 'bold',
  },
});

export default Login;