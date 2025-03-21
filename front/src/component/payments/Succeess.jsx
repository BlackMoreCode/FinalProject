import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9fafb; /* 토스 스타일에 맞춘 밝은 배경 */
`;

export const BoxSection = styled.div`
  background: #ffffff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 24px;
  color: #333d4b;
  margin-bottom: 16px;
`;

export const InfoText = styled.p`
  font-size: 16px;
  color: #4e5968;
  margin: 8px 0;
`;

export const PaymentKey = styled.p`
  font-size: 14px;
  color: #8b95a1;
  word-break: break-all;
`;

export const Button = styled.button`
  background-color: #3182f6;
  color: white;
  border: none;
  padding: 12px 16px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 24px;
  width: 100%;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #1b64da;
  }
`;

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
    // 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
    };

    async function confirm() {
      const response = await fetch("/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        // 결제 실패 비즈니스 로직을 구현하세요.
        navigate(`/fail?message=${json.message}&code=${json.code}`);
        return;
      }

      // 결제 성공 비즈니스 로직을 구현하세요.
    }
    confirm();
  }, []);

  const handleGoToMain = () => {
    navigate("/main");
  };

  return (
    <Wrapper>
      <BoxSection>
        <Title>결제 성공</Title>
        <InfoText>{`주문번호: ${searchParams.get("orderId")}`}</InfoText>
        <InfoText>{`결제 금액: ${Number(
          searchParams.get("amount")
        ).toLocaleString()}원`}</InfoText>
        {/* <PaymentKey>{`paymentKey: ${searchParams.get(
          "paymentKey"
        )}`}</PaymentKey> */}
        <Button onClick={handleGoToMain}>메인으로 가기</Button>
      </BoxSection>
    </Wrapper>
  );
}
