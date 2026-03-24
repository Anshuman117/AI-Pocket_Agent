import Color from "@/share/Color";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  agent: Agent;
};
export type Agent = {
  id: number;
  name: string;
  desc: string;
  image: string;
  initialText: string;
  prompt: string;
  type: string;
  featured?: boolean;
};
export default function AgentCard({ agent }: Props) {
 
  return (
    <View
      style={{ backgroundColor: Color.WHITE, borderRadius: 15, minHeight: 200,overflow:'hidden' }}
    
    >
      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{agent.name}</Text>
        <Text numberOfLines={2} style={{ color: Color.GRAY,marginTop:2 }}>
          {agent.desc}
        </Text>
      </View>
      <View style={{
        position:'absolute',
        right:0,
        bottom:0,
        
      }}>
      <Image source={agent.image} style={{
        width:110,
        height:100,
        resizeMode:'contain'
      }}/>
      </View>
    </View >
  );
}
