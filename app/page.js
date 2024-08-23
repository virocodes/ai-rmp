// import { useUser } from "@clerk/nextjs";
import {auth, currentUser} from '@clerk/nextjs/server'
import { getConversationsByUserId } from "@/lib/getConversations";
import { getMessagesByConversationId } from "@/lib/getMessages";
import { createConversation } from "@/lib/createConversation";
import Chatbot from "@/components/Chatbot";


export default async function Home() {
  // const { isLoaded, isSignedIn, user } = useUser();
  // console.log('user', isSignedIn, user)

  const {userId} = auth()
  // console.log('userId', userId)
  // if signed in, get conversationsByUser or create new conversation
  const conversations = userId ? await getConversationsByUserId(userId) : []
  // console.log('conversations', conversations)

  const conversationId = conversations.length === 0 && userId? await createConversation(userId) : conversations.length > 0 ? conversations[0]?.id : null
  console.log('conversationId', conversationId)

  // if signed in, get messagesByConversationId
  const messagesJSON = userId && conversationId ? await getMessagesByConversationId(conversationId) : []
  // console.log('messagesJSON', messagesJSON)
  
  // if conversationId then set prev messages
  const prevMessages = JSON.parse(JSON.stringify(messagesJSON))
  
  const user = await currentUser()
  // console.log('user', user)
  

  return (
    <Chatbot name={user?.firstName} conversationId={conversationId} prevMessages={prevMessages} />
  );
}
