import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ReduxApi from "../../api/ReduxApi";
import { setGuest, setUserInfo } from "../../context/redux/UserReducer";
import { logout } from "../../context/redux/CommonAction";
import { RootState } from "../../context/Store";
import ChatModal from "./chat/ChatModal";
import { Background, Header, Mobile, PC } from "./style/HeaderStyle";
import { Outlet } from "react-router-dom";
import React from "react";
import PCHeader from "./PCHeader";
import ModalComponents from "./ModalComponents";
import MobileHeader from "./MobileHeader";
import MainContainer from "../../component/MainContainer";

const Layout = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: RootState) => state.token.accessToken
  );

  useEffect(() => {
    const fetchMyinfo = async () => {
      try {
        if (accessToken) {
          const rsp = await ReduxApi.getMyInfo();
          console.log(rsp);
          if (rsp.data) {
            dispatch(setUserInfo(rsp.data));
          } else {
            console.log("logout");
            dispatch(logout());
          }
        } else {
          dispatch(setGuest());
        }
      } catch (error) {
        console.log(error);
        dispatch(logout());
      }
    };
    fetchMyinfo();
  }, [accessToken]);

  return (
    <Background>
      <Header>
        <PC>
          <PCHeader />
        </PC>
        <Mobile>
          <MobileHeader />
        </Mobile>
      </Header>
      <ChatModal />
      <MainContainer>
        <Outlet />
      </MainContainer>
      {/*<Footer/>*/}
      <ModalComponents />
    </Background>
  );
};
export default Layout;
