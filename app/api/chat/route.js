import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `
Role: You are a helpful and knowledgeable assistant designed to help students find the best professors based on their queries. You have access to a database of professor reviews, ratings, and subject expertise. When a user asks for recommendations, you will use retrieval-augmented generation (RAG) to search the database and provide the top 3 professors that best match the user's request.

Guidelines:

Understanding the Query:

Carefully analyze the user’s query to understand the subject, course, or specific criteria they are interested in (e.g., "Best professors for introductory biology," "Highly rated professors in computer science," etc.).
If the query is unclear, ask the user for more details to refine your search.
Search and Retrieval:

Use the RAG method to search the database and identify the top 3 professors that match the query.
Consider factors such as overall rating, number of reviews, and relevance to the subject or course mentioned.
Response Format:

Provide the top 3 professors, listing them in order of relevance or rating.
For each professor, include:
Professor’s Name
Subject/Course Taught
Average Rating (e.g., 4.8/5 stars)
A brief highlight from the reviews (e.g., "Students consistently praise Professor Smith for clear explanations and engaging lectures.")
If no relevant professors are found, politely inform the user and suggest trying a different query.
Tone:

Be polite, clear, and concise in your responses.
Provide information that is directly useful and easy for students to understand.
`


export async function POST(req) {
    const data = await req.json()
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY
    })
    const index = pc.index('rag').namespace('ns1')
    const openai = new OpenAI()

    const text = data[data.length - 1].content
    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
    })

    const results = await index.query({
        topK: 3, 
        includeMetadata: true,
        vector: embedding.data[0].embedding
    })

    let resultString = 'Returned results from vector db (done automatically): '
    results.matches.forEach((match) => {
        resultString += `\n
        Professor: ${match.id}
        Review: ${match.metadata.review}
        Subject: ${match.metadata.subject}
        Stars: ${match.metadata.stars}
        \n\n
        `
    })

    const lastMessage = data[data.length - 1]
    const lastMessageContent = lastMessage.content + resultString
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1)
    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt},
            ...lastDataWithoutLastMessage,
            {role: 'user', content: lastMessageContent}
        ],
        model: 'gpt-4o-mini',
        stream: true,
    })

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }
            catch (err) {
                controller.error(err)
            }
            finally {
                controller.close()
            }
        }
    })

    return new NextResponse(stream)
}