import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { firestoreDb } from '@/config/FirebaseConfig'
import { useUser } from '@clerk/expo'
import { MessageCircle } from 'lucide-react-native'
import Color from '@/share/Color'
import { useRouter } from 'expo-router'





type History={
  agentId:number,
  agentName:string,
  agentPrompt:string,
  imageBanner:string,
  emoji:string,
  messages:any[],
  lastModified:any



}

export default function History() {

  const {user}=useUser();
  const router=useRouter();
  const [loading,setLoading]=useState(false);
  const [historyList,setHistoryList]=useState<History[]>([]);
  useEffect(()=>{
    user && GetChatHistory();
  },[user])
  const GetChatHistory=async()=>{
    setLoading(true);
    try{
    const q=query(collection(firestoreDb,'chats'),where('userEmail','==',user?.primaryEmailAddress?.emailAddress),
  orderBy('lastModified','desc'));
    const querySnapshot=await getDocs(q);
    setHistoryList([]);
    querySnapshot.forEach((doc)=>{
      console.log(doc.data());
      // @ts-ignore
      setHistoryList(prev=>[...prev,doc.data()])
    })
  }
  catch(e){
    console.log(e)
  }
    setLoading(false);

  }
  const OnClickHandle=(item:History)=>{
    router.push({
      pathname:'/chat',
      params:{
        agentname:item.agentName,
        initialText:'',
        agentPrompt:item.agentPrompt,
        agentId:item.agentId,
        emoji:item.emoji,
        imageBanner:item.imageBanner,
        messagesList:JSON.stringify(item.messages)
       
    }
    })

  }
  return (
    <View style={{
      padding:20,

    }}>
      <FlatList
      data={historyList}
      onRefresh={()=>GetChatHistory}
      refreshing={loading}
      renderItem={({item,index})=>(
        <TouchableOpacity style={{display:'flex',
          flexDirection:'row',
          padding:10,
          backgroundColor:Color.WHITE,
          marginBottom:10,
          borderRadius:10

          
        }}
        onPress={()=>OnClickHandle(item)}>
          <View style={{padding:15,
           marginRight:10,
            backgroundColor:Color.LIGHT_GRAY,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            borderRadius:10
          }}>
         {item.emoji?<Text style={{fontSize:20}}>{item.emoji}</Text>:<MessageCircle/>}
          </View>
         
         <View style={{
          width:'80%'
         }}> 
          <Text style={{
            fontSize:20,
            fontWeight:'bold'
          }}
          >{item.agentName}</Text>
          <Text numberOfLines={2}
          style={{
            color:Color.GRAY
          }}>{item.messages[item.messages.length-1]?.content}</Text>
         </View>
        </TouchableOpacity>
      )}
      />

    </View>
  )
}