import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {RootState, AppDispatch} from "../../context/Store";
import {closeCursorModal} from "../../context/redux/ModalReducer";
import React from 'react';  // React를 명시적으로 import

// 나머지 코드...



const CursorModal = () => {
	const cursor = useSelector((state : RootState) => state.modal.cursorModal)
	const dispatcher = useDispatch<AppDispatch>()

	if (!cursor.open || !cursor.position) return null;
	const onCancel = () => {
		cursor.onCancel?.()
		dispatcher(closeCursorModal())
	}
	const onOption = (value:any) => {
		cursor.onOption?.(value, cursor.id);
		dispatcher(closeCursorModal())
	}
	return (
		<ModalOverlay onClick={onCancel}>
			<ModalContainer
				style={{
					top: `${cursor.position.y}px`,
					left: `${cursor.position.x + 10}px`,
					transform: "translateY(100%)"
				}}
			>
				<ModalContent>
					{cursor.message && <MessageText>{cursor.message}</MessageText>}
					{cursor.options.map((option, index) => (
						<ModalButton key={index} onClick={() => onOption(option.value)}>
							{option.label}
						</ModalButton>
					))}
				</ModalContent>
			</ModalContainer>
		</ModalOverlay>
	);
};

export default CursorModal;

// ✅ 스타일 정의
const ModalContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 200px;
	height: 150px;
  position: relative;
  margin: 10px 0;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const ModalButton = styled.button`
    width: 200px;
    font-size: 0.8rem;
    font-weight: bold;
    cursor: pointer;
    color: black;
    background-color: white;
    border: none;
    border-radius: 8px;
    text-align: center;
    
`;

const MessageText = styled.div`
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 12px;
`;
const ModalOverlay = styled.div`
	display: flex;
	position: fixed;
	width: 100vw;
	height: 100vh;
    z-index: 999;
	left: 0;
	top: 0;
`
