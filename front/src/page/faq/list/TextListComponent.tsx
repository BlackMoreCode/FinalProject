import React, { useContext } from 'react';
import styled from "styled-components";
import { PostContext } from '../../../context/PostStore';
import {AppDispatch, RootState} from "../../../context/Store";
import {useDispatch, useSelector} from 'react-redux';
import {FaqResDto} from "../../../api/dto/FaqDto";
import {setRejectModal, setSubmitModal, setTitleNContentModal} from "../../../context/redux/ModalReducer";
import {ButtonContainer} from "../../auth/Style";
import {IconButton, Tooltip} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import FaqApi from "../../../api/FaqApi";


const TextListComponent = () => {
  const admin = useSelector((state : RootState) => state.user.admin);
  const dispatch = useDispatch<AppDispatch>();
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("PostListMain must be used within a Context Provider");
  }
  const { postList } = context;

  const onClickItem = (item : FaqResDto) => {
    dispatch(setTitleNContentModal({title: item.title, content: item.content, onCancel:null}))
  }

  const onSubmit = async (data: { title: string, content: string; id: string }) => {
    try {
      const rsp = await FaqApi.updateFaq(data.id, {title: data.title, content: data.content});
      console.log(rsp);
      dispatch(setRejectModal({message: `FAQ를 수정하는데 ${rsp ? "성공" : "실패"} 했습니다.`, onCancel:null}))
    } catch (error) {
      console.error(error)
      dispatch(setRejectModal({message: `FAQ를 수정 통신에 실패 했습니다.`, onCancel:null}))
  }
  }

  const onClickEdit = (item: FaqResDto) => {
    dispatch(setSubmitModal({message: "FAQ 수정", initial:{title: item.title, content: item.content, id: item.id}, onCancel: null, restriction: undefined, onSubmit: onSubmit}))
  }

  const onClickDelete = async (id : string) => {
    try{
      const rsp = await FaqApi.deleteFaq(id)
      console.log("rsp", rsp)
      dispatch(setRejectModal({message: `FAQ를 삭제하는데 ${rsp ? "성공" : "실패"} 했습니다.`, onCancel:null}))
    } catch (error) {
      console.error(error)
      dispatch(setRejectModal({message: `FAQ를 삭제 통신에 실패 했습니다.`, onCancel:null}))
    }
  }


  return (
    <Container>
      <TopBorder /> {/* 검은색 상단 가로선 */}
      {postList && postList.map((item, index) => (
        <BoardItem key={index}>
          <IndexCell>{index + 1}</IndexCell>
          <TitleContainer onClick={() => onClickItem(item)}>
            <TitleCell>{item.title}</TitleCell>
          </TitleContainer>
          {admin ? <ButtonContainer>
            <Tooltip title="수정하기">
              <IconButton onClick={() => onClickEdit(item)}>
                <EditIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip title="삭제하기">
              <IconButton onClick={() => onClickDelete(item.id)}>
                <EditIcon/>
              </IconButton>
            </Tooltip>
          </ButtonContainer> : <ButtonContainer/>}
        </BoardItem>
      ))}
    </Container>
  );
};


export default TextListComponent;

const Container = styled.div`
    padding: 20px;
    width: 100%;
`;

const TopBorder = styled.div`
    border-top: 2px solid black; /* 검은색 상단 가로선 */
`;

const BoardItem = styled.div`
    display: flex;
    align-items: center; /* 세로 정렬 */
    height: 80px; /* 높이를 고정하거나 적절하게 설정 */
    padding: 0 20px;
    border-bottom: 1px solid #e0e0e0;
    margin: 0;
    width: 100%; /* 전체 너비를 차지하도록 설정 */
`;

const IndexCell = styled.div`
    font-size: 22px;
    color: #333;
    width: 50px;
    margin: auto 0;
    text-align: left;
    display: flex;
    justify-content: center; /* 가로 중앙 정렬 */
    align-items: center; /* 세로 중앙 정렬 */
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1; /* 가능한 모든 공간을 차지하도록 설정 */
    align-items: flex-start;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    padding: 0 20px; /* 양옆에 패딩을 줘서 간격을 확실히 설정 */
    
`;

const TitleCell = styled.div`
    font-size: 20px;
    font-weight: bold;
    color: #333;
    text-align: left;
    margin-bottom: 5px;
    width: 100%; /* 제목 영역을 100% 차지하게 설정 */
`;

