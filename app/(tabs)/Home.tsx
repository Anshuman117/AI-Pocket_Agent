import AgentListComponent from "@/components/Home/AgentListComponent";
import CreateAgentBanner from "@/components/Home/CreateAgentBanner";
import Color from "@/share/Color";
import { useNavigation } from "expo-router";
import { SettingsIcon } from "lucide-react-native";
import React, { useEffect } from "react";
import { FlatList, Image, Settings, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          AI Pocket Agent
        </Text>
      ),
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          style={{
            marginLeft: 15,
            display: "flex",
            flexDirection: "row",
            gap: 6,
            backgroundColor: Color.PRIMARY,
            padding: 5,
            paddingHorizontal: 10,
            borderRadius: 5,
          }}
        >
          <Image
            source={require("./../../assets/images/dimond.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text style={{ color: Color.WHITE, fontWeight:'bold' }}>Pro</Text>
        </TouchableOpacity>
      ),
      headerRight:()=>{
        return <SettingsIcon style={{ marginRight: 15}}/>;


      }
      

      
    });
  }, []);
  return (
    <FlatList
    data={[]}
    renderItem={null}
    ListHeaderComponent={  <View style={{padding:15}}>
    <AgentListComponent isFeatured={true}/>
    <CreateAgentBanner/>
    <AgentListComponent isFeatured={false}/>
  </View>}/>
  
  );
}
