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
		const { flightNumber } = await request.json();

		const apiKey = process.env.GEMINI_API_KEY;

		if (!apiKey) {
			return NextResponse.json(
				{ error: 'API key not configured' },
				{ status: 500 },
			);
		}

		const prompt = `Generate plausible (make it as real-time or accurate possible) flight and aircraft details for flight number ${flightNumber} in JSON format. Include:
      - flightNumber (string, same as input)
      - make (string, e.g., Boeing, Airbus, Embraer)
      - model (string, e.g., 737-800, A320neo, E190)
      - age (string, e.g., "5 years", "10 years")
      - registration (string, e.g., "N123AA", "G-XXXX")
      - icao24 (string, e.g., "A1B2C3", "400D5E")
      - status (string, e.g., "On-time", "Delayed by 45 minutes", "Landed", "Cancelled")
      - origin (string, e.g., "London Heathrow (LHR)")
      - destination (string, e.g., "New York JFK (JFK)")
      - scheduledDeparture (string, e.g., "2025-06-12 10:00 AM UTC")
      - scheduledArrival (string, e.g., "2025-06-12 01:00 PM UTC")
      - maintenanceHistorySummary (string, a brief, plausible summary of recent maintenance)
      - estimatedReliabilityScore (number, 1-100, where higher is better)
	  - averageDelay (string, e.g., "15 minutes", "On-time")
      - delayProbability (number, 0-100, likelihood of delay)
      - commonDelayReasons (array of strings, e.g., ["Air traffic congestion", "Weather conditions", "Technical issues"])
      - historicalPerformance (string, e.g., "Historically, 75% of flights on this route are on-time.")
      If you cannot plausibly generate data for the given flight number, return an empty JSON object.`;

		const schema = {
			type: 'OBJECT',
			properties: {
				flightNumber: { type: 'STRING' },
				make: { type: 'STRING' },
				model: { type: 'STRING' },
				age: { type: 'STRING' },
				registration: { type: 'STRING' },
				icao24: { type: 'STRING' },
				status: { type: 'STRING' },
				origin: { type: 'STRING' },
				destination: { type: 'STRING' },
				scheduledDeparture: { type: 'STRING' },
				scheduledArrival: { type: 'STRING' },
				maintenanceHistorySummary: { type: 'STRING' },
				estimatedReliabilityScore: { type: 'NUMBER' },
				averageDelay: { type: 'STRING' },
				delayProbability: { type: 'NUMBER' },
				commonDelayReasons: { type: 'ARRAY', items: { type: 'STRING' } },
				historicalPerformance: { type: 'STRING' },
			},
			required: [
				'flightNumber',
				'make',
				'model',
				'age',
				'registration',
				'icao24',
				'status',
				'origin',
				'destination',
				'scheduledDeparture',
				'scheduledArrival',
				'maintenanceHistorySummary',
				'estimatedReliabilityScore',
				'averageDelay',
				'delayProbability',
				'commonDelayReasons',
				'historicalPerformance',
			],
		};

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
