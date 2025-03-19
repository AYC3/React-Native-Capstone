import { useState } from "react";
import { View, Text, TextInput, Image, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";

const Onboarding = ({ completingOnboarding }) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  const isFirstNameValid = firstName.trim().length > 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const profileInfo = async () => {
    try {
      await AsyncStorage.setItem("firstName", firstName);
      await AsyncStorage.setItem("email", email);
    } catch (error) {
      console.error("no info saved in async storage", error);
    }
  };

  return (
    <View style={styles.onBoardingContainer}>
      {/* <View style={styles.headerContainer}>
        <Text>LITTLE LEMON</Text>
        <Image
          style={styles.logo}
          source={require("../assets/LittleLemonGreen.png")}
        />
      </View> */}
      <Header title="Header" />
      <Text>Let us get to know you!</Text>
      <View style={styles.inputContainer}>
        <Text>First Name:</Text>
        <TextInput
          style={styles.Input}
          placeholder="First name"
          require
          onChangeText={setFirstName}
          value={firstName}
        />
        <Text>Email:</Text>
        <TextInput
          style={styles.Input}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
        <Button
          title="Next"
          disabled={!(isFirstNameValid && isEmailValid)}
          onPress={() => {
            completingOnboarding();
            profileInfo();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  onBoardingContainer: {
    paddingTop: 30,
    width: "70%",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    gap: 30,
  },

  // headerContainer: {
  //   flexDirection: "row",
  // },

  // logo: {
  //   height: 50,
  //   width: 50,
  //   resizeMode: "contain",
  // },

  inputContainer: {
    textAlign: "center",
    gap: 20,
  },

  Input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
  },
});
export default Onboarding;
