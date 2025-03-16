import React from "react";
import SignupModal from "../auth/signup/SignupModal"
import LoginModal from "../auth/login/LoginModal";
import ConfirmModal from "../../component/Modal/ConfirmModal";
import CursorModal from "../../component/Modal/CursorModal";
import LoadingModal from "../../component/Modal/LoadingModal";
import OptionsModal from "../../component/Modal/OptionsModal";
import RejectModal from "../../component/Modal/RejectModal";
import SubmitModal from "../../component/Modal/SubmitModal";
import TitleNContentModal from "../../component/Modal/TitleNContentModal";
import FindPwdModal from "../auth/findPw/FindPwdModal";
import FindIdModal from "../auth/findId/FindIdModal";
import CalendarModal from "../profile/calendar/CalendarModal";



const ModalComponents = () => {

  return (
    <>
      <SignupModal/>
      <LoginModal/>
      <FindIdModal/>
      <FindPwdModal/>
      <CalendarModal/>
      <ConfirmModal/>
      <CursorModal/>
      <LoadingModal/>
      <OptionsModal/>
      <RejectModal/>
      <SubmitModal/>
      <TitleNContentModal/>
    </>
  )
}
export default ModalComponents;