import { AppDispatch, RootState } from "../../context/Store";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Tooltip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import React, { useState } from "react";
import { openModal } from "../../context/redux/ModalReducer";
import { useNavigate } from "react-router-dom";
import { logout } from "../../context/redux/CommonAction";
import CloseIcon from '@mui/icons-material/Close';
import DropdownComponent from "../../component/DropdownComponent";

const ProfileButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const guest = useSelector((state: RootState) => state.user.guest);
  const admin = useSelector((state: RootState) => state.user.admin);
  const nickname = useSelector((state: RootState) => state.user.nickname);
  const [profile, setProfile] = useState<boolean>(false);

  const menuList = guest
    ? [
      { name: "로그인", fn: () => dispatch(openModal("login")) },
      { name: "회원 가입", fn: () => dispatch(openModal("signup")) },
    ]
    : admin
      ? [
        { name: "프로필", fn: () => navigate("/profile") },
        { name: "관리자 페이지", fn: () => navigate("/admin") },
        { name: "로그아웃", fn: () => dispatch(logout()) },
      ]
      : [
        { name: "프로필", fn: () => navigate("/profile") },
        { name: "로그아웃", fn: () => dispatch(logout()) },
      ];

  return (
    <>
      <Tooltip title={profile ? "닫기" : (nickname || "게스트")} >
        <IconButton
          onClick={() => setProfile(!profile)}
          sx={{ background: "#F5F5DC", color: "#6A4E23", zIndex: profile ? "30" : "5" }}>
          {profile ? <CloseIcon/> : <PersonIcon/>}
        </IconButton>
      </Tooltip>
      <DropdownComponent open={profile} onClose={() => setProfile(false)} list={menuList} />
    </>
  );
};
export default ProfileButton;