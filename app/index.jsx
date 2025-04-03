import { ActivityIndicator, Image, Text, View } from "react-native";

import { Redirect } from "expo-router";
import { useEffect, useState } from "react";



export default function Index() {
  const user = true;
  const [loading, setLoading] = useState(false);

  

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'white' }}>
       <Image
          source={require("../assets/images/loading.gif")}
          style={{ width: 300, height: 300 }} 
        />
      </View>
    );
  }

  return (
  
    <View style={{ flex: 1 }}>
    {user ? <Redirect href={'/home'} /> : <Login />}
  </View>
  
  );
}
