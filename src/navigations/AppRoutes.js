import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React,{useEffect,useState} from 'react'
import {View,Text} from 'react-native'
import AuthStack from './AuthStack'
import HomeScreen from '../screens/HomeScreen'
import auth from '@react-native-firebase/auth'


const stack= createNativeStackNavigator()

const AppStack=()=>{
    const[user,setUser]=useState(false)
useEffect(()=>{
    const checkUser=()=>{
        auth().onAuthStateChanged((state)=>{
            if(state){
                setUser(true)
            }
            else{
                setUser(false)
            }
        })
    }
    checkUser()
},[])
    return(
       <stack.Navigator screenOptions={{headerShown:false}}>
       { 
       user ?
       <stack.Group>
           <stack.Screen component={HomeScreen} name="HomeScreen"/>
         

       </stack.Group>
:
        <stack.Screen component={AuthStack} name="AuthStack"/>}
       </stack.Navigator>
    )
}

export default AppStack