import { View, Text, FlatList } from 'react-native'
import React from 'react'
import CreateAgentBanner from '@/components/Home/CreateAgentBanner'
import AgentListComponent from '@/components/Home/AgentListComponent'
import UserCreatedAgentList from '@/components/Explore/UserCreatedAgentList'

export default function Explore() {
  return (
    <FlatList
      data={[]} // dummy list
      renderItem={null}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      ListHeaderComponent={
        <View style={{ padding: 20 }}>
          
          <CreateAgentBanner />

          <UserCreatedAgentList />

          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: 10,
            }}
          >
            Featured Agent
          </Text>

          <AgentListComponent isFeatured={true} />

        </View>
      }
    />
  )
}