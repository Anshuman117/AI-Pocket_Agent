import Color from "@/share/Color";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function CreateAgentBanner() {
  const router =useRouter();
  return (
    <View
      style={{
        backgroundColor: Color.PRIMARY,
        borderRadius: 15,
        display: "flex",
        flexDirection: "row",
        marginTop:15
      }}
    >
      <Image
        source={require("./../../assets/images/agents/agentGroup.png")}
        style={{ width: 170, height: 110, resizeMode: "contain" }}
      />
      <View style={{ padding: 10, width: 160 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: Color.WHITE }}>
          Create Your Own Agent{" "}
        </Text>
        <TouchableOpacity style={{backgroundColor:Color.WHITE,
        padding:7,
        borderRadius:5,
        marginTop:10,
        marginRight:5
            
        }}
        onPress={()=>router.push('/create-agent')}
        >
            <Text style={{color:Color.PRIMARY,textAlign:'center'}}>Create Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
