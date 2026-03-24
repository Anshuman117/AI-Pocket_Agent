import { Agents } from "@/share/AgentList";

import React from "react";

import { FlatList, TouchableOpacity, View } from "react-native";

import AgentCard from "./AgentCard";
import NonFeaturedAgentCard from "./NonFeaturedAgentCard";
import { useRouter } from "expo-router";

export default function AgentListComponent({isFeatured}:any) {
   const router=useRouter();
  return (
    <View>
      <FlatList
        data={Agents}
        numColumns={2}
        renderItem={({ item, index }) =>
          item.featured === isFeatured ? (
            <TouchableOpacity style={{ flex: 1, padding: 5 }}
              onPress={()=>router.push({
                    pathname:'/chat',
                    params:{
                      agentname:item.name,
                      initialText:item.initialText,
                      agentPrompt:item.prompt,
                      agentId:item.id,
                      imageBanner:item.image
                     
                    }
                  })}
            >
              
              {item.featured?
              <AgentCard agent={item} key={index} />:
              <NonFeaturedAgentCard agent={item} key={index}/>
              }
            
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}
