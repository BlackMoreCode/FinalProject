import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem } from "@mui/material";
import RecipeSearchField from "./RecipeSearchField";
import { CalendarResDto, CalendarUpdateReqDto, CalendarCreateReqDto } from "../../../api/dto/CalendarDto";
import CalendarApi from "../../../api/CalendarApi";
import { AppDispatch } from "../../../context/Store";
import { useDispatch } from "react-redux";
import { setRejectModal } from "../../../context/redux/ModalReducer";

interface EditCalendarEventProps {
  event: CalendarResDto;
  setEvent: React.Dispatch<React.SetStateAction<CalendarResDto | null>>;
}

const EditCalendarEvent = ({ event, setEvent }: EditCalendarEventProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  console.log(event)
  console.log(isEditMode)
  useEffect(() => {
    setIsEditMode(event.calendarId > 0);
  }, []);

  const handleSaveChanges = async () => {
    if (event) {
      try {
        if (event.recipeId && event.recipeName && event.date)
        {
          if (isEditMode) {
            const calendarUpdateRequest: CalendarUpdateReqDto = {
              id: event.calendarId,
              recipeId: event.recipeId,
              memo: event.memo,
              amount: event.amount,
              date: event.date,
              category: event.recipe,
            };
            const rsp = await CalendarApi.updateCalendar(calendarUpdateRequest);
            if (rsp.data) {
              setEvent(null);
            }
          } else {
            const calendarCreateRequest: CalendarCreateReqDto = {
              recipeId: event.recipeId,
              memo: event.memo,
              amount: event.amount,
              date: event.date,
              category: event.recipe,
            };
            const rsp = await CalendarApi.createCalendar(calendarCreateRequest);
            if (rsp.data) {
              setEvent(null);
            } else {
              setRejectModal({
                message: isEditMode ? "수정 저장에 실패" : "새 캘린더 작성에 실패",
                onCancel: null,
              })
            }
          }
        }
      } catch (error) {
        console.error(isEditMode ? "수정 저장 중 오류 발생:" : "캘린더 저장 중 오류 발생:", error);
        dispatch(
          setRejectModal({
            message: isEditMode ? "수정 저장중 오류 발생" : "캘린더 저장중 오류 발생",
            onCancel: null,
          })
        );
      }
    }
  };

  return (
    <Box mt={2}>
      <Typography variant="h6">{isEditMode ? "수정하기" : "추가하기"}</Typography>

      <TextField
        label="날짜 선택"
        type="date"
        fullWidth
        value={event.date}
        onChange={(e) => setEvent({ ...event, date: e.target.value })}
        sx={{ mt: 1 }}/>

      {/* recipe와 recipeName을 같은 줄에 배치 */}
      <Box display="flex" gap={2} mt={2}>
        <Select
          value={event.recipe}
          onChange={(e) =>
            (e.target.value === "cocktail" || e.target.value === "food") &&
            setEvent({ ...event, recipe: e.target.value, recipeName: "", recipeId: "" })
          }
          sx={{ width: "20%" }}
        >
          <MenuItem value="food">음식</MenuItem>
          <MenuItem value="cocktail">칵테일</MenuItem>
        </Select>
        <RecipeSearchField
          value={event.recipeName}
          onChange={(newRecipeName, newRecipeId) => setEvent({ ...event, recipeName: newRecipeName, recipeId: newRecipeId})}
          type={event.recipe}
        />
      </Box>

      <TextField
        label="수량"
        fullWidth
        value={event.amount}
        onChange={(e) => setEvent({ ...event, amount: e.target.value })}
        sx={{ mt: 2 }}
      />
      <TextField
        label="메모"
        fullWidth
        value={event.memo}
        onChange={(e) => setEvent({ ...event, memo: e.target.value })}
        sx={{ mt: 2 }}
      />
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button onClick={handleSaveChanges} color="primary">
          저장
        </Button>
        <Button onClick={() => setEvent(null)} color="secondary">
          취소
        </Button>
      </Box>
    </Box>
  );
};

export default EditCalendarEvent;
