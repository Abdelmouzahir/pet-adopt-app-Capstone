import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";

export default function UserItem({ userInfo }) {

  const onDeleteChat = (e) => {
    // 🛑 This stops the Link from opening the chat when you click delete
    e.stopPropagation();

    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this chat?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "Chat", userInfo.docId));
            } catch (error) {
              console.error("Error deleting chat:", error);
            }
          } 
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

          {/* Trash Button */}
          <TouchableOpacity onPress={onDeleteChat} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>

        {/* Your custom line style */}
        <View style={styles.line} />
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    width: '100%',
    paddingVertical: 5,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0'
  },
  text: {
    fontFamily: "outfit",
    fontSize: 20,
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