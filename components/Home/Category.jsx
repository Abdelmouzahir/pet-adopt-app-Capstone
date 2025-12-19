import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";

export default function Category() {
  const [categoryList, setCategoryList] = useState([]);
  //click on category to filter pets by category
  //define state for selected category is dogs by default
  const [selectedCategory, setSelectedCategory] = useState('Dogs');

  useEffect(() => {
    GetCategories();
  }, []);

  //fetch categories from backend (firebase)

  const GetCategories = async () => {
    setCategoryList([]); //clear previous data
    const snapshot = await getDocs(collection(db, "Catgory"));
    snapshot.forEach((doc) => {
      //console.log(doc.id, " => ", doc.data());
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Category</Text>
      <FlatList
        data={categoryList}
        numColumns={4}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            onPress={() => setSelectedCategory(item?.name)}
          style={{ flex: 1 }}>
            <View style={[styles.imgContainer,
              selectedCategory === item?.name && styles.selectedCategoryCont
            ]}>
              <Image
                source={{ uri: item?.imageUrl }}
                style={styles.sliderImage}
              />
            </View>
            <Text style={styles.imgText}>{item?.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  text: {
    fontFamily: "outfit-medium",
    fontSize: 20,
  },
  sliderImage: {
    width: 40,
    height: 40,
  },
  imgContainer: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 15,
    margin: 5,

  },
  imgText:{
    textAlign: 'center',
    fontFamily: 'outfit'
  },
  selectedCategoryCont:{
    backgroundColor: Colors.SECONDARY,
    borderColor: Colors.SECONDARY,
  }
});
