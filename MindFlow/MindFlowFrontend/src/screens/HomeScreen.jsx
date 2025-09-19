import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN = 'authToken'
const HomeScreen = ({navigation}) => {
  const handleLogout = async() => {
    try{
      const res = await AsyncStorage.removeItem(TOKEN)
      navigation.replace("Login");
    }catch(err){
      console.log(err)
    }
  }

  return (
    <View>
        <Text>Home</Text>
        <TouchableOpacity style = {styles.button} onPress={handleLogout}>
          <Text style = {styles.buttonText}>Logout</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  }
})

export default HomeScreen