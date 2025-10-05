import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FarmSimulator from "./components/NewFarmSimulator";
import { ThemeProvider } from "./context/ThemeContext";

// Main app content
function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <FarmSimulator />
        </div>
      </main>
      <Footer />
    </div>
  );
}

// App root component
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
