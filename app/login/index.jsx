import { useAuth, useSSO } from "@clerk/clerk-expo";
import * as Linking from 'expo-linking';
import { useRouter } from "expo-router"; // Use useRouter hook
import * as WebBrowser from 'expo-web-browser';
import * as React from "react";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

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
  useWarmUpBrowser();
  const { isLoaded, isSignedIn } = useAuth();
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  // 1. Add a local loading state for the transition
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.replace("/(tabs)/home");
    }
  }, [isLoaded, isSignedIn]);

  const onGooglePress = async () => {
    try {
      const redirectUrl = Linking.createURL("/");

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (createdSessionId) {
        // 2. Set redirecting to true BEFORE calling setActive
        setIsRedirecting(true);
        
        await setActive?.({ session: createdSessionId });
        
        // Navigation happens here
        router.replace('/(tabs)/home');
      }
    } catch (err) {
      console.log(err);
      setIsRedirecting(false); // Reset if login fails/cancels
    }
  };

  // 3. Show loader if Clerk is loading OR if we are currently redirecting
  if (!isLoaded || isRedirecting || isSignedIn) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.WHITE }}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        {isRedirecting && <Text style={{marginTop: 10, fontFamily: 'outfit'}}>Loading your profile...</Text>}
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: Colors.WHITE, height: '100%' }}>
      <Image
        source={require("./../../assets/images/login.png")}
        style={{ width: "100%", height: 500 }}
      />
      <View style={styles.textView}>
        <Text style={styles.text}>Ready to make a new friend?</Text>
        <Text style={styles.text1}>Let's adopt the pet which you like and make their life happy again</Text>
        <Pressable onPress={onGooglePress} style={styles.press}>
          <Text style={styles.pressText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}





const styles = StyleSheet.create({
  text: {
    fontFamily: "outfit-bold",
    fontSize: 30,
    textAlign: "center",

  },
  text1: {
    fontFamily: "outfit",
    fontSize: 18,
    textAlign: "center",
    color: Colors.GRAY,
  },
  textView: {
    padding:20,
    display: 'flex',
    alignItems: 'center',
  },
  press:{
    padding:14,
    marginTop:100,
    backgroundColor: Colors.PRIMARY,
    borderRadius:14,
    width:'100%',

  },
  pressText:{
    textAlign:'center',
    fontFamily:'outfit-medium',
    fontSize:20,
   

  }


});