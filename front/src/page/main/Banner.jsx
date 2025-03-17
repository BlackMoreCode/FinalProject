import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import styled from "styled-components";

const BannerContainer = styled.div`
  width: 100%;
  max-height: 400px;
  position: relative;

  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* 🔹 네비게이션 화살표 스타일 */
  .swiper-button-prev,
  .swiper-button-next {
    color: rgba(245, 245, 245, 0.9); /* ✅ 매우 밝은 회색 (#e4e4e4) */
    width: 60px; /* ✅ 크기 조정 */
    height: 60px;
    border-radius: 50%; /* ✅ 둥글게 */
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.3s ease;
  }

  /* 🔹 화살표 hover 시 */
  .swiper-button-prev:hover,
  .swiper-button-next:hover {
    color: rgba(0, 0, 0, 0.4);
  }

  /* 🔹 화살표 아이콘 커스텀 (굵고 둥글게) */
  .swiper-button-prev::after,
  .swiper-button-next::after {
    font-size: 40px; /* ✅ 화살표 크기 */
    font-weight: bold; /* ✅ 굵기 조정 */
  }
`;
const Banner = () => {
  return (
    <BannerContainer>
      <Swiper
        navigation
        autoplay={{ delay: 5000 }}
        modules={[Navigation, Autoplay]}
        loop
      >
        <SwiperSlide>
          <img src="/banner/banner1.png" alt="banner1" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/banner/banner2.png" alt="banner2" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/banner/banner3.png" alt="banner3" />
        </SwiperSlide>
      </Swiper>
    </BannerContainer>
  );
};

export default Banner;
