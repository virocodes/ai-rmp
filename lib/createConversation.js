import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // your Firebase config file

export async function createConversation(userId) {
    try {
        // Reference to the conversation's messages subcollection
        const conversationsCollectionRef = collection(db, `conversations`);

        // Add a new conversation
        const newConversation = {
            userId: userId,
            createdAt: new Date(),
        };

        // Add the document to Firestore
        const docRef = await addDoc(conversationsCollectionRef, newConversation);
        console.log("Conversation created with ID: ", docRef.id);
        return docRef.id
    } catch (error) {
        console.error("Error adding message: ", error);
    }
}