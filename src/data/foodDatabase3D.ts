// Transform the existing food database for 3D visualization
import { FOOD_DATABASE } from '../pages/Index';
import { transformFoodToCelestialBody } from '../utils/foodToCelestialBody';

export const FOOD_DATABASE_3D = {
  // Transform each category for 3D visualization
  breakfast: FOOD_DATABASE.breakfast.map((food, index) =>
    transformFoodToCelestialBody(food, 'breakfast', index)
  ),

  lunch: FOOD_DATABASE.lunch.map((food, index) =>
    transformFoodToCelestialBody(food, 'lunch', index)
  ),

  dinner: FOOD_DATABASE.dinner.map((food, index) =>
    transformFoodToCelestialBody(food, 'dinner', index)
  ),

  snack: FOOD_DATABASE.snack.map((food, index) =>
    transformFoodToCelestialBody(food, 'snack', index)
  ),

  drink: FOOD_DATABASE.drink.map((food, index) =>
    transformFoodToCelestialBody(food, 'drink', index)
  )
};

// Original food database for nutrition calculations
export { FOOD_DATABASE };

// Helper function to get 3D food data for visualization
export function getFoodDatabase3D() {
  return FOOD_DATABASE_3D;
}

// Helper function to get original food database for calculations
export function getOriginalFoodDatabase() {
  return FOOD_DATABASE;
}

// Helper function to get food by name
export function getFoodByName(name: string) {
  const allFoods = [
    ...FOOD_DATABASE.breakfast,
    ...FOOD_DATABASE.lunch,
    ...FOOD_DATABASE.dinner,
    ...FOOD_DATABASE.snack,
    ...FOOD_DATABASE.drink
  ];

  return allFoods.find(food =>
    food.name.toLowerCase().includes(name.toLowerCase())
  );
}

// Helper function to get 3D celestial body by name
export function getCelestialBodyByName(name: string) {
  const allBodies = [
    ...FOOD_DATABASE_3D.breakfast,
    ...FOOD_DATABASE_3D.lunch,
    ...FOOD_DATABASE_3D.dinner,
    ...FOOD_DATABASE_3D.snack,
    ...FOOD_DATABASE_3D.drink
  ];

  return allBodies.find(body =>
    body.name.toLowerCase().includes(name.toLowerCase())
  );
}