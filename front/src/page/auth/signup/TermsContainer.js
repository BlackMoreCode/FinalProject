"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Style_1 = require("../Style");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const ModalReducer_1 = require("../../../context/redux/ModalReducer");
const Term_1 = require("../../../util/Term");
const TermsContainer = ({ setter, serviceTerm, privacyTerm }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Style_1.TermsHeader, null, "\uC57D\uAD00 \uB3D9\uC758"),
        react_1.default.createElement(Style_1.TermsWrapper, null,
            react_1.default.createElement(Style_1.TermContainer, null,
                react_1.default.createElement(Style_1.TermsCheckbox, { type: "checkbox", checked: serviceTerm, onChange: (e) => setter(e.target.checked, "서비스") }),
                react_1.default.createElement(Style_1.TermLabel, null,
                    "[\uD544\uC218]",
                    " ",
                    react_1.default.createElement(Style_1.TermLink, { onClick: () => dispatch((0, ModalReducer_1.setTitleNContentModal)({ title: "서비스 이용약관", content: Term_1.termsOfService, onCancel: () => { } })) }, "\uC11C\uBE44\uC2A4 \uC774\uC6A9\uC57D\uAD00"),
                    "\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4.")),
            react_1.default.createElement(Style_1.TermContainer, null,
                react_1.default.createElement(Style_1.TermsCheckbox, { type: "checkbox", checked: privacyTerm, onChange: (e) => setter(e.target.checked, "개인정보") }),
                react_1.default.createElement(Style_1.TermLabel, null,
                    "[\uD544\uC218]",
                    " ",
                    react_1.default.createElement(Style_1.TermLink, { onClick: () => dispatch((0, ModalReducer_1.setTitleNContentModal)({ title: "개인정보 처리방침", content: Term_1.privacyPolicy, onCancel: () => { } })) }, "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68"),
                    "\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4.")))));
};
exports.default = TermsContainer;
