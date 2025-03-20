import { View, Text, Image, FlatList } from "react-native";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("little-lemon");

// console.log(db);

db.execSync(
  `CREATE TABLE IF NOT EXISTS menu(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL,
    image TEXT
    );`
);

const Home = () => {
  const [menuItems, setMenuItems] = useState(null);
  console.log("menu items loging", menuItems);

  function checkDB() {
    const results = db.getAllSync("SELECT * FROM menu;");
    return results.length > 0 ? results : null;
  }

  async function fetchMenuData() {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
      );
      const data = await response.json();

      data.menu.forEach((item) => {
        db.runSync(
          "INSERT INTO menu (name, description, price, image) VALUES (?,?,?,?);",
          [item.name, item.description, item.price, item.image]
        );
      });

      loadMenuFromDB();
    } catch (error) {}
  }

  function loadMenuFromDB() {
    const results = db.getAllSync("SELECT * FROM menu;");
    setMenuItems(results);
  }

  useEffect(() => {
    const existingData = checkDB();

    if (existingData) {
      setMenuItems(existingData);
    } else {
      fetchMenuData();
    }
  }, []);

  // useEffect(() => {
  //   function clearDatabase() {
  //     db.execSync("DELETE FROM menu;"); // Delete all rows
  //     setMenuItems([]); // Clear state
  //     console.log("🗑️ Database cleared!");
  //   }
  //   clearDatabase();
  // }, []);

  // useEffect(() => {
  //   const fetchMenuItems = async () => {
  //     const response = await fetch(
  //       "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
  //     );
  //     const data = await response.json();
  //     // console.log(data);
  //     setMenuItems(data);
  //   };
  //   fetchMenuItems();
  // }, []);

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

      {/* {menuItems?.menu && (
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
      )} */}

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
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
    </View>
  );
};

export default Home;
