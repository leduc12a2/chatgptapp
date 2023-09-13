import { StyleSheet, Text, View } from 'react-native'
import React,{useEffect,useState} from 'react'
import {WebView} from 'react-native-webview';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const [tokenFCM, setTokenFCM] = useState<any>()
  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      setTokenFCM(fcmToken);
    }
  };
  useEffect(() => {
      checkToken();
  }, [])
  
  return (
    <WebView
      source={{uri: 'https://www.youtube.com/watch?v=8lA0wP-0vEo'}}
      style={{flex: 1}}
    />
  );
}

export default App

const styles = StyleSheet.create({})