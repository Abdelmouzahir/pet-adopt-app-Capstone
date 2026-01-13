import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Link } from 'expo-router';
import Header from '../../components/Home/Header';
import PetListByCategory from '../../components/Home/PetListByCategory';
import Slider from '../../components/Home/Slider';
import Colors from '../../constants/Colors';

export default function Home() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Slider */}
      <Slider />

      
      {/* PetList + Category */}
      <PetListByCategory />
      

      {/* Add New Pet Option */}
      <Link href="/add-new-pet" asChild>
      <Pressable style={styles.addPetButton}>
        <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
        <Text style={styles.addPetButtonText}>Add New Pet</Text>
      </Pressable>
      </Link>

      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
  },
  addPetButton: {
    flexDirection: 'row',
    display: 'flex',
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
})