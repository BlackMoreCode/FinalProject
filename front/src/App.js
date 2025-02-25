import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./component/header/Header";
import MainContainer from "./component/MainContainer";
import ProfilePage from "./page/profile/ProfilePage";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <MainContainer>
          <Routes>
            <Route path="/" element={<ProfilePage />} />
          </Routes>
        </MainContainer>
      </Router>
    </div>
  );
}

export default App;
