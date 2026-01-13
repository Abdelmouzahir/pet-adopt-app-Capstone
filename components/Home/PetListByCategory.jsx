import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { db } from "../../config/FirebaseConfig";
import Category from "./Category";
import PetListItem from "./PetListItem";


export default function PetListByCategory() {
  const [petList, setPetList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    GetPetList("Dogs");
  }, []);

  /**
   * Used to get pet list on Category selection
   * @param {*} category
   */

  const GetPetList = async (category) => {
    setLoader(true);
    setPetList([]); //clear previous data
    const q = query(collection(db, "Pets"), where("category", "==", category));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setPetList((petList) => [...petList, doc.data()]);
    });
    setLoader(false);
  };

  const NUM_COLS = 2;

  return (
    <View style={{ flex: 1 }}>

      {/* Fixed  */}
      <View style={{paddingHorizontal:16}}>
      <Category category={(value) => GetPetList(value)} />
       </View>
      {/* Scrollable pets list */}
      <FlatList
        data={petList}
        numColumns={NUM_COLS}
        key={`cols-${NUM_COLS}`}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <PetListItem pet={item} />}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginTop: 14,

        }}
        contentContainerStyle={{
          paddingBottom: 120, // space for bottom tab bar
        }}
        refreshing={loader}
        onRefresh={() => GetPetList("Dogs")}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
