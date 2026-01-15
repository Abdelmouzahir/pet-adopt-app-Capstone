import { useUser } from "@clerk/clerk-expo";
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Bubble, GiftedChat, InputToolbar, Send } from "react-native-gifted-chat";
import {
  useSafeAreaInsets
} from "react-native-safe-area-context";
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const params = useLocalSearchParams();
  const { user } = useUser();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!user || !params?.id) return;

    getUserDetails();

    // Real-time listener for messages
    const q = query(
      collection(db, "Chat", params.id, "Messages"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data();
        return {
          _id: data._id || d.id,
          text: data.text || "",
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          user: {
            _id: data.user?._id,
            name: data.user?.name,
            avatar: data.user?.avatar, // This pulls the avatar from Firestore
          },
        };
      });
      setMessages(list);
    });

    return () => unsub();
  }, [user, params?.id]);

  const getUserDetails = async () => {
    const docRef = doc(db, "Chat", params?.id);
    const docSnap = await getDoc(docRef);
    const result = docSnap.data();

    const otherUser = result?.users?.filter(
      (item) => item.email !== user?.primaryEmailAddress?.emailAddress
    );

    if (otherUser?.length) {
      navigation.setOptions({ headerTitle: otherUser[0].name });
    }
  };

  const onSend = useCallback(
    async (newMessages = []) => {
      const msg = newMessages[0];

      // Prepare the object for Firestore
      const enrichedMessage = {
        _id: msg._id,
        text: msg.text,
        user: {
          _id: user?.primaryEmailAddress?.emailAddress,
          name: user?.fullName,
          avatar: user?.imageUrl, // Save your avatar URL to DB
        },
        createdAt: serverTimestamp(),
      };

      // Optimistic local update (makes UI feel fast)
      setMessages((prev) =>
        GiftedChat.append(prev, [
          {
            ...msg,
            user: enrichedMessage.user,
            createdAt: new Date(),
          },
        ])
      );

      // Save to Firebase
      await addDoc(
        collection(db, "Chat", params.id, "Messages"),
        enrichedMessage
      );
    },
    [user, params?.id]
  );

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: user?.primaryEmailAddress?.emailAddress,
            name: user?.fullName,
            avatar: user?.imageUrl,
          }}
          // AVATAR FIXES
          showUserAvatar={true} // Shows your avatar on the right
          showAvatarForEveryMessage={true}
          renderAvatarOnTop={true} 
          
          // UI FIXES
          placeholder="Type a message..."
          alwaysShowSend={true}
          scrollToBottom={true}
          
          // Input Toolbar Styling (fixes the "looks bad" UI)
          renderInputToolbar={(props) => (
            <InputToolbar
              {...props}
              containerStyle={styles.inputToolbar}
            />
          )}

          // Send Button Styling
          renderSend={(props) => (
            <Send {...props} containerStyle={styles.sendButton}>
               <MaterialIcons name="send" size={28} color={Colors.PRIMARY} />
            </Send>
          )}

          // Message Bubble Styling
          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{
                right: { backgroundColor: Colors.SECONDARY },
                left: { backgroundColor: Colors.LIGHT_PRIMARY },
              }}
              textStyle={{
                right: { color: "#fff", fontFamily: 'outfit' },
                left: { color: "#000", fontFamily: 'outfit' },
              }}
            />
          )}
        />
        {/* Adds space for the home indicator on iPhone */}
        <View style={{ height: insets.bottom }} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    
  },
  inputToolbar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 5,
    paddingHorizontal: 5,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  }
});