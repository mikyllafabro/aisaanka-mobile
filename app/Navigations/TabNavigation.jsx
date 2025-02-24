import { View, Text } from 'react-native'
import React from 'react'
import Main from '../Screen/main';
import Profile from '../Screen/profile';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


export default function TabNavigation() {
  const Tab=createBottomTabNavigator();

    return (
    <Tab.Navigator>
        <Tab.Screen name="Home" component={Main} />
        <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  )
}