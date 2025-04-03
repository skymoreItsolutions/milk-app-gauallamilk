import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from 'react-redux';
import  store  from '../store';

export default function RootLayout() {
  return (
    <Provider store={store}>
    <SafeAreaView style={{ flex: 1}}>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
     
    </Stack>
    </SafeAreaView>
    </Provider>
  );
}
