import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { db, storage } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";
import SelectField from "./SelectField";

export default function AddNewPet() {
  const [formData, setFormData] = useState({
    category: "Dogs",
    sex: "Male",
  });
  const [image, setImage] = useState(null);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = () => {
    // Here you can handle form submission, e.g., validate and send data to backend
    //console.log("FORM DATA:", formData);
    if (Object.keys(formData).length !== 8) {
      if (Platform.OS === "android") {
        ToastAndroid.show(
          "Please fill all the fields and select an image.",
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert(
          "Missing Information.  ⚠️",
          "Please fill all the fields and select an image."
        );
      }
      return;
    }
    UploadImage();
  };

  // used to upload Pet image to firebase storage (server)
  const UploadImage = async () => {
    setLoader(true);
    try {
      const resp = await fetch(image);
      const blob = await resp.blob();
      const storageRef = ref(storage, "/PetAdopt/" + Date.now() + ".jpg");

      // 1. Upload the file
      await uploadBytes(storageRef, blob);
      console.log("File Uploaded!");

      // 2. Get the URL
      const downloadUrl = await getDownloadURL(storageRef);
      console.log("File available at", downloadUrl);

      // 3. Save to Firestore
      await SaveFormData(downloadUrl);
    } catch (error) {
      console.error("Error in upload process:", error);
      setLoader(false);
      Alert.alert("Error", "Failed to upload image or save data.");
    }
  };

  //func to save the data entered by user
  const SaveFormData = async (imageUrl) => {
    const docId = Date.now().toString();
    await setDoc(doc(db, "Pets", docId), {
      ...formData,
      imageUrl: imageUrl,
      username: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
      userImage: user?.imageUrl,
      id: docId,
    });
    setLoader(false);
    if (Platform.OS === "android") {
      ToastAndroid.show("Pet added successfully!", ToastAndroid.CENTER);
    } else {
      Alert.alert("Success ✅", "Pet added successfully!");
    }
    router.replace("/(tabs)/home");
  };

  //
  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...(prev ?? {}),
      [fieldName]: fieldValue,
    }));
  };

  //image picker method
  const imagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Example categories
  const categoryOptions = ["Cats", "Dogs", "Birds", "Fish"];

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.textStyle}>Add New Pet for Adoption</Text>

      <Pressable onPress={imagePicker}>
        {!image ? (
          <Image
            source={require("../../assets/images/placeholder.png")}
            style={styles.image}
          />
        ) : (
          <Image source={{ uri: image }} style={styles.image} />
        )}
      </Pressable>

      {/* Pet Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet Name *</Text>
        <TextInput
          value={formData?.name || ""}
          onChangeText={(value) => handleInputChange("name", value)}
          style={styles.input}
          placeholder="Enter Pet Name"
        />
      </View>

      {/* Age */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          value={formData?.age || ""}
          onChangeText={(value) => handleInputChange("age", value)}
          style={styles.input}
          placeholder="Enter Pet Age"
          keyboardType="numeric-pad"
        />
      </View>

      {/* Breed */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Breed *</Text>
        <TextInput
          value={formData?.breed || ""}
          onChangeText={(value) => handleInputChange("breed", value)}
          style={styles.input}
          placeholder="Enter Pet Breed"
        />
      </View>

      {/* Gender (SelectField) */}
      <SelectField
        label="Gender *"
        placeholder="Select Gender"
        value={formData?.sex || ""}
        onChange={(v) => handleInputChange("sex", v)}
        options={["Male", "Female"]}
        colors={Colors}
      />

      {/* Weight */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight *</Text>
        <TextInput
          value={formData?.weight || ""}
          onChangeText={(value) => handleInputChange("weight", value)}
          style={styles.input}
          placeholder="Enter Pet Weight"
          keyboardType="numeric-pad"
        />
      </View>

      {/* Category (SelectField) */}
      <SelectField
        label="Category *"
        placeholder="Select Category"
        value={formData?.category || ""}
        onChange={(v) => handleInputChange("category", v)}
        options={categoryOptions}
        colors={Colors}
      />

      {/* Address */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address *</Text>
        <TextInput
          value={formData?.address || ""}
          onChangeText={(value) => handleInputChange("address", value)}
          style={styles.input}
          placeholder="Enter Pet Address"
        />
      </View>

      {/* About */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>About *</Text>
        <TextInput
          value={formData?.about || ""}
          numberOfLines={5}
          multiline
          onChangeText={(value) => handleInputChange("about", value)}
          style={styles.inputAbout}
          placeholder="Enter Pet About"
        />
      </View>

      {/* Submit */}
      <TouchableOpacity
        disabled={loader}
        style={styles.button}
        onPress={onSubmit}
      >
        {loader ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  textStyle: {
    fontFamily: "outfit-medium",
    fontSize: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    marginTop: 10,
  },
  inputContainer: {
    marginVertical: 8,
  },
  input: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    fontFamily: "outfit",
  },
  label: {
    fontFamily: "outfit",
    marginVertical: 6,
  },
  inputAbout: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    fontFamily: "outfit",
    textAlignVertical: "top",
    height: 120,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 7,
    marginVertical: 12,
  },
  submitButtonText: {
    fontFamily: "outfit-medium",
    textAlign: "center",
  },
});
