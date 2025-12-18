import { useUser } from '@clerk/clerk-expo';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function Header() {
    const {user}= useUser();
    
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.welcome}>Welcome,</Text>
        <Text style={styles.userText}>{user?.fullName}</Text>
      </View>
      <Image source={{uri: user?.imageUrl}} style={{
        width:40,
        height:40,
        borderRadius:99,
      }}  />
    </View>
  );
}


const styles =  StyleSheet.create({
 container:{
    flexDirection:'row',
    display: 'flex',
    justifyContent:'space-between',
    alignItems:'center',
 },   
 welcome:{
    fontFamily:'outfit',
    fontSize: 18,
 },
 userText:{
    fontFamily:'outfit-medium',
    fontSize: 25,
 }

})