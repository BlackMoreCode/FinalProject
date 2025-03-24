import { useContext } from "react";
import { Button } from "@mui/material";
import styled from "styled-components";
import { AdminContext } from "../../../context/AdminStore";
import React from "react";

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    margin-top: 20px;
    padding: 10px;
`;

const TypeButtonContainer = styled(ButtonContainer)`
    margin-bottom: 20px;
`;

const ChartSelector = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("AdminContext가 제공되지 않았습니다.");
  }

  const { type, setType, order, setOrder } = context;

  // 예시 타입과 주문 리스트
  const typeList: { id: "cocktail" | "food"; name: string }[] = [
    { id: "cocktail", name: "칵테일" },
    { id: "food", name: "음식" },
  ];

  const orderList: { id: "view" | "like"; name: string }[] = [
    { id: "view", name: "조회수" },
    { id: "like", name: "좋아요" },
  ];

  return (
    <>
      {/* Type 선택 버튼 */}
      <TypeButtonContainer>
        {typeList.map((category) => (
          <Button
            key={category.id}
            onClick={() => setType(category.id)} // 바로 setType 호출
            sx={{
              backgroundColor: type === category.id ? "#6054d4" : "#e0cefe",
              color: type === category.id ? "#fff" : "#4a3f9d",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "10px 20px",
              textTransform: "none", // 기본 대문자 변환 방지
              zIndex: "1",
              "&:hover": {
                backgroundColor: type === category.id ? "#5241a2" : "#c6b8f7",
              },
            }}
          >
            {category.name}
          </Button>
        ))}
      </TypeButtonContainer>

      {/* Order 선택 버튼 */}
      <ButtonContainer>
        {orderList.map((category) => (
          <Button
            key={category.id}
            onClick={() => setOrder(category.id)} // 바로 setOrder 호출
            sx={{
              backgroundColor: order === category.id ? "#6054d4" : "#e0cefe",
              color: order === category.id ? "#fff" : "#4a3f9d",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "10px 20px",
              textTransform: "none", // 기본 대문자 변환 방지
              zIndex: "1",
              "&:hover": {
                backgroundColor: order === category.id ? "#5241a2" : "#c6b8f7",
              },
            }}
          >
            {category.name}
          </Button>
        ))}
      </ButtonContainer>
    </>
  );
};

export default ChartSelector;
