import { Link } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

export default function UserItem({ userInfo }) {
  return (
    <Link href={'/chat?id='+userInfo.docId}>
      <View style={styles.container}>
        <Image
          source={{ uri: userInfo?.imageUrl }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 99,
          }}
        />
        <Text style={styles.text}>{userInfo?.name}</Text>
      </View>
      <View style={styles.line}>

      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 7,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  text: {
    fontFamily: "outfit",
    fontSize: 20,
  },
  line:{
    borderWidth:0.5,
     marginVertical: 5,
     borderColor: Colors.GRAY
  }
});
