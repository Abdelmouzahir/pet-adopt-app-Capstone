
import { Image, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import MarkFav from '../MarkFav';


export default function PetInfo({pet}) {
  return (
    <View>
      <Image source={{uri:pet.imageUrl}} style={{width: '100%', height: 385, objectFit: 'cover'}} />
      <View style={styles.container}>
        <View>
            <Text style={styles.nameStyle}>{pet?.name}</Text>
            <Text style={styles.addressStyle}>{pet?.address}</Text>
        </View>
            <MarkFav pet={pet} />
       
           
      </View>
      
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameStyle: {
    fontFamily: 'outfit-bold',
    fontSize: 27,
  },
  addressStyle: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: Colors.GRAY,
  },

})