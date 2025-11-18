import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Utensils, Activity, DollarSign } from "lucide-react";

interface FormData {
  age: number;
  sex: "male" | "female" | "";
  weight: number;
  height: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "veryActive" | "";
  goal: "lose" | "maintain" | "gain" | "";
  dietPreference: "veg" | "nonveg" | "both" | "";
  budget: number;
}

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  price: number;
  type: "veg" | "nonveg";
}

interface MealPlan {
  breakfast: FoodItem;
  lunch: FoodItem;
  dinner: FoodItem;
  snack: FoodItem;
  drink: FoodItem;
}

interface Results {
  bmi: number;
  bmr: number;
  targetCalories: number;
  mealPlan: MealPlan;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalFiber: number;
  totalCost: number;
}

const FOOD_DATABASE = {
  breakfast: [
    // Vegetarian - South Indian
    { name: "Poha with Veggies", quantity: "1 cup (150g)", calories: 250, protein: 6, carbs: 48, fats: 5, fiber: 3, price: 25, type: "veg" as const },
    { name: "Upma with Veggies", quantity: "1 cup (180g)", calories: 200, protein: 7, carbs: 35, fats: 3, fiber: 2, price: 20, type: "veg" as const },
    { name: "Idli (3 pcs)", quantity: "3 pieces (120g)", calories: 180, protein: 5, carbs: 38, fats: 1, fiber: 1, price: 30, type: "veg" as const },
    { name: "Masala Dosa", quantity: "1 piece (200g)", calories: 280, protein: 7, carbs: 45, fats: 8, fiber: 2, price: 45, type: "veg" as const },
    { name: "Plain Dosa", quantity: "1 piece (150g)", calories: 220, protein: 5, carbs: 40, fats: 6, fiber: 1, price: 35, type: "veg" as const },
    // Vegetarian - Breads
    { name: "Paratha with Curd", quantity: "2 pieces (150g)", calories: 320, protein: 8, carbs: 42, fats: 12, fiber: 2, price: 40, type: "veg" as const },
    { name: "Aloo Paratha", quantity: "2 pieces (180g)", calories: 350, protein: 9, carbs: 48, fats: 13, fiber: 3, price: 45, type: "veg" as const },
    { name: "Paneer Paratha", quantity: "2 pieces (200g)", calories: 380, protein: 15, carbs: 45, fats: 16, fiber: 2, price: 55, type: "veg" as const },
    { name: "Puri with Sabzi", quantity: "2 puris + 150g sabzi", calories: 450, protein: 8, carbs: 55, fats: 20, fiber: 3, price: 50, type: "veg" as const },
    { name: "Methi Thepla", quantity: "4 pieces (120g)", calories: 240, protein: 7, carbs: 38, fats: 7, fiber: 3, price: 32, type: "veg" as const },
    // Vegetarian - Cereals & Others
    { name: "Masala Oats", quantity: "1 cup (200ml)", calories: 180, protein: 7, carbs: 28, fats: 4, fiber: 5, price: 25, type: "veg" as const },
    { name: "Vermicelli Upma", quantity: "1 cup (150g)", calories: 210, protein: 6, carbs: 35, fats: 5, fiber: 2, price: 22, type: "veg" as const },
    { name: "Semolina Halwa", quantity: "1 cup (200g)", calories: 280, protein: 5, carbs: 42, fats: 10, fiber: 1, price: 30, type: "veg" as const },
    { name: "Moong Dal Cheela", quantity: "2 pieces (180g)", calories: 200, protein: 9, carbs: 28, fats: 5, fiber: 3, price: 28, type: "veg" as const },
    { name: "Besan Chilla", quantity: "2 pieces (160g)", calories: 220, protein: 8, carbs: 32, fats: 7, fiber: 2, price: 25, type: "veg" as const },
    { name: "Cornflakes with Milk", quantity: "1 cup (200ml)", calories: 200, protein: 6, carbs: 35, fats: 3, fiber: 1, price: 40, type: "veg" as const },
    { name: "Toast with Butter & Jam", quantity: "2 slices (100g)", calories: 280, protein: 5, carbs: 38, fats: 11, fiber: 1, price: 35, type: "veg" as const },
    { name: "Muesli with Yogurt", quantity: "1 cup (200g)", calories: 250, protein: 8, carbs: 38, fats: 6, fiber: 4, price: 50, type: "veg" as const },
    { name: "Uttapam with Veggies", quantity: "2 pieces (180g)", calories: 230, protein: 6, carbs: 40, fats: 5, fiber: 2, price: 35, type: "veg" as const },
    { name: "Chikhalwali (Puffed Rice)", quantity: "1 cup (150g)", calories: 220, protein: 4, carbs: 50, fats: 1, fiber: 1, price: 20, type: "veg" as const },
    // Non-Vegetarian
    { name: "Bread Omelette", quantity: "2 slices + 2 eggs", calories: 320, protein: 14, carbs: 28, fats: 16, fiber: 0, price: 40, type: "nonveg" as const },
    { name: "Egg Bhurji (2 eggs)", quantity: "150g", calories: 240, protein: 12, carbs: 8, fats: 15, fiber: 0, price: 35, type: "nonveg" as const },
    { name: "Scrambled Eggs (3)", quantity: "150g", calories: 280, protein: 18, carbs: 6, fats: 18, fiber: 0, price: 40, type: "nonveg" as const },
    { name: "Boiled Eggs (2)", quantity: "100g", calories: 180, protein: 13, carbs: 1, fats: 13, fiber: 0, price: 28, type: "nonveg" as const },
    { name: "Chicken Keema Paratha", quantity: "2 pieces (220g)", calories: 420, protein: 22, carbs: 45, fats: 18, fiber: 2, price: 90, type: "nonveg" as const },
    { name: "Fish Fry with Toast", quantity: "150g fish + toast", calories: 350, protein: 28, carbs: 25, fats: 16, fiber: 1, price: 120, type: "nonveg" as const },
    { name: "Chicken Upma", quantity: "1 cup (200g)", calories: 280, protein: 18, carbs: 30, fats: 9, fiber: 1, price: 70, type: "nonveg" as const },
    { name: "Bacon with Eggs & Toast", quantity: "2 strips + 1 egg", calories: 380, protein: 16, carbs: 28, fats: 22, fiber: 1, price: 100, type: "nonveg" as const },
    { name: "Sausage Pav", quantity: "2 sausages + pav", calories: 420, protein: 16, carbs: 45, fats: 18, fiber: 2, price: 70, type: "nonveg" as const },
    { name: "Anda Paratha", quantity: "2 pieces (200g)", calories: 350, protein: 14, carbs: 42, fats: 15, fiber: 2, price: 50, type: "nonveg" as const },
  ],
  lunch: [
    // Vegetarian - Dal & Rice
    { name: "Dal Rice (Toor Dal)", quantity: "1 plate (250g)", calories: 350, protein: 12, carbs: 52, fats: 6, fiber: 5, price: 50, type: "veg" as const },
    { name: "Rajma Rice", quantity: "1 plate (280g)", calories: 420, protein: 15, carbs: 62, fats: 8, fiber: 8, price: 60, type: "veg" as const },
    { name: "Chole Rice", quantity: "1 plate (280g)", calories: 450, protein: 16, carbs: 65, fats: 10, fiber: 9, price: 65, type: "veg" as const },
    // Vegetarian - Rice Dishes
    { name: "Veg Pulao with Raita", quantity: "1 plate (300g)", calories: 380, protein: 10, carbs: 55, fats: 12, fiber: 4, price: 60, type: "veg" as const },
    { name: "Mixed Veg Biryani", quantity: "1 plate (300g)", calories: 420, protein: 12, carbs: 58, fats: 14, fiber: 4, price: 80, type: "veg" as const },
    { name: "Sambar Rice", quantity: "1 plate (280g)", calories: 370, protein: 10, carbs: 55, fats: 8, fiber: 5, price: 55, type: "veg" as const },
    { name: "Lemon Rice", quantity: "1 plate (250g)", calories: 320, protein: 8, carbs: 48, fats: 9, fiber: 3, price: 45, type: "veg" as const },
    { name: "Coconut Rice", quantity: "1 plate (280g)", calories: 400, protein: 9, carbs: 52, fats: 16, fiber: 3, price: 55, type: "veg" as const },
    // Vegetarian - Roti Based
    { name: "Roti with Dal and Sabzi", quantity: "2 rotis + 200g (1 cup)", calories: 400, protein: 14, carbs: 58, fats: 10, fiber: 6, price: 60, type: "veg" as const },
    { name: "Paneer Sabzi with Roti", quantity: "2 rotis + 150g paneer", calories: 480, protein: 22, carbs: 45, fats: 22, fiber: 3, price: 95, type: "veg" as const },
    { name: "Aloo Gobhi with Roti", quantity: "2 rotis + 150g curry", calories: 380, protein: 10, carbs: 52, fats: 13, fiber: 4, price: 50, type: "veg" as const },
    { name: "Bhindi Do Pyaza with Roti", quantity: "2 rotis + 120g bhindi", calories: 320, protein: 8, carbs: 45, fats: 11, fiber: 3, price: 48, type: "veg" as const },
    { name: "Palak Paneer with Rice", quantity: "1 plate rice (250g)", calories: 480, protein: 20, carbs: 48, fats: 20, fiber: 4, price: 100, type: "veg" as const },
    { name: "Paneer Tikka Masala", quantity: "1 plate (250g)", calories: 520, protein: 24, carbs: 42, fats: 24, fiber: 2, price: 120, type: "veg" as const },
    { name: "Baingan Bharta with Roti", quantity: "2 rotis + 150g", calories: 350, protein: 8, carbs: 48, fats: 12, fiber: 4, price: 48, type: "veg" as const },
    { name: "Chana Masala with Rice", quantity: "1 plate (280g)", calories: 420, protein: 14, carbs: 60, fats: 12, fiber: 8, price: 60, type: "veg" as const },
    { name: "Mushroom Curry with Roti", quantity: "2 rotis + 150g", calories: 340, protein: 12, carbs: 42, fats: 12, fiber: 4, price: 70, type: "veg" as const },
    { name: "Mix Veg Curry with Roti", quantity: "2 rotis + 150g", calories: 360, protein: 9, carbs: 50, fats: 12, fiber: 5, price: 55, type: "veg" as const },
    // Vegetarian - Special
    { name: "Pav Bhaji", quantity: "1 serving (250g)", calories: 480, protein: 10, carbs: 65, fats: 16, fiber: 5, price: 60, type: "veg" as const },
    { name: "Misal Pav", quantity: "1 serving (200g)", calories: 420, protein: 12, carbs: 55, fats: 14, fiber: 7, price: 55, type: "veg" as const },
    { name: "Lentil Soup with Bread", quantity: "1 bowl soup + 2 slices", calories: 380, protein: 14, carbs: 52, fats: 10, fiber: 6, price: 55, type: "veg" as const },
    { name: "Sprouted Moong with Rice", quantity: "1 plate (250g)", calories: 320, protein: 15, carbs: 42, fats: 8, fiber: 6, price: 45, type: "veg" as const },
    // Non-Vegetarian
    { name: "Chicken Curry with Rice", quantity: "200g chicken + rice", calories: 550, protein: 35, carbs: 52, fats: 18, fiber: 2, price: 140, type: "nonveg" as const },
    { name: "Egg Curry with Rice", quantity: "3 eggs + rice (250g)", calories: 480, protein: 18, carbs: 48, fats: 20, fiber: 1, price: 80, type: "nonveg" as const },
    { name: "Fish Curry with Rice", quantity: "200g fish + rice", calories: 520, protein: 38, carbs: 45, fats: 16, fiber: 1, price: 170, type: "nonveg" as const },
    { name: "Mutton Curry with Rice", quantity: "200g mutton + rice", calories: 600, protein: 40, carbs: 48, fats: 24, fiber: 1, price: 200, type: "nonveg" as const },
    { name: "Chicken Biryani", quantity: "1 plate (300g)", calories: 580, protein: 32, carbs: 62, fats: 20, fiber: 2, price: 150, type: "nonveg" as const },
    { name: "Egg Biryani", quantity: "1 plate (280g)", calories: 520, protein: 18, carbs: 60, fats: 18, fiber: 2, price: 100, type: "nonveg" as const },
    { name: "Tandoori Chicken with Rice", quantity: "200g chicken + rice", calories: 540, protein: 38, carbs: 50, fats: 16, fiber: 1, price: 150, type: "nonveg" as const },
    { name: "Fish Fry with Rice", quantity: "200g fish + rice", calories: 500, protein: 36, carbs: 48, fats: 14, fiber: 1, price: 180, type: "nonveg" as const },
    { name: "Chicken Tikka Masala", quantity: "1 plate (250g)", calories: 580, protein: 36, carbs: 42, fats: 24, fiber: 1, price: 150, type: "nonveg" as const },
    { name: "Prawns Curry with Rice", quantity: "200g prawns + rice", calories: 480, protein: 32, carbs: 48, fats: 12, fiber: 1, price: 220, type: "nonveg" as const },
    { name: "Chicken Keema with Rice", quantity: "1 plate (280g)", calories: 540, protein: 34, carbs: 55, fats: 18, fiber: 2, price: 140, type: "nonveg" as const },
    { name: "Fish Biryani", quantity: "1 plate (300g)", calories: 560, protein: 36, carbs: 58, fats: 18, fiber: 2, price: 180, type: "nonveg" as const },
    { name: "Butter Chicken with Rice", quantity: "200g + rice", calories: 600, protein: 32, carbs: 55, fats: 26, fiber: 1, price: 160, type: "nonveg" as const },
    { name: "Lamb Kebab with Rice", quantity: "200g kebab + rice", calories: 580, protein: 38, carbs: 50, fats: 22, fiber: 1, price: 170, type: "nonveg" as const },
  ],
  dinner: [
    // Vegetarian
    { name: "Khichdi with Ghee", quantity: "1 plate (250g)", calories: 300, protein: 10, carbs: 42, fats: 8, fiber: 3, price: 45, type: "veg" as const },
    { name: "Dal Roti", quantity: "2 rotis + 1 cup dal", calories: 350, protein: 14, carbs: 50, fats: 8, fiber: 5, price: 55, type: "veg" as const },
    { name: "Veg Biryani Light", quantity: "1 plate (280g)", calories: 400, protein: 10, carbs: 55, fats: 12, fiber: 4, price: 75, type: "veg" as const },
    { name: "Palak Paneer with Roti", quantity: "2 rotis + 150g", calories: 420, protein: 20, carbs: 42, fats: 18, fiber: 4, price: 100, type: "veg" as const },
    { name: "Sabzi Roti", quantity: "3 rotis + 100g sabzi", calories: 320, protein: 10, carbs: 48, fats: 8, fiber: 4, price: 55, type: "veg" as const },
    { name: "Mixed Dal with Rice", quantity: "1 plate (250g)", calories: 360, protein: 12, carbs: 52, fats: 8, fiber: 5, price: 55, type: "veg" as const },
    { name: "Paneer Tikka with Roti", quantity: "2 rotis + 150g", calories: 480, protein: 22, carbs: 40, fats: 20, fiber: 2, price: 120, type: "veg" as const },
    { name: "Toor Dal with Rice", quantity: "1 plate (260g)", calories: 380, protein: 13, carbs: 54, fats: 7, fiber: 5, price: 55, type: "veg" as const },
    { name: "Moong Dal with Roti", quantity: "2 rotis + 1 cup dal", calories: 340, protein: 12, carbs: 48, fats: 8, fiber: 5, price: 48, type: "veg" as const },
    { name: "Pumpkin Curry with Rice", quantity: "1 plate (250g)", calories: 320, protein: 8, carbs: 48, fats: 8, fiber: 5, price: 45, type: "veg" as const },
    { name: "Ridge Gourd Sabzi with Roti", quantity: "2 rotis + 120g", calories: 280, protein: 7, carbs: 40, fats: 8, fiber: 3, price: 42, type: "veg" as const },
    { name: "Carrot Beans with Roti", quantity: "2 rotis + 150g", calories: 320, protein: 9, carbs: 45, fats: 10, fiber: 5, price: 50, type: "veg" as const },
    { name: "Tomato Dal with Rice", quantity: "1 plate (260g)", calories: 360, protein: 11, carbs: 52, fats: 8, fiber: 5, price: 50, type: "veg" as const },
    { name: "Veg Pulao Light", quantity: "1 plate (250g)", calories: 380, protein: 9, carbs: 52, fats: 12, fiber: 4, price: 60, type: "veg" as const },
    // Non-Vegetarian
    { name: "Grilled Chicken with Roti", quantity: "200g + 2 rotis", calories: 480, protein: 36, carbs: 40, fats: 14, fiber: 2, price: 140, type: "nonveg" as const },
    { name: "Egg Fried Rice", quantity: "1 plate (250g)", calories: 420, protein: 16, carbs: 48, fats: 16, fiber: 2, price: 80, type: "nonveg" as const },
    { name: "Butter Chicken with Naan", quantity: "1 naan + 150g", calories: 580, protein: 32, carbs: 52, fats: 24, fiber: 2, price: 160, type: "nonveg" as const },
    { name: "Fish Curry with Rice", quantum: "1 plate (280g)", calories: 500, protein: 36, carbs: 48, fats: 14, fiber: 1, price: 170, type: "nonveg" as const },
    { name: "Mutton Keema with Roti", quantity: "2 rotis + 150g", calories: 560, protein: 36, carbs: 42, fats: 22, fiber: 2, price: 190, type: "nonveg" as const },
    { name: "Chicken Tikka with Roti", quantity: "2 rotis + 150g", calories: 520, protein: 34, carbs: 40, fats: 20, fiber: 2, price: 150, type: "nonveg" as const },
    { name: "Tandoori Fish", quantity: "200g + veggies", calories: 420, protein: 38, carbs: 22, fats: 14, fiber: 2, price: 200, type: "nonveg" as const },
    { name: "Shrimp Curry with Rice", quantity: "1 plate (260g)", calories: 450, protein: 32, carbs: 48, fats: 10, fiber: 1, price: 210, type: "nonveg" as const },
    { name: "Chicken Lollipop with Rice", quantity: "1 plate (280g)", calories: 540, protein: 36, carbs: 50, fats: 18, fiber: 1, price: 150, type: "nonveg" as const },
    { name: "Lamb Curry with Naan", quantity: "1 naan + 150g", calories: 580, protein: 38, carbs: 50, fats: 22, fiber: 2, price: 220, type: "nonveg" as const },
  ],
  snack: [
    // Vegetarian - Savory
    { name: "Samosa (2 pcs)", quantity: "100g", calories: 260, protein: 5, carbs: 32, fats: 12, fiber: 2, price: 20, type: "veg" as const },
    { name: "Pakora Mix (5 pcs)", quantity: "100g", calories: 200, protein: 4, carbs: 22, fats: 10, fiber: 1, price: 25, type: "veg" as const },
    { name: "Dhokla (4 pcs)", quantity: "120g", calories: 160, protein: 6, carbs: 28, fats: 2, fiber: 2, price: 30, type: "veg" as const },
    { name: "Kachori (2 pcs)", quantity: "100g", calories: 280, protein: 5, carbs: 35, fats: 13, fiber: 2, price: 28, type: "veg" as const },
    { name: "Namkeen Mix (100g)", quantity: "100g", calories: 180, protein: 4, carbs: 20, fats: 9, fiber: 1, price: 30, type: "veg" as const },
    { name: "Mixture (100g)", quantity: "100g", calories: 200, protein: 4, carbs: 22, fats: 10, fiber: 1, price: 28, type: "veg" as const },
    // Vegetarian - Sweet
    { name: "Laddu (2 pcs)", quantity: "80g", calories: 240, protein: 5, carbs: 32, fats: 10, fiber: 1, price: 35, type: "veg" as const },
    { name: "Barfi (2 pcs)", quantity: "80g", calories: 220, protein: 4, carbs: 30, fats: 9, fiber: 0, price: 32, type: "veg" as const },
    // Vegetarian - Nuts & Seeds
    { name: "Mixed Nuts (40g)", quantity: "40g", calories: 220, protein: 8, carbs: 10, fats: 18, fiber: 2, price: 60, type: "veg" as const },
    { name: "Almonds (30g)", quantity: "30g", calories: 180, protein: 7, carbs: 6, fats: 15, fiber: 3, price: 50, type: "veg" as const },
    { name: "Peanuts (50g)", quantity: "50g", calories: 260, protein: 9, carbs: 8, fats: 22, fiber: 3, price: 20, type: "veg" as const },
    { name: "Roasted Chana (60g)", quantity: "60g", calories: 180, protein: 8, carbs: 18, fats: 6, fiber: 3, price: 15, type: "veg" as const },
    { name: "Makhana (100g)", quantity: "100g", calories: 140, protein: 3, carbs: 28, fats: 1, fiber: 2, price: 60, type: "veg" as const },
    // Vegetarian - Fruits
    { name: "Banana", quantity: "1 medium (120g)", calories: 105, protein: 1, carbs: 27, fats: 0, fiber: 3, price: 10, type: "veg" as const },
    { name: "Apple", quantity: "1 medium (180g)", calories: 95, protein: 0, carbs: 25, fats: 0, fiber: 4, price: 35, type: "veg" as const },
    { name: "Orange", quantity: "1 medium (150g)", calories: 85, protein: 1, carbs: 21, fats: 0, fiber: 3, price: 20, type: "veg" as const },
    { name: "Papaya", quantity: "1 cup (150g)", calories: 60, protein: 1, carbs: 15, fats: 0, fiber: 3, price: 25, type: "veg" as const },
    { name: "Grapes (100g)", quantity: "100g", calories: 70, protein: 1, carbs: 18, fats: 0, fiber: 1, price: 35, type: "veg" as const },
    { name: "Watermelon (200g)", quantity: "200g", calories: 60, protein: 1, carbs: 12, fats: 0, fiber: 1, price: 20, type: "veg" as const },
    { name: "Mango (100g)", quantity: "100g", calories: 60, protein: 0, carbs: 15, fats: 0, fiber: 1, price: 40, type: "veg" as const },
    // Vegetarian - Others
    { name: "Biscuits (4 pcs)", quantity: "100g", calories: 200, protein: 3, carbs: 28, fats: 8, fiber: 1, price: 25, type: "veg" as const },
    { name: "Fruit Chaat", quantity: "1 cup (150g)", calories: 120, protein: 1, carbs: 28, fats: 1, fiber: 4, price: 40, type: "veg" as const },
    { name: "Cucumber Raita", quantity: "1 cup (200g)", calories: 100, protein: 4, carbs: 12, fats: 2, fiber: 1, price: 20, type: "veg" as const },
    // Non-Vegetarian
    { name: "Boiled Egg", quantity: "1 piece (50g)", calories: 155, protein: 13, carbs: 1, fats: 11, fiber: 0, price: 15, type: "nonveg" as const },
    { name: "Fried Fish Snack", quantity: "100g", calories: 220, protein: 20, carbs: 8, fats: 12, fiber: 0, price: 70, type: "nonveg" as const },
    { name: "Chicken Snacks (4 pcs)", quantity: "100g", calories: 200, protein: 22, carbs: 8, fats: 10, fiber: 0, price: 80, type: "nonveg" as const },
    { name: "Prawn Chips (30g)", quantity: "30g", calories: 150, protein: 12, carbs: 8, fats: 8, fiber: 0, price: 60, type: "nonveg" as const },
    { name: "Tandoori Chicken Bites", quantity: "100g", calories: 180, protein: 24, carbs: 4, fats: 8, fiber: 0, price: 75, type: "nonveg" as const },
  ],
  drink: [
    // Vegetarian - Hot
    { name: "Chai (1 cup)", quantity: "200ml", calories: 80, protein: 2, carbs: 12, fats: 2, fiber: 0, price: 10, type: "veg" as const },
    { name: "Coffee (1 cup)", quantity: "200ml", calories: 60, protein: 1, carbs: 6, fats: 1, fiber: 0, price: 15, type: "veg" as const },
    { name: "Green Tea (1 cup)", quantity: "200ml", calories: 30, protein: 1, carbs: 4, fats: 0, fiber: 0, price: 15, type: "veg" as const },
    { name: "Herbal Tea (1 cup)", quantity: "200ml", calories: 20, protein: 0, carbs: 4, fats: 0, fiber: 0, price: 12, type: "veg" as const },
    // Vegetarian - Dairy
    { name: "Milk (1 cup)", quantity: "200ml", calories: 150, protein: 8, carbs: 12, fats: 8, fiber: 0, price: 20, type: "veg" as const },
    { name: "Lassi (1 cup)", quantity: "200ml", calories: 150, protein: 6, carbs: 18, fats: 3, fiber: 0, price: 35, type: "veg" as const },
    { name: "Buttermilk (1 cup)", quantity: "200ml", calories: 60, protein: 3, carbs: 4, fats: 1, fiber: 0, price: 15, type: "veg" as const },
    { name: "Mango Lassi (1 cup)", quantity: "220ml", calories: 200, protein: 5, carbs: 32, fats: 4, fiber: 0, price: 50, type: "veg" as const },
    { name: "Fruit Yogurt (1 cup)", quantity: "150g", calories: 120, protein: 4, carbs: 20, fats: 2, fiber: 0, price: 40, type: "veg" as const },
    // Vegetarian - Juices & Water
    { name: "Lemon Water", quantity: "1 glass (200ml)", calories: 10, protein: 0, carbs: 2, fats: 0, fiber: 0, price: 5, type: "veg" as const },
    { name: "Coconut Water", quantity: "1 glass (200ml)", calories: 45, protein: 1, carbs: 9, fats: 0, fiber: 0, price: 30, type: "veg" as const },
    { name: "Nimbu Pani", quantity: "1 glass (200ml)", calories: 40, protein: 0, carbs: 10, fats: 0, fiber: 0, price: 12, type: "veg" as const },
    { name: "Sugarcane Juice", quantity: "1 glass (250ml)", calories: 200, protein: 0, carbs: 50, fats: 0, fiber: 0, price: 30, type: "veg" as const },
    { name: "Watermelon Juice", quantity: "1 glass (200ml)", calories: 60, protein: 1, carbs: 12, fats: 0, fiber: 0, price: 35, type: "veg" as const },
    { name: "Orange Juice", quantity: "1 glass (200ml)", calories: 110, protein: 2, carbs: 26, fats: 0, fiber: 1, price: 40, type: "veg" as const },
    { name: "Apple Juice", quantity: "1 glass (200ml)", calories: 100, protein: 0, carbs: 24, fats: 0, fiber: 0, price: 45, type: "veg" as const },
    { name: "Pomegranate Juice", quantity: "1 glass (200ml)", calories: 120, protein: 1, carbs: 28, fats: 0, fiber: 0, price: 50, type: "veg" as const },
    { name: "Banana Shake", quantity: "1 glass (250ml)", calories: 220, protein: 7, carbs: 38, fats: 5, fiber: 3, price: 55, type: "veg" as const },
    { name: "Strawberry Shake", quantity: "1 glass (250ml)", calories: 180, protein: 5, carbs: 32, fats: 4, fiber: 2, price: 60, type: "veg" as const },
    { name: "Water (Plain)", quantity: "1 glass (200ml)", calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, price: 0, type: "veg" as const },
  ],
};

const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

const GOAL_ADJUSTMENTS = {
  lose: -500,
  maintain: 0,
  gain: 500,
};

const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    age: 0,
    sex: "",
    weight: 0,
    height: 0,
    activityLevel: "",
    goal: "",
    dietPreference: "",
    budget: 0,
  });

  const [results, setResults] = useState<Results | null>(null);
  const [showResults, setShowResults] = useState(false);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const calculateBMR = (weight: number, height: number, age: number, sex: string): number => {
    if (sex === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  const selectBestFood = (
    foods: FoodItem[],
    targetCalories: number,
    maxBudget: number,
    dietPref: string
  ): FoodItem => {
    let filtered = foods;

    // Filter by diet preference
    if (dietPref === "veg") {
      filtered = foods.filter((food) => food.type === "veg");
    } else if (dietPref === "nonveg") {
      filtered = foods.filter((food) => food.type === "nonveg");
    } else if (dietPref === "both") {
      // For "both", randomly choose between veg or nonveg to add variety
      const vegItems = foods.filter((food) => food.type === "veg");
      const nonVegItems = foods.filter((food) => food.type === "nonveg");
      
      // 50-50 chance to pick from veg or nonveg for variety
      filtered = Math.random() > 0.5 ? nonVegItems : vegItems;
      
      // If one category is empty, use the other
      if (filtered.length === 0) {
        filtered = vegItems.length > 0 ? vegItems : nonVegItems;
      }
    }

    // Fallback to all veg if filter is empty
    if (filtered.length === 0) {
      filtered = foods.filter((f) => f.type === "veg");
    }

    // Sort by calorie match and budget fit
    filtered.sort((a, b) => {
      const aDiff = Math.abs(a.calories - targetCalories);
      const bDiff = Math.abs(b.calories - targetCalories);
      const aBudgetFit = a.price <= maxBudget ? 0 : a.price - maxBudget;
      const bBudgetFit = b.price <= maxBudget ? 0 : b.price - maxBudget;
      
      if (aBudgetFit !== bBudgetFit) return aBudgetFit - bBudgetFit;
      return aDiff - bDiff;
    });

    return filtered[0];
  };

  const generateMealPlan = (): Results => {
    const bmi = calculateBMI(formData.weight, formData.height);
    const bmr = calculateBMR(formData.weight, formData.height, formData.age, formData.sex);
    const activityFactor = ACTIVITY_FACTORS[formData.activityLevel as keyof typeof ACTIVITY_FACTORS];
    const goalAdjustment = GOAL_ADJUSTMENTS[formData.goal as keyof typeof GOAL_ADJUSTMENTS];
    const targetCalories = bmr * activityFactor + goalAdjustment;

    const calorieDistribution = {
      breakfast: targetCalories * 0.25,
      lunch: targetCalories * 0.35,
      dinner: targetCalories * 0.3,
      snack: targetCalories * 0.07,
      drink: targetCalories * 0.03,
    };

    const budgetDistribution = {
      breakfast: formData.budget * 0.2,
      lunch: formData.budget * 0.35,
      dinner: formData.budget * 0.3,
      snack: formData.budget * 0.1,
      drink: formData.budget * 0.05,
    };

    const mealPlan: MealPlan = {
      breakfast: selectBestFood(
        FOOD_DATABASE.breakfast,
        calorieDistribution.breakfast,
        budgetDistribution.breakfast,
        formData.dietPreference
      ),
      lunch: selectBestFood(
        FOOD_DATABASE.lunch,
        calorieDistribution.lunch,
        budgetDistribution.lunch,
        formData.dietPreference
      ),
      dinner: selectBestFood(
        FOOD_DATABASE.dinner,
        calorieDistribution.dinner,
        budgetDistribution.dinner,
        formData.dietPreference
      ),
      snack: selectBestFood(
        FOOD_DATABASE.snack,
        calorieDistribution.snack,
        budgetDistribution.snack,
        formData.dietPreference
      ),
      drink: selectBestFood(
        FOOD_DATABASE.drink,
        calorieDistribution.drink,
        budgetDistribution.drink,
        formData.dietPreference
      ),
    };

    const totalCalories =
      mealPlan.breakfast.calories +
      mealPlan.lunch.calories +
      mealPlan.dinner.calories +
      mealPlan.snack.calories +
      mealPlan.drink.calories;

    const totalProtein =
      mealPlan.breakfast.protein +
      mealPlan.lunch.protein +
      mealPlan.dinner.protein +
      mealPlan.snack.protein +
      mealPlan.drink.protein;

    const totalCarbs =
      mealPlan.breakfast.carbs +
      mealPlan.lunch.carbs +
      mealPlan.dinner.carbs +
      mealPlan.snack.carbs +
      mealPlan.drink.carbs;

    const totalFats =
      mealPlan.breakfast.fats +
      mealPlan.lunch.fats +
      mealPlan.dinner.fats +
      mealPlan.snack.fats +
      mealPlan.drink.fats;

    const totalFiber =
      mealPlan.breakfast.fiber +
      mealPlan.lunch.fiber +
      mealPlan.dinner.fiber +
      mealPlan.snack.fiber +
      mealPlan.drink.fiber;

    const totalCost =
      mealPlan.breakfast.price +
      mealPlan.lunch.price +
      mealPlan.dinner.price +
      mealPlan.snack.price +
      mealPlan.drink.price;

    return {
      bmi: Math.round(bmi * 10) / 10,
      bmr: Math.round(bmr),
      targetCalories: Math.round(targetCalories),
      mealPlan,
      totalCalories,
      totalProtein: Math.round(totalProtein * 10) / 10,
      totalCarbs: Math.round(totalCarbs * 10) / 10,
      totalFats: Math.round(totalFats * 10) / 10,
      totalFiber: Math.round(totalFiber * 10) / 10,
      totalCost,
    };
  };

  const handleSubmit = () => {
    if (
      !formData.age ||
      !formData.sex ||
      !formData.weight ||
      !formData.height ||
      !formData.activityLevel ||
      !formData.goal ||
      !formData.dietPreference ||
      !formData.budget
    ) {
      alert("Please fill all fields");
      return;
    }

    const calculatedResults = generateMealPlan();
    setResults(calculatedResults);
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setResults(null);
    setFormData({
      age: 0,
      sex: "",
      weight: 0,
      height: 0,
      activityLevel: "",
      goal: "",
      dietPreference: "",
      budget: 0,
    });
  };

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-main px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-foreground mb-3">Your Personalized Diet Plan</h1>
          <p className="text-muted-foreground text-lg">Tailored to your goals and budget</p>
        </motion.header>          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            {[
              { label: "BMI", value: results.bmi, icon: Calculator, unit: "" },
              { label: "BMR", value: results.bmr, icon: Activity, unit: "cal" },
              { label: "Target Calories", value: results.targetCalories, icon: Utensils, unit: "cal" },
              { label: "Your Budget", value: `₹${formData.budget}`, icon: DollarSign, unit: "" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border-2 border-emerald-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-muted-foreground text-sm font-medium mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                  <span className="text-lg ml-1">{stat.unit}</span>
                </p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {Object.entries(results.mealPlan).map(([mealType, food], index) => (
              <motion.div
                key={mealType}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border-2 border-emerald-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold capitalize text-foreground">{mealType}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      food.type === "veg"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {food.type === "veg" ? "🌱 Veg" : "🍗 Non-Veg"}
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-3">{food.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  <span className="font-semibold text-foreground">Quantity:</span> {food.quantity}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Protein</span>
                    <span className="text-lg font-bold text-foreground">{food.protein}g</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Carbs</span>
                    <span className="text-lg font-bold text-foreground">{food.carbs}g</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Fats</span>
                    <span className="text-lg font-bold text-foreground">{food.fats}g</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Fiber</span>
                    <span className="text-lg font-bold text-foreground">{food.fiber}g</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{food.calories}</span> cal
                    </span>
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">₹{food.price}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-2 border-emerald-200 mb-8"
          >
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Daily Nutritional Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Total Calories</p>
                <p className="text-4xl font-bold text-foreground">{results.totalCalories}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Target: {results.targetCalories} cal
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Total Protein</p>
                <p className="text-4xl font-bold text-blue-600">{results.totalProtein}g</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: 50-60g
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Total Carbs</p>
                <p className="text-4xl font-bold text-amber-600">{results.totalCarbs}g</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: 200-300g
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Total Fats</p>
                <p className="text-4xl font-bold text-orange-600">{results.totalFats}g</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: 50-70g
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Total Fiber</p>
                <p className="text-4xl font-bold text-green-600">{results.totalFiber}g</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: 25-35g
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Total Cost</p>
                <p className="text-4xl font-bold text-foreground">₹{results.totalCost}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Budget: ₹{formData.budget}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-emerald-200">
              <div className="text-center">
                <p
                  className={`text-2xl font-bold ${
                    results.totalCost <= formData.budget ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {results.totalCost <= formData.budget
                    ? "✓ Budget Status: Within Budget"
                    : `⚠ Budget Status: ₹${results.totalCost - formData.budget} over`}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="bg-gradient-button text-white px-12 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              Create New Plan
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-foreground mb-3">Indian Diet Planner</h1>
          <p className="text-muted-foreground text-lg">
            Get your personalized meal plan based on your goals and budget
          </p>
        </motion.header>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-2 border-emerald-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-foreground font-semibold mb-2">Age</label>
              <input
                type="number"
                min="15"
                max="100"
                value={formData.age || ""}
                onChange={(e) => updateFormData("age", parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-colors bg-white"
                placeholder="Enter age (15-100)"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-2">Sex</label>
              <div className="grid grid-cols-2 gap-3">
                {["male", "female"].map((sex) => (
                  <button
                    key={sex}
                    onClick={() => updateFormData("sex", sex)}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      formData.sex === sex
                        ? "bg-gradient-button text-white shadow-lg"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {sex === "male" ? "Male" : "Female"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-2">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="200"
                value={formData.weight || ""}
                onChange={(e) => updateFormData("weight", parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-colors bg-white"
                placeholder="Enter weight (30-200 kg)"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-2">Height (cm)</label>
              <input
                type="number"
                min="120"
                max="250"
                value={formData.height || ""}
                onChange={(e) => updateFormData("height", parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-colors bg-white"
                placeholder="Enter height (120-250 cm)"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-2">Activity Level</label>
              <select
                value={formData.activityLevel}
                onChange={(e) => updateFormData("activityLevel", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-colors bg-white"
              >
                <option value="">Select activity level</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="veryActive">Very Active</option>
              </select>
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-2">Goal</label>
              <select
                value={formData.goal}
                onChange={(e) => updateFormData("goal", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-colors bg-white"
              >
                <option value="">Select goal</option>
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
              </select>
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-2">Diet Preference</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "veg", label: "Veg" },
                  { value: "nonveg", label: "Non-Veg" },
                  { value: "both", label: "Both" },
                ].map((pref) => (
                  <button
                    key={pref.value}
                    onClick={() => updateFormData("dietPreference", pref.value)}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      formData.dietPreference === pref.value
                        ? "bg-gradient-button text-white shadow-lg"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {pref.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-2">Daily Budget (₹)</label>
              <input
                type="number"
                min="100"
                max="5000"
                value={formData.budget || ""}
                onChange={(e) => updateFormData("budget", parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-colors bg-white"
                placeholder="Enter budget (₹100-5000)"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full bg-gradient-button text-white py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
          >
            Generate My Diet Plan
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
