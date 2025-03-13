import { View, Text, TextInput, Button, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";

const Profile = () => {
  const [userFirstName, setUserFirstName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);

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

  return (
    <View>
      <Text>Avatar</Text>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <Text>
        {userFirstName[0]}
        {lastName[0]}
      </Text>

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
      <Button title="Pick an image" onPress={pickimage} />
    </View>
  );
};

export default Profile;
