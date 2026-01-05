import { StyleSheet, View } from 'react-native'
import PetInfoCard from './PetInfoCard'

export default function PetSubInfo({pet}) {
  return (
    <View style={styles.container}>
      <View style={styles.container2}> 
        
        <PetInfoCard icon={require("./../../assets/images/calendar.png")} title="Age" value={pet?.age+ " Years"} />
        <PetInfoCard icon={require("./../../assets/images/bone.png")} title="Breed" value={pet?.breed} />
        </View>
        <View style={styles.container2}> 
        <PetInfoCard icon={require("./../../assets/images/sex.png")} title="Sex" value={pet?.sex} />
        <PetInfoCard icon={require("./../../assets/images/weight.png")} title="Weight" value={pet?.weight+ " Kg"} />
        </View>
      </View>
    
  )
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 20,

    },
    container2:{
        flexDirection: 'row',
        display: 'flex',

    }

})