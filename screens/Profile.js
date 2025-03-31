import { View, Text, TextInput, Button, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox";

const Profile = ({ applogout, setIsImageLoaded }) => {
  const [userFirstName, setUserFirstName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);

  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [isChecked4, setIsChecked4] = useState(false);

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

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // setIsImageLoaded(true);
    }
  };
  useEffect(() => {});
  const saveProfileData = async () => {
    try {
      await AsyncStorage.setItem("userFirstName", userFirstName);
      await AsyncStorage.setItem("userEmail", userEmail);
      await AsyncStorage.setItem("lastName", lastName);
      await AsyncStorage.setItem("phone", phone);
      await AsyncStorage.setItem("image", JSON.stringify(image));

      (await AsyncStorage.setItem("isChecked1", JSON.stringify(isChecked1))) ||
        false;
      (await AsyncStorage.setItem("isChecked2", JSON.stringify(isChecked2))) ||
        false;
      (await AsyncStorage.setItem("isChecked3", JSON.stringify(isChecked3))) ||
        false;
      (await AsyncStorage.setItem("isChecked4", JSON.stringify(isChecked4))) ||
        false;

      alert("Data saved to asyncStorage");
    } catch (error) {
      console.error("error sacing profile to asyncStorage", error);
    }
    setIsImageLoaded("just re rendering");
  };

  const loadProfileData = async () => {
    try {
      const savedUserFirstname = await AsyncStorage.getItem("userFirstName");
      const savedUserEmail = await AsyncStorage.getItem("userEmail");
      const savedLastName = await AsyncStorage.getItem("lastName");
      const savedPhone = await AsyncStorage.getItem("phone");
      const savedImage = await AsyncStorage.getItem("image");

      const savedCheckbox1 = JSON.parse(
        await AsyncStorage.getItem("isChecked1")
      );
      const savedCheckbox2 = JSON.parse(
        await AsyncStorage.getItem("isChecked2")
      );
      const savedCheckbox3 = JSON.parse(
        await AsyncStorage.getItem("isChecked3")
      );
      const savedCheckbox4 = JSON.parse(
        await AsyncStorage.getItem("isChecked4")
      );

      if (savedUserFirstname) setUserFirstName(savedUserFirstname);
      if (savedUserEmail) setUserEmail(savedUserEmail);
      if (savedLastName) setLastName(savedLastName);
      if (savedPhone) setPhone(savedPhone);
      if (savedImage !== null) {
        setImage(JSON.parse(savedImage));
      }
      if (savedCheckbox1) setIsChecked1(savedCheckbox1);
      if (savedCheckbox2) setIsChecked2(savedCheckbox2);
      if (savedCheckbox3) setIsChecked3(savedCheckbox3);
      if (savedCheckbox4) setIsChecked4(savedCheckbox4);
    } catch (error) {
      console.error("Error loading data from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  return (
    <View>
      <Text>Personal information</Text>
      <Text>Avatar</Text>
      {image ? (
        <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />
      ) : (
        <Text
          style={{ color: "white", backgroundColor: "black", fontSize: 40 }}
        >
          {userFirstName[0]}
          {lastName[0]}
        </Text>
      )}

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
      <Button title="Log out" onPress={applogout} />
      <Button title="Discard changes" />
      <Button title="Save changes" onPress={saveProfileData} />
      <Text>EMAIL NOTIFICATIONS</Text>
      <View>
        <Checkbox value={isChecked1} onValueChange={setIsChecked1} />
        <Text>Order status</Text>
      </View>
      <View>
        <Checkbox value={isChecked2} onValueChange={setIsChecked2} />
        <Text>Password changes</Text>
      </View>
      <View>
        <Checkbox value={isChecked3} onValueChange={setIsChecked3} />
        <Text>Pecial offers</Text>
      </View>
      <View>
        <Checkbox value={isChecked4} onValueChange={setIsChecked4} />
        <Text>Newsletters</Text>
      </View>
    </View>
  );
};

export default Profile;
