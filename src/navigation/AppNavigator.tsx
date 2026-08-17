import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, fonts } from '../constants/theme';
import ComingSoonScreen from '../screens/ComingSoonScreen';
import DashboardScreen from '../screens/DashboardScreen';
import QuickLogScreen from '../screens/HomeScreen';
import { RootStackParamList, TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.sage,
        tabBarInactiveTintColor: colors.soft,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.hairline,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="QuickLog" component={QuickLogScreen} options={{ tabBarLabel: 'Quick Log' }} />
      <Tab.Screen name="Chat" options={{ tabBarLabel: 'Chat' }}>
        {() => <ComingSoonScreen title="Chat" edges={['top']} />}
      </Tab.Screen>
      <Tab.Screen name="Reports" options={{ tabBarLabel: 'Reports' }}>
        {() => <ComingSoonScreen title="Reports" edges={['top']} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Trends">
          {({ navigation }) => (
            <ComingSoonScreen title="Trends" onBack={() => navigation.goBack()} />
          )}
        </Stack.Screen>
        <Stack.Screen name="History">
          {({ navigation }) => (
            <ComingSoonScreen title="History" onBack={() => navigation.goBack()} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
