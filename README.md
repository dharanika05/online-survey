# QuickPulse Online Survey (MongoDB)

A full-stack online survey application. It randomly selects exactly 5 questions from a question bank and stores each submitted response in MongoDB.

## Tech stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose

## Requirements
- Node.js installed
- MongoDB Atlas account (or a local MongoDB server)

## Setup (Windows / VS Code)
1. Extract the ZIP file.
2. Open the extracted `Online_Survey_MongoDB` folder in VS Code.
3. Open the terminal in that folder.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Copy `.env.example` and create a new file named `.env`.
6. Open `.env` and replace the sample `MONGODB_URI` with your actual MongoDB connection string. Do not share your database password.
7. Start the app:
   ```bash
   npm start
   ```
8. Open `http://localhost:5000` in your browser.

## Check MongoDB connection
Open `http://localhost:5000/api/health`. The response should show:
```json
{"ok":true,"database":"connected"}
```

## Database
Database name: `quickpulse`
Collection name: `surveyresponses`

Each document stores 5 question-and-answer pairs and automatic `createdAt` / `updatedAt` timestamps.

## API endpoints
- `GET /api/health` — check server and database connection.
- `POST /api/responses` — save one survey response (exactly 5 answers).
- `GET /api/responses/count` — get the number of submitted responses.

## Add or edit questions
Edit the `questionBank` array in `public/script.js`. Keep the question format:
```js
{ q: "Your question?", a: ["Option 1", "Option 2", "Option 3", "Option 4"] }
```

## Important
This project requires a valid MongoDB connection in `.env`. The `.env` file is intentionally not included in the ZIP because it contains your private database credentials.
