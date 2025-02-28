"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ProfileStyle_1 = require("./style/ProfileStyle");
// 나중에 유저 id값만 넣으면 알아서 서치 할 수 있도록 하는것이 목적
const Profile = ({ user, customStyle }) => {
    return (react_1.default.createElement(ProfileStyle_1.ProfileCard, { style: { backgroundColor: customStyle.bgColor } },
        react_1.default.createElement(ProfileStyle_1.ProfileHeaderContainer, null,
            react_1.default.createElement(ProfileStyle_1.ProfileImageWrapper, null, user.profileImg ? (react_1.default.createElement(ProfileStyle_1.ProfileImage, { src: user.profileImg, alt: `${user.name} 프로필 이미지` })) : (react_1.default.createElement(ProfileStyle_1.ProfileImagePlaceholder, null, "\uC774\uBBF8\uC9C0 \uC5C6\uC74C"))),
            react_1.default.createElement(ProfileStyle_1.ProfileInfo, null,
                react_1.default.createElement(ProfileStyle_1.Nickname, { style: {
                        fontFamily: customStyle.nicknameFont,
                        fontSize: customStyle.nicknameSize,
                    } }, user.name),
                react_1.default.createElement(ProfileStyle_1.Introduce, { style: {
                        fontFamily: customStyle.introduceFont,
                        fontSize: customStyle.introduceSize,
                    } }, user.introduce)))));
};
exports.default = Profile;
