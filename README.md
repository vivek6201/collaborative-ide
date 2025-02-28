<h1 align="center">CODERSHUB</h1>
<p align="center">A Collaborative IDE powered by JUDGE0</p>

## Tech Stack:
 - Next.js (Client-Side)
 - Next.js (Server-Side)
 - Judge0 (For Online Code Execution (Self Hosted))
 - WebSocket Backend (Node.js, WS)
 - TypeScript (For Type Safety)
 - Docker & Docker Compose (For Deployment on private server)
 - Tailwind and Shadcn (UI Design and Devlopment)

## Features
 - Users can Create/Join multiple rooms and develop apps
 - Real-Time Code editor every stroke on the editor will be streamed to all the user inside the room.
 - Integrated Chat feature to ease collaboration
 - File Manager, Just like VS-Code to work with multiple file and folder

## Local Setup:

## 1. With Docker: (Make sure docker and docker compose is installed on your local system)

 - Clone the repo.
 - copy all the content of env file from .env.example
 - run the command for frontend
    ```
    docker compose -f frontend/docker-compose.dev.yaml up --build
    ```
 - run the command for backend
    ```
    docker compose -f backend/docker-compose.dev.yml up --build
    ```

## 2. Without Docker:
 
 - Clone the repo
 -  copy all the content of env file from .env.example
 -  run the command install the dependencies
 -  ```
    cd backend pnpm install
    cd ../frontend && pnpm install
    ```
 - run the frontend and backend repectively
   ```
   cd pnpm dev
   cd ../backend && pnpm dev
   ```    
