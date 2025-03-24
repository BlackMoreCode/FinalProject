import Banner from "./Banner";
import Top3Recipes from "./MainRecipe";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import CalendarApi from "../../api/CalendarApi";

const MainPage = () => {
  const guest = useSelector((state) => state.user.guest);
  const [cocktailList, setCocktailList] = useState([]);
  const [foodList, setFoodList] = useState([]);
  
  useEffect(() => {
    const fetchCocktail = async () => {
      try{
        if(!guest){
          const rsp = await CalendarApi.getRecommend("cocktail")
          console.log(rsp)
          if (rsp.status === 200){
            setCocktailList(rsp.data)
          }
        }else {
          const rsp = await CalendarApi.getPublicRecommend("cocktail")
          console.log(rsp)
          if (rsp.status === 200){
            setCocktailList(rsp.data)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchCocktail()
  },[guest])
  
  useEffect(() => {
    const fetchFood = async () => {
      try{
        if(!guest){
          const rsp = await CalendarApi.getRecommend("food")
          console.log(rsp)
          if (rsp.status === 200){
            setFoodList(rsp.data)
          }
        }else {
          const rsp = await CalendarApi.getPublicRecommend("food")
          console.log(rsp)
          if (rsp.status === 200){
            setFoodList(rsp.data)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchFood()
  },[guest])
  
  return (
    <div>
      <Banner />
      <Top3Recipes category="일반 음식" recipes={foodList} />
      <Top3Recipes category="주류" recipes={cocktailList} />
    </div>
  );
};

export default MainPage;
