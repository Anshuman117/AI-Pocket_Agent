import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { HeaderTitle } from '@react-navigation/elements';
import EmojiPicker from 'rn-emoji-keyboard'

import Color from '@/share/Color';
import { doc, setDoc } from 'firebase/firestore';
import { firestoreDb } from '@/config/FirebaseConfig';
import { useUser } from '@clerk/expo';

export default function CreateAgent() {
    const navigation=useNavigation();
    const [emoji,setEmoji]=useState('🎃');
    const[agentName,setAgentName]=useState<string>();
    const[instruction,setInstruction]=useState<string>();
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const {user}=useUser();
    const router =useRouter();
    useEffect(()=>{
        navigation.setOptions({
            headerShown:true,
            headerTitle:'Create Agent'
        })
    },[])
    const CreateNewAgent=async()=>{
        if(!agentName||!emoji||!instruction){
            Alert.alert('Please enter all details')
            return;
        }
        const agentId=Date.now().toString()
        await setDoc(doc(firestoreDb,'agent',agentId),{
            emoji:emoji,
            agentName:agentName,
            agentId:agentId,
            prompt:instruction,
            userEmail:user?.primaryEmailAddress?.emailAddress
        });
        Alert.alert("Confirmation",'Agent Created SuccessFully!',[
            {
                text:'OK',
                onPress:()=>console.log('OK'),
                style:'cancel'
            },
            {
                text:'Try Now',
                onPress:()=>router.push({
                    pathname:'/chat',
                    params:{
                        agentname:agentName,
                        initialText:'',
                        agentPrompt:instruction,
                        agentId:agentId,
                        emoji:emoji
                       
                    }
                })
            }
        ]);
        setAgentName('');
        setInstruction('');
    }
  return (
    <View style={{padding:20}}>
        <View style={{
            display:'flex',
            alignItems:'center',
            justifyContent:'center'
        }}>
    <TouchableOpacity style={{padding:15,
    borderWidth:1,
    borderRadius:15,
    borderColor: Color.LIGHT_GRAY,
    backgroundColor:Color.WHITE
    }}
    onPress={()=>setIsOpen(true)}
    >
        <Text style={{fontSize:30}}
        >{emoji}</Text>
    </TouchableOpacity>
    <EmojiPicker onEmojiSelected={(event)=>setEmoji(event.emoji)} open={isOpen} onClose={() => setIsOpen(false)} />
    </View>
    <View>
        <Text>Agent/Assistant Name</Text>
        <TextInput placeholder='Agent Name' style={styles.input}
        placeholderTextColor={Color.GRAY}
        onChangeText={(v)=>setAgentName(v)}
        />
    </View>
    <View style={{paddingTop:15}}>
        <Text>Instructions</Text>
        <TextInput 
        placeholder='Ex. You are a professional Gym Trainer'
        placeholderTextColor={Color.GRAY}
        onChangeText={(v)=>setInstruction(v)}
         style={[styles.input,{height:200,textAlignVertical:'top'}]} multiline={true}/>
    </View>
    <TouchableOpacity
    style={{
        padding:15,
        backgroundColor:Color.PRIMARY,
        marginTop:20,
        borderRadius:15
    }}
    onPress={CreateNewAgent}>
        <Text style={{color:Color.WHITE,textAlign:'center',fontSize:18}}>Create Agent</Text>

    </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    input:{
        backgroundColor:Color.WHITE,
        borderRadius:10,
        padding:8,
        fontSize:18,
        marginTop:5,
        paddingTop:15,
        paddingBottom:15,
        color:Color.BLACK


    }
})
