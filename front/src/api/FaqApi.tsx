import axios from "axios";
import Commons from "../util/Common";
import axiosInstance from "./AxiosInstance";

const BASE_URL = Commons.BASE_URL;

const FaqApi = {
  getFaq: async (search: string, size: number, page: number) => {
    return await axios.get(`${BASE_URL}/faq/public/search`, {
      params: { q: search, size, page },
    });
  },

  getTotalPages: async (search: string, size: number) => {
    return await axios.get(`${BASE_URL}/faq/public/page`, {
      params: { q: search, size },
    });
  },

  deleteFaq: async (id: string) => {
    return await axiosInstance.delete(`${BASE_URL}/faq/${id}`);
  },

  updateFaq: async (id: string, data: { title: string; content: string }) => {
    return await axiosInstance.post(`${BASE_URL}/faq/${id}`, data);
  },
};
export default FaqApi;