import { useAuth, useUser } from "@clerk/clerk-expo";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const Menu = [
    { id: 1, name: "Add New Pet", icon: "add-circle", path: "/add-new-pet" },
    { id: 5, name: "My Post", icon: "bookmark", path: "/user-post" },
    { id: 2, name: "Favorites", icon: "heart", path: "/(tabs)/favorite" },
    { id: 3, name: "Inbox", icon: "chatbubble", path: "/(tabs)/inbox" },
    { id: 4, name: "Logout", icon: "exit", path: "logout" },
    
  ];

  const onPressMenu = (item) => {
    if (item.path === 'logout') {
      signOut();
      return;
    }
    router.push(item.path);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Profile</Text>

      {/* Profile Section */}
      <View style={styles.profileInfo}>
        <Image
          source={{ uri: user?.imageUrl }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{user?.fullName}</Text>
        <Text style={styles.userEmail}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      {/* Menu List */}
      <FlatList
        data={Menu}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPressMenu(item)}
            style={styles.menuItem}
          >
            <View style={styles.menuLeftSection}>
              <View style={[
                styles.iconContainer, 
                item.path === 'logout' && { backgroundColor: '#ffebee' } // Light red for logout
              ]}>
                <Ionicons 
                  name={item?.icon} 
                  size={24} 
                  color={item.path === 'logout' ? '#f44336' : Colors.PRIMARY} 
                />
              </View>
              <Text style={[
                styles.menuText, 
                item.path === 'logout' && { color: '#f44336' }
              ]}>
                {item.name}
              </Text>
            </View>
            
            {/* Standard Chevron */}
            {item.path !== 'logout' && (
              <Ionicons name="chevron-forward" size={20} color={Colors.GRAY} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
   
  },
  headerText: {
    fontFamily: "outfit-bold",
    fontSize: 30,
    marginTop: 20,
  },
  profileInfo: {
    alignItems: "center",
    marginVertical: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.LIGHT_PRIMARY,
  },
  username: {
    marginTop: 10,
    fontFamily: "outfit-bold",
    fontSize: 22,
  },
  userEmail: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.WHITE,
    padding: 12,
    borderRadius: 15,
    marginVertical: 8,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 2,
  },
  menuLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconContainer: {
    padding: 8,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 10,
  },
  menuText: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
  }
});