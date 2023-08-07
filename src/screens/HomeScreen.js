import React, { useState, useEffect } from 'react';
import AgoraUIKit,{StreamFallbackOptions} from 'agora-rn-uikit';
import { View, Text, Button, TouchableOpacity, ToastAndroid,AppState } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import PipHandler, { usePipModeListener } from 'react-native-pip-android';
const HomeScreen = ({navigation}) => {
  const [videoCall, setVideoCall] = useState(false);

  const [channel, setChannel] = useState('');
  const [friends, setFriends] = useState([]);


  const[name,setName]=useState('')
const[calls,setCalls]=useState([])
const[callId,setCallId]=useState('')
const[currentCallId,setcurrentCallId]=useState('')
const[usertype,setusertype]=useState('')
const[isStopped,setIsStopped]=useState(false)

const inPipMode = usePipModeListener();

const userData=async()=>{
    const Snapshot = await firestore().collection('Users').doc(auth().currentUser.uid).get();
    const data= Snapshot.data()
    setName(data.name)
}
  useEffect(() => {
    // Fetch users list from Firestore
    userData()
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const friendsSnapshot = await firestore().collection('Users').where('id','!=',auth().currentUser.uid).get();
      const friendsData = friendsSnapshot.docs.map((doc) => doc.data());
      setFriends(friendsData);
    } catch (error) {
      console.log('Error fetching friends:', error);
    }
  };

  const startCall = async (friendId) => {
    try {
      const generatedChannelName = generateUniqueChannelName();
      setChannel(generatedChannelName);
      setVideoCall(true);
      await notifyFriend(friendId, generatedChannelName);
     
    } catch (error) {
      console.log('Error starting call:', error);
      setVideoCall(false);
    }
  };

  const generateUniqueChannelName = () => {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `channel-${timestamp}-${randomString}`;
  };

  const notifyFriend = async (friendId, channelName) => {
    try {
        const callingId= friendId+ auth().currentUser.uid+ new Date().toISOString()
       setcurrentCallId(callingId)
     firestore().collection('VideoCalls').add({
        reciverId: friendId,
        channel: channelName,
        callingId,
        callStatus: 'ringing',
        callerName:name,
        callerId: auth().currentUser.uid

      }).then(()=>{
        console.log("I'm here before calling timeout start")
        startCallTimeout(callingId);
      }).catch((err)=>{
        setVideoCall(false)
      })
      
    } catch (error) {
      console.log('Error notifying friend:', error);
    }
  };

  const startCallTimeout = (callingId) => {
    console.log("I'm here after calling timeout start")
    setTimeout(() => {
      if(isStopped){
        console.log("Call Is Stopped")
      }
      else{

        checkCallStatus(callingId);
      }
    }, 10000); // Adjust the timeout duration as needed
  };

  const checkCallStatus = async (callingId) => {

    try {
      const friendRef = await firestore().collection('VideoCalls').where('callingId','==',callingId).get();
  const snapshot= friendRef.docs.map((doc)=>doc.data())
  const docsIds=friendRef.docs.map((doc)=>doc.id)
  const docId=docsIds[0]
  const data= snapshot[0]
    
        // console.log("Data of calls is   ",data)
        if (data && data.callStatus === 'ringing') {
            firestore().collection('VideoCalls').doc(docId).delete().then(()=>{

                setVideoCall(false);
                ToastAndroid.show('Call Not Picked ',ToastAndroid.SHORT)
                alert('Call Not Picked ')
                console.log('Call declined or not answered');
            }).catch((err)=>{console.log('err is  ',err)})
       
        
      }
    } catch (error) {
      console.log('Error checking call status:', error);
    }
  };

  const joinCall = async () => {
    try {
      const currentUser = auth().currentUser.uid;
      const currentUserRef = firestore().collection('VideoCalls').where('reciverId','==',auth().currentUser.uid).where('callStatus','==','ringing');
      const snapshot = await currentUserRef.get();
     const snaps= snapshot.docs.map((item)=>item.data())
     const docIds= snapshot.docs.map((item)=>item.id)
     const docId=docIds[0]
        const data = snaps[0]
        if (data && data.channel) {
          setChannel(data.channel);
          firestore().collection('VideoCalls').doc(docId).update({
            callStatus:'accepted'
          }).then(()=>{

              setVideoCall(true);
          }).catch((err)=>{console.log('Error updating call  ',err)})
        }
      
    } catch (error) {
      console.log('Error joining call:', error);
    }
  };
  useEffect(()=>{
    const getMyCalls=async()=>{
     
      const callsdata=  firestore().collection('VideoCalls').where('reciverId','==',auth().currentUser.uid)
      .where('callStatus','==','ringing')
      callsdata.onSnapshot(snapshot => {
        const userCalls = snapshot.docs.map(doc => doc.data());
        setCalls(userCalls);
       
      })
  
    
    
    }
    getMyCalls()
  },[])
  const endCall = async () => {
    
    if(usertype=='reciever'){
      try {
        const CallsRef = await firestore().collection('VideoCalls').where('callingId','==',callId).get()
const calldata = CallsRef.docs.map((item)=>item.id)
const currentCallRef= calldata[0]
       await firestore().collection('VideoCalls').doc(currentCallRef).update({
          callStatus: 'picked',
        });
        setVideoCall(false);
      } catch (error) {
        console.log('Error ending call:', error);
      }
    }
   
   else{
    try {
      const CallsRef = await firestore().collection('VideoCalls').where('callingId','==',currentCallId).get()
const calldata = CallsRef.docs.map((item)=>item.id)
const currentCallRef= calldata[0]
     await firestore().collection('VideoCalls').doc(currentCallRef).update({
        callStatus: 'stopped',
      });
      setVideoCall(false);
    } catch (error) {
      console.log('Error ending call:', error);
    }
   }
    
  };



 useEffect(()=>{
  const handleAppStateChange=(nextState)=>{
    if(nextState=='active'){
      // console.log("App Is Active ")
     
    }
    else{
      // console.log("App Is Not Active")
      PipHandler.enterPipMode(300, 400)
    }
  }
  AppState.addEventListener('change', handleAppStateChange);

 
 })


 


  return (
    <View style={{flex:1,justifyContent:'center'}}>

    {
inPipMode ?
<View style={{flex:1,justifyContent:'center'}}>
  {videoCall ? 
    <AgoraUIKit
  
  settings={{disableRtm:false}}
      connectionData={{ appId: '2c43cba1ad68473ea3c0dfb50f31a026', channel, }}
      rtcCallbacks={{ EndCall: () => endCall() ,}}
     styleProps={{UIKitContainer: {
      width:400,
      height:300,
      justifyContent:'center'
     }}}
    />
   : 
   <Text>Not On Call</Text>
  
  }
  </View>

:

    <View style={{flex:1,justifyContent:'center'}}>
       

      {videoCall ? (
        <AgoraUIKit
      
     settings={{disableRtm:false}}
          connectionData={{ appId: '2c43cba1ad68473ea3c0dfb50f31a026', channel, }}
          rtcCallbacks={{ EndCall: () => endCall() ,}}
         
        />
      ) : 
      <View>
         <Button
        title='Log Out'
        onPress={()=>{auth().signOut()}}
        />
        
        <View>
        <Text>My Calls</Text>
{calls.length >0  ? 
<View>
    {
    calls.map((item,index)=>{
return(
    <View key={index}>
        <Text>{item.callerName} is Calling You</Text>
        <Button
        title='Accept Call'
        onPress={()=>{
          setCallId(item.callingId)
          setusertype('reciever')
          joinCall()}}
        />
    
    </View>
)
    })  
    }
    </View>


:
<Text onPress={joinCall}>No Calls Yet</Text>
}
        </View>
        <Text style={{fontSize:20,alignSelf:'center'}}>My Friends </Text>
      {friends.map((friend) => (
        <View key={friend.id} style={{elevation:10,paddingHorizontal:'5%',paddingVertical:'5%'}}>
          <Text>{friend.name}</Text>
          <TouchableOpacity
          onPress={() => startCall(friend.id)}
          style={{backgroundColor: 'black',alignSelf:'center',padding:'2%'}}
          >

          <Text style={{color: 'white'}}>Video Call</Text>
          </TouchableOpacity>
        </View>
      ))}
        </View>
      }
    </View>
}

    
    </View>
  );
};

export default HomeScreen;





// import React from 'react'
// import AgoraUIKit from 'agora-rn-uikit';
// import {View,Text} from 'react-native'
// import {} from 'react-native-agora'
// const HomeScreen=()=>{
//     const [videoCall, setVideoCall] = useState(true);
    

//   const connectionData = {
//     appId: '2c43cba1ad68473ea3c0dfb50f31a026',
//     channel: 'test',
//   };
//   const rtcCallbacks = {
//     EndCall: () => setVideoCall(false),
//   };
//   return videoCall ? (
//     <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
//   ) : (
//     <Text onPress={()=>setVideoCall(true)}>Start Call</Text>
//   );
// }

// export default HomeScreen
