import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import Colors from '../../constants/Colors';

export default function PetDetails() {
    const pet=useLocalSearchParams();
    const data = JSON.stringify(pet);

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
             headerTransparent: true,
             headerTitle: '',
            });
    }, []);


  return (
    <View style={{flex:1}}>
      <ScrollView
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
      >
        {/* Pet Info */}
        <PetInfo pet={pet} />

        {/* Pet SubInfo */}
        <PetSubInfo pet={pet} />

        {/* about */}
        <AboutPet pet={pet} />

        {/* owner details */}
        <OwnerInfo pet={pet} />

        <View style={{ height: 70 }}></View>

        

      </ScrollView>
      {/* Adopt me button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.adoptButton}>
          <Text style={styles.textAdopt}>Adopt Me</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
    adoptButton: {
        padding: 20,
        backgroundColor: Colors.PRIMARY,

    },
    bottomContainer:{
        position: "absolute",
        width: "100%",
        bottom: 0,
    },
    textAdopt:{
        fontFamily: 'outfit-medium',
        textAlign: 'center',
        fontSize: 20,

    }
})