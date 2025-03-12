import { useState } from "react";
import { View, Text, TextInput, Image, StyleSheet, Button } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

const Onboarding = ({ completingOnboarding }) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  const isFirstNameValid = firstName.trim().length > 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // const onboardingCompleted = () => {
  //   if (isFirstNameValid && isEmailValid) {
  //     setIsOnboardingComplete(true);
  //   }
  //   persistData();
  // };

  // const persistData = async () => {
  //   try {
  //     await AsyncStorage.setItem("isOnboardingComplete", JSON.stringify(true));
  //     Alert.alert("State saved to AsyncStorage!");
  //   } catch (error) {
  //     console.error("error saving to AS", error);
  //     Alert.alert("Failed to save to AsyncStorage!");
  //   }
  // };

  return (
    <View style={styles.onBoardingContainer}>
      <View style={styles.headerContainer}>
        <Text>LITTLE LEMON</Text>
        <Image
          style={styles.logo}
          source={require("../assets/LittleLemonGreen.png")}
        />
      </View>
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
          onPress={completingOnboarding}
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

  headerContainer: {
    flexDirection: "row",
  },

  logo: {
    height: 50,
    width: 50,
    resizeMode: "contain",
  },

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
