import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../components/Home/Header';
import PetListByCategory from '../../components/Home/PetListByCategory';
import Slider from '../../components/Home/Slider';
import Colors from '../../constants/Colors';


export default function Home() {
  const insets = useSafeAreaInsets();

  return (

    
    <View style={[styles.mainContainer, {paddingTop: insets.top}]}>

      {/* SECTION 1: FIXED HEADER & SLIDER */}
      <View style={styles.fixedTopSection}>
        <Header />
        <Slider />
      </View>

      {/* SECTION 2: FIXED ADD PET BUTTON */}
      <View style={{ paddingHorizontal: 20 }}>
        <Link href="/add-new-pet" asChild>
          <Pressable style={styles.addPetButton}>
            <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
            <Text style={styles.addPetButtonText}>Add New Pet</Text>
          </Pressable>
        </Link>
      </View>

      {/* SECTION 3: SCROLLABLE CATEGORIES & PETS */}
      <View style={styles.scrollSection}>
        <PetListByCategory />
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    
  },
  fixedTopSection: {
    paddingHorizontal: 20,
    marginTop: 5,
  },
  scrollSection: {
    flex: 1, // This gives the PetListByCategory the room it needs to render
  },
  addPetButton: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 15,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  addPetButtonText: {
    color: Colors.PRIMARY,
    fontFamily: 'outfit-medium',
    fontSize: 18,
  },
});