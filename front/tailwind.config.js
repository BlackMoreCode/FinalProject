/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // 다크 모드는 클래스 방식으로 전환 (예: <html class="dark">)
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 라이트 모드 색상
        beige: "#F5F5DC", // 배경 등 따뜻한 베이지
        kakiBrown: "#6A4E23", // 텍스트 및 테두리용 카키 브라운
        warmOrange: "#EC4908", // 버튼 등 포인트 주황

        // 다크 모드 색상
        darkBrown: "#2B1D0E", // 다크 모드 배경 (짙은 브라운)
        softBeige: "#D7C4A3", // 다크 모드 텍스트 (소프트 베이지)
        deepOrange: "#D84315", // 다크 모드 포인트 컬러 (딥 오렌지)
        darkKaki: "#4E3B22", // 다크 모드 보조 컬러 (어두운 카키 브라운)
      },
    },
  },
  plugins: [],
};
