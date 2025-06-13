'use client';
import React, { useState } from 'react';
// import Head from 'next/head'; // Removed as it was causing a compilation error in this environment

// Main App component
export default function Home() {
	const [flightNumber, setFlightNumber] = useState('');
	const [aircraftInfo, setAircraftInfo] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [apiCalled, setApiCalled] = useState(false); // Track if initial API call has been made

	/**
	 * Handles the flight number input change.
	 * Converts input to uppercase for consistent lookup.
	 * Clears previous information when input changes.
	 * @param {Object} e - The event object.
	 */
	const handleFlightNumberChange = (e) => {
		setFlightNumber(e.target.value.toUpperCase().replace(/\s/g, ''));
		// Clear previous info and errors when input changes
		setAircraftInfo(null);
		setError('');
		setApiCalled(false);
	};

	/**
	 * Fetches aircraft information by calling the local API endpoint.
	 */
	const getAircraftInfo = async () => {
		setLoading(true);
		setError('');
		setAircraftInfo(null);
		setApiCalled(true); // Mark that an API call is being attempted

		try {
			const prompt = `Generate plausible (but not necessarily real-time or accurate) flight and aircraft details for flight number ${flightNumber} in JSON format. Include:
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
				],
			};

			const response = await fetch('/api/gemini', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt, type: 'flightInfo', schema }),
			});

			const result = await response.json();

			if (response.ok && result.data) {
				let parsedData;
				try {
					parsedData = JSON.parse(result.data);
				} catch (parseError) {
					console.error(
						'Failed to parse JSON from local API:',
						parseError,
						'Raw response:',
						result.data,
					);
					setError(
						'Could not parse AI-generated flight data. Please try again.',
					);
					return;
				}

				if (parsedData && parsedData.flightNumber === flightNumber) {
					setAircraftInfo(parsedData);
				} else {
					setError(
						`AI could not generate plausible data for flight number: ${flightNumber}.`,
					);
					setAircraftInfo(null);
				}
			} else {
				console.error('Error from /api/gemini (flightInfo):', result);
				setError(
					result.error ||
						'API did not return valid flight data. Please try again or with a different flight number.',
				);
				setAircraftInfo(null);
			}
		} catch (err) {
			console.error('Failed to call local API for flight info:', err);
			setError(
				`Failed to retrieve data. Network error or API issue. Detailed error: ${err.message}`,
			);
			setAircraftInfo(null);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Generates insights about the aircraft type by calling the local API endpoint.
	 * @param {string} make - The aircraft manufacturer.
	 * @param {string} model - The aircraft model.
	 */
	// Function to determine reliability score color (for display of generated score)
	const getReliabilityColor = (score) => {
		if (typeof score !== 'number') return 'bg-gray-300';
		if (score >= 90) return 'bg-green-500';
		if (score >= 70) return 'bg-yellow-500';
		return 'bg-red-500';
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center p-4 font-inter text-gray-800'>
			{/* <Head>  */}
			{/* Removed as it was causing a compilation error in this environment */}
			{/* <title>Flight Lens</title> */}
			{/* <meta name="description" content="Flight and aircraft information by Flight Lens" /> */}
			{/* <link rel="icon" href="/favicon.ico" /> */}
			{/* </Head> */}

			<div className='bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg border border-purple-200 transform hover:scale-105 transition-transform duration-300 ease-in-out'>
				<h1 className='text-4xl font-extrabold text-purple-700 mb-6 text-center tracking-tight'>
					Flight Lens
				</h1>
				<p className='text-center text-gray-600 mb-8'>
					Enter a flight number to get aircraft details via Flight Lens.
				</p>

				<div className='mb-6'>
					<label
						htmlFor='flightNumber'
						className='block text-gray-700 text-sm font-semibold mb-2'
					>
						Flight Number (IATA format, e.g., LH456):
					</label>
					<input
						type='text'
						id='flightNumber'
						value={flightNumber}
						onChange={handleFlightNumberChange}
						placeholder='e.g., LH456, UA870, BA249'
						className='w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-400 transition-all duration-200'
					/>
				</div>

				<button
					onClick={getAircraftInfo}
					disabled={loading || !flightNumber}
					className='w-full bg-purple-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-purple-700 transition duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-3 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
				>
					{loading ? (
						<>
							<svg
								className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
							>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'
								></circle>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
								></path>
							</svg>
							Generating Flight Data...
						</>
					) : (
						'Get Flight Lens Info ✨'
					)}
				</button>

				{error && (
					<div className='mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md animate-fade-in'>
						<p className='font-bold mb-2'>Error:</p>
						<p>{error}</p>
						{apiCalled && (
							<p className='text-sm mt-3 text-red-600'>
								The AI may not be able to generate plausible data for all flight
								numbers, or there might be an issue with the AI response.
							</p>
						)}
					</div>
				)}

				{aircraftInfo && (
					<div className='mt-8 bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-lg animate-slide-up'>
						<h2 className='text-2xl font-bold text-blue-800 mb-5 border-b pb-3 border-blue-200'>
							Flight Lens Details for {flightNumber}
						</h2>
						<div className='space-y-4'>
							<p className='text-gray-700'>
								<span className='font-semibold'>Make:</span> {aircraftInfo.make}
							</p>
							<p className='text-gray-700'>
								<span className='font-semibold'>Model:</span>{' '}
								{aircraftInfo.model}
							</p>
							<p className='text-700'>
								<span className='font-semibold'>Age:</span> {aircraftInfo.age}
							</p>
							<p className='text-gray-700'>
								<span className='font-semibold'>Registration:</span>{' '}
								{aircraftInfo.registration}
							</p>
							<p className='text-gray-700'>
								<span className='font-semibold'>ICAO24:</span>{' '}
								{aircraftInfo.icao24}
							</p>
							<p className='text-gray-700'>
								<span className='font-semibold'>Current Status:</span>{' '}
								{aircraftInfo.status}
							</p>

							<div className='pt-4 border-t border-blue-100'>
								<p className='text-gray-700'>
									<span className='font-semibold'>Origin Airport:</span>{' '}
									{aircraftInfo.origin}
								</p>
								<p className='text-gray-700'>
									<span className='font-semibold'>Destination Airport:</span>{' '}
									{aircraftInfo.destination}
								</p>
								<p className='text-gray-700'>
									<span className='font-semibold'>Scheduled Departure:</span>{' '}
									{aircraftInfo.scheduledDeparture}
								</p>
								<p className='text-gray-700'>
									<span className='font-semibold'>Scheduled Arrival:</span>{' '}
									{aircraftInfo.scheduledArrival}
								</p>
							</div>

							<div className='pt-4 border-t border-blue-100'>
								<p className='text-gray-700'>
									<span className='font-semibold'>Maintenance Summary:</span>{' '}
									{aircraftInfo.maintenanceHistorySummary}
								</p>
							</div>

							<div className='pt-4 border-t border-blue-100 bg-purple-50 p-4 rounded-lg shadow-inner'>
								<p className='font-semibold text-xl text-purple-700 mb-3'>
									Estimated Reliability Score:
								</p>
								<div className='flex items-center space-x-3'>
									<span className='text-3xl font-bold text-purple-600'>
										{typeof aircraftInfo.estimatedReliabilityScore === 'number'
											? `${aircraftInfo.estimatedReliabilityScore}/100`
											: 'N/A'}
									</span>
									<div className='w-40 h-4 rounded-full overflow-hidden bg-gray-300 shadow-sm'>
										<div
											className={`h-full rounded-full ${getReliabilityColor(
												aircraftInfo.estimatedReliabilityScore,
											)} transition-all duration-500 ease-out`}
											style={{
												width:
													typeof aircraftInfo.estimatedReliabilityScore ===
													'number'
														? `${aircraftInfo.estimatedReliabilityScore}%`
														: '0%',
											}}
										></div>
									</div>
									<span className='text-md font-medium text-gray-600'>
										{typeof aircraftInfo.estimatedReliabilityScore === 'number'
											? aircraftInfo.estimatedReliabilityScore >= 90
												? 'Excellent'
												: aircraftInfo.estimatedReliabilityScore >= 70
												? 'Good'
												: 'Needs Attention'
											: ''}
									</span>
								</div>
							</div>
						</div>

						<p className='text-sm text-red-700 italic mt-6 pt-4 border-t border-red-200'>
							<span className='font-bold'>Crucial Disclaimer:</span> This data
							is *generated by a large language model (Gemini 2.5 Flash) for Flight Lens* and is
							not sourced from real-time flight tracking databases. It is
							illustrative and should **not** be used for actual flight planning
							or decision-making. Information may be inaccurate,
							incomplete, or entirely fictitious. When in doubt try again.
						</p>
					</div>
				)}
			</div>
			<div className='text-center mt-6 text-sm text-gray-500'>
				Flight Lens by{' '}
				<a
					href='https://www.linkedin.com/in/akm85/'
					target='_blank'
					rel='noopener noreferrer'
					className='text-purple-600 hover:text-purple-800 transition-colors duration-200'
				>
					Abhishek Maurya
				</a>
			</div>
		</div>
	);
}
