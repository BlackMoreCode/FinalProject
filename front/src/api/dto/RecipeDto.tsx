export interface IngredientDto {
    ingredient: string;
    amount: string;
}

export interface ManualDto {
    text: string;
    imageUrl: string;
}

export interface FoodResDto {
    name: string;
    cookingMethod: string;
    category: string;
    description: string;
    ingredients: IngredientDto[];
    instructions: ManualDto[];
    image: string;
    like: number;
    report: number;
    author: number;
}

export interface CocktailIngDto {
    unit: string;
    amount: number;
    ingredient: string;
    special?: string;
}

// 칵테일 상세 정보 DTO 타입 정의
export interface CocktailResDto {
    id: string;
    name: string;
    preparation: string;
    image: string;
    category: string;
    abv: number;
    garnish: string;
    glass: string;
    like: number;
    report: number;
    author: number;
    ingredients: CocktailIngDto[];
}

export interface CommentDto {
    memberId: number;
    commentId: number;
    nickName: string;
    content: string;
    parentCommentId: number | null;
    replies: CommentDto[];
}

export interface CommentSectionProps {
    postId: string; // 댓글이 속한 게시물 ID
}

export interface LikeReportButtonsProps {
    postId: string;
    type: string;
    likes: number;
    reports: number;
    updateCounts: (newLikes: number, newReports: number) => void;
}

