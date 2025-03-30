import { View, Text, Image, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

const Header = ({ imageLoadedAS }) => {
  // const [loadedProfileImage, setLoadedProfileImage] = useState(null);

  const navigation = useNavigation();

  const imageToJson = JSON.parse(imageLoadedAS);

  console.log(imageLoadedAS);

  // useEffect(() => {
  //   if (imageLoadedAS) {
  //     console.log(imageLoadedAS);
  //     setLoadedProfileImage();
  //   }
  // }, [imageLoadedAS]);

  useEffect(() => {
    const loadUserImage = async () => {
      try {
        const storedUserImage = await AsyncStorage.getItem("image");
        console.log(
          "logeando imagen de async prueba DESDE HEADER",
          storedUserImage
        );
      } catch (error) {}
    };
    loadUserImage();
  }, []);

  // if (!imageLoadedAS) {
  //   return <Text>Loading Image...</Text>;
  // }

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text>LITTLE LEMON</Text>

        <Image
          style={styles.logo}
          source={require("../assets/LittleLemonGreen.png")}
        />
      </View>

      <View>
        {/* <Text>PROFILE PICTURE</Text> */}
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{ uri: imageToJson }}
            style={{ width: 60, height: 60, borderRadius: 100 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    paddingTop: 60,
  },

  logo: {
    height: 50,
    width: 50,
    resizeMode: "contain",
  },
});

export default Header;
