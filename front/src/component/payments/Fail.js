"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailPage = FailPage;
const react_router_dom_1 = require("react-router-dom");
require("./style.css");
function FailPage() {
    const [searchParams] = (0, react_router_dom_1.useSearchParams)();
    const errorCode = searchParams.get("code");
    const errorMessage = searchParams.get("message");
    return (React.createElement("div", { className: "wrapper w-100" },
        React.createElement("div", { className: "flex-column align-center w-100 max-w-540" },
            React.createElement("img", { alt: "https://static.toss.im/lotties/error-spot-apng.png", width: "120", height: "120" }),
            React.createElement("h2", { className: "title" }, "\uACB0\uC81C\uB97C \uC2E4\uD328\uD588\uC5B4\uC694"),
            React.createElement("div", { className: "response-section w-100" },
                React.createElement("div", { className: "flex justify-between" },
                    React.createElement("span", { className: "response-label" }, "code"),
                    React.createElement("span", { id: "error-code", className: "response-text" }, errorCode)),
                React.createElement("div", { className: "flex justify-between" },
                    React.createElement("span", { className: "response-label" }, "message"),
                    React.createElement("span", { id: "error-message", className: "response-text" }, errorMessage))),
            React.createElement("div", { className: "w-100 button-group" },
                React.createElement("a", { className: "btn", href: "https://developers.tosspayments.com/sandbox", target: "_blank", rel: "noreferrer noopener" }, "\uB2E4\uC2DC \uD14C\uC2A4\uD2B8\uD558\uAE30"),
                React.createElement("div", { className: "flex", style: { gap: "16px" } },
                    React.createElement("a", { className: "btn w-100", href: "https://docs.tosspayments.com/reference/error-codes", target: "_blank", rel: "noreferrer noopener" }, "\uC5D0\uB7EC\uCF54\uB4DC \uBB38\uC11C\uBCF4\uAE30"),
                    React.createElement("a", { className: "btn w-100", href: "https://techchat.tosspayments.com", target: "_blank", rel: "noreferrer noopener" }, "\uC2E4\uC2DC\uAC04 \uBB38\uC758\uD558\uAE30"))))));
}
