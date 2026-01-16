import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";

export default function UserItem({ userInfo }) {

  const onDeletePress = (e) => {
    // 🛑 Prevent the Link from opening the chat screen
    e.stopPropagation();

    // ⚠️ Confirmation Message
    Alert.alert(
      "Delete Chat",
      `Are you sure you want to delete your conversation with ${userInfo?.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Deletes the document from the 'Chat' collection
              await deleteDoc(doc(db, "Chat", userInfo.docId));
              console.log("Chat deleted successfully");
            } catch (error) {
              console.error("Error deleting chat:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <Link href={'/chat?id=' + userInfo.docId} asChild>
      <TouchableOpacity style={styles.itemWrapper}>
        <View style={styles.mainRow}>
          <View style={styles.container}>
            <Image
              source={{ uri: userInfo?.imageUrl }}
              style={styles.avatar}
            />
            <Text style={styles.text}>{userInfo?.name}</Text>
          </View>

          {/* Delete Icon */}
          <TouchableOpacity onPress={onDeletePress} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>

        <View style={styles.line} />
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    width: '100%',
    paddingHorizontal: 5,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Pushes the trash icon to the right
    alignItems: 'center',
  },
  container: {
    marginVertical: 7,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 99,
  },
  text: {
    fontFamily: "outfit",
    fontSize: 18,
  },
  deleteButton: {
    padding: 10,
  },
  line: {
    height: 0.5, 
    backgroundColor: Colors.GRAY || '#F0F0F0',
    marginTop: 5,
    width: '80%',
    marginLeft: 65
  }
});