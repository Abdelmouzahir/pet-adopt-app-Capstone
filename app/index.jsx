import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  // Use useAuth to get the loading status and sign-in status
  const { isLoaded, isSignedIn } = useAuth();

  // This prevents the code from jumping to the login redirect prematurely
  if (!isLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // 2. redirect based on isSignedIn
  return (
    <View style={styles.view}>
      {isSignedIn ? (
        <Redirect href={"/(tabs)/home"} />
      ) : (
        <Redirect href={"/login"} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
