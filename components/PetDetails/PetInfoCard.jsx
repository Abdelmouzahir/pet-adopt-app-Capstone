import { Image, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

export default function PetInfoCard({ icon, title, value}) {
  return (
    <View style={styles.calendarView}>
      <Image
        source={icon}
        style={{ width: 40, height: 40 }}
      />
      <View style={styles.info}>
        <Text style={styles.ageText}>{title}</Text>
        <Text style={styles.ageValue}>{value}</Text>
      </View>
    </View>
  );
}




const styles = StyleSheet.create({
    calendarView:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
        padding: 10,
        margin: 5,
        borderRadius: 8,
        gap: 10,
        flex: 1,
    },
    info:{
     flex:1,
    },
    ageText:{
        fontFamily: 'outfit',
        fontSize: 16,
        color: Colors.GRAY,
    },
    ageValue:{
        fontFamily: 'outfit-medium',
        fontSize: 17,
    },

})