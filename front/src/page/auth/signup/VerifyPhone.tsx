import React, { useState, useEffect } from "react";
import { InputContainer, Input, PhoneVerifyButton } from "../Style";
import { useDispatch } from "react-redux";
import { setRejectModal } from "../../../context/redux/ModalReducer";
import { AppDispatch } from "../../../context/Store";
import AuthApi from "../../../api/AuthApi";
import Commons from "../../../util/Common";
import { SmsTokenVerificationDto } from "../../../api/dto/AuthDto";

const VerifyPhone = ({ phone, setter }: { phone: string, setter: (value: boolean, type: string) => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [verify, setVerify] = useState({
    verify: "",
    timer: 300,
    active: false,
  });
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  useEffect(() => {
    if (phone) {
      setVerify((prev) => ({ ...prev, timer: 300, active: false }));
    }
  }, [phone]);

  useEffect(() => {
    if (verify.active && verify.timer > 0) {
      const timer = setInterval(() => {
        setVerify((prev) => ({ ...prev, timer: prev.timer - 1 }));
      }, 1000);
      return () => clearInterval(timer);
    } else if (verify.timer <= 0) {
      setVerify((prev) => ({ ...prev, active: false }));
      dispatch(
        setRejectModal({
          message: "인증 시간이 만료되었습니다. 다시 요청해주세요.",
          onCancel: () => {},
        })
      );
    }
  }, [verify.active, verify.timer]);

  const onClickPhoneVerify = async () => {
    if (isRequestInProgress) return;
    setIsRequestInProgress(true);

    if (!phone) {
      setIsRequestInProgress(false);
      return;
    }

    try {
      const rsp = await AuthApi.sendVerificationCode(phone);
      console.log("서버 응답:", rsp);

      if (rsp.data === "true") {
        setVerify((prev) => ({ ...prev, active: true, timer: 300 }));
        dispatch(
          setRejectModal({
            message: "인증번호가 발송되었습니다.",
            onCancel: () => {},
          })
        );
      } else if (rsp.data === "EXCEED_LIMIT") {
        setVerify((prev) => ({ ...prev, active: false, timer: 0 })); // 타이머를 0으로 설정하여 숫자가 안 뜨게 함
        dispatch(
          setRejectModal({
            message: "인증번호 발송 횟수를 초과했습니다. 5시간 후 다시 시도해주세요.",
            onCancel: () => {},
          })
        );
      } else {
        setVerify((prev) => ({ ...prev, active: false, timer: 0 })); // 타이머를 0으로 설정하여 숫자가 안 뜨게 함
        dispatch(
          setRejectModal({
            message: "인증 과정중 오류로 인증을 실패했습니다.",
            onCancel: () => {},
          })
        );
      }
    } catch (error) {
      console.error("인증번호 발송 요청 중 에러 발생:", error);
      setVerify((prev) => ({ ...prev, active: false, timer: 0 })); // 타이머를 0으로 설정하여 숫자가 안 뜨게 함
      dispatch(
        setRejectModal({
          message: "서버와의 통신 문제로 인증을 실패했습니다.",
          onCancel: () => {},
        })
      );
    } finally {
      setIsRequestInProgress(false);
    }
  };

  const onVerify = async () => {
    try {
      const verifyToken: SmsTokenVerificationDto = {
        inputToken: verify.verify,
        phone: phone,
      };
      const rsp = await AuthApi.verifySmsToken(verifyToken);
      if (rsp.data) {
        dispatch(
          setRejectModal({ message: "인증번호가 유효합니다.", onCancel: () => {} })
        );
        setter(true, "verifyPhone");
      } else {
        setVerify((prev) => ({ ...prev, verified: false }));
        dispatch(
          setRejectModal({
            message: "인증번호가 유효하지 않거나 만료되었습니다.",
            onCancel: () => {},
          })
        );
        setter(false, "전화번호");
      }
    } catch (error) {
      setVerify((prev) => ({ ...prev, verified: false }));
      dispatch(
        setRejectModal({
          message: "인증번호 확인 중 오류가 발생했습니다.",
          onCancel: () => {},
        })
      );
      setter(false, "전화번호");
    }
  };

  return (
    <InputContainer>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <PhoneVerifyButton
          onClick={onClickPhoneVerify}
          disabled={isRequestInProgress || !phone}
          style={{ width: "90px" }}
        >
          인증요청
        </PhoneVerifyButton>
      </div>

      {verify.active && (
        <>
          <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
            <Input
              type="text"
              placeholder="인증번호 입력"
              value={verify.verify}
              onChange={(e) =>
                setVerify((prev) => ({ ...prev, verify: e.target.value }))
              }
              style={{ flex: "1", marginRight: "10px" }}
            />
            <PhoneVerifyButton onClick={onVerify} disabled={verify.timer <= 0}>
              인증하기
            </PhoneVerifyButton>
          </div>
          {verify.timer > 0 && (
            <p style={{ marginTop: "5px", color: verify.timer < 60 ? "red" : "black" }}>
              남은 시간: {Commons.formatTime(verify.timer)}
            </p>
          )}
        </>
      )}
    </InputContainer>
  );
};

export default VerifyPhone;
