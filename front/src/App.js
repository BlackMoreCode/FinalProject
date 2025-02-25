import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./component/Header";
import ProfilePage from "./page/profile/ProfilePage";
import CocktailListPage from "./page/cocktail/CocktailListPage";
import CocktailDetailPage from "./page/cocktail/CocktailDetailPage";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
          <Routes>
            {/* 기존 ProfilePage 라우트 */}
            <Route path="/" element={<ProfilePage />} />

            {/* 칵테일 리스트 페이지 */}
            <Route path="/cocktails" element={<CocktailListPage />} />

            {/* 칵테일 상세 페이지: :id 파라미터 사용 */}
            <Route path="/cocktails/:id" element={<CocktailDetailPage />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
