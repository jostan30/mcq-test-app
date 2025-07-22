import { NextResponse } from "next/server";

export async function POST(req) {
  const { topic } = await req.json();

  const prompt = `You are an intelligent educational assistant. Generate 10 multiple-choice questions for a quiz on the topic "${topic}". 

📚 Guidelines:
- Each question should test conceptual understanding or factual knowledge.
- Format: Each question must have exactly 4 answer options.
- Indicate the correct option using the index (starting at 0).
- Avoid ambiguous or overly complex questions.
- The format must be valid JSON. Return an array like:

[
  {
    "question": "What is ...?",
    "options": ["A", "B", "C", "D"],
    "correct": 2
  }
]

🧠 Purpose:
This quiz is designed to help learners quickly assess their understanding of "${topic}". It simulates a practice test format for revision or interview prep.
`;


  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // Update your .env file accordingly
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
      "X-Title": "MCQ Test Generator",        // Optional: your project name
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct", // A good free model
      messages: [
        { role: "system", content: "You are an exam generator AI." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  const text = data.choices?.[0]?.message?.content;
  const questions = JSON.parse(text); // Must match expected JSON format

  return NextResponse.json({ questions });
}
