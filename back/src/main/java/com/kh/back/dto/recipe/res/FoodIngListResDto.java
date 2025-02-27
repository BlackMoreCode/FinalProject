package com.kh.back.dto.recipe.res;

import com.kh.back.dto.python.SearchListResDto;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class FoodIngListResDto implements SearchListResDto {
    private String id;
    private String name;
    private String quantity;
}
