import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../Screens/Home';
import CallScreen from '../Screens/CallScreen';
import Rooms from '../Screens/Rooms';
const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CallScreen" component={CallScreen} />
        <Stack.Screen name="Rooms" component={Rooms} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
