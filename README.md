# Doodle Chat (Frontend)

A simple, responsive chat interface built with React and TypeScript. It connects to the [Frontend Challenge Chat API](https://github.com/DoodleScheduling/frontend-challenge-chat-api) to send and display messages from all participants.

## Features

- **Message list**: Displays all messages in chronological order with distinct styling for your messages (right, yellow) and others (left, gray).
- **Send messages**: Enter your name and message, then send. Your name is remembered in `localStorage`.
- **Load older messages**: Pagination via “Load older messages” at the top.
- **Responsive**: Works on desktop and mobile.
- **Accessibility**: Semantic HTML, ARIA labels, keyboard support, and visible focus states.

## Prerequisites

- Node.js 18+
- The [Chat API](https://github.com/DoodleScheduling/frontend-challenge-chat-api) running locally (e.g. on port 3000)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Chat API backend (in its repo) so it is available at `http://localhost:3000`.

3. Start the frontend dev server (proxies `/api` to the backend):

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

- `npm run dev` – Start Vite dev server (port 5173, proxies `/api` to localhost:3000).
- `npm run build` – Production build.
- `npm run preview` – Preview production build locally.

## Tech stack

- React 18
- TypeScript
- Vite

## Configuration

The app uses the Vite proxy in `vite.config.ts`: requests to `/api` are forwarded to `http://localhost:3000`. For production, point the build to your API origin (e.g. via env or a different proxy).

Authentication uses the shared Bearer token required by the challenge API (`super-secret-doodle-token`).
