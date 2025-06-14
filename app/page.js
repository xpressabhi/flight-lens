'use client';
import React, { useState } from 'react';
import Script from 'next/script';
import {
	MdOutlineInfo,
	MdAccessTime,
	MdBuild,
	MdWarning,
	MdStarRate,
} from 'react-icons/md';
import { FaPlane } from 'react-icons/fa';

// import Head from 'next/head'; // Removed as it was causing a compilation error in this environment

// Main App component
export default function Home() {
	const [flightNumber, setFlightNumber] = useState('');
	const [aircraftInfo, setAircraftInfo] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [apiCalled, setApiCalled] = useState(false); // Track if initial API call has been made
	const [activeTab, setActiveTab] = useState('overview');

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
			const response = await fetch('/api/gemini', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ flightNumber }),
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
		<div className='min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center p-6 font-inter text-gray-800 max-w-7xl mx-auto'>
			{/* <Head>  */}
			{/* Removed as it was causing a compilation error in this environment */}
			{/* <title>Flight Lens</title> */}
			{/* <meta name="description" content="Flight and aircraft information by Flight Lens" /> */}
			{/* <link rel="icon" href="/favicon.ico" /> */}
			{/* </Head> */}

			<div className='bg-white p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl border border-purple-200 transform hover:scale-105 transition-transform duration-300 ease-in-out'>
				<h1 className='text-lg sm:text-4xl font-extrabold text-purple-700 mb-4 sm:mb-6 text-center tracking-tight'>
					Flight Lens
				</h1>
				<p className='text-center text-gray-600 mb-6 sm:mb-8 text-base leading-relaxed font-medium'>
					Enter a flight number to get aircraft details via Flight Lens.
				</p>

				<div className='mb-4 sm:mb-6'>
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
						className='w-full px-4 sm:px-5 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-400 transition-all duration-200'
					/>
				</div>

				<button
					onClick={getAircraftInfo}
					disabled={loading || !flightNumber}
					className='w-full bg-purple-600 text-white py-2 sm:py-3 rounded-lg font-bold text-lg hover:bg-purple-700 transition duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-3 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
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
					<div className='mt-4 sm:mt-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md animate-fade-in'>
						<p className='font-bold mb-1 sm:mb-2'>Error:</p>
						<p className='text-base leading-relaxed'>{error}</p>
						{apiCalled && (
							<p className='text-sm mt-2 sm:mt-3 text-red-600'>
								The AI may not be able to generate plausible data for all flight
								numbers, or there might be an issue with the AI response.
							</p>
						)}
					</div>
				)}

				{aircraftInfo && (
					<>
						<div className='my-4 text-lg sm:text-xl font-bold text-purple-900 text-center'>
							<FaPlane className='inline mr-2' />
							Aircraft Make: {aircraftInfo.make}
						</div>
						<div className='mt-6 pt-4 border-t border-blue-100 bg-purple-50 p-4 sm:p-6 rounded-lg shadow-inner'>
							<p className='font-semibold text-lg sm:text-xl text-purple-700 mb-3'>
								<MdStarRate className='inline mr-2' />
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
						<div className='flex flex-wrap justify-center gap-4 border-b mb-6 overflow-x-auto'>
							<button
								onClick={() => setActiveTab('overview')}
								className={`px-4 py-2 font-semibold ${
									activeTab === 'overview'
										? 'border-b-4 border-purple-600 text-purple-700'
										: 'text-gray-500'
								}`}
							>
								<MdOutlineInfo className='inline mr-1' /> Overview
							</button>
							<button
								onClick={() => setActiveTab('delay')}
								className={`px-4 py-2 font-semibold ${
									activeTab === 'delay'
										? 'border-b-4 border-purple-600 text-purple-700'
										: 'text-gray-500'
								}`}
							>
								<MdAccessTime className='inline mr-1' /> Delay
							</button>
							<button
								onClick={() => setActiveTab('maintenance')}
								className={`px-4 py-2 font-semibold ${
									activeTab === 'maintenance'
										? 'border-b-4 border-purple-600 text-purple-700'
										: 'text-gray-500'
								}`}
							>
								<MdBuild className='inline mr-1' /> Maintenance
							</button>
							<button
								onClick={() => setActiveTab('disclaimer')}
								className={`px-4 py-2 font-semibold ${
									activeTab === 'disclaimer'
										? 'border-b-4 border-purple-600 text-purple-700'
										: 'text-gray-500'
								}`}
							>
								<MdWarning className='inline mr-1' /> Disclaimer
							</button>
						</div>

						{activeTab === 'overview' && (
							<section className='bg-white p-4 sm:p-6 rounded-xl border border-blue-200 shadow hover:shadow-lg transition-shadow duration-300 mb-6'>
								<h2 className='text-lg sm:text-2xl font-bold text-blue-800 mb-4 sm:mb-6 border-b pb-2 border-blue-200'>
									Flight Lens Details for {flightNumber}
								</h2>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700'>
									<p className='font-medium'>
										<span className='font-semibold'>Model:</span>{' '}
										{aircraftInfo.model}
									</p>
									<p className='font-medium'>
										<span className='font-semibold'>Age:</span>{' '}
										{aircraftInfo.age}
									</p>
									<p className='font-medium'>
										<span className='font-semibold'>Registration:</span>{' '}
										{aircraftInfo.registration}
									</p>
									<p className='font-medium'>
										<span className='font-semibold'>ICAO24:</span>{' '}
										{aircraftInfo.icao24}
									</p>
									<p className='font-medium'>
										<span className='font-semibold'>Airline:</span>{' '}
										{aircraftInfo.airline}
									</p>
									<p className='font-medium'>
										<span className='font-semibold'>Current Status:</span>{' '}
										{aircraftInfo.status}
									</p>
								</div>

								<div className='mt-6 pt-4 border-t border-blue-100 text-gray-700'>
									<p className='font-medium'>
										<span className='font-semibold'>Origin Airport:</span>{' '}
										{aircraftInfo.origin}
									</p>
									<p className='font-medium'>
										<span className='font-semibold'>Destination Airport:</span>{' '}
										{aircraftInfo.destination}
									</p>
									<p className='font-medium'>
										<span className='font-semibold'>Scheduled Departure:</span>{' '}
										{aircraftInfo.scheduledDeparture}
									</p>
									<p className='font-medium'>
										<span className='font-semibold'>Scheduled Arrival:</span>{' '}
										{aircraftInfo.scheduledArrival}
									</p>
								</div>
							</section>
						)}

						{activeTab === 'delay' && (
							<section className='bg-white p-4 sm:p-6 rounded-xl border border-blue-200 shadow hover:shadow-lg transition-shadow duration-300 mb-6'>
								<h2 className='text-lg sm:text-2xl font-bold text-blue-800 mb-5 sm:mb-6 border-b pb-3 border-blue-200'>
									Delay Analysis for {flightNumber}
								</h2>
								<div className='space-y-3 text-gray-700'>
									<p className='font-medium'>
										<span className='font-semibold'>Average Delay:</span>{' '}
										{aircraftInfo.averageDelay}
									</p>
									<p className='font-medium'>
										<span className='font-semibold'>Delay Probability:</span>{' '}
										{aircraftInfo.delayProbability}%
									</p>
									<p className='font-medium'>
										<span className='font-semibold'>Common Delay Reasons:</span>{' '}
										{aircraftInfo.commonDelayReasons.join(', ')}
									</p>
									<p className='font-medium'>
										<span className='font-semibold'>
											Historical Performance:
										</span>{' '}
										{aircraftInfo.historicalPerformance}
									</p>
								</div>
							</section>
						)}

						{activeTab === 'maintenance' && (
							<section className='bg-white p-4 sm:p-6 rounded-xl border border-blue-200 shadow hover:shadow-lg transition-shadow duration-300 mb-6'>
								<h2 className='text-lg sm:text-2xl font-bold text-blue-800 mb-5 sm:mb-6 border-b pb-3 border-blue-200'>
									Maintenance History for {flightNumber}
								</h2>
								<p className='text-gray-700 font-medium'>
									{aircraftInfo.maintenanceHistorySummary}
								</p>
							</section>
						)}

						{activeTab === 'disclaimer' && (
							<p className='text-sm italic mt-6 pt-4 border-t border-red-200 bg-red-50 text-red-700 rounded-md p-4'>
								<span className='font-bold'>Crucial Disclaimer:</span> This data
								is *generated by a large language model (Gemini 2.5 Flash) for
								Flight Lens* and is not sourced from real-time flight tracking
								databases. It is illustrative and should **not** be used for
								actual flight planning or decision-making. Information may be
								inaccurate, incomplete, or entirely fictitious. When in doubt
								try again.
							</p>
						)}
					</>
				)}
			</div>
			<div className='text-center mt-6 text-sm text-gray-500'>
				Flight Lens by  
				<a
					href='https://www.linkedin.com/in/akm85/'
					target='_blank'
					rel='noopener noreferrer'
					className='text-purple-600 hover:text-purple-800 transition-colors duration-200'
				>
					Abhishek Maurya
				</a>
			</div>
			<Script
				id='adsbygoogle-script'
				async
				src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7214001284506571'
				crossorigin='anonymous'
				strategy='afterInteractive'
			></Script>
		</div>
	);
}
