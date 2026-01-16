import { useUser } from "@clerk/clerk-expo";
import Ionicons from '@expo/vector-icons/Ionicons';
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import PetListItem from '../../components/Home/PetListItem';
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";

export default function UserPost() {
  const { user } = useUser();
  const [userPostList, setUserPostList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    user && GetUserPost();
  }, [user]);

  const GetUserPost = async () => {
    setLoader(true);
    const q = query(
      collection(db, "Pets"),
      where("email", "==", user?.primaryEmailAddress?.emailAddress)
    );
    
    const querySnapshot = await getDocs(q);
    const tempData = [];

    querySnapshot.forEach((docSnap) => {
      tempData.push({ ...docSnap.data(), id: docSnap.id });
    });
    
    setUserPostList(tempData);
    setLoader(false);
  };

  // 1. Updated Alert to include the Pet Name
  const OnDeletePress = (item) => {
    Alert.alert(
      'Delete Post ⚠️', 
      `Are you sure you want to delete ${item?.name || 'this pet'}?`, 
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deletePost(item.id) }
      ]
    );
  }

  const deletePost = async (postId) => {
      await deleteDoc(doc(db, 'Pets', postId));
      GetUserPost();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>My Post</Text>
      
      <FlatList
        data={userPostList}
        numColumns={2}
        refreshing={loader}
        onRefresh={GetUserPost}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.columnWrapper}
        // 2. Added Empty State Logic
        ListEmptyComponent={
          !loader && (
            <View style={styles.emptyContainer}>
              <Text style={styles.noPostText}>No Pets Has been Posted yet! 🐾</Text>
              <Text style={{ color: "gray", marginTop: 10, fontFamily: 'outfit' }}>
                Pull down to refresh
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.outerCardContainer}>
            <PetListItem pet={item} />
            
            <Pressable 
              onPress={() => OnDeletePress(item)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash" size={20} color="#FA5C5C" />
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  headerText: {
    fontFamily: "outfit-medium",
    fontSize: 30,
    marginBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: 15,
  },
  outerCardContainer: {
    width: '48%',
    marginBottom: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.LIGHT_PRIMARY,
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
    gap: 5,
    width: '93%'
  },
  deleteText: {
    fontFamily: 'outfit',
    color: '#FA5C5C',
    fontSize: 14,
  },
  // Styles for the empty state
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    padding: 20
  },
  noPostText: {
    fontFamily: 'outfit-medium',
    fontSize: 20,
    textAlign: 'center'
  }
});