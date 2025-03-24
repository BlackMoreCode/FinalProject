

export interface CalendarReqDto {
  memberId : number;
  start : Date | null;
  end : Date | null;
  recipe : string | null;
}

export interface CalendarResDto {
  calendarId: number;
  memberId: number;
  recipeId: string;
  recipeName: string;
  recipe: "cocktail" | "food";
  date: string;
  amount: string;
  memo: string;
}

export interface CalendarCreateReqDto {
  recipeId: string;
  date: string;
  amount: string;
  memo: string;
  category: "cocktail" | "food";
}

export interface CalendarUpdateReqDto {
  id: number;
  recipeId: string;
  date: string;
  amount: string;
  memo: string;
  category: "cocktail" | "food";
}

export interface TopRatedResDto {
  recipeId: string;
  img: string;
  title: string;
  count: number;
  rate: number;
}

export interface RecommendResDto {
  id : string;
  name: string;
  image: string;
  likes: number;
}
