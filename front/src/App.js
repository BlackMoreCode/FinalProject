import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import ProfilePage from "./page/profile/ProfilePage";

function App() {
  return (
    <div>
      <Router>
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
          <Routes>
            <Route path="/" element={<ProfilePage />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
