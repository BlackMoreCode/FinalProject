import {useContext, useEffect} from "react";
import {AdminContext} from "../../../context/AdminStore";
import AdminApi from "../../../api/AdminApi";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../context/Store";
import {setRejectModal} from "../../../context/redux/ModalReducer";
import styled from "styled-components";
import React from "react";
import ChartSelector from "./ChartSelector";
import ChartContent from "./ChartContent";


const ChartMain = () => {
  const context = useContext(AdminContext)
  const dispatch = useDispatch<AppDispatch>();

  if (!context) {
    throw new Error("AdminContext가 제공되지 않았습니다.");
  }
  const {setChart, type, order, setPage} = context


  useEffect(() => {
    setPage("chart")
  },[])

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const rsp = await AdminApi.getChart(type, order);
        console.log(rsp)
        if (rsp.status === 200) {
          setChart(rsp.data);
        } else {
          dispatch(setRejectModal({message: "코드 오류로 차트를 불러오는 데 실패 했습니다.", onCancel: null}))
        }
      } catch (e) {
        console.error(e)
        dispatch(setRejectModal({message: "통신 오류로 차트를 불러오는 데 실패 했습니다.", onCancel: null}))
      }
    }
    fetchChart()
  }, [type, order]);

  return (
    <Container>
      <ChartSelector/>
      <ChartContent/>
    </Container>
  )
}
export default ChartMain;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`