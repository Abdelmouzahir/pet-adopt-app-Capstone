import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

export default function OwnerInfo({ pet }) {


  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Image
          source={{ uri: pet?.userImage }}
          style={{ width: 50, height: 50, borderRadius: 99 }}
        />

        <View>
          <Text style={styles.textname}>{pet?.username}</Text>
          <Text style={styles.textOwner}>Pet Owner</Text>
        </View>
      </View>

      <Ionicons name="send-sharp" size={24} color={Colors.PRIMARY} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
    gap: 20,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderColor: Colors.PRIMARY,
    justifyContent: "space-between",
  },
  container2:{
    flexDirection: "row",
    display: "flex",
    gap: 20,
  },
  textname: {
    fontFamily: "outfit-medium",
    fontSize: 17,
  },
  textOwner: {
    fontFamily: "outfit",
    color: Colors.GRAY,
  },
});
