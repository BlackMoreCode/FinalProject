import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./component/header/Header";
import MainContainer from "./component/MainContainer";
import ProfilePage from "./page/profile/ProfilePage";
import { CheckoutPage } from "./component/payments/Checkout";
import { SuccessPage } from "./component/payments/Succeess";
import { FailPage } from "./component/payments/Fail";
import CocktailListPage from "./page/cocktail/CocktailListPage";
import CocktailDetailPage from "./page/cocktail/CocktailDetailPage";

function App() {
  return (
    // 라이트 모드: bg-white, 다크 모드: bg-[#2B1D0E], 전체 화면 높이
    <div className="bg-white dark:bg-[#2B1D0E] min-h-screen transition-colors">
      <Router>
        <Header />
        <MainContainer>
          <Routes>
            <Route path="/" element={<ProfilePage />} />

            {/* 결제 페이지 */}
            <Route path="/sandbox" element={<CheckoutPage />} />{" "}
            {/* /sandbox 경로에 CheckoutPage 연결 */}
            <Route path="/sandbox/success" element={<SuccessPage />} />{" "}
            {/* /sandbox/success 경로에 SuccessPage 연결 */}
            <Route path="/sandbox/fail" element={<FailPage />} />{" "}
            {/* /sandbox/fail 경로에 FailPage 연결 */}

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
