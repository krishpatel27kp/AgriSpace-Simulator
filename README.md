# AgriSpace

AgriSpace is a web application for smart farming simulation and crop recommendations using NASA POWER climate data. It helps farmers make data-driven decisions for sustainable agriculture.

## Features
- Fetches real-time weather data from NASA POWER API
- Simulates crop growth and yield potential
- Provides risk analysis and recommendations
- Visualizes results with charts and dashboards
- User-friendly interface for farm input and analysis

## Technologies Used
- React (Frontend)
- Vite (Build tool)
- Tailwind CSS (Styling)
- Chart.js, Recharts (Visualization)
- Axios/Fetch (API calls)
- NASA POWER API (External data)

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js)

### Installation
1. **Clone the repository:**
   ```
   git clone https://github.com/krishpatel27kp/AgriSpace.git
   ```
2. **Navigate to the project folder:**
   ```
   cd AgriSpace
   ```
3. **Install dependencies:**
   ```
   npm install
   ```

### Running the App Locally
1. **Start the development server:**
   ```
   npm run dev
   ```
2. **Open your browser and go to:**
   ```
   http://localhost:5173
   ```
   (The port may vary; check your terminal output.)

### Exposing Your Local App (for Mentors)
If you want to share your running app with someone remotely (e.g., a mentor):

#### Using ngrok
1. Download ngrok from https://ngrok.com/download and unzip it.
2. Open PowerShell in the folder with `ngrok.exe`.
3. Run your local server (`npm run dev`).
4. Start ngrok:
   ```
   ./ngrok http 5173
   ```
5. Copy the public URL shown by ngrok and share it.

#### Using LocalTunnel
1. Install LocalTunnel:
   ```
   npm install -g localtunnel
   ```
2. Run your local server (`npm run dev`).
3. Start LocalTunnel:
   ```
   lt --port 5173
   ```
4. Copy the public URL and share it.

## Project Structure
```
AgriSpace/
├── src/
│   ├── components/         # React components (UI, dashboard, simulator, analysis)
│   ├── utils/              # Simulation, API, and analysis logic
│   ├── context/            # Theme and global state
│   ├── theme/              # Color and style config
│   └── App.jsx             # Main app entry
├── public/                 # Static assets
├── package.json            # Project metadata and dependencies
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
```

## Error Handling & Fallbacks
- Invalid user inputs are validated and show error messages.
- NASA POWER API failures display a warning and allow retry.
- Simulation errors show fallback messages in the UI.

## How to Use
1. Enter your farm location, crop type, and settings.
2. Click to fetch weather data and run simulations.
3. View results, recommendations, and risk analysis on the dashboard.

## Contact
For questions or feedback, contact the project owner via GitHub: [krishpatel27kp](https://github.com/krishpatel27kp)

---
Mentors: To run and review this app, follow the installation and running instructions above. For remote access, use ngrok or LocalTunnel as described. If you encounter any issues, please check the terminal output for errors or contact the owner.
