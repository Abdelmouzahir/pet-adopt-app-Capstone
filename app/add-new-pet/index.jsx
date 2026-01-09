import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';

export default function AddNewPet() {

    const handleInputChange = (fieldName, fieldValue) => {
        // Handle input changes here
        console.log(fieldName, fieldValue);
    };

    return (
        <ScrollView 
        style={{flex:1}}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        >
          
            <Text style={styles.textStyle}> Add New Pet for Adoption </Text>
            <Image
        source={require('../../assets/images/placeholder.png')}
        style={{ width: 100, height: 100, borderRadius: 15, borderWidth:1, borderColor: Colors.GRAY }}
      />
      {/* Input Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet Name *</Text>
        <TextInput onChangeText={(value) => handleInputChange('name', value)}  style={styles.input} placeholder='Enter Pet Name'/>
      </View>
      {/* Input Age */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet Age *</Text>
        <TextInput onChangeText={(value) => handleInputChange('age', value)}  style={styles.input} placeholder='Enter Pet Age'/>
      </View>
      {/* Input Breed */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet Breed *</Text>
        <TextInput onChangeText={(value) => handleInputChange('breed', value)}  style={styles.input} placeholder='Enter Pet Breed'/>
      </View>
      {/* Input Gender */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet Gender *</Text>
        <TextInput onChangeText={(value) => handleInputChange('sex', value)}  style={styles.input} placeholder='Enter Pet Gender'/>
      </View>
      {/* Input Weight */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet Weight *</Text>
        <TextInput onChangeText={(value) => handleInputChange('weight', value)}  style={styles.input} placeholder='Enter Pet Weight'/>
      </View>
      {/* Input Category */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet Category *</Text>
        <TextInput onChangeText={(value) => handleInputChange('category', value)}  style={styles.input} placeholder='Enter Pet Category'/>
      </View>
      {/* Input Address */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet Address *</Text>
        <TextInput onChangeText={(value) => handleInputChange('address', value)}  style={styles.input} placeholder='Enter Pet Address'/>
      </View>
      {/* Input About */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>About *</Text>
        <TextInput
        numberOfLines={5}
        multiline={true}
        onChangeText={(value) => handleInputChange('about', value)}  style={styles.inputAbout} placeholder='Enter Pet About'/>
      </View>
      {/* submit button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      
      </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
       padding: 20,
       paddingBottom: 50, 
       flexGrow: 1,
    },
    textStyle: {
        fontFamily: 'outfit-medium',
        fontSize: 20,
    },
    inputContainer: {
        marginVertical: 5,
    },
    input:{
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 7,
        fontFamily: 'outfit',

    },
    label:{
        fontFamily: 'outfit',
        marginVertical: 5,
    },
    inputAbout:{
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 7,
        fontFamily: 'outfit',
        textAlignVertical: 'top',
        height:120,
    },
    button: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 7,
        marginVertical: 10,
        
    },
    submitButtonText: {
        fontFamily: 'outfit-medium',
        textAlign: 'center',

    }

});