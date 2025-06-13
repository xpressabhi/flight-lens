// app/api/gemini/route.js
import { NextResponse } from 'next/server';
import { GoogleGenAI, Modality } from '@google/genai';

/**
 * Handles POST requests to the Gemini API route.
 * It expects a 'prompt' and 'type' in the request body.
 * 'type' can be 'flightInfo', 'delayAnalysis', or 'aircraftInsights'.
 */
export async function POST(request) {
	try {
		console.log('starting');
		const { prompt, type, schema } = await request.json();

		const apiKey = process.env.GEMINI_API_KEY;
		console.log(apiKey, prompt);

		if (!apiKey) {
			return NextResponse.json(
				{ error: 'API key not configured' },
				{ status: 500 },
			);
		}

		if (!prompt) {
			return NextResponse.json(
				{ error: 'Prompt is required' },
				{ status: 400 },
			);
		}

		const ai = new GoogleGenAI({ apiKey });
		const model = 'gemini-2.5-flash-preview-05-20';
		const config = {
			thinkingConfig: {
				thinkingBudget: 0,
			},
			responseMimeType: 'application/json',
			responseModalities: [Modality.TEXT],
			responseSchema: schema,
		};

		const response = await ai.models.generateContent({
			model,
			contents: [{ role: 'user', parts: [{ text: prompt }] }],
			config,
		});
		return NextResponse.json({ data: response.text }, { status: 200 });
	} catch (error) {
		console.error('Error in Gemini API route:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error', details: error.message },
			{ status: 500 },
		);
	}
}
