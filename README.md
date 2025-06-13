This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Gemini API

To use Gemini API, you need to create a Gemini API key. You can do this by following the instructions [here](https://cloud.google.com/gemini/docs/setup).

Once you have your Gemini API key, you can add it to your `.env.local` file.

```
GEMINI_API_KEY=your-gemini-api-key
```

## Why use Gemini API in place of actual airline data api

We use Gemini API because it is a more powerful model than the actual airline data api. It can generate more accurate results. at very less cost, almost free via generous free tier provided by Google Gemini API.

Get API key at https://aistudio.google.com/apikey
