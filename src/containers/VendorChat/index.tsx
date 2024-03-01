import { View, Text, ActivityIndicator, ImageBackground } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import ChatContext from '../../chatContext'
import { useSelector } from 'react-redux'
import ChatScreen from '../Chat'
import TaskChatVendorItem from '../../components/Chat/TaskChatVendorItem'
import TopBar from '../../components/TopBar'
import { moderateScale } from '../../utils/scalingUnits'


export default function VendorChat(props) {
   let { userData } = useSelector(state => state.user)
   let vendor = { ...userData }
   vendor.userId = userData.id

   return (
      <ImageBackground
         source={require("../../assets/images/blurBG.png")}
         resizeMode="cover"
         imageStyle={{
            width: "100%",
            height: "100%"
         }}
         style={{
            flex: 1
         }}
      >
         <TopBar
            style={{ backgroundColor: 'transparent' }}
            title="Chat"
         />
         <View style={{ paddingHorizontal: moderateScale(11) }}>
            <TaskChatVendorItem
               taskData={props.route.params.data}
               vendor={vendor}
               chatName={props.route.params.data.name}
            />
         </View>
      </ImageBackground>
   )
}

/* export default function VendorChat(props) {

   const {
      chatClient,
      setupChatClient,
      clientReady,
      disconnectClient,
      setChannel
   } = useContext(ChatContext)

   let { userData } = useSelector(state => state.user)

   const [channelInEntry, setChannelInEntry] = useState(undefined);
   const [uname,setUname] = useState("")


   let task = props.route.params.data//.activities.find(i => i.vendors.find(vendor => vendor.userId == userData.id))

   let hostId = props.route.params.data.event.userId

   let channelPrefix = "task" + task.id

   //console.log(groupName)

   useEffect(() => {

      const startup = async () => {
         if (!clientReady) {
            await setupChatClient()
         }

         let membersArray = [
            hostId + "_user",
            userData.id + "_user",
         ]
         membersArray.sort(function (a, b) {
            const aId = a?.slice(0, 2)
            const bId = b?.slice(0, 2)
            return parseInt(aId) - parseInt(bId)
         })

         let channelId = [...membersArray].join('__')
         if (channelPrefix) {
            channelId = `${channelPrefix}_${channelId}`
         }

         const channel = chatClient.channel("messaging", channelId,
            {
               members: membersArray, name: channelId
            });
         await channel.create();

         // use CID to get channel data with full state
         const filter = {
            type: 'messaging',
            members: { $in: membersArray },
            id: { $eq: channelId }
         };

         let queryRes;
         if (membersArray?.length > 0) {
            queryRes = await chatClient.queryChannels(filter, {}, {
               watch: true, // this is the default
               state: true,
            });


            const channelWithState = queryRes[0]

            //console.log(channelWithState)

            if (!channelWithState) {
               return;
            }

            setChannel(channelWithState);
            setUname(channelWithState.state.members[hostId + "_user"].user?.name)
            setChannelInEntry(channelWithState)

         }
      };
      startup();


   }, [])

   const obj={params:{name:uname}}

   return (
      <>
         {channelInEntry
            ?
            <ChatScreen route={obj}/>
            :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}><ActivityIndicator /></View>}
      </>
   )
} */