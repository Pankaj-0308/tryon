import React from "react";
import VirtualTryOn from "./components/VirtualTryOn";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <VirtualTryOn />
      <Footer />
    </div>
  );
};

export default App; 