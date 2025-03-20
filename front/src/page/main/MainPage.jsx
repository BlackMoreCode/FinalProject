import Banner from "./Banner";
import Top3Recipes from "./MainRecipe";

const MainPage = () => {
  const generalRecipes = [
    {
      id: 1,
      title: "Delicious Spaghetti Carbonara",
      image: "/images/spaghetti.jpg",
      url: "/recipes/1",
    },
    {
      id: 2,
      title: "Perfectly Grilled Chicken",
      image: "/images/chicken.jpg",
      url: "/recipes/2",
    },
    {
      id: 3,
      title: "Vegan Avocado Salad",
      image: "/images/salad.jpg",
      url: "/recipes/3",
    },
  ];

  const alcoholicRecipes = [
    {
      id: 1,
      title: "Margarita",
      image: "/images/margarita.jpg",
      url: "/recipes/4",
    },
    {
      id: 2,
      title: "Whiskey Sour",
      image: "/images/whiskey.jpg",
      url: "/recipes/5",
    },
    {
      id: 3,
      title: "Pina Colada",
      image: "/images/pina-colada.jpg",
      url: "/recipes/6",
    },
  ];
  return (
    <div>
      <Banner />
      <Top3Recipes category="일반 음식 레시피" recipes={generalRecipes} />
      <Top3Recipes category="주류 레시피" recipes={alcoholicRecipes} />
    </div>
  );
};

export default MainPage;
