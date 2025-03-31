import { View, Text, Image, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

const HeaderNoGoBack = ({ imageLoadedAS }) => {
  const [reRender, setReRender] = useState(false);

  useEffect(() => {
    setReRender("re rendering comp.");
  }, [imageLoadedAS]);

  const imageToJson = JSON.parse(imageLoadedAS);
  const navigation = useNavigation();

  useEffect(() => {});

  return (
    <View>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Go Back</Text>
        </TouchableOpacity>
        <Text>LITTLE LEMON</Text>

        <Image
          style={styles.logo}
          source={require("../assets/LittleLemonGreen.png")}
        />
      </View>

      <View>
        {imageToJson ? (
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
              source={{ uri: imageToJson }}
              style={{ width: 60, height: 60, borderRadius: 100 }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Text
              style={{ color: "white", backgroundColor: "black", fontSize: 40 }}
            >
              Profile
            </Text>
          </TouchableOpacity>
        )}

        {/* <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{ uri: imageToJson }}
            style={{ width: 60, height: 60, borderRadius: 100 }}
          />
        </TouchableOpacity> */}
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

export default HeaderNoGoBack;
