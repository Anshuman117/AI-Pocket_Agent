import Color from '@/share/Color';
import { AIChatModel } from '@/share/GlobalApi';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Camera, Copy, Cross, Plus, Send, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker'
import { firestoreDb } from '@/config/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useUser } from '@clerk/expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
type Message = {
  role: string;
  content: string;
  image?: string; // ✅ add this
};

export default function ChatUI() {
  const navigation =useNavigation();
  const {agentname,agentPrompt,agentId,initialText,chatId,emoji,imageBanner,messagesList}=useLocalSearchParams();
   const[messages,setMessages]=useState<Message[]>([]);
   const[input,setInput]=useState<string|null>();
   const[file,setFile]=useState();
   const [docId,setDocId]=useState<string|null>();
   const {user}=useUser();
   const insets = useSafeAreaInsets();
  useEffect(()=>{
    navigation.setOptions({
      headerShown:true,
      headerTitle: agentname,
      headerRight:()=>(
        <Plus/>
      )
    })
    if(!chatId){

      const id=Date.now().toString()
      setDocId(id);

    }
    else{
      setDocId(chatId.toString())
    }
    if(messagesList)
    {

    
    // @ts-ignore
    const messagesListJSON=JSON.parse(messagesList)
    if(messagesListJSON?.length>0){
      setMessages(messagesListJSON)
    }
  }
  },[messagesList]);

  useEffect(()=>{
    setInput(initialText)
    if(agentPrompt)
    {  
      setMessages((prev)=>[...prev,{role:'system',content:agentPrompt.toString()}])
    }


  },[agentPrompt])

  const onSendMessage = async () => {
    if (!input?.trim() && !file) return;
  
    let imageUrl = null;
  
    // ✅ Upload image if exists
    if (file) {
      imageUrl = await uploadToCloudinary(file);
    }
  
    // 👇 include image in message
    const newMessage = {
      role: "user",
      content: input || "",
      image: imageUrl, // optional
    };
  
    const loadingMsg = { role: "assistant", content: "_loading_" };
  
    setInput("");
    setFile(null); // clear after send
  
    const updatedMessages = [...messages, newMessage];
  
    setMessages((prev) => [...prev, newMessage, loadingMsg]);
  
    try {
      const result = await AIChatModel(updatedMessages);
  
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: result?.aiResponse || "No response",
        };
        return updated;
      });
  
    } catch (error) {
      console.log("ERROR:", error);
  
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Server error 😢",
        };
        return updated;
      });
    }
  };


  const CopyToClipboard=async(message:string)=>{
    await Clipboard.setStringAsync(message);
    
    ToastAndroid.show('Copied to clipBoard!',ToastAndroid.BOTTOM)

  }
  const PickImage=async()=>{
    const result=await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing:false,
      quality:0.5
    })
    if(!result.canceled)
    {
      setFile(result.assets[0].uri);
    }
  }

   

  // 🟢 NEW CODE (Cloudinary Upload)
const uploadToCloudinary = async (imageUri) => {
  const data = new FormData();

  data.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "photo.jpg",
  });

  data.append("upload_preset", "AI_Pocket_APP"); // replace
  data.append("cloud_name", "dymfpsqiz"); // replace

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dymfpsqiz/image/upload",
      {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const result = await res.json();
    return result.secure_url;
  } catch (error) {
    console.log("Cloudinary Error:", error);
    return null;
  }
};

useEffect(()=>{
  const SaveMessages=async()=> {
  if(messages?.length>0&&docId)
  {

    await setDoc(doc(firestoreDb,'chats',docId),{
      userEmail:user?.primaryEmailAddress?.emailAddress,
      messages:messages,
      docId:docId,
      agentName: agentname,
      agentPrompt: agentPrompt,
      agentId: agentId,
      initialText: initialText,
      ...(emoji && { emoji }),                // ✅ FIX
    ...(imageBanner && { imageBanner }), 
      lastModified:Date.now()

      

 

    },{merge:true})
  }
  }
  SaveMessages();

},[messages])
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <FlatList
      style={styles.messageList}
      contentContainerStyle={[
        styles.listContent,
        { paddingBottom: Math.max(insets.bottom, 12) },
      ]}
      keyboardShouldPersistTaps="handled"
      data={messages}
      //@ts-ignore
      renderItem={({ item, index }) =>
        item.role !== 'system' && (
          <View
            style={[
              styles.messageContainer,
              item.role == 'user'
                ? styles.userMessage
                : styles.assistantMessage,
            ]}
          >
            {item.content == '_loading_' ? (
              <ActivityIndicator size={'small'} color={Color.BLACK} />
            ) : (
              <>
               {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: 10,
                      marginTop: 5,
                    }}
                  />
                )}
                <Text
                  style={[
                    styles.MessageText,
                    item.role === 'user'
                      ? styles.userText
                      : styles.assistantText,
                  ]}
                >
                  {item.content}
                </Text>
      
               
              </>
            )}
      
            {item.role == 'assistant' && (
              <Pressable onPress={() => CopyToClipboard(item.content)}>
                <Copy color={Color.GRAY} />
              </Pressable>
            )}
          </View>
        )
      }   
      />
       <View
        style={[
          styles.composerWrapper,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
       >
       {file&&(
        <View style={{
          marginBottom:5,
          display:'flex',
          flexDirection:'row'
          }}>
          <Image source={{uri:file}} style={{
            width:50,
            height:50,
            borderRadius:6
          }}/>
          <TouchableOpacity onPress={()=>setFile(null)}>
            <X/>
          </TouchableOpacity>
        </View>

       )}
       
      {/* Input box */}
      <View style={styles.inputContainer}>
      <TouchableOpacity style={{marginRight:10}} 
      onPress={PickImage}>
          <Camera size={27}/>
        </TouchableOpacity>
        <TextInput
          onChangeText={(v)=>setInput(v)}
          value={input}
          style={styles.input}
          placeholder='Type a message'
          placeholderTextColor={Color.GRAY}
          multiline
        />
        
        <TouchableOpacity style={{backgroundColor:Color.PRIMARY,padding:7,borderRadius:99}} onPress={onSendMessage}>
          <Send color={Color.WHITE} size={20}/>
        </TouchableOpacity>
      </View>
      </View>

    </KeyboardAvoidingView >
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Color.WHITE,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messageList: {
    flex: 1,
  },
  messageContainer:{
    maxWidth:'75%',
    marginVertical:4,
    padding:10,
    margin:10,
    borderRadius:15

  },
  userMessage:{
    backgroundColor:Color.PRIMARY,
    alignSelf:'flex-end',
    borderBottomRightRadius:1

  },
  assistantMessage:{
    backgroundColor:Color.LIGHT_GRAY,
    alignSelf:'flex-start',
    borderRadius:15,
    borderBottomLeftRadius:1


  },
  MessageText:{fontSize:16},
  userText:{color:Color.WHITE},
  assistantText:{color:Color.BLACK},
  composerWrapper: {
    paddingHorizontal: 10,
    paddingTop: 8,
    backgroundColor: Color.WHITE,
  },
  inputContainer:{
    flexDirection:'row',
    alignItems:'flex-end',
    padding:10,
    borderWidth:1,
    borderRadius:12,
    borderColor:'#ccc',
    
  },
  input:{
    flex:1,
    padding:10,
    borderRadius:20,
    borderWidth:1,
    borderColor:'#ccc',
    backgroundColor:Color.WHITE,
    marginRight:8,
    paddingHorizontal:15,
    minHeight: 46,
    maxHeight: 110,
    textAlignVertical: 'top',
  }
  
})
