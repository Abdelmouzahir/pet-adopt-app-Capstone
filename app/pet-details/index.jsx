import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import PetInfo from '../../components/PetDetails/PetInfo';

export default function PetDetails() {
    const pet=useLocalSearchParams();
    const data = JSON.stringify(pet);

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
             headerTransparent: true,
             headerTitle: '',
            });
    }, []);


  return (
    <View>
        {/* Pet Info */}
        <PetInfo pet={pet} />

        {/* Pet Properties */}

        {/* about */}

        {/* owner details */}

        {/* Adopt me button */}

      
    </View>
  )
}