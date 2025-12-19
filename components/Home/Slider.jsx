import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';
import { db } from '../../config/FirebaseConfig';


export default function Slider() {

    const [sliderList, setSliderList] = useState([]);

    useEffect(() => {
        GetSliders();
     }, []);

    //fetch sliders from backedn (firebase)
     const GetSliders = async () =>{
         setSliderList([]); //clear previous data

         const snapshot = await getDocs(collection(db, "Sliders"));
         //log sliders to console
         snapshot.forEach((doc) => {
           //console.log(doc.id, " => ", doc.data());
           setSliderList(sliderList => [...sliderList, doc.data()]);
         });

     }

  return (
    <View style={styles.container}>
      <FlatList 
        data={sliderList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View>
            <Image source={{uri:item?.imageUrl}}    
                   style={styles.sliderImage}
             />
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    sliderImage:{

        width:Dimensions.get('screen').width *0.9,
        height: 170,
        borderRadius: 15,
        marginRight: 15,
    },
    container:{
        marginTop: 15,
    }
})