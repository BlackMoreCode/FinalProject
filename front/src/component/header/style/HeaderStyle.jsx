import styled from "styled-components";
import { NavLink as RouterNavLink } from "react-router-dom";

export const Navbar = styled.nav`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid #dfd3c3;
  background-color: #fff;
  position: relative;
  z-index: 10;
  overflow-x: hidden;
  overflow-y: visible;

  @media (max-width: 768px) {
    background-color: #d1b6a3;
    border-bottom: 1px solid #6a4e23;
    height: 72px;
    position: fixed;
  }
`;

export const NavContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem; /* 기존 2rem에서 줄여서 여백 문제 해결 */
  display: flex;
  flex-direction: column;
  overflow-x: visible;

  @media (max-width: 768px) {
    padding: 0 0.5rem; /* 좁은 화면에서 패딩을 줄여서 너비 확보 */
  }
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: #6a4e23;
  overflow: hidden;
  position: relative;
`;

export const BottomSection = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    display: none; /* 모바일에서 숨기기 */
  }
`;

export const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 3rem;
  color: #9f8473;
  padding-left: 0;
  font-weight: bold;
  position: relative;
  width: 100%;

  @media (max-width: 768px) {
    display: none; /* 모바일에서 네비 메뉴 숨기기 */
  }
`;

export const NavLink = styled(RouterNavLink)`
  text-decoration: none;
  color: #9f8473;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  padding-bottom: 5px;

  &:hover {
    color: #d1b6a3;
  }

  &.active::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -15px; /* 네비 바 하단 보더와 겹치도록 조정 */
    width: 100%;
    height: 3px;
    background-color: #6a4e23;
    transition: left 0.3s ease, width 0.3s ease; /* 밑줄 이동 애니메이션 */
  }

  @media (max-width: 768px) {
    color: #6a4e23;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    padding-bottom: 5px;
    width: 100%;

    &:hover {
      color: #fff;
    }

    &.active::after,
    &.active::before {
      content: "";
      position: absolute;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: #6a4e23;
      opacity: 0; /* 초기 상태에서는 숨김 */
      transform: scaleX(0); /* 처음에는 크기가 0으로 설정 */
      transition: opacity 0.3s ease, transform 0.3s ease; /* 애니메이션을 부드럽게 */
      z-index: 1; /* 두 선이 겹치지 않도록 z-index 추가 */
    }

    &.active::after {
      bottom: -5px; /* 아래쪽 선 */
    }

    &.active::before {
      top: -5px; /* 위쪽 선 */
    }

    &.active::after,
    &.active::before {
      opacity: 1; /* 활성화되면 선이 나타남 */
      transform: scaleX(1); /* 애니메이션으로 확장 */
    }
  }
`;

export const LoginButton = styled.button`
  background: none;
  border: 1px solid #6a4e23;
  color: #6a4e23;
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background: #6a4e23;
    color: #f5f5dc;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const HamburgerIcon = styled.div`
  display: none;
  font-size: 30px;
  cursor: pointer;
  color: #6a4e23;
  position: absolute;
  right: 2rem; /* 기존과 동일하지만 공백 문제 방지 */
  top: 50%;
  transform: translateY(-50%);

  @media (max-width: 768px) {
    display: block;
  }
`;

export const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border: 1px solid #6a4e23;
  border-top: none;
  width: 45%;
  position: fixed;
  top: 72px;
  right: 0;
  z-index: 1000;
  padding: 2rem 0;
  padding-top: 0;
  gap: 2rem;
  transform: translateX(100%); /* 처음엔 화면 밖 */
  transition: transform 0.3s ease-in-out; /* 애니메이션 */

  ${({ isMenuOpen }) => isMenuOpen && `transform: translateX(0);`}
`;

export const MobileLoginButton = styled.button`
  background: none;
  border: 1px solid #6a4e23;
  color: #6a4e23;
  padding: 1rem 1rem;
  cursor: pointer;
  width: 100%;
  text-align: center;
  border-left: none;
  border-right: none;

  &:hover {
    background: #6a4e23;
    color: #f5f5dc;
  }
`;

export const MenuItem = styled.div`
  width: 100%;
  text-align: center;

  ${NavLink} {
    color: #6a4e23;
  }
`;
