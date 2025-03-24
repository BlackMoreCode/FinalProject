import React, {createContext, ReactNode, useState} from "react";
import {AdminMemberResDto, ChartResDto} from "../api/dto/AdminDto";
import {SelectChangeEvent} from "@mui/material";
import {FaqResDto} from "../api/dto/FaqDto";

// 상태 값들의 타입 정의
interface PostContextType {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  postList: FaqResDto[] | null
  setPostList: React.Dispatch<React.SetStateAction<FaqResDto[] | null>>;
  maxPage: number;
  setMaxPage: React.Dispatch<React.SetStateAction<number>>;
}

// PostContext 생성
export const PostContext = createContext<PostContextType | null>(null);

interface PostStoreProps {
  children: ReactNode;
}

const PostStore: React.FC<PostStoreProps> = ({ children }) => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [postList, setPostList] = useState<FaqResDto[] | null>(null);
  const [maxPage, setMaxPage] = useState<number>(0);
  return (
    <PostContext.Provider
      value={{
        page,
        setPage,
        size,
        setSize,
        postList,
        setPostList,
        maxPage,
        setMaxPage
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export default PostStore;