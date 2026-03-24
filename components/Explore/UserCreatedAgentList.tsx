import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import { firestoreDb } from '@/config/FirebaseConfig'
import { useUser } from '@clerk/expo';
import Index from '@/app';
import { ArrowRight, Trash2 } from 'lucide-react-native';
import Color from '@/share/Color';
import { useRouter } from 'expo-router';

type Agent={
    agentName:string,
    agentId:string,
    prompt:string,
    emoji:string
}
export default function UserCreatedAgentList() {
    const {user}=useUser();
    const [AgentList,setAgentList]=useState<Agent[]>([]);
    const router=useRouter();
    useEffect(()=>{
        user && GetUserAgents();

    },[user])
    const GetUserAgents=async()=>{
        const q=query(collection(firestoreDb,'agent'),where("userEmail",'==',user?.primaryEmailAddress?.emailAddress))
        setAgentList([]);
        const querySnapshot=await getDocs(q);
        querySnapshot.forEach((doc)=>{
            console.log(doc.data())
            //@ts-ignore
            setAgentList((prev)=>[...prev,{
                ...doc.data(),
                agentId:doc.id
            }])
        })
    }
    const handleDelete = (agentId: string) => {
        Alert.alert(
          "Delete Agent",
          "Are you sure you want to delete?",
          [
            { text: "Cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                await deleteDoc(doc(firestoreDb, 'agent', agentId));
                setAgentList((prev) =>
                  prev.filter((item) => item.agentId !== agentId)
                );
              },
            },
          ]
        );
      };

  return (
    <View style={{
        marginTop:10,
        marginBottom:10
    }}>
      <Text style={{fontSize:18,fontWeight:'bold'}}>My Agent/Assistant</Text>
      
      <FlatList
      data={AgentList}
      renderItem={({item,index})=>(
        <TouchableOpacity style={{
            display:'flex',
            flexDirection:'row',
            padding:15,
            borderWidth:0.5,
            borderColor:Color.GRAY,
            alignItems:'center',
            justifyContent:'space-between',
            backgroundColor:Color.LIGHT_BLUE,
            borderRadius:15,
            marginTop:10

        }}
        onPress={()=>router.push({
            pathname:'/chat',
                    params:{
                      agentname:item.agentName,
                      initialText:'',
                      agentPrompt:item.prompt,
                      agentId:item.agentId,
                      emoji:item.emoji
                    }
        })}>
            <View style={{display:'flex',flexDirection:'row',gap:10,alignItems:'center'}}>
            <Text style={{fontSize:25,}}>{item.emoji}</Text> 
            <Text style={{fontSize:20,fontWeight:'semibold'}}>{item.agentName}</Text>
            </View>

             {/* DELETE BUTTON */}
      <TouchableOpacity 
        onPress={(e) => {
          e.stopPropagation(); // 🚨 prevents opening chat
          handleDelete(item.agentId);
        }}
      >
       <Trash2 color="red" size={20} />
      </TouchableOpacity>
            <ArrowRight/>
        </TouchableOpacity>
        
      )}/>
    </View>
  )
}