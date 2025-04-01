import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

const Header = ({ imageLoadedAS }) => {
  const [reRender, setReRender] = useState(false);

  useEffect(() => {
    if (!imageLoadedAS == null) {
      setReRender("re rendering comp.");
    }
  }, [imageLoadedAS, reRender]);

  const imageToJson = JSON.parse(imageLoadedAS);

  console.log(imageLoadedAS);
  console.log(reRender);

  const navigation = useNavigation();

  useEffect(() => {});

  return (
    <View>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ fontWeight: "bold", color: "#495e57", fontSize: 15 }}>
            Go Back
          </Text>
        </Pressable>
        {/* <Text>LITTLE LEMON</Text> */}

        <Image style={styles.logo} source={require("../assets/Logo.png")} />
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
                style={{
                  color: "white",
                  backgroundColor: "black",
                  fontSize: 40,
                }}
              >
                Empty
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
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: "20",
    paddingRight: "20",
    marginTop: 50,
    marginBottom: 10,
  },

  logo: {
    // height: 130,
    // marginTop: 100,
    width: 200,
    resizeMode: "contain",
  },
});

export default Header;
