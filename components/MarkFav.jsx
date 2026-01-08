import { useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { GetFavList, UpdateFav } from "../Shared/Shared";


export default function MarkFav({pet, color="black"}) {
  const { user } = useUser();
  const [favList, setFavList] = useState();

  useEffect(() => {
    user && GetFav();
  }, [user]);

  const GetFav = async () => {
    const result = await GetFavList(user);
    setFavList(result?.favorites ? result?.favorites : []);
    //console.log("fav list", result);
  };

  const AddToFav = async () => {
    const favResult = favList;
    favResult.push(pet.id); 

    await UpdateFav(user, favResult);
    GetFav();
  }

  const RemoveFromFav = async () => {
    const favResult = favList.filter((favId) => favId !== pet.id); 

    await UpdateFav(user, favResult);
    GetFav();
  }


  return (
    <View>

      {favList?.includes(pet.id)? <Pressable onPress={RemoveFromFav}>
        <Ionicons name="heart" size={30} color="#FA5C5C" />
      </Pressable>
        :
      <Pressable onPress={AddToFav}>
        <Ionicons name="heart-outline" size={30} color={color} />
      </Pressable>}
    </View>
  );
}
