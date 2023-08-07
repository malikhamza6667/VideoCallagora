import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import {View,Text} from 'react-native'
import LoginScreen from '../screens/LoginScreen'
import SignUpScreen from '../screens/SignUpScreen'

const stack= createNativeStackNavigator()

const AuthStack=()=>{
    return(
       <stack.Navigator screenOptions={{headerShown:false}}>
        <stack.Screen component={LoginScreen} name="LoginScreen"/>
        <stack.Screen component={SignUpScreen} name="SignUpScreen"/>
       </stack.Navigator>
    )
}

export default AuthStack