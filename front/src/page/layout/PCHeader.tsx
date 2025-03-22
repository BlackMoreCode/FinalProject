import {
  BottomSection,
  DropDownButton,
  DropdownContainer,
  LoginButton,
  Navbar,
  NavContainer,
  NavLink,
  NavLinks,
  TopSection,
} from "./style/HeaderStyle";
import React, { useState } from "react";
import DropdownComponent from "../../component/DropdownComponent";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";

const PCHeader = () => {
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuList = [
    { path: "/main", name: "Main" },
    { path: "/forum", name: "Forum" },
  ];

  const recipeList = [
    { name: "cocktail", fn: () => navigate("/recipe/cocktail") },
    { name: "food", fn: () => navigate("/recipe/food") },
    { name: "Add a recipe", fn: () => navigate("/recipe/typeselect") },
  ];

  // 로고 클릭 시 /main으로 이동
  const handleLogoClick = () => {
    navigate("/main");
  };

  return (
    <Navbar>
      <NavContainer>
        <TopSection>
          <img
            src="/Logo317_2.png"
            alt="Logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
        </TopSection>
        <BottomSection>
          <NavLinks>
            {menuList.map(({ path, name }) => (
              <NavLink key={path} to={path} end>
                {name}
              </NavLink>
            ))}
            <DropdownContainer>
              <DropDownButton
                className={
                  location.pathname.includes("recipe")
                    ? "active"
                    : "no-underline"
                }
                onClick={() => setOpen(!open)}
              >
                Recipe
              </DropDownButton>
              <DropdownComponent
                open={open}
                onClose={() => setOpen(false)}
                list={recipeList}
              />
            </DropdownContainer>
          </NavLinks>
        </BottomSection>
        <TopSection>
          <ProfileButton />
        </TopSection>
      </NavContainer>
    </Navbar>
  );
};
export default PCHeader;
