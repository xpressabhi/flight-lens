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

		const prompt = `Generate plausible (make it as real-time or accurate possible) flight and aircraft details for flight number ${flightNumber} in markdown format. Include:
	  - Summary (string, a brief overview of the flight)	
	  - Estimated Reliability Score (number, 1-100, where higher is better)
      - Make (string, e.g., Boeing, Airbus, Embraer)
      - Model (string, e.g., 737-800, A320neo, E190)
      - Age (string, e.g., "5 years", "10 years")
	  - Airline (string, e.g., "British Airways", "Lufthansa", "Indigo")
      - Status (string, e.g., "On-time", "Delayed by 45 minutes", "Landed", "Cancelled")
      - Origin (string, e.g., "London Heathrow (LHR)")
      - Destination (string, e.g., "New York JFK (JFK)")
      - Scheduled Departure (string, e.g., "2025-06-12 10:00 AM IST")
      - Scheduled Arrival (string, e.g., "2025-06-12 01:00 PM IST")
      - Maintenance History Summary (string, a brief, plausible summary of recent maintenance)
	  - Average Delay (string, e.g., "15 minutes", "On-time")
      - Delay Probability (number, 0-100, likelihood of delay)
      - Common Delay Reasons (string, e.g., "Air traffic congestion, Weather conditions, Technical issues")
      - Historical Performance (string, e.g., "Historically, 75% of flights on this route are on-time.")
      If you cannot plausibly generate data for the given flight number, return an error message in markdown format.`;

		const ai = new GoogleGenAI({ apiKey });
		const model = 'gemini-2.5-flash-lite-preview-06-17';

		// Define the grounding tool
		const groundingTool = {
			googleSearch: {},
		};

		const config = {
			thinkingConfig: {
				thinkingBudget: 0,
			},
			tools: [groundingTool],
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
