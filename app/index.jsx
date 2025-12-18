import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Index() {

  const {user} = useUser();

  return (
    <View
      style={styles.view}
    >
      {user ? 
      <Redirect href={"/(tabs)/home"} />
      :
      <Redirect href={"/login"} />
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily:'outfit',
    fontSize: 40,
  },
  view:{
    flex: 1,
  }
});
