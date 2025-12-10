import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.view}
    >
      <Text style={styles.container}>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily:'Outfit',
    fontSize: 40,
  },
  view:{
    flex: 1,
  }
});
