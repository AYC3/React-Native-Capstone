import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
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
    <View style={{ paddingLeft: 20, paddingRight: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        Personal information
      </Text>

      <Text>Avatar</Text>

      <View style={styles.avatarContainer}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        ) : (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 50,
              width: 100,
              height: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#495e57",
                fontSize: 50,
              }}
            >
              {userFirstName[0]}
              {lastName[0]}
            </Text>
          </View>
        )}
        <Pressable style={styles.button1} onPress={pickimage}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Change</Text>
        </Pressable>
        <Pressable style={styles.button2}>
          <Text style={{ color: "#495e57" }}>Remove image</Text>
        </Pressable>
        {/* <Button title="Change image" onPress={pickimage} />
        <Button title="Remove image" /> */}
      </View>

      <Text>First name</Text>
      <TextInput value={userFirstName} style={styles.input} />
      <Text>Laste name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last name"
        onChangeText={setLastName}
        value={lastName}
      />

      <Text>Email</Text>
      <TextInput value={userEmail} style={styles.input} />

      <Text>Phone number</Text>
      <TextInput
        placeholder="Enter your phone number"
        onChangeText={handlePhone}
        keyboardType="number-pad"
        maxLength={10}
        value={phone}
        style={styles.input}
      />

      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
        Email Notifications
      </Text>
      <View style={styles.checkboxContainer}>
        <Checkbox value={isChecked1} onValueChange={setIsChecked1} />
        <Text>Order status</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox value={isChecked2} onValueChange={setIsChecked2} />
        <Text>Password changes</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox value={isChecked3} onValueChange={setIsChecked3} />
        <Text>Pecial offers</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox value={isChecked4} onValueChange={setIsChecked4} />
        <Text>Newsletters</Text>
      </View>
      <Pressable style={styles.button3} onPress={applogout}>
        <Text style={{ fontWeight: "bold", fontWeight: "bold" }}>Log out</Text>
      </Pressable>
      {/* <Button title="Log out" onPress={applogout} /> */}
      <View style={styles.btnContainer}>
        <Pressable style={styles.button2}>
          <Text style={{ color: "#495e57" }}>Discard changes</Text>
        </Pressable>
        <Pressable style={styles.button1} onPress={saveProfileData}>
          <Text style={{ color: "white" }}>Save changes</Text>
        </Pressable>
        {/* <Button title="Discard changes" style={styles.button} />
        <Button title="Save changes" onPress={saveProfileData} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    marginBottom: 20,
  },

  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  button1: {
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#495e57",
    maxHeight: 50,
  },
  button2: {
    padding: 12,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#495e57",
    maxHeight: 45,
  },
  button3: {
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4CE14",
    maxHeight: 50,
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#495e57",
    borderRadius: 10,
    marginBottom: 10,
  },

  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 5,
  },
});

export default Profile;
