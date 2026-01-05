import { Image, StyleSheet, Text, View } from 'react-native'
import Colors from '../../constants/Colors'


export default function PetListItem({pet}) {
  return (
    <View style={styles.container}>
      <Image source={{uri:pet?.imageUrl}}
             style={{width:150,
                    height:135,
                    objectFit:'cover',
                    borderRadius:10}} />

       <Text style={styles.name}>{pet?.name}</Text>
       <View style={styles.container2}>
            <Text style={styles.breedText}>{pet?.breed}</Text>
            <Text style={styles.ageText}>{pet?.age} YRS</Text>
        </View>             
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        padding:10,
        marginRight:15,
        backgroundColor:Colors.WHITE,
        borderRadius:10,


    },
    name:{
        fontFamily:'outfit-medium',
        fontSize:18,

    },
    breedText:{
        color:Colors.GRAY,
        fontFamily:'outfit',
    },
    container2:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    ageText:{
        fontFamily:'outfit',
        color:Colors.PRIMARY,
        backgroundColor:Colors.LIGHT_PRIMARY,
        paddingHorizontal:7,
        borderRadius:10,
        fontSize:11,
    }




})