import React, { useEffect } from 'react';
import { AppState, Platform, PermissionsAndroid } from 'react-native';

// Alias: AndroidDebugKey
// MD5: 1C:16:77:16:FD:D0:03:8E:97:96:0C:81:E8:0C:9B:26
// SHA1: 01:A5:48:DE:64:0D:C4:B2:4B:F4:B3:86:67:59:17:75:CB:BE:A2:B4
// SHA-256: 2C:EB:9D:C1:8A:16:62:9F:4F:39:BF:64:B2:59:5F:1F:75:2E:10:B4:2F:66:00:DC:C6:21:17:C5:FE:46:52:01
// Valid until: Sunday, December 15, 2052
const KeepCallScreen = () => {
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      ]);
    }

    CallKeep.setup({
      ios: {
        appName: 'Your App Name',
      },
      android: {
        alertTitle: 'Permissions required',
        alertDescription: 'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'OK',
        additionalPermissions: [],
        foregroundService: {
          channelId: 'YourNotificationChannelId',
          channelName: 'YourNotificationChannelName',
        },
      },
    });

    CallKeep.registerPhoneAccount();
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      // App has come to the foreground
      // Handle any necessary operations here
    } else if (nextAppState === 'background') {
      // App has gone to the background
      // Handle any necessary operations here
    }
  };

  const startCall = () => {
    // Start a call using CallKeep
    const callUUID = 'YOUR_CALL_UUID';
    const handle = 'John Doe'; // The name to be displayed for the call
    const number = '+123456789'; // The number to be displayed for the call

    const callOptions = {
      phoneNumber: number,
      callerId: handle,
      name: handle,
      hasVideo: false, // Set to true for video call
      androidRingtone: 'your_ringtone_file',
    };

    CallKeep.displayIncomingCall(callUUID, number, handle, handle, true, callOptions);
  };

  return (
    // Your app UI components here
    // For example, a button to initiate a call
    <Button title="Start Call" onPress={startCall} />
  );
};

export default KeepCallScreen;
