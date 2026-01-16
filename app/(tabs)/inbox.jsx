import { useUser } from '@clerk/clerk-expo';
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import UserItem from '../../components/Inbox/UserItem';
import { db } from "../../config/FirebaseConfig";

export default function Inbox() {
  const { user } = useUser();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (user) {
      GetUserList();
    }
  }, [user]);

  const GetUserList = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'Chat'),
        where('userIds', 'array-contains', user?.primaryEmailAddress?.emailAddress)
      );

      const querySnapshot = await getDocs(q);
      const tempSafeList = [];
      
      querySnapshot.forEach(doc => {
        // Include the doc ID so you can navigate to the chat later
        tempSafeList.push({ id: doc.id, ...doc.data() });
      });

      setUserList(tempSafeList);
    } catch (error) {
      console.error("Error fetching inbox:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logic to extract the "Other User" from the chat record.
   * We do this mapping during the render phase or via a useMemo.
   */
  const getFilteredList = () => {
    return userList.map((record) => {
      // 1. Rename 'user' to 'u' to avoid conflict with the Clerk 'user' object
      const otherUser = record.users?.filter(u => u?.email !== user?.primaryEmailAddress?.emailAddress);
      
      return {
        docId: record.id,
        ...otherUser[0] // Take the first person who isn't the current user
      };
    });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.textbox}>Inbox</Text>

      <FlatList
        data={getFilteredList()}
        style={{marginTop:20}}
        onRefresh={GetUserList}
        refreshing={loading}
        keyExtractor={(item, index) => item.docId || index.toString()}
        renderItem={({ item }) => (
          <UserItem userInfo={item} />
        )}
        // 2. Added Empty State Logic
                ListEmptyComponent={
                  !loader && (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.noPostText}>No Messages In your Inbox 📩</Text>
                      <Text style={{ color: "gray", marginTop: 10, fontFamily: 'outfit' }}>
                        Pull down to refresh
                      </Text>
                    </View>
                  )
                }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    marginTop: 20,
  },
  textbox: {
    fontFamily: "outfit-medium",
    fontSize: 30,
  },
  // Styles for the empty state
  emptyContainer: {
    alignItems: 'center',
    marginTop: 250,
    padding: 20
  },
  noPostText: {
    fontFamily: 'outfit-medium',
    fontSize: 20,
    textAlign: 'center'
  }
});