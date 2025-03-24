import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartEvent, ActiveElement } from "chart.js";
import { AdminContext } from "../../../context/AdminStore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// chart.js에서 필요한 요소들 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;

const ChartContainer = styled.div`
    width: 100%;  // 기본적으로 전체 너비 사용

    @media (max-width: 1000px) {
        width: 90%; // 화면이 좁아지면 차트 너비를 90%로 줄임
    }
`;

const ChartComponent = () => {
  const context = useContext(AdminContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("AdminContext가 제공되지 않았습니다.");
  }

  const { chart, type } = context;

  // 차트 데이터 준비
  const data = chart && chart.length > 0 ? {
    labels: chart.map((item) => item.name),
    datasets: [
      {
        label: "좋아요",
        data: chart.map((item) => item.like),
        backgroundColor: "#6054d4",
        borderColor: "#5241a2",
        borderWidth: 1,
      },
      {
        label: "조회수",
        data: chart.map((item) => item.view),
        backgroundColor: "#e0cefe",
        borderColor: "#c6b8f7",
        borderWidth: 1,
      },
    ],
  } : {
    labels: ["데이터 없음"],
    datasets: [
      {
        label: "좋아요",
        data: [0],
        backgroundColor: "#6054d4",
        borderColor: "#5241a2",
        borderWidth: 1,
      },
      {
        label: "조회수",
        data: [0],
        backgroundColor: "#e0cefe",
        borderColor: "#c6b8f7",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (tickValue: string | number) {
            return typeof tickValue === 'number' && tickValue % 1 === 0 ? tickValue : ""; // 정수만 표시하고 소수점은 빈 문자열로 처리
          },
        },
      },
    },
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const chartElement = elements[0]; // 첫 번째 선택된 요소
        const index = chartElement.index; // 선택된 항목의 인덱스
        const selectedItem = chart ? chart[index] : null;
        if (selectedItem) {
          navigate(`/${type}recipe/detail/${selectedItem.id}/${type}`);
        }
      }
    },
  };

  return (
    <ChartWrapper>
      <ChartContainer>
        <Bar data={data} options={options} />
      </ChartContainer>
    </ChartWrapper>
  );
};

export default ChartComponent;
