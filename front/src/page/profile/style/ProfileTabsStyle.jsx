import styled from "styled-components";

export const ProfileTabsContainer = styled.section`
  border-top: 1px solid #ddd;
  padding-top: 0;
`;

export const TabMenu = styled.nav`
  margin-top: 0;
`;

export const TabList = styled.ul`
  display: flex;
  justify-content: center;
  list-style: none;
  gap: 1rem;
  padding: 0;
  margin-bottom: 2rem;
  margin-top: 0px;
`;

export const TabItem = styled.li`
  padding: 0.5rem 1rem;
  border-bottom: 2px solid transparent;
  position: relative;
  cursor: pointer;

  &.active::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    border-top: 2px solid #000;
  }
`;

export const TabContent = styled.div`
  align-items: center;
  justify-content: center;
`;

export const CalendarSection = styled.div`
  margin: 30px auto;
  text-align: center;
  width: 90%;
  height: 400px;
  background-color: lightgray;
  border: 1px solid black;
`;

export const UserPost = styled.article`
  border: 1px solid #eee;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
`;
