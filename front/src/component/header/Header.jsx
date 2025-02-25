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

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <Navbar>
      <NavContainer>
        <TopSection>
          <h1>Logo</h1>
          <LoginButton>Login</LoginButton>
          <HamburgerIcon onClick={toggleMenu}>
            <HiMenu />
          </HamburgerIcon>
        </TopSection>
        <BottomSection>
          <NavLinks>
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </NavLinks>
        </BottomSection>

        <MobileMenu isMenuOpen={isMenuOpen}>
          <MenuItem>
            <MobileLoginButton>Login</MobileLoginButton>
          </MenuItem>
          <MenuItem>
            <NavLink to="/" end>
              Home
            </NavLink>
          </MenuItem>
          <MenuItem>
            <NavLink to="/about">About</NavLink>
          </MenuItem>
          <MenuItem>
            <NavLink to="/contact">Contact</NavLink>
          </MenuItem>
        </MobileMenu>
      </NavContainer>
    </Navbar>
  );
}
