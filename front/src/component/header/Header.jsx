import React, { useState } from "react";
import {
  Navbar,
  NavContainer,
  TopSection,
  BottomSection,
  NavLinks,
  NavLink,
  LoginButton,
  HamburgerIcon,
  MobileMenu,
  MobileLoginButton,
  MenuItem,
} from "./style/HeaderStyle";
import { HiMenu } from "react-icons/hi";

const menuList = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About" },
  { path: "/contact", name: "Contact" },
];

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <Navbar>
      <NavContainer>
        {/* 상단 섹션: 로고, 로그인 버튼, 햄버거 아이콘 */}
        <TopSection>
          <h1>Logo</h1>
          <LoginButton>Login</LoginButton>
          <HamburgerIcon onClick={toggleMenu}>
            <HiMenu />
          </HamburgerIcon>
        </TopSection>

        {/* 하단 섹션: PC 뷰용 메뉴 */}
        <BottomSection>
          <NavLinks>
            {menuList.map(({ path, name }) => (
              <NavLink key={path} to={path} end>
                {name}
              </NavLink>
            ))}
            {/* 여기서 Cocktails 메뉴 추가 */}
            <NavLink to="/cocktails">Cocktails</NavLink>
          </NavLinks>
        </BottomSection>

        {/* 모바일 메뉴 */}
        <MobileMenu isMenuOpen={isMenuOpen}>
          <MenuItem>
            <MobileLoginButton>Login</MobileLoginButton>
          </MenuItem>
          {menuList.map(({ path, name }) => (
            <MenuItem key={path}>
              <NavLink to={path} end>
                {name}
              </NavLink>
            </MenuItem>
          ))}
          {/* 모바일 메뉴에도 Cocktails 추가 */}
          <MenuItem>
            <NavLink to="/cocktails">Cocktails</NavLink>
          </MenuItem>
        </MobileMenu>
      </NavContainer>
    </Navbar>
  );
}
