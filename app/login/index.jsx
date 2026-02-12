import { useAuth, useSSO } from "@clerk/clerk-expo";
import Checkbox from "expo-checkbox";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Colors from "../../constants/Colors";

// Warm up the browser to improve UX for the SSO flow
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  // --- States ---
  const [isChecked, setChecked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // --- Clerk Hooks ---
  useWarmUpBrowser();
  const { isLoaded, isSignedIn } = useAuth();
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  // Handle auto-redirect if user is already signed in
  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.replace("/(tabs)/home");
    }
  }, [isLoaded, isSignedIn]);

  const onGooglePress = async () => {
    // 1. Validation: If not checked, show warning and STOP
    if (!isChecked) {
      setShowWarning(true);
      return;
    }

    try {
      const redirectUrl = Linking.createURL("/");

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (createdSessionId) {
        setIsRedirecting(true);
        await setActive?.({ session: createdSessionId });
        router.replace("/(tabs)/home");
      }
    } catch (err) {
      console.log("Login Error:", err);
      setIsRedirecting(false); // Reset loader if user cancels or error occurs
    }
  };

  // --- Loading View ---
  if (!isLoaded || isRedirecting || isSignedIn) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loaderText}>
          {isSignedIn ? "Redirecting to Home..." : "Loading your profile..."}
        </Text>
      </View>
    );
  }

  // --- Main UI ---
  return (
    <View style={styles.mainContainer}>
      <Image
        source={require("./../../assets/images/login.png")}
        style={styles.heroImage}
      />

      <View style={styles.textView}>
        <Text style={styles.title}>Ready to make a new friend?</Text>
        <Text style={styles.subTitle}>
          Let's adopt the pet which you like and make their life happy again
        </Text>

        {/* --- Checkbox Section --- */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={(value) => {
              setChecked(value);
              // Hide warning automatically once they check the box
              if (value) setShowWarning(false);
            }}
            color={isChecked ? Colors.PRIMARY : undefined}
          />
          <Text style={styles.label}>
            I agree to the{" "}
            <Text style={styles.linkText}>Terms and Conditions</Text>
          </Text>
        </View>

        {/* --- Dynamic Warning Message --- */}
        {showWarning && (
          <Text style={styles.warningText}>
            ⚠️ Please accept the terms to continue
          </Text>
        )}

        {/* --- Submit Button --- */}
        <Pressable
          onPress={onGooglePress}
          style={[
            styles.press,
            !isChecked && styles.pressDisabled, // Visual state change
          ]}
        >
          <Text style={styles.pressText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.WHITE,
    height: "100%",
  },
  heroImage: {
    width: "100%",
    height: 500,
  },
  textView: {
    padding: 20,
    marginTop: -20,
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontFamily: "outfit-bold",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    fontFamily: "outfit",
    textAlign: "center",
    color: Colors.GRAY,
    marginTop: 10,
  },

  // Checkbox Styles
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    marginBottom: 5,
  },
  checkbox: {
    marginRight: 12,
    borderRadius: 4,
    width: 20,
    height: 20,
  },
  label: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.GRAY,
  },
  linkText: {
    color: Colors.PRIMARY,
    textDecorationLine: "underline",
  },
  warningText: {
    color: "#e74c3c",
    textAlign: "center",
    fontFamily: "outfit-medium",
    fontSize: 13,
    marginBottom: 10,
  },

  // Button Styles
  press: {
    padding: 16,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    marginTop: 10,
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  pressDisabled: {
    backgroundColor: "#cccccc", // Grayed out color
    elevation: 0,
  },
  pressText: {
    color: Colors.WHITE,
    textAlign: "center",
    fontFamily: "outfit-medium",
    fontSize: 18,
  },

  // Loader Styles
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
  },
  loaderText: {
    marginTop: 10,
    fontFamily: "outfit",
    color: Colors.PRIMARY,
  },
});
