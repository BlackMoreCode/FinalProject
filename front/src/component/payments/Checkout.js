"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutPage = CheckoutPage;
const react_1 = require("react");
const tosspayments_sdk_1 = require("@tosspayments/tosspayments-sdk");
require("./style.css");
const generateRandomString = () => window.btoa(Math.random()).slice(0, 20);
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
function CheckoutPage() {
    const [ready, setReady] = (0, react_1.useState)(false);
    const [widgets, setWidgets] = (0, react_1.useState)(null);
    // ✅ 한 번에 관리할 결제 정보
    const [paymentDetails, setPaymentDetails] = (0, react_1.useState)({
        amount: { currency: "KRW", value: 5000 },
        orderId: generateRandomString(),
        orderName: "토스 티셔츠 외 2건",
        customerName: "김토스",
        customerEmail: "customer123@gmail.com",
    });
    (0, react_1.useEffect)(() => {
        function fetchPaymentWidgets() {
            return __awaiter(this, void 0, void 0, function* () {
                const tossPayments = yield (0, tosspayments_sdk_1.loadTossPayments)(clientKey);
                const widgets = tossPayments.widgets({ customerKey: tosspayments_sdk_1.ANONYMOUS });
                setWidgets(widgets);
            });
        }
        fetchPaymentWidgets();
    }, [clientKey]);
    (0, react_1.useEffect)(() => {
        function renderPaymentWidgets() {
            return __awaiter(this, void 0, void 0, function* () {
                if (widgets == null) {
                    return;
                }
                /**
                 * 위젯의 결제금액을 결제하려는 금액으로 초기화하세요.
                 * renderPaymentMethods, renderAgreement, requestPayment 보다 반드시 선행되어야 합니다.
                 * @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
                 */
                yield widgets.setAmount(paymentDetails.amount);
                yield Promise.all([
                    /**
                     * 결제창을 렌더링합니다.
                     * @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderpaymentmethods
                     */
                    widgets.renderPaymentMethods({
                        selector: "#payment-method",
                        // 렌더링하고 싶은 결제 UI의 variantKey
                        // 결제 수단 및 스타일이 다른 멀티 UI를 직접 만들고 싶다면 계약이 필요해요.
                        // @docs https://docs.tosspayments.com/guides/v2/payment-widget/admin#새로운-결제-ui-추가하기
                        variantKey: "DEFAULT",
                    }),
                    /**
                     * 약관을 렌더링합니다.
                     * @docs https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자-옵션
                     */
                    widgets.renderAgreement({
                        selector: "#agreement",
                        variantKey: "AGREEMENT",
                    }),
                ]);
                setReady(true);
            });
        }
        renderPaymentWidgets();
    }, [widgets]);
    // ✅ 결제 정보 업데이트 메서드
    function setPaymentDetailsHandler(newDetails) {
        setPaymentDetails((prevDetails) => (Object.assign(Object.assign({}, prevDetails), newDetails)));
    }
    /*
    setPaymentDetailsHandler(data) 사용법
    
    1.
    useEffect(() => {
    async function fetchOrderDetails() {
      const response = await fetch("/api/order-details"); // 백엔드 API 요청
      const data = await response.json();
      
      setPaymentDetailsHandler(data); // 받아온 데이터를 결제 정보로 설정
    }
  
    fetchOrderDetails();
    }, []);
    이런식으로 백엔드에서 정형화된 데이터를 받아오거나
  
    2.
    const savePaymentDetailsToLocalStorage = (data) => {
    localStorage.setItem("paymentDetails", JSON.stringify(data));
    };
  
    savePaymentDetailsToLocalStorage({
    amount: { currency: "KRW", value: 100_000 },
    orderId: "order_67890",
    orderName: "아이패드 프로",
    customerName: "홍길동",
    customerEmail: "hong@example.com",
    });
    이렇게 로컬스토리지에서 저장된 데이터를
  
    useEffect(() => {
    const storedPaymentDetails = localStorage.getItem("paymentDetails");
  
    if (storedPaymentDetails) {
      const parsedDetails = JSON.parse(storedPaymentDetails);
      setPaymentDetailsHandler(parsedDetails); // 저장된 정보로 결제 정보 업데이트
    }
  }, []);
  
  이렇게 가져와서 설정하게
  
    */
    return (React.createElement("div", { className: "wrapper w-100" },
        React.createElement("div", { className: "max-w-540 w-100" },
            React.createElement("div", { id: "payment-method", className: "w-100" }),
            React.createElement("div", { id: "agreement", className: "w-100" }),
            React.createElement("div", { className: "btn-wrapper w-100" },
                React.createElement("button", { className: "btn primary w-100", onClick: () => __awaiter(this, void 0, void 0, function* () {
                        try {
                            /**
                             * 결제 요청
                             * 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
                             * 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
                             * @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
                             */
                            yield (widgets === null || widgets === void 0 ? void 0 : widgets.requestPayment({
                                orderId: paymentDetails.orderId,
                                orderName: paymentDetails.orderName,
                                customerName: paymentDetails.customerName,
                                customerEmail: paymentDetails.customerEmail,
                                successUrl: window.location.origin +
                                    "/sandbox/success" +
                                    window.location.search,
                                failUrl: window.location.origin +
                                    "/sandbox/fail" +
                                    window.location.search,
                            }));
                        }
                        catch (error) {
                            // TODO: 에러 처리
                        }
                    }), disabled: !ready },
                    ready ? "결제하기" : "로딩 중...",
                    " ")))));
}
