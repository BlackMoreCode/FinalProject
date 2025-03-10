import React, { useState, useCallback } from "react";
import { AppDispatch, RootState } from "../../../context/Store";
import { useDispatch, useSelector } from "react-redux";
import DuplicateVerifyInput from "./DuplicateVerifyInput";
import MatchInput from "./MatchInput";
import { Dialog, DialogTitle } from "@mui/material";
import {ButtonContainer, Container, SignupButton} from "../Style";
import { closeModal, openModal, setConfirmModal, setRejectModal } from "../../../context/redux/ModalReducer";
import VerifyPhone from "./VerifyPhone";
import TermsContainer from "./TermsContainer";
import AuthApi from "../../../api/AuthApi";
import { signupReqDto } from "../../../api/dto/AuthDto";

const SignupModal = () => {
  const signup = useSelector((state: RootState) => state.modal.signupModal);
  const dispatch = useDispatch<AppDispatch>();
  const [check, setCheck] = useState({
    email: "",
    nickname: "",
    password: "",
    phone: "",
    verifyPhone : false,
    serviceTerm : false,
    privacyTerm : false,
  });

  // 이메일, 비밀번호, 닉네임, 전화번호 상태 업데이트
  const setter = useCallback((value: string, type: string) => {
    setCheck((prev) => ({
      ...prev,
      [type]: value, // 동적으로 처리
    }));
  }, [setCheck]);

  // 이용약관 및 개인정보 약관 동의 상태 업데이트 (리코일)
  const verifySetter = useCallback((value: boolean, type: string) => {
    setCheck((prev) => ({
      ...prev,
      [type]: value, // 동적으로 처리
    }));
  }, [setCheck]);

  const isValid = Object.values(check).every((value) => value !== false && value !== "");

  // 회원가입 API 호출 (리덕스와 리코일 분리된 상태에서 관리)
  const onClickSignup = async () => {
    try {
      const signupReq: signupReqDto = {
        email: check.email,
        phone: check.phone,
        pwd: check.password,
        nickname: check.nickname,
      };

      const rsp = await AuthApi.signup(signupReq);
      if (rsp.data === "성공") {
        dispatch(setConfirmModal({
          message: "회원가입에 성공했습니다.\n바로 로그인 하시겠습니까?",
          onConfirm: () => dispatch(openModal("login")),
          onCancel: () => {},
        }));
        dispatch(closeModal("signup"));
      } else {
        dispatch(setRejectModal({
          message: `${rsp.data}의 이유로 회원가입에 실패했습니다.`,
          onCancel: () => {},
        }));
      }
    } catch (e) {
      console.error(e);
      dispatch(setRejectModal({
        message: "서버와의 통신 불가로 회원가입에 실패했습니다.",
        onCancel: () => {},
      }));
    }
  };

  return (
    <Dialog
      open={signup}
      onClose={() => dispatch(closeModal("signup"))}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",  // 기본적으로 화면 너비를 100%로 설정
          maxWidth: "600px",  // 최대 너비 600px로 제한
          margin: "0 auto",  // 화면 가운데 정렬
          padding: "10px",  // 내부 여백 설정
          // 반응형 디자인: 화면 크기별로 Dialog 크기 조정
          "@media (max-width: 768px)": {
            maxWidth: "100%",  // 모바일 환경에서 Dialog의 최대 너비를 100%로 설정
            padding: "10px",  // 모바일에서는 패딩을 줄여서 표시
          },
        },
      }}
    >
      <DialogTitle>회원가입</DialogTitle>
      <Container>
        <DuplicateVerifyInput setter={setter} label="이메일" id="email" type="email"/>
        <MatchInput setter={setter} />
        <DuplicateVerifyInput setter={setter} label="닉네임" id="nickname" />
        <DuplicateVerifyInput setter={setter} label="전화번호" id="phone" />
        <VerifyPhone setter={verifySetter} phone={check.phone} />
        <TermsContainer setter={verifySetter} privacyTerm={check.privacyTerm} serviceTerm={check.serviceTerm} />
        <ButtonContainer>
          <SignupButton disabled={!isValid} onClick={onClickSignup}>
            가입하기
          </SignupButton>
        </ButtonContainer>
      </Container>
    </Dialog>
  );
};

export default SignupModal;