import React,{useState} from 'react'
import {View,Text, TextInput, TouchableOpacity, ToastAndroid} from 'react-native'
import auth from '@react-native-firebase/auth'
import firestore from'@react-native-firebase/firestore'

const SignUpScreen=({navigation})=>{
    const[email,setEmail]=useState('')
    const[name,setName]=useState('')
    const[password,setPassword]=useState('')
    const loginUser=()=>{
auth().createUserWithEmailAndPassword(email,password).then(()=>{
ToastAndroid.show('Sucess',ToastAndroid.SHORT)
firestore().collection('Users').doc(auth().currentUser.uid).set({
    name,
    email,
    id: auth().currentUser.uid
})
}).catch((err)=>{console.log('Err is  ',err)})
    }
    return(
        <View style={{flex:1 ,justifyContent:'center',alignItems:'center'}}>
            <Text>Sign Up </Text>
            <TextInput
            value={name}
            placeholder='Enter Your Name'
            onChangeText={(text)=>{setName(text)}}
            style={{borderWidth:1,width:'90%',marginVertical:'2%'}}
            />
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
            style={{borderWidth:2,width:'50%',alignItems:'center', borderRadius:10,paddingHorizontal:5,paddingVertical:5}}
            >
                <Text>SignUp</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={{marginVertical:'2%'}}
            onPress={()=>{navigation.navigate('LoginScreen')}}
            >
                <Text>Already Registered?</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SignUpScreen