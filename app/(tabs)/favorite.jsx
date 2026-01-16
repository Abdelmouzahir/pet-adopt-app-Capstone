import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GetFavList } from "../../Shared/Shared";
import PetListItem from "../../components/Home/PetListItem";
import { db } from "../../config/FirebaseConfig";

export default function Favorite() {
  const { user } = useUser();
  const [favIds, setFavIds] = useState([]);
  const [favPets, setFavPets] = useState([]);
  //refresh data
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    user && GetFavPetIds();
  }, [user]);

  // fetch Ids favorites from db
  const GetFavPetIds = async () => {
    setLoader(true);
    const result = await GetFavList(user);
    const ids = result?.favorites ?? [];

    //console.log(result?.favorites)
    setFavIds(ids);
    setLoader(false);
    GetFavPetList(ids);
  };
  // fetch pet details from pet Ids
  const GetFavPetList = async (ids) => {
    setLoader(true);
    // ✅ if no favorites, don't query Firestore
    if (!Array.isArray(ids) || ids.length === 0) {
      setFavPets([]); // Explicitly clear the pet list
      setLoader(false); // Stop the refreshing animation
      return;
    }

    try {
      const q = query(collection(db, "Pets"), where("id", "in", ids));
      const snap = await getDocs(q);

      const pets = snap.docs.map((d) => d.data());
      setFavPets(pets);
    } catch (e) {
      console.log("GetFavPetList error:", e);
      setFavPets([]);
    } finally {
      setLoader(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textbox}>Favorites</Text>

      {favPets.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={loader} onRefresh={GetFavPetIds} />
          }
        >
          <Text style={styles.noFavText}> NO favorites Pets 🐾 </Text>
          <Text style={{ color: "gray", marginTop: 10 }}>
            Pull down to refresh
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={favPets}
          style={{marginTop:15}}
          numColumns={2}
          key={"fav-list-2"}
          onRefresh={GetFavPetIds}
          refreshing={loader}
          renderItem={({ item }) => <PetListItem pet={item} />}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        />
      )}
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
  noFavText: {
    fontSize: 20,
    fontFamily: "outfit",
  },
  emptyContainer: {
    flex: 1, // fills remaining space
    justifyContent: "center",
    alignItems: "center",
  },
});
