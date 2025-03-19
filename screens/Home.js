import { View, Text, Image, FlatList } from "react-native";
import Header from "../components/Header";
import { useEffect, useState } from "react";

const Home = () => {
  const [menuItems, setMenuItems] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const response = await fetch(
        "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
      );
      const data = await response.json();
      // console.log(data);
      setMenuItems(data);
    };
    fetchMenuItems();
  }, []);

  return (
    <View>
      <Header title="Header" />
      <View>
        <Text>Little Lemon</Text>
        <Text>Chicago</Text>
        <Text>
          We are a family owned mediterranean restaurant focused on traditional
          recipes serced with a modern twist
        </Text>
        <Image />
      </View>
      <Text>ORDER FOR DELIVERY!</Text>

      <FlatList
        data={menuItems.menu}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>{item.price}</Text>
            <Image
              source={{
                uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
              }}
              style={{ width: 200, height: 200 }}
            />
          </View>
        )}
      />

      {/* {menuItems?.menu?.map((item) => {
        return (
          <View>
            <Text key={item.name}>{item.name}</Text>
            <Text key={item.description}>{item.description}</Text>
            <Text key={item.price}>{item.price}</Text>
            <Image
              key={item.image}
              source={{
                uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
              }}
              style={{ width: 200, height: 200 }}
            />
          </View>
        );
      })} */}
    </View>
  );
};

export default Home;
