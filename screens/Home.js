import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("little-lemon");

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
    const existingData = checkDB();

    if (existingData) {
      setMenuItems(existingData);
      setCategories([...new Set(existingData.map((item) => item.category))]);
    } else {
      fetchMenuData();
    }
  }, []);

  useEffect(() => {
    if (menuItems) {
      const uniqueCategories = [
        ...new Set(menuItems.map((item) => item.category)),
      ];
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

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
    <View style={{ flex: 1 }}>
      {/* <View> */}
      <View style={styles.heroContainer}>
        <Text style={{ color: "#F4CE14", fontSize: 35 }}>Little Lemon</Text>
        <Text style={{ color: "white", fontSize: 25, marginBottom: 15 }}>
          Chicago
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              color: "white",
              marginBottom: 15,
              maxWidth: 200,
              fontSize: 15,
            }}
          >
            We are a family owned Mediterranean restaurant,focused on
            traditional recipies served with a modern twist
          </Text>
          <Image
            source={require("../assets/Hero image.png")}
            style={{ height: 150, width: 150, borderRadius: 20 }}
          />
        </View>

        <TextInput
          placeholder="Search for a dish..."
          onChangeText={setSearchText}
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 10,
            marginTop: 10,
            // margin: 15,
            backgroundColor: "white",
          }}
        />
      </View>
      <View style={{ padding: 20 }}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          ORDER FOR DELIVERY!
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10 }}
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
      </View>
      <FlatList
        nestedScrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ padding: 20 }}
        data={filteredMenu.length > 0 ? filteredMenu : []}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10, gap: 20 }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {item.name}
              </Text>
              <Text style={{ paddingBottom: 8, maxWidth: 250 }}>
                {item.description}
              </Text>
              <Text style={{ fontSize: 16 }}>${item.price}</Text>
            </View>

            <Image
              source={{
                uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
              }}
              style={{
                width: 100,
                height: 100,
                marginTop: 10,
                // alignSelf: "flex-end",
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    backgroundColor: "#495e57",
    minHeight: 230,
    padding: 20,
    // minWidth: 500,
  },
});

export default Home;
