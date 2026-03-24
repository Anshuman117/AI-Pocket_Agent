
import { View, Text, Image } from 'react-native'
import React from 'react'
import { Agent } from './AgentCard';
import Color from '@/share/Color';

type Props = {
    agent: Agent
  };
export default function NonFeaturedAgentCard({ agent }: Props) {
   return (
     <View
       style={{ backgroundColor: Color.WHITE, borderRadius: 15, minHeight: 180,overflow:'hidden',padding:15,marginTop:15 }}
     >
          <View style={{
        
         
       }}>
       <Image source={agent.image} style={{
         width:80,
         height:80,
         resizeMode:'contain'
       }}/>
       </View>
       <View style={{ marginTop:5 }}>
         <Text style={{ fontSize: 20, fontWeight: "bold" }}>{agent.name}</Text>
         <Text numberOfLines={2} style={{ color: Color.GRAY,marginTop:2 }}>
           {agent.desc}
         </Text>
       </View>
     
     </View>
   );
}


