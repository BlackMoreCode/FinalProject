import React from "react";
import styled from "styled-components";

interface Dropdown {
  open: boolean;
  onClose: () => void;
  list: { name: string; fn: () => void }[];
}

const DropdownComponent = ({ open, onClose, list }: Dropdown) => {
  if (!open) return null;

  return (
    <>
      {/* 배경을 클릭하면 드롭다운이 닫히게 함 */}
      <DropdownBackground onClick={onClose} />
      <DropdownWrapper>
        {list.map((item, index) => (
          <DropdownItem
            key={index}
            onClick={() => {
              item.fn();
              onClose();
            }}
          >
            {item.name}
          </DropdownItem>
        ))}
      </DropdownWrapper>
    </>
  );
};

export default DropdownComponent;

// 배경 클릭 시 닫히도록 처리하는 컴포넌트
const DropdownBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10; /* 드롭다운이 위에 오도록 */
    pointer-events: auto;
`;

// 드롭다운 아이템을 감싸는 컴포넌트
const DropdownWrapper = styled.div`
  position: absolute;
  top: 100%; /* 부모 요소 아래 */
  left: -50px;
  width: 150px;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 20;
  border-radius: 5px;
  overflow: hidden;
`;

// 드롭다운 아이템
const DropdownItem = styled.div`
    padding: 10px;
    cursor: pointer;
    transition: background 0.2s ease-in-out;

    &:hover {
        background: #f0f0f0;
    }
`;
