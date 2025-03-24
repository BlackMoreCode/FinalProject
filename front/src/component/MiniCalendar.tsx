import { JSX, useEffect, useState } from "react";
import CalendarApi from "../api/CalendarApi";
import { CalendarReqDto, CalendarResDto } from "../api/dto/CalendarDto";
import { AppDispatch, RootState } from "../context/Store";
import { useDispatch, useSelector } from "react-redux";
import { setCalendarModal, setRejectModal } from "../context/redux/ModalReducer";
import styled from "styled-components";
import React from "react";
import { Box, Typography, IconButton, Badge } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import zIndex from "@mui/material/styles/zIndex";

interface MiniCalendarProps {
  memberId: number | null;
}

const MiniCalendar = ({ memberId }: MiniCalendarProps) => {
  const date = new Date();
  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date }>({
    startDate: new Date(date.getFullYear(), date.getMonth(), 1),
    endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  });
  const [calList, setCalList] = useState<CalendarResDto[] | []>([]);
  const dispatch = useDispatch<AppDispatch>();
  const nickname = useSelector((state: RootState) => state.user.nickname);

  useEffect(() => {
    const fetchCalList = async () => {
      try {
        if (memberId === null) return;
        const calendarReq: CalendarReqDto = {
          memberId: memberId,
          start: dateRange.startDate,
          end: dateRange.endDate,
          recipe: null,
        };
        const rsp = await CalendarApi.getCalendar(calendarReq);
        if (rsp.data) {
          setCalList(rsp.data);
          return;
        }
        console.error("입력 데이터의 오류로 캘린더를 불러오지 못했습니다.");
        dispatch(setRejectModal({ message: "캘린더를 불러오는데 실패했습니다.", onCancel: null }));
      } catch (error) {
        console.log(error);
      }
    };
    fetchCalList();
  }, [dateRange, memberId]);

  if (memberId === null) return null;
  const updateDateRange = (newStart: Date, newEnd: Date) => {
    setDateRange({ startDate: newStart, endDate: newEnd });
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const todayFormatted = today.toISOString().split("T")[0]; // 오늘 날짜만 'YYYY-MM-DD' 형식으로 변환
    const daysInMonth = new Date(dateRange.startDate.getFullYear(), dateRange.startDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(dateRange.startDate.getFullYear(), dateRange.startDate.getMonth(), 1).getDay();
    const days: JSX.Element[] = [];

    // 첫 번째 줄의 빈 칸 추가
    Array.from({ length: firstDayOfMonth }).forEach((_, index) => {
      days.push(<Box key={`empty-${index}`} />);
    });

    // 날짜 추가
    Array.from({ length: daysInMonth }).forEach((_, day) => {
      // 날짜를 계산하기 위해 Date 객체를 생성하고 시간을 00:00:00으로 설정
      const date = new Date(dateRange.startDate.getFullYear(), dateRange.startDate.getMonth(), day + 2); // 실제 날짜 계산
      const formattedDateStr = date.toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식으로 변환
      // 받아온 item.date도 같은 형식으로 변환 후 비교
      const eventCount = calList.filter((item) => {
        const itemDateFormatted = new Date(item.date).toISOString().split("T")[0];
        return itemDateFormatted === formattedDateStr;
      }).length;

      const isToday = formattedDateStr === todayFormatted; // 오늘 날짜인지 확인
      const hasEvent = eventCount > 0; // 이벤트가 있는지 확인

      days.push(
        <Badge key={formattedDateStr} color="error" badgeContent={hasEvent ? eventCount : null} sx={{zIndex: 0}}>
          <IconButton
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: isToday
                ? "#9f8473"
                : hasEvent
                  ? "#F5F5DC"
                  : "transparent",
              color: isToday ? "white" : "#333",
              border: "1px solid #d0d0d0",
              boxShadow: isToday
                ? "0 4px 10px rgba(0, 103, 71, 0.4)"
                : hasEvent
                  ? "0 4px 10px rgba(139, 94, 60, 0.4)"
                  : "none",
              fontWeight: isToday ? "bold" : "normal",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: isToday
                  ? "#8e735f"
                  : hasEvent
                    ? "#E0D8A1"
                    : "#f0f0f0",
                boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
              },
            }}
            onClick={() => handleDayClick(formattedDateStr)}
          >
            <Typography sx={{ fontSize: "14px", fontWeight: isToday ? "bold" : "normal" }}>
              {day + 1} {/* day는 0부터 시작하므로 바로 1을 더하여 날짜를 표시 */}
            </Typography>
          </IconButton>
        </Badge>
      );
    });

    return days;
  };



  const handleDayClick = (date: string) => {
    console.log("클릭된 날짜:", date);
    // 로컬 날짜를 사용하여 모달을 실행
    dispatch(setCalendarModal({date: date, memberId: memberId, message: `${nickname}님의 ${date}의 캘린더`}))
  };

  // 달력의 월을 이전 달/다음 달로 변경하는 함수
  const changeMonth = (direction: "prev" | "next") => {
    const newDate = new Date(dateRange.startDate);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    const newStartDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    const newEndDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
    updateDateRange(newStartDate, newEndDate);
  };

  return (
    <Background>
      <CalendarWrapper>
        <CalendarHeader>
          <Month>{dateRange.startDate.getMonth() + 1}월</Month>
          <Navigation>
            <IconButton onClick={() => changeMonth("prev")}>
              <ChevronLeftIcon sx={{ fontSize: 30 }} />
            </IconButton>
            <IconButton onClick={() => changeMonth("next")}>
              <ChevronRightIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Navigation>
        </CalendarHeader>
        <CalendarGrid>
          <DayLabel>일</DayLabel>
          <DayLabel>월</DayLabel>
          <DayLabel>화</DayLabel>
          <DayLabel>수</DayLabel>
          <DayLabel>목</DayLabel>
          <DayLabel>금</DayLabel>
          <DayLabel>토</DayLabel>
          {generateCalendarDays()}
        </CalendarGrid>
      </CalendarWrapper>
    </Background>
  );
};

export default MiniCalendar;

const Background = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 20px;
`;

const CalendarWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 10px;
`;

const CalendarHeader = styled.div`
    font-size: 1.5rem;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const Month = styled.div`
    font-weight: bold;
`;

const Navigation = styled.div`
    display: flex;
    gap: 10px;
`;

const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    text-align: center;
`;

const DayLabel = styled.div`
    font-weight: bold;
    padding: 5px 0;
`;
