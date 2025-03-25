import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
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
    image TEXT,
    category TEXT
    );`
);

const Home = () => {
  const [menuItems, setMenuItems] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

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
          "INSERT INTO menu (name, description, price, image, category) VALUES (?,?,?,?,?);",
          [item.name, item.description, item.price, item.image, item.category]
        );
      });

      loadMenuFromDB();
    } catch (error) {
      console.error(error);
    }
  }

  function loadMenuFromDB() {
    const results = db.getAllSync("SELECT * FROM menu;");
    setMenuItems(results);
  }

  useEffect(() => {
    const uniqueCategories = [];
    if (menuItems) {
      menuItems.forEach((item) => {
        if (!uniqueCategories.includes(item.category)) {
          uniqueCategories.push(item.category);
          // setCategories(uniqueCategories);
        }
      });
      setCategories(uniqueCategories);
    }
  }, [menuItems]);

  function toggleCategory(category) {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((cat) => cat !== category)
        : [...prevSelected, category]
    );
  }

  // filtering the menu:

  const filteredMenu =
    menuItems && selectedCategories.length > 0
      ? menuItems.filter((item) => {
          return selectedCategories.includes(item.category);
        })
      : menuItems || [];

  useEffect(() => {
    const existingData = checkDB();

    if (existingData) {
      setMenuItems(existingData);
      setCategories([...new Set(existingData.map((item) => item.category))]);
    } else {
      fetchMenuData();
    }
  }, []);

  // DELETE DATABASE: //

  // useEffect(() => {
  //   function clearDatabase() {
  //     db.execSync("DELETE FROM menu;"); // Delete all rows
  //     setMenuItems([]); // Clear state
  //     console.log("database cleared");
  //   }
  //   clearDatabase();
  // }, []);

  // useEffect(() => {
  //   db.execSync("DROP TABLE IF EXISTS menu;");
  // }, []);

  const Banner = () => {
    return (
      <View>
        <Text>LITTLE LEMON</Text>
        <Text>Chicago </Text>
        <Text>
          We are a family owned Mediterranean restaurant,focused on traditional
          recipies served with a modern twist
        </Text>
        <Image />
        <TextInput style={{ backgroundColor: "white", borderRadius: 100 }} />
      </View>
    );
  };

  return (
    <View>
      <Header />
      <Banner />
      {/* CATEGORY SELECTOR */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10 }}
      >
        {categories.length > 0 ? (
          categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => toggleCategory(category)}
              style={{
                backgroundColor: selectedCategories.includes(category)
                  ? "#FF6347"
                  : "#ddd",
                padding: 10,
                marginRight: 10,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: selectedCategories.includes(category)
                    ? "white"
                    : "black",
                }}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>Loading categories...</Text>
        )}
      </ScrollView>

      {/* MENU LIST */}
      <FlatList
        data={filteredMenu.length > 0 ? filteredMenu : []}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>${item.price}</Text>
            <Image
              source={{
                uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
              }}
              style={{ width: 200, height: 200, marginTop: 10 }}
            />
          </View>
        )}
      />
    </View>
  );
};
export default Home;
