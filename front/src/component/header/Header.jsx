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
  DropdownContainer,
  DropdownMenu,
  DropdownItem,
} from "./style/HeaderStyle"; // 드롭다운 관련 컴포넌트 포함
import { HiMenu } from "react-icons/hi";

// 상단 메뉴 리스트 (예시)
const menuList = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About" },
  { path: "/contact", name: "Contact" },
  { path: "/forum", name: "Forum" },
];

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  // 모바일 메뉴 열고 닫는 함수
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
            {/* 기존 메뉴 목록 반복 출력 */}
            {menuList.map(({ path, name }) => (
              <NavLink key={path} to={path} end>
                {name}
              </NavLink>
            ))}

            {/* "Cocktails" 링크를 대체하는 "Recipe" 드롭다운 메뉴 */}
            <DropdownContainer>
              {/* 부모 메뉴 */}
              {/* NavLink에 .noUnderline 클래스를 추가 */}
              <NavLink to="#" className="noUnderline">
                Recipe
              </NavLink>
              {/* 마우스 오버 시 표시될 서브 메뉴 */}
              <DropdownMenu>
                <DropdownItem>
                  <NavLink to="/food-recipe">Food Recipe</NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink to="/cocktail-recipe">Cocktail Recipe</NavLink>
                </DropdownItem>
              </DropdownMenu>
            </DropdownContainer>
          </NavLinks>
        </BottomSection>

        {/* 모바일 메뉴 (햄버거 클릭 시 표시) */}
        <MobileMenu isMenuOpen={isMenuOpen}>
          <MenuItem>
            <MobileLoginButton>Login</MobileLoginButton>
          </MenuItem>
          {/* 기존 메뉴 목록 반복 출력 */}
          {menuList.map(({ path, name }) => (
            <MenuItem key={path}>
              <NavLink to={path} end>
                {name}
              </NavLink>
            </MenuItem>
          ))}
          {/* 모바일 메뉴에서 "Recipe"와 서브 메뉴 항목 표시 */}
          <MenuItem>
            <NavLink to="#">Recipe</NavLink>
            <MenuItem>
              <NavLink to="/food-recipe">Food Recipe</NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/cocktail-recipe">Cocktail Recipe</NavLink>
            </MenuItem>
          </MenuItem>
        </MobileMenu>
      </NavContainer>
    </Navbar>
  );
}
