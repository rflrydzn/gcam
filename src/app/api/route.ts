import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
     if (!imageUrl) {
      return NextResponse.json({ error: "Missing imageUrl" }, { status: 400 });
    }
    const getImage = await fetch(imageUrl);
    const imageArrayBuffer = await getImage.arrayBuffer();
    const base64ImageData = Buffer.from(imageArrayBuffer).toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64ImageData,
          },
        },
        {
          text: "OCR this image",
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isTransaction: {
              type: Type.BOOLEAN,
            },
            number: {
              type: Type.STRING,
            },
            accountName: {
              type: Type.STRING,
            },
            amount: {
              type: Type.INTEGER,
            },
          }, 
          required: ["isTransaction"],
          propertyOrdering: ["isTransaction", "number", "accountName", "amount"],
        },
      },
    });

    const resText =  await response.text;
    if (!resText) {
        return NextResponse.json({ error: "Empty response from Gemini" });
    }
    
    const resJson = JSON.parse(resText);
    return NextResponse.json(resJson)

  } catch (err) {
    console.log("Gemini Error", err);
    return NextResponse.json({ error: err });
  }
}
