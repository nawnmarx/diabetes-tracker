import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../constants/theme';
import AddReadingScreen from '../screens/AddReadingScreen';
import HomeScreen from '../screens/HomeScreen';

export type RootStackParamList = {
  Home: undefined;
  AddReading: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Diabetes Tracker' }} />
        <Stack.Screen name="AddReading" component={AddReadingScreen} options={{ title: 'Add Reading' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
