import Color from "@/share/Color";
import { ActivityIndicator, Dimensions, Image, Platform, Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useSSO, useUser } from '@clerk/expo'
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/expo";

import { doc, setDoc } from "firebase/firestore";
import { firestore, firestoreDb } from "@/config/FirebaseConfig";
import {  useRouter } from "expo-router";


export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function Index() {
  const { isSignedIn} = useAuth()
  const router=useRouter();
  const {user}=useUser();
  const[loading,setLoading]=useState(true);
  console.log(user?.primaryEmailAddress?.emailAddress)

  useEffect(()=>{

    if(isSignedIn){
      // redirect to homeScreen
     router.replace("/(tabs)/Home");

    }
    if(isSignedIn!=undefined){
      setLoading(false);
    }
  },[isSignedIn])
  useWarmUpBrowser()

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO()
  

  const onLoginPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri(),
      })


      if (user) {
        await setDoc(doc(firestoreDb, 'users', user.id), {
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
          joinDate: Date.now(),
          credits: 20
        });
      }

      // If sign in was successful, set the active session
     if (createdSessionId) {
  setActive!({
    session: createdSessionId,
    navigate: async () => {
      router.replace("/(tabs)/Home")
    },
  })
} else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // See https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections#handle-missing-requirements
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [startSSOFlow])
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        paddingTop: Platform.OS == "android" ? 30 : 40,
        justifyContent: "center",
      }}
    >
      <Image
        source={require("./../assets/images/login.png")}
        style={{
          width: Dimensions.get("screen").width * 0.85,
          height: 280,
          resizeMode: "contain",
        }}
      />
      <View>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10,
            color: Color.BLACK,
          }}
        >
          Welcome to AI Pocket Agent
        </Text>
        <Text style={{ fontSize: 18, textAlign: "center", color: Color.GRAY }}>
          Yout Ultimate AI Personal Agent to make life easer. Try it Today,
          Completely Free!
        </Text>
      </View>
      {!loading &&<TouchableOpacity style={{
        width:'100%',
        padding:15,
        backgroundColor:Color.PRIMARY,
        borderRadius:12,
        marginTop:20,


      }}
      onPress={onLoginPress}>
        <Text
        style={{color:Color.WHITE,
          textAlign:'center',
          fontSize:16
        }}
        >
          Get Started</Text>
      </TouchableOpacity>}
      {loading==undefined&&<ActivityIndicator size={"large"}/>}
    </View>
  );
}
