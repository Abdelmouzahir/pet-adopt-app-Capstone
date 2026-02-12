import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item;
    } catch (error) {
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// 1. Create an Internal Layout to handle the Auth logic
function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === "(tabs)";

    if (isSignedIn) {
      // If we are signed in but NOT in tabs, go to home
      if (!inTabsGroup) {
        router.replace("/(tabs)/home");
      }
    } else {
      // If not signed in, and not already on the login page, go to login
      // Note: segments[0] for "app/login/index.jsx" is "login"
      if (segments[0] !== "login") {
        router.replace("/login");
      }
    }
  }, [isSignedIn, isLoaded, segments]);

  // IMPORTANT: This prevents the "flash"
  // If Clerk hasn't loaded, we show a loader instead of the Stack
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "" }} />
      <Stack.Screen name="login/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="add-new-pet/index"
        options={{ title: "Add New Pet" }}
      />
      <Stack.Screen name="chat/index" options={{ title: "" }} />
      <Stack.Screen name="user-post/index" options={{ title: "My Post" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const [fontsLoaded] = useFonts({
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("../assets/fonts/Outfit-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <InitialLayout />
    </ClerkProvider>
  );
}
