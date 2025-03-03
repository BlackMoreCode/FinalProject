import {
  BottomSection,
  DropDownButton,
  DropdownContainer,
  LoginButton,
  Navbar,
  NavContainer,
  NavLink,
  NavLinks,
  TopSection
} from "./style/HeaderStyle";
import React, {useState} from "react";
import DropdownComponent from "../../component/DropdownComponent";
import {useLocation, useNavigate} from "react-router-dom";
import ProfileButton from "./ProfileButton";





const PCHeader = () => {
  const [open, setOpen] = useState<boolean>(false)
  const navigate = useNavigate();
  const location = useLocation();

  const menuList = [
    { path: "/", name: "Home"},
    { path: "/about", name: "About" },
    { path: "/contact", name: "Contact" },
  ];


  const recipeList = [
    { name: "cocktail", fn: () =>  navigate("/recipe/cocktail")},
    { name: "food", fn: () =>  navigate("/recipe/food")},
  ]

  return (
    <Navbar>
      <NavContainer>
        <TopSection>
          <h1>Logo</h1>
        </TopSection>
        <BottomSection>
          <NavLinks>
            {menuList.map(({ path, name }) => (
              <NavLink key={path} to={path} end>
                {name}
              </NavLink>
            ))}
            <DropdownContainer>
              <DropDownButton className={location.pathname.includes("recipe") ? "active" : "no-underline"} onClick={() => setOpen(!open)}>
                Recipe
              </DropDownButton>
              <DropdownComponent open={open} onClose={() => setOpen(false)} list={recipeList} />
            </DropdownContainer>
          </NavLinks>
        </BottomSection>
        <TopSection>
          <ProfileButton/>
        </TopSection>
      </NavContainer>
    </Navbar>
  );
}
export default PCHeader