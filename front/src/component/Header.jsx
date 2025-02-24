import styled from "styled-components";

const Navbar = styled.nav`
  display: flex;
  flex-direction: column;
  background-color: #6a4e23;
  color: white;
  width: 100%;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  background-color: #f5f5dc;
  padding: 0 2rem;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5dc;
  color: #6a4e23;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: flex-start;
  border-top: #6a4e23 1px solid;
  width: 100%;
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 3rem;
  color: #6a4e23;
  padding-left: 0;
`;

const NavLink = styled.li`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const LoginButton = styled.button`
  background: none;
  border: 1px solid #6a4e23;
  color: #6a4e23;
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background: #6a4e23;
    color: #f5f5dc;
  }
`;

export default function Header() {
  return (
    <Navbar>
      <NavContainer>
        <TopSection>
          <h1>Logo</h1>
          <LoginButton>Login</LoginButton>
        </TopSection>
        <BottomSection>
          <NavLinks>
            <NavLink>Home</NavLink>
            <NavLink>About</NavLink>
            <NavLink>Contact</NavLink>
          </NavLinks>
        </BottomSection>
      </NavContainer>
    </Navbar>
  );
}
