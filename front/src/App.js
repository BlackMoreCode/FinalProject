import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./component/header/Header";
import MainContainer from "./component/MainContainer";
import ProfilePage from "./page/profile/ProfilePage";
import CocktailListPage from "./page/cocktail/CocktailListPage";
import CocktailDetailPage from "./page/cocktail/CocktailDetailPage";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <MainContainer>
          <Routes>
            {/* 기존 ProfilePage 라우트 */}
            <Route path="/" element={<ProfilePage />} />

            {/* 칵테일 리스트 페이지 */}
            <Route path="/cocktails" element={<CocktailListPage />} />

            {/* 칵테일 상세 페이지: :id 파라미터 사용 */}
            <Route path="/cocktails/:id" element={<CocktailDetailPage />} />
          </Routes>
        </MainContainer>
      </Router>
    </div>
  );
}

export default App;
