import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  MenuItem, Select
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { AppDispatch, RootState } from "../../../context/Store";
import { CalendarReqDto, CalendarResDto } from "../../../api/dto/CalendarDto";
import CalendarApi from "../../../api/CalendarApi";
import {
  closeCalendarModal,
  setCalendarModal,
  setConfirmModal,
  setRejectModal
} from "../../../context/redux/ModalReducer";
import { Close, Edit } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import EditCalendarEvent from "./EditCalendarEvent";

const CalendarModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const id = useSelector((state: RootState) => state.user.id);
  const { open, message, date, memberId } = useSelector((state: RootState) => state.modal.calendarModal);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date } | null>(null);
  const [calList, setCalList] = useState<CalendarResDto[] | []>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarResDto | null>(null);

  useEffect(() => {
    if (date) {
      const targetDate = new Date(date);
      const startOfWeek = new Date(targetDate);
      const endOfWeek = new Date(targetDate);
      startOfWeek.setDate(targetDate.getDate() - targetDate.getDay());
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      setDateRange({ startDate: startOfWeek, endDate: endOfWeek });
    }
  }, [date]);

  useEffect(() => {
    const fetchCalList = async () => {
      try {
        if (memberId && dateRange && !selectedEvent) {
          const calendarReq: CalendarReqDto = {
            memberId: memberId,
            start: dateRange.startDate,
            end: dateRange.endDate,
            recipe: recipe,
          };
          const rsp = await CalendarApi.getCalendar(calendarReq);
          console.log(rsp);
          if (rsp.data) {
            setCalList(rsp.data);
          } else {
            console.error("입력 데이터의 오류로 캘린더를 불러오지 못했습니다.");
            dispatch(setRejectModal({ message: "캘린더를 불러오는데 실패했습니다.", onCancel: null }));
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCalList();
  }, [memberId, dateRange, recipe, selectedEvent]);

  const handleDateClick = (selectedDate: string) => {
    console.log(memberId)
    if (memberId) {
      console.log(selectedDate);
      dispatch(setCalendarModal({ date: selectedDate, message: message, memberId: memberId }));
    }
  };

  const onClickDelete = async (calendarId: number) => {
    try {
      const rsp = await CalendarApi.deleteCalendar(calendarId);
      if (rsp.data) {
        dispatch(setRejectModal({ message: "캘린더를 삭제하는데 성공했습니다.", onCancel: null }));
      }
      else {
        dispatch(setRejectModal({ message: "캘린더를 삭제하는데 실패했습니다.", onCancel: null }));
      }
    } catch (error) {
      console.error(error);
      dispatch(setRejectModal({ message: "캘린더를 삭제중에 오류가 발생 했습니다.", onCancel: null }));
    }
  }

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const generateWeekCalendar = () => {
    const today = new Date().toISOString().split("T")[0];
    return Array.from({ length: 7 }).map((_, i) => {
      const currentDay = new Date(dateRange!.startDate);
      currentDay.setDate(currentDay.getDate() + i);

      const formattedDate = currentDay.toISOString().split("T")[0];
      const isToday = formattedDate === today;
      const isSelectedDate = formattedDate === date;

      const eventCount = calList.filter(item => {
        const itemDateFormatted = new Date(item.date).toISOString().split("T")[0];
        return itemDateFormatted === formattedDate;
      }).length;

      return {
        date: formattedDate,
        day: currentDay.getDate(),
        weekDay: weekDays[currentDay.getDay()],
        isToday,
        isSelectedDate,
        eventCount,
      };
    });
  };

  const renderDayDetails = (date: string) => {
    const dayEvents = calList.filter(item => {
      const itemDateFormatted = new Date(item.date).toISOString().split("T")[0];
      return itemDateFormatted === date;
    });
    return (
      <List>
        <HorizontalLine />
        {date}의 내역
        {id && id === memberId && <Tooltip title="작성하기">
					<IconButton onClick={() => setSelectedEvent({
            calendarId: 0,
            memo: "",
            memberId: id,
            recipeId: "",
            recipe: "food",
            amount: "",
            date: date,
            recipeName: ""
          })}>
						<AddIcon />
					</IconButton>
				</Tooltip>}
        {dayEvents.map((event, index) => (
          <ListItem key={index} sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <ListItemText
              sx={{display: "flex", alignItems: "center", width: "100%"}}
              primary={
                <span
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => setRecipe(event.recipe)}
                >
                  {event.recipeName}
                </span>
              }
              secondary={`　${event.recipe} - ${event.amount}  ${event.memo && "(메모:" + event.memo + ")"}`}
            />
            {id === memberId &&
							<ButtonContainer>
								<Tooltip title={"수정하기"}>
									<IconButton onClick={() => setSelectedEvent(event)}>
										<Edit />
									</IconButton>
								</Tooltip>
								<Tooltip title={"삭제하기"}>
									<IconButton onClick={() => dispatch(setConfirmModal({
                    message: `정말로 ${event.recipeName}의 캘린더를 삭제하시겠습니까?`,
                    onConfirm: () => onClickDelete(event.calendarId),
                    onCancel: null
                  }))}>
										<Close />
									</IconButton>
								</Tooltip>
							</ButtonContainer>}
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Dialog open={open} onClose={() => dispatch(closeCalendarModal())}>
      <DialogTitle>{message}</DialogTitle>
      <DialogContent>
        <Select
          value={recipe || ""}
          onChange={(e) =>
            (e.target.value === "cocktail" || e.target.value === "food" || e.target.value === "") &&
            e.target.value ? setRecipe(e.target.value) : setRecipe(null)
          }
          sx={{ width: "20%" }}
        >
          <MenuItem value="">전부</MenuItem>
          <MenuItem value="food">음식</MenuItem>
          <MenuItem value="cocktail">칵테일</MenuItem>
        </Select>
        <CalendarWrapper>
          {dateRange && generateWeekCalendar().map(({ date, day, weekDay, isToday, isSelectedDate, eventCount }) => (
            <DayBox key={date} isToday={isToday} isSelectedDate={isSelectedDate} onClick={() => handleDateClick(date)}>
              <WeekDay variant="body2">{weekDay}</WeekDay>
              <Typography variant="h6">{day}</Typography>
              {eventCount > 0 && <Typography variant="caption" color="error">{eventCount}개</Typography>}
              {calList.filter(item => {
                const itemDateFormatted = new Date(item.date).toISOString().split("T")[0];
                return itemDateFormatted === date;
              }).map(event => (
                <Tooltip key={event.recipeId} title={event.recipeName} arrow>
                  <EventIcon onClick={() => setRecipe(event.recipe)}>{event.recipe === "cocktail" ? "🍸" : event.recipe === "food" ? "🍔" : "🍽️"}</EventIcon>
                </Tooltip>
              ))}
            </DayBox>
          ))}
        </CalendarWrapper>

        {date && renderDayDetails(date)}

        {selectedEvent && (
          <EditCalendarEvent event={selectedEvent} setEvent={setSelectedEvent} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CalendarModal;

// 스타일링 부분
const HorizontalLine = styled.hr`
    width: 100%;
    border: 1px solid #ccc;
    margin: 20px 0;
`;

const CalendarWrapper = styled(Box)`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
    margin-top: 20px;

    @media (max-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

const DayBox = styled(Box)<{ isToday: boolean; isSelectedDate: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    background-color: ${({ isToday, isSelectedDate }) =>
            isToday ? "lightcoral" : isSelectedDate ? "lightblue" : "transparent"};
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    width: 70px;

    @media (max-width: 768px) {
        padding: 10px;
        width: 50px;
    }
`;

const WeekDay = styled(Typography)`
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 0.9rem;
`;

const EventIcon = styled(Typography)`
    font-size: 18px;
    margin-top: 8px;
    cursor: pointer;
`;

const ButtonContainer = styled(Box)`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 5px;
    }
`;
