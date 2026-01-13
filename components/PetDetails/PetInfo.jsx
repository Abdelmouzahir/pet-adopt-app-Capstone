
import { Image, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import MarkFav from '../MarkFav';


export default function PetInfo({pet}) {
  // Add a console log here to see exactly what the URL looks like
  //console.log("Image URL being rendered:", pet?.imageUrl);

  // Function to fix the Firebase URL encoding
  const getCorrectImageUrl = (url) => {
    if (!url) return null;
    // This replaces the unencoded slash in the path with the required %2F
    return url.replace('/PetAdopt/', '/PetAdopt%2F');
  };

  const finalImageUrl = getCorrectImageUrl(pet?.imageUrl);

  return (
    <View>
      <Image source={{uri: finalImageUrl}} key={finalImageUrl} style={{width: '100%', height: 385, resizeMode: 'cover'}} />
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