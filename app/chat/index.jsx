import { useUser } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
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
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import {
  Bubble,
  Composer,
  Day,
  GiftedChat,
  InputToolbar,
  Send,
  Time,
} from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(),
          user: {
            _id: data.user?._id,
            name: data.user?.name,
            avatar: data.user?.avatar,
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
      const { name, imageUrl, avatar } = otherUser[0];

      navigation.setOptions({
        headerTitleAlign: 'center',
        headerTitle: () => (
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: imageUrl || avatar }}
              style={styles.headerAvatar}
            />
            <Text style={styles.headerName}>{name}</Text>
          </View>
        ),
      });
    }
  };

  const onSend = useCallback(
    async (newMessages = []) => {
      const msg = newMessages[0];
      const enrichedMessage = {
        _id: msg._id,
        text: msg.text,
        user: {
          _id: user?.primaryEmailAddress?.emailAddress,
          name: user?.fullName,
          avatar: user?.imageUrl,
        },
        createdAt: serverTimestamp(),
      };

      setMessages((prev) =>
        GiftedChat.append(prev, [
          {
            ...msg,
            user: enrichedMessage.user,
            createdAt: new Date(),
          },
        ])
      );

      await addDoc(
        collection(db, "Chat", params.id, "Messages"),
        enrichedMessage
      );
    },
    [user, params?.id]
  );

  // --- CUSTOM RENDER COMPONENTS ---

  const renderDay = (props) => {
    return (
      <View style={{ alignItems: "center", marginVertical: 10 }}>
        <Day
          {...props}
          dateFormat="ddd, MMM D [at] h:mm A"
          textStyle={styles.dayText}
        />
      </View>
    );
  };

  const renderTime = (props) => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: "#000", // This makes the left bubble time black
            fontFamily: "outfit",
            fontSize: 10,
          },
          right: {
            color: "#fff", // Keeps the right bubble time white
            fontFamily: "outfit",
            fontSize: 10,
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={{ alignItems: "center" }}
      />
    );
  };

  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        textInputStyle={styles.composer}
        placeholder="Message..."
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <View style={styles.sendButton}>
          <MaterialIcons name="send" size={28} color={Colors.PRIMARY} />
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: Colors.SECONDARY || "#007AFF",
            borderRadius: 18,
            // padding: 2
          },
          left: {
            backgroundColor: Colors.LIGHT_PRIMARY,
            borderRadius: 18,
            //padding: 2
          },
        }}
        textStyle={{
          right: { color: "#fff", fontFamily: "outfit" },
          left: { color: "#000", fontFamily: "outfit" },
        }}
      />
    );
  };

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
          showUserAvatar={true}
          showAvatarForEveryMessage={false}
          renderAvatarOnTop={true}
          renderDay={renderDay}
          renderTime={renderTime}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          alwaysShowSend
          maxComposerHeight={100}
        />
        <View style={{ height: insets.bottom }} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  // Day/Date Style
  dayText: {
    color: Colors.WHITE,
    fontSize: 12,
    fontFamily: "outfit-medium",
  },
  // Modern iMessage Style Input
  inputToolbar: {
    backgroundColor: "#fff",
    borderTopWidth: 0,
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingTop: 0,
  },
  composer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginTop: 7,
    marginBottom: 7,
    fontSize: 16,
    fontFamily: "outfit",
    lineHeight: 20,
    color: "#000",
  },
  sendContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginRight: 5,
    height: 40,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    // On Android, you might need a slight marginLeft if the title isn't centered
    marginLeft: Platform.OS === 'ios' ? 0 : -20, 
  },
  headerAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#f0f0f0',
  },
  headerName: {
    fontSize: 18,
    fontFamily: 'outfit-bold', // or your preferred font
    color: '#000',
  },
});
