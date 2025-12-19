import { useAuth, useSSO } from "@clerk/clerk-expo";
import * as Linking from 'expo-linking';
import { router } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import * as React from "react";
import { useEffect } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";



export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX

    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, []);
}

WebBrowser.maybeCompleteAuthSession();


export default function LoginScreen() {

  useWarmUpBrowser();
  const {isLoaded, isSignedIn} = useAuth();
  const {startSSOFlow} = useSSO();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) router.replace("/(tabs)/home");
  }, [isLoaded, isSignedIn]);

// ✅ While Clerk is restoring the session, don't show login yet
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  
// ✅ If signed in, don't show login (avoids flash)
  if (isSignedIn) {
    return null;
  }

  const onGooglePress = async () => {
    try {
      const redirectUrl = Linking.createURL("/");

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        router.replace('/(tabs)/home'); // ✅ NOW it navigates
      }
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <View style={{backgroundColor: Colors.WHITE, height:'100%'}}> 
      <Image
        source={require("./../../assets/images/login.png")}
        style={{ width: "100%", height: 500 }}
      />
      <View style={styles.textView}>
        <Text style={styles.text}>Ready to make a new friend?</Text>
        <Text style={styles.text1}>Let's adopt the pet which you like and make there life happy again</Text>
        <Pressable  onPress={onGooglePress} style={styles.press}>
              <Text style={styles.pressText}>
                Get Started
              </Text>
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