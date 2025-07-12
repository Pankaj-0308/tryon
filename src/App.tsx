import React from "react";
import VirtualTryOn from "./components/VirtualTryOn";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <VirtualTryOn />
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App; 
