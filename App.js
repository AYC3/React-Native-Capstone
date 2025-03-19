import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import Onboarding from "./screens/Onboarding";
import Profile from "./screens/Profile";
import Splash from "./screens/Splash";
import Home from "./screens/Home";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOnboardingState = async () => {
      try {
        const stateValue = await AsyncStorage.getItem("isOnboardingComplete");
        if (stateValue !== null) {
          setIsOnboardingComplete(JSON.parse(stateValue));
        } else {
          setIsOnboardingComplete(false);
        }
      } catch (error) {
        console.error("failed to load async storage data", error);
      } finally {
        setLoading(false);
      }
    };
    loadOnboardingState();
  }, []);

  const completingOnboarding = async () => {
    setIsOnboardingComplete(true);
    try {
      await AsyncStorage.setItem("isOnboardingComplete", JSON.stringify(true));
    } catch (error) {
      console.error("failed to save to async storage :(", error);
    }
  };

  if (loading) {
    return <Splash />;
  }

  const applogout = async () => {
    try {
      // Clear AsyncStorage when the user logs out
      await AsyncStorage.clear();
      setIsOnboardingComplete(false); // Reset onboarding status
    } catch (error) {
      console.error("Error clearing AsyncStorage", error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isOnboardingComplete ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile">
              {(props) => <Profile {...props} applogout={applogout} />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Onboarding">
            {(props) => (
              <Onboarding
                {...props}
                completingOnboarding={completingOnboarding}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    // backgroundColor: "#fff",
    // width: "80%",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
