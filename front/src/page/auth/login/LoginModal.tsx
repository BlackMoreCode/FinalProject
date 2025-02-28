import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../context/Store";
import {
  closeModal,
  openModal,
  setRejectModal,
} from "../../../context/redux/ModalReducer";
import Commons from "../../../util/Common";
import {
  ChangeWithSetter,
  KeyPress,
  SNSLoginType,
} from "../../../context/types";
import {
  Button,
  GoogleButton,
  InputField,
  KakaoButton,
  Line,
  LogoImg,
  ModalContent,
  NaverButton,
  SignupTextButton,
  Slash,
  SnsLoginText,
  SocialButtonsContainer,
  TextButton,
  TextButtonContainer,
} from "../Style";
import { setToken } from "../../../context/redux/TokenReducer";
import { loginReqDto, loginResDto } from "../../../api/dto/AuthDto";
import AuthApi from "../../../api/AuthApi";
import axios from "axios";
import { Dialog, DialogTitle } from "@mui/material";

const LoginModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loginModal = useSelector((state: RootState) => state.modal.loginModal);
  if (!loginModal) return null;

  const SNS_SIGN_IN_URL = (type: SNSLoginType) =>
    `${Commons.BASE_URL}/api/v1/auth/oauth2/${type}`;
  const onSnsSignInButtonClickHandler = (type: SNSLoginType) => {
    window.location.href = SNS_SIGN_IN_URL(type);
  };
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPw, setInputPw] = useState<string>("");

  const onClickLogin = async () => {
    try {
      const loginReq: loginReqDto = { email: inputEmail, pwd: inputPw };
      const res = await AuthApi.login(loginReq);
      console.log(res);

      const loginRes: loginResDto | null = res.data;
      if (loginRes !== null && loginRes.grantType === "Bearer") {
        dispatch(setToken(loginRes.token));
        dispatch(closeModal("login"));
      } else {
        console.log("잘못된 아이디 또는 비밀번호 입니다.");
        dispatch(
          setRejectModal({ message: "ID와 PW가 다릅니다.", onCancel: () => {} })
        );
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.log("로그인 에러 : ", err);

        if (err.response?.status === 405) {
          console.log("로그인 실패: 405 Unauthorized");
          dispatch(
            setRejectModal({
              message: "로그인에 실패 하였습니다.",
              onCancel: () => {},
            })
          );
        } else {
          console.log("서버와의 통신에 실패: ", err.message);
          dispatch(
            setRejectModal({
              message: "서버와의 통신에 실패 하였습니다.",
              onCancel: () => {},
            })
          );
        }
      } else {
        console.log("예상치 못한 에러 발생: ", err);
        dispatch(
          setRejectModal({
            message: "알 수 없는 오류가 발생하였습니다.",
            onCancel: () => {},
          })
        );
      }
    }
  };

  const handleKeyPress: KeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 엔터 키가 눌렸을 때
      onClickLogin(); // 로그인 버튼 클릭 함수 실행
    }
  };
  const handleInputChange: ChangeWithSetter<string> = (e, setter) => {
    setter(e.target.value);
  };

  return (
    <Dialog open={loginModal} onClose={() => dispatch(closeModal("login"))}>
      <DialogTitle>로그인</DialogTitle>
      <form onSubmit={(e) => e.preventDefault()}>
        <InputField
          type="text"
          placeholder="이메일"
          value={inputEmail}
          onChange={(e) => handleInputChange(e, setInputEmail)}
          onKeyDown={handleKeyPress}
        />
        <InputField
          type="password"
          placeholder="비밀번호"
          value={inputPw}
          onChange={(e) => handleInputChange(e, setInputPw)}
          onKeyDown={handleKeyPress}
        />
        <Button type="button" onClick={onClickLogin}>
          로그인
        </Button>

        {/* 아이디찾기 / 비밀번호 찾기 */}
        <TextButtonContainer>
          <div>
            <TextButton onClick={() => dispatch(openModal("findId"))}>
              이메일 찾기
            </TextButton>
            <Slash>/</Slash>
            <TextButton onClick={() => dispatch(openModal("findPw"))}>
              비밀번호 찾기
            </TextButton>
          </div>
          <SignupTextButton onClick={() => dispatch(openModal("signup"))}>
            회원가입
          </SignupTextButton>
        </TextButtonContainer>

        {/* 라인 및 SNS 로그인 섹션 */}
        <Line />
        <SnsLoginText>SNS 계정 간편 로그인</SnsLoginText>
        <SocialButtonsContainer>
          <NaverButton onClick={() => onSnsSignInButtonClickHandler("naver")}>
            <LogoImg
              src={
                "https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Flogo%2Fnaver_logo.png?alt=media"
              }
            />
            <p>네이버 로그인</p>
          </NaverButton>
          <KakaoButton onClick={() => onSnsSignInButtonClickHandler("kakao")}>
            <LogoImg
              src={
                "https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Flogo%2Fkakao_logo.png?alt=media"
              }
            />
            <p>카카오 로그인</p>
          </KakaoButton>
          <GoogleButton onClick={() => onSnsSignInButtonClickHandler("google")}>
            <LogoImg
              src={
                "https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Flogo%2Fgoogle_logo.png?alt=media"
              }
            />
            <p>구글 로그인</p>
          </GoogleButton>
        </SocialButtonsContainer>
      </form>
    </Dialog>
  );
};

export default LoginModal;
