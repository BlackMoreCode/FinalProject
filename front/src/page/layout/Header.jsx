import React, { useEffect, useState } from "react";
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
} from "./style/HeaderStyle";
import { HiMenu } from "react-icons/hi";
import { Outlet } from "react-router-dom";
import MainContainer from "../../component/MainContainer";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../context/redux/ModalReducer";
import ModalComponents from "./ModalComponents";



const menuList = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About" },
  { path: "/contact", name: "Contact" },
  { path: "/forum", name: "Forum" },
];

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const guest = useSelector((state) => state.token.guest);
  const dispatch = useDispatch();
  
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  
  return (
    <Navbar>
      <NavContainer>
        <TopSection>
          <h1>Logo</h1>
          <LoginButton onClick={() => dispatch(openModal("login"))}>Login</LoginButton>
          <HamburgerIcon onClick={toggleMenu}>
            <HiMenu />
          </HamburgerIcon>
        </TopSection>
        
        <BottomSection>
          <NavLinks>
            {menuList.map(({ path, name }) => (
              <NavLink key={path} to={path} end>
                {name}
              </NavLink>
            ))}
            <DropdownContainer>
              <NavLink to="#" className="noUnderline">
                Recipe
              </NavLink>
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
      <ModalComponents />
      <MainContainer>
        <Outlet />
      </MainContainer>
    </Navbar>
  );
}
