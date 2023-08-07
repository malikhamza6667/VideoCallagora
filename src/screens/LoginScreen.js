import React,{useState} from 'react'
import {View,Text, TextInput, TouchableOpacity, ToastAndroid} from 'react-native'
import auth from '@react-native-firebase/auth'
const LoginScreen=({navigation})=>{
    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const loginUser=()=>{
auth().signInWithEmailAndPassword(email,password).then(()=>{
ToastAndroid.show('Sucess',ToastAndroid.SHORT)
}).catch((err)=>{console.log('Err is  ',err)})
    }
    return(
        <View style={{flex:1 ,justifyContent:'center',alignItems:'center'}}>
            <Text>Login </Text>
            <TextInput
            value={email}
            
            placeholder='Enter Your Email'
            onChangeText={(text)=>{setEmail(text)}}
            style={{borderWidth:1,width:'90%',marginVertical:'2%'}}
            />
            <TextInput
            value={password}
            placeholder='Enter Your Password'
            onChangeText={(text)=>{setPassword(text)}}
            style={{borderWidth:1,width:'90%',marginVertical:'2%'}}
            />
            <TouchableOpacity
            onPress={()=>{loginUser()}}
            style={{borderWidth:2, width:'50%',alignItems:'center',borderRadius:10,paddingHorizontal:5,paddingVertical:5}}
            >
                <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={{marginVertical:5}}
            onPress={()=>{navigation.navigate('SignUpScreen')}}
            >
                <Text>Not Yet Registered?</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen