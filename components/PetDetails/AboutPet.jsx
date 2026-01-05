import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';

export default function AboutPet({ pet }) {

    const [readMore, setReadMore] = useState(true);
    
  return (
    <View style={styles.container}>
      <Text style={styles.nameText}>About {pet?.name}</Text>
        <Text numberOfLines={readMore ? 3 : 60} style={styles.aboutText}>{pet?.about}</Text>
        {readMore && 
        <Pressable onPress={() => setReadMore(false)}>
            <Text style={styles.readMoreText}>Read More</Text>
        </Pressable>
        }
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        padding:20,
    },
    nameText:{
        fontSize:20,
        fontFamily:'outfit-medium',
    },
    aboutText:{
        fontSize:14,
        fontFamily:'outfit',
    },
    readMoreText:{
        fontSize:14,
        fontFamily:'outfit-medium',
        color:Colors.SECONDARY,
    }

})