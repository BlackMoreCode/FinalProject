import {
  CalendarCreateReqDto,
  CalendarReqDto,
  CalendarResDto,
  CalendarUpdateReqDto, RecommendResDto,
  TopRatedResDto
} from "./dto/CalendarDto";
import axios from "axios";
import Commons from "../util/Common";
import axiosInstance from "./AxiosInstance";


const CalendarApi ={
  getCalendar: async (calendarReq : CalendarReqDto) => {
    return await axios.post<CalendarResDto[]>(`${Commons.BASE_URL}/cal/public/list`, calendarReq)
  },
  existsCalendar: async (date : Date, recipeId : string) => {
    return await axiosInstance.get<boolean>(`${Commons.BASE_URL}/cal/exist/${date}/${recipeId}`)
  },
  createCalendar: async (calendarCreReq : CalendarCreateReqDto) => {
    return await axiosInstance.post<boolean>(`${Commons.BASE_URL}/cal/create`, calendarCreReq)
  },
  updateCalendar: async (calendarUptReq : CalendarUpdateReqDto) => {
    return await axiosInstance.post<boolean>(`${Commons.BASE_URL}/cal/update`, calendarUptReq)
  },
  deleteCalendar: async (id : number) => {
    return await axiosInstance.delete<boolean>(`${Commons.BASE_URL}/cal/delete/${id}`)
  },
  getTopRecipes: async (type : string) => {
    return await axios.get<TopRatedResDto>(`${Commons.BASE_URL}/cal/public/top/${type}`)
  },
  getPublicRecommend: async (type: string) => {
    return await axios.get<RecommendResDto[]>(`${Commons.BASE_URL}/recommend/public/${type}`)
  },
  getRecommend: async (type: string) => {
    return await axiosInstance.get<RecommendResDto[]>(`${Commons.BASE_URL}/recommend/${type}`)
  }
}

export default CalendarApi