import { collection, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react"; // Added useRef
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";
export default function Slider() {
  const [sliderList, setSliderList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null); // Reference to the FlatList

  useEffect(() => {
    GetSliders();
  }, []);

  // --- Auto-scroll Logic ---
  useEffect(() => {
    if (sliderList.length > 0) {
      const interval = setInterval(() => {
        // Calculate next index (loop back to 0 if at the end)
        const nextIndex =
          activeIndex === sliderList.length - 1 ? 0 : activeIndex + 1;

        setActiveIndex(nextIndex);

        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }, 10000); // 10 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [activeIndex, sliderList]);

  const GetSliders = async () => {
    const snapshot = await getDocs(collection(db, "Sliders"));
    const data = snapshot.docs.map((doc) => doc.data());
    setSliderList(data);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef} // Attach the reference
        data={sliderList}
        horizontal={true}
        pagingEnabled={true} // Snaps to images nicely
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        getItemLayout={(data, index) => ({
          length: Dimensions.get("screen").width * 0.9 + 15, // Width + Margin
          offset: (Dimensions.get("screen").width * 0.9 + 15) * index,
          index,
        })}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: item?.imageUrl }}
              style={styles.sliderImage}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sliderImage: {
    width: Dimensions.get("screen").width * 0.9,
    height: 170,
    borderRadius: 15,
    marginRight: 15,
    backgroundColor: Colors.GRAY, // Placeholder color while loading
  },
  container: {
    marginTop: 15,
  },
});
