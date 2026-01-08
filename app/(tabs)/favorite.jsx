import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
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
    setFavPets([]);
    const q = query(collection(db, "Pets"), where("id", "in", ids));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      //console.log(doc.data());
      setFavPets((prev) => [...prev, doc.data()]);
    });

    setLoader(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textbox}>Favorites</Text>

      <FlatList
      data ={favPets}
      numColumns={2}
      onRefresh={GetFavPetIds}
      refreshing={loader}
      renderItem={({item, index}) =>(
        <View>
          <PetListItem pet={item} />
          </View>
          
      )}
      
      
      
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
  },
  textbox: {
    fontFamily: "outfit-medium",
    fontSize: 30,
  },
});
