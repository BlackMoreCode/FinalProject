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
exports.SuccessPage = SuccessPage;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
function SuccessPage() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [searchParams] = (0, react_router_dom_1.useSearchParams)();
    (0, react_1.useEffect)(() => {
        // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
        // 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
        const requestData = {
            orderId: searchParams.get("orderId"),
            amount: searchParams.get("amount"),
            paymentKey: searchParams.get("paymentKey"),
        };
        function confirm() {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield fetch("/confirm", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestData),
                });
                const json = yield response.json();
                if (!response.ok) {
                    // 결제 실패 비즈니스 로직을 구현하세요.
                    navigate(`/fail?message=${json.message}&code=${json.code}`);
                    return;
                }
                // 결제 성공 비즈니스 로직을 구현하세요.
            });
        }
        confirm();
    }, []);
    return (React.createElement("div", { className: "result wrapper" },
        React.createElement("div", { className: "box_section" },
            React.createElement("h2", null, "\uACB0\uC81C \uC131\uACF5"),
            React.createElement("p", null, `주문번호: ${searchParams.get("orderId")}`),
            React.createElement("p", null, `결제 금액: ${Number(searchParams.get("amount")).toLocaleString()}원`),
            React.createElement("p", null, `paymentKey: ${searchParams.get("paymentKey")}`))));
}
