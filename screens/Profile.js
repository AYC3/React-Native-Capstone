import { View, Text, TextInput, Button, Image, CheckBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  createStaticNavigation,
  useNavigation,
} from "@react-navigation/native";

const Profile = ({ applogout }) => {
  const [userFirstName, setUserFirstName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem("firstName");
        const storedUserEmail = await AsyncStorage.getItem("email");

        if (storedUserName && storedUserEmail) {
          setUserFirstName(storedUserName);
          setUserEmail(storedUserEmail);
        }
      } catch (error) {}
    };
    loadUserData();
  }, []);

  const handlePhone = (text) => {
    const formatted = text.replace(/[^0-9]/g, "");
    if (formatted.length <= 10) {
      setPhone(formatted);
    }
  };

  const pickimage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveProfileData = async () => {
    try {
      await AsyncStorage.setItem("userFirstName", userFirstName);
      await AsyncStorage.setItem("userEmail", userEmail);
      await AsyncStorage.setItem("lastName", lastName);
      await AsyncStorage.setItem("phone", phone);
      await AsyncStorage.setItem("image", image);
      alert("Data saved to asyncStorage");
    } catch (error) {
      console.error("error sacing profile to asyncStorage", error);
    }
  };

  const loadProfileData = async () => {
    try {
      const savedUserFirstname = await AsyncStorage.getItem("userFirstName");
      const savedUserEmail = await AsyncStorage.getItem("userEmail");
      const savedLastName = await AsyncStorage.getItem("lastName");
      const savedPhone = await AsyncStorage.getItem("phone");
      const savedImage = await AsyncStorage.getItem("image");
      if (userFirstName !== "") setUserFirstName(savedUserFirstname);
      if (userEmail !== "") setUserEmail(savedUserEmail);
      if (lastName !== "") setLastName(savedLastName);
      if (phone !== "") setPhone(savedPhone);
      if (image !== "") setImage(savedImage);
    } catch (error) {
      console.error("Error loading data from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  // const logout = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //     setUserFirstName("");
  //     setUserEmail("");
  //     setLastName("");
  //     setPhone("");
  //     setImage("");
  //   } catch (error) {
  //     console.error("error clearing data to the disk", error);
  //   }
  // };

  return (
    <View>
      <Text>Personal information</Text>
      <Text>Avatar</Text>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <Text>
        {userFirstName[0]}
        {lastName[0]}
      </Text>
      <Button title="Change image" onPress={pickimage} />
      <Button title="Remove image" />

      <Text>First name:</Text>
      <TextInput value={userFirstName} />
      <Text>Laste name:</Text>
      <TextInput placeholder="Last name" onChangeText={setLastName} />

      <Text>Email:</Text>
      <TextInput value={userEmail} />

      <Text>Phone number:</Text>
      <TextInput
        placeholder="Enter your phone number"
        onChangeText={handlePhone}
        keyboardType="number-pad"
        maxLength={10}
        value={phone}
      />
      <Button
        title="Log out"
        onPress={applogout}
        // onPress={() => navigation.navigate("Onboarding")}
      />
      <Button title="Discard changes" />
      <Button title="Save changes" onPress={saveProfileData} />
      <CheckBox />
    </View>
  );
};

export default Profile;
