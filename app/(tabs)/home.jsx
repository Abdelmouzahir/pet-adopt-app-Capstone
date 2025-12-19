import { StyleSheet, View } from 'react-native'
import Header from '../../components/Home/Header'
import PetListByCategory from '../../components/Home/PetListByCategory'
import Slider from '../../components/Home/Slider'

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

      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
  },
})