FairShare
🤖 AI Trip Planner
This is a web application designed to help users kickstart their travel planning. By simply providing a destination and travel dates, users can get instant, AI-powered inspiration for their trip, including top places to visit and must-try local foods. This project now uses the OpenAI API to generate creative and helpful travel suggestions.

✨ Key Features
AI-Powered Inspiration: Enter a destination and dates to receive AI-generated suggestions.

Structured Suggestions: Get a curated list of "Top Places to Visit" and "Must-Try Foods".

Seamless Planning: Directly transition from the inspiration page to a detailed trip planner.

Modern & Responsive UI: A clean and easy-to-use interface built with modern web technologies.

🛠️ Tech Stack
Frontend: React, TypeScript

Build Tool: Vite

Styling: Tailwind CSS

Icons: Lucide React

Routing: React Router

AI Integration: OpenAI API

🚀 Getting Started
Follow these instructions to get a local copy up and running.

Prerequisites
Node.js (v18 or later)

npm or yarn

An active OpenAI API key

Installation & Setup
Clone the repository:

Bash

git clone <your-repository-url>
cd <your-repository-name>
Install dependencies:

Bash

npm install
or if you use yarn:

Bash

yarn install
Set up environment variables:
This project requires an API key to connect to the OpenAI service.

Create a new file named .env in the root of your project. You can do this by copying the example file if one exists:

Bash

cp .env.example .env
Open the .env file and add your OpenAI API key:

VITE_OPENAI_API_KEY="your_secret_api_key_here"
Run the development server:

Bash

npm run dev
The application should now be running on http://localhost:5173 (or another port if 5173 is busy).