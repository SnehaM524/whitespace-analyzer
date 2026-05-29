# WHITESPACE

A competitive messaging analyzer. You paste in a category and a few competitors. The tool reads their live positioning, maps where everyone is crowded, and surfaces the open angle nobody owns. It then suggests one concrete move to claim that space.

Built with React and Vite. It uses the Anthropic API with live web search. The API key stays on the server, so it is never exposed in the browser or committed to the repo.

## What it does

1. You enter a category, your company, and two to four competitors.
2. It researches each competitor's current positioning using web search.
3. It extracts their messaging pillars and core narrative.
4. It plots everyone on a positioning map and highlights the empty territory.
5. It gives you a positioning line to own and one move to ship this week.

## Run it locally

You need Node version 18 or higher.

1. Install dependencies.

   ```
   npm install
   ```

2. Add your key. Copy the example file to a real one.

   ```
   cp .env.example .env
   ```

   Then open `.env` and paste your Anthropic API key. You can get a key from the Anthropic Console.

3. Start the dev server.

   ```
   npm run dev
   ```

4. Open the local URL it prints. Usually it is http://localhost:5173.

## Deploy to Vercel

1. Push this project to a new GitHub repository.
2. Go to Vercel and import that repository.
3. In the Vercel project settings, open Environment Variables.
4. Add a variable named `ANTHROPIC_API_KEY` and paste your key as the value.
5. Deploy.

Vercel detects the `api` folder and runs `api/analyze.js` as a serverless function. The frontend calls that function, and the function talks to Anthropic using your key.

## Important

Never commit your `.env` file. The `.gitignore` already excludes it. Your key should only ever live in the local `.env` file and in the Vercel environment variables.
