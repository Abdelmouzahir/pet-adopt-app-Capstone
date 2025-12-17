import { Link } from "expo-router";
import { StyleSheet, Text, View, } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.view}
    >
      <Link href="/login">
      <Text style={styles.container}>Go To login screen</Text>
      </Link>
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
