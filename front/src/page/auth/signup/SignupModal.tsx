import React, { useState, useEffect } from "react";
import AuthApi from "../../../../../../Uniguide/BackendCapstone/src/main/react/src/api/AuthApi";
import {useRecoilState} from "recoil";
import {emailState, isChecked, nicknameState, phoneState} from "../../../context/recoil/AuthState";
import {AppDispatch, RootState} from "../../../context/Store";
import { useDispatch, useSelector } from "react-redux";
import DuplicateVerifyInput from "./DuplicateVerifyInput";
import MatchInput from "./MatchInput";
import {Dialog} from "@mui/material";
import {ButtonContainer,  SignupButton } from "../Style";
import {closeModal, openModal, setConfirmModal, setRejectModal} from "../../../context/redux/ModalReducer";
import VerifyPhone from "./VerifyPhone";
import TermsContainer from "./TermsContainer";


const SignupModal = () => {
  const signup = useSelector((state: RootState) => state.modal.signupModal);
  if (!signup) return null;
  const dispatch = useDispatch<AppDispatch>();
  const [check, setCheck] = useRecoilState(isChecked);

  const setter = (value: string, type: string) => {
    switch (type) {
      case "이메일":
        setCheck((prev) => ({...prev, email: value}))
        break;
      case "비밀번호":
        setCheck((prev) => ({...prev, password: value}))
        break;
      case "닉네임":
        setCheck((prev) => ({...prev, nickname: value}))
        break;
      case "전화번호":
        setCheck((prev) => ({...prev, phone: value}))
        break;
      default:
        break;
    }
  }

  const verifySetter = (value: boolean, type: string) => {
    switch (type) {
      case "이용":
        setCheck((prev) => ({...prev, serviceTerm: value}))
        break;
      case "개인정보":
        setCheck((prev) => ({...prev, privacyTerm: value}))
        break;
      case "전화번호":
        setCheck((prev) => ({...prev, verifyPhone: value}))
        break;
      default:
        break;
    }

    const isValid = Object.values(check).every((value) => value !== false && value !== "");

    const onClickSignup = async () => {
      try {
        const rsp = await AuthApi.signup(check);
        if (rsp.data === "성공") {
          dispatch(setConfirmModal({
            message: "회원가입에 성공했습니다.\n바로 로그인 하시겠습니까?",
            onConfirm: () => dispatch(openModal("login")),
            onCancel: () => {
            }
          }))
          dispatch(closeModal("signup"))
        } else {
          dispatch(setRejectModal({
            message: `${rsp.data}의 이유로 회원가입에 실패했습니다.`, onCancel: () => {
            }
          }))
        }
      } catch (e) {
        console.error(e)
        dispatch(setRejectModal({
          message: "서버와의 통신 불가의 이유로 회원가입에 실패했습니다.", onCancel: () => {
          }
        }))
      }
    };

    return (
      <Dialog open={signup}>
        <h3>회원가입</h3>
        <DuplicateVerifyInput state={emailState} setter={setter} label="이메일"/>
        <MatchInput setter={setter}/>
        <DuplicateVerifyInput state={nicknameState} setter={setter} label='닉네임'/>
        {/* 전화번호 입력 및 인증 */}
        <DuplicateVerifyInput state={phoneState} setter={setter} label="전화번호"/>
        <VerifyPhone setter={verifySetter} phone={check.phone}/>
        {/* 약관 동의 UI */}
        <TermsContainer setter={verifySetter} privacyTerm={check.privacyTerm} serviceTerm={check.serviceTerm}/>
        {/* 가입 버튼 */}
        <ButtonContainer>
          <SignupButton disabled={!isValid} onClick={onClickSignup}>
            가입하기
          </SignupButton>
        </ButtonContainer>
      </Dialog>
    );
  };
}

export default SignupModal;