import { View, Text, Image } from "react-native";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const Header = ({ image }) => {
  const [loadedProfileImage, setLoadedProfileImage] = useState(null);
  console.log(loadedProfileImage);

  useEffect(() => {
    if (image) {
      setLoadedProfileImage(image);
    }
  }, [image]);

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
        <Text>PROFILE PICTURE</Text>
        {loadedProfileImage && (
          <Image
            source={{ uri: loadedProfileImage }}
            style={{ width: 200, height: 200 }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
  },

  logo: {
    height: 50,
    width: 50,
    resizeMode: "contain",
  },
});

export default Header;
