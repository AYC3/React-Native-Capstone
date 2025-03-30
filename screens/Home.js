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

// Ensure menu table exists
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
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Function to check if DB has data
  function checkDB() {
    const results = db.getAllSync("SELECT * FROM menu;");
    return results.length > 0 ? results : null;
  }

  // Fetch menu data from API and store in SQLite
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

  // Load menu from SQLite DB
  function loadMenuFromDB() {
    const results = db.getAllSync("SELECT * FROM menu;");
    setMenuItems(results);
  }

  // Load data on mount
  useEffect(() => {
    const existingData = checkDB();

    if (existingData) {
      setMenuItems(existingData);
      setCategories([...new Set(existingData.map((item) => item.category))]);
    } else {
      fetchMenuData();
    }
  }, []);

  // Get unique categories from menuItems
  useEffect(() => {
    if (menuItems) {
      const uniqueCategories = [
        ...new Set(menuItems.map((item) => item.category)),
      ];
      setCategories(uniqueCategories);
    }
  }, [menuItems]);

  // Handle category selection
  function toggleCategory(category) {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((cat) => cat !== category)
        : [...prevSelected, category]
    );
  }

  // Handle search input with debounce (500ms delay)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  // Filter menu based on selected categories AND search text
  const filteredMenu =
    menuItems && selectedCategories.length > 0
      ? menuItems.filter(
          (item) =>
            selectedCategories.includes(item.category) &&
            item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      : menuItems?.filter((item) =>
          item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        ) || [];

  return (
    <View style={{ padding: 20, flex: 1 }}>
      {/* <Header /> */}
      <View>
        <Text>LITTLE LEMON</Text>
        <Text>Chicago </Text>
        <Text>
          We are a family owned Mediterranean restaurant,focused on traditional
          recipies served with a modern twist
        </Text>
        <Image />
        {/* SEARCH BAR */}
        <TextInput
          placeholder="Search for a dish..."
          onChangeText={setSearchText}
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 10,
          }}
        />
      </View>

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
