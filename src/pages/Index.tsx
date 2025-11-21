import React, { useState } from "react";
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

// Duplicate interfaces removed



// ...existing code for Index component follows here (starting with: const Index = () => { ... )



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
  const [showResults, setShowResults] = useState<boolean>(false);


  // Helper: Calculate BMI
  function calculateBMI(weight: number, height: number): number {
    if (!weight || !height) return 0;
    return weight / ((height / 100) * (height / 100));
  }

  // Helper: Calculate BMR
  function calculateBMR(weight: number, height: number, age: number, sex: string): number {
    if (!weight || !height || !age || !sex) return 0;
    if (sex === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  // Goal adjustments for calories
  const GOAL_ADJUSTMENTS: Record<string, number> = {
    lose: -400,
    maintain: 0,
    gain: 400,
  };

  // Helper: Update form data
  function updateFormData<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  // Helper: Reset form and results
  function handleReset() {
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
    setResults(null);
    setShowResults(false);
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

// Old FOOD_DATABASE removed. Only the new FOOD_DATABASE should remain below.

const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

const FOOD_DATABASE = {
  breakfast: [
    // Vegetarian - South Indian / Healthy
    { name: "Ragi Porridge (Finger Millet)", quantity: "1 cup (200g)", calories: 220, protein: 6, carbs: 42, fats: 3, fiber: 6, price: 30, type: "veg" as const },
    { name: "Broken Wheat Upma (Dalia Upma)", quantity: "1 cup (200g)", calories: 210, protein: 7, carbs: 40, fats: 4, fiber: 5, price: 25, type: "veg" as const },
    { name: "Idli (3 small, ragi + rice blend)", quantity: "3 pieces (130g)", calories: 170, protein: 6, carbs: 36, fats: 1, fiber: 2, price: 28, type: "veg" as const },
    { name: "Steamed Rava Idli with Veg", quantity: "3 pieces (140g)", calories: 190, protein: 7, carbs: 38, fats: 2, fiber: 3, price: 32, type: "veg" as const },
    { name: "Oats Poha with Vegetables", quantity: "1 cup (180g)", calories: 200, protein: 8, carbs: 36, fats: 4, fiber: 6, price: 30, type: "veg" as const },

    // Added healthy options
    { name: "Vegetable Dalia", quantity: "1 bowl (200g)", calories: 180, protein: 6, carbs: 32, fats: 2, fiber: 5, price: 22, type: "veg" as const },
    { name: "Paneer Bhurji with Multigrain Toast", quantity: "1 plate (180g)", calories: 260, protein: 16, carbs: 22, fats: 12, fiber: 4, price: 55, type: "veg" as const },
    { name: "Chickpea Pancake (Besan Chilla)", quantity: "2 pieces (160g)", calories: 210, protein: 10, carbs: 28, fats: 6, fiber: 6, price: 25, type: "veg" as const },
    { name: "Egg & Spinach Sandwich", quantity: "2 slices + 2 eggs", calories: 250, protein: 16, carbs: 28, fats: 8, fiber: 5, price: 40, type: "nonveg" as const },
    { name: "Chicken Sausage & Veggie Scramble", quantity: "1 plate (180g)", calories: 280, protein: 18, carbs: 12, fats: 16, fiber: 3, price: 60, type: "nonveg" as const },
    { name: "Sprouted Moong Salad Bowl", quantity: "1 bowl (180g)", calories: 160, protein: 10, carbs: 28, fats: 2, fiber: 7, price: 30, type: "veg" as const },

    // Vegetarian - Breads (healthier versions)
    { name: "Multigrain Paratha (1) + Curd", quantity: "1 piece (120g) + 100g curd", calories: 260, protein: 10, carbs: 34, fats: 8, fiber: 6, price: 40, type: "veg" as const },
    { name: "Besan & Oats Chilla (2)", quantity: "2 pieces (160g)", calories: 220, protein: 14, carbs: 28, fats: 6, fiber: 6, price: 28, type: "veg" as const },
    { name: "Sprouted Moong Toast (2 slices)", quantity: "2 slices (150g)", calories: 230, protein: 12, carbs: 32, fats: 6, fiber: 7, price: 35, type: "veg" as const },

    // Vegetarian - Cereals & Protein-rich
    { name: "Greek Yogurt + Fruit + Seeds", quantity: "1 cup (200g)", calories: 220, protein: 14, carbs: 25, fats: 6, fiber: 4, price: 60, type: "veg" as const },
    { name: "Moong Dal Cheela with Paneer Filling", quantity: "2 pieces (200g)", calories: 260, protein: 18, carbs: 30, fats: 8, fiber: 5, price: 45, type: "veg" as const },
    { name: "Quinoa Upma with Veggies", quantity: "1 cup (200g)", calories: 240, protein: 9, carbs: 38, fats: 5, fiber: 6, price: 60, type: "veg" as const },
    { name: "Rava (Semolina) Dosa - minimal oil", quantity: "1 piece (140g)", calories: 180, protein: 6, carbs: 34, fats: 3, fiber: 2, price: 30, type: "veg" as const },

    // Vegetarian - Light & quick
    { name: "Fruit Bowl (seasonal mix)", quantity: "1 bowl (200g)", calories: 120, protein: 2, carbs: 30, fats: 1, fiber: 5, price: 45, type: "veg" as const },
    { name: "Poached Eggs on Multigrain Toast (veg option = avocado)", quantity: "2 eggs + 1 slice (or avocado)", calories: 270, protein: 16, carbs: 20, fats: 12, fiber: 4, price: 50, type: "veg" as const },

    // Non-Vegetarian - Healthy
    { name: "Egg White Omelette with Spinach & Tomato", quantity: "150g (3 egg whites)", calories: 120, protein: 20, carbs: 4, fats: 3, fiber: 2, price: 35, type: "nonveg" as const },
    { name: "Masala Omelette (1 whole + 2 whites) with Ragi Toast", quantity: "200g", calories: 260, protein: 20, carbs: 28, fats: 8, fiber: 4, price: 45, type: "nonveg" as const },
    { name: "Smoked Salmon on Multigrain (small serving)", quantity: "80g salmon + 1 slice", calories: 220, protein: 18, carbs: 18, fats: 10, fiber: 2, price: 180, type: "nonveg" as const },

    // Non-Vegetarian - Protein-forward
    { name: "Egg Bhurji with Mixed Veg (minimal oil)", quantity: "1 plate (180g)", calories: 240, protein: 16, carbs: 10, fats: 14, fiber: 3, price: 45, type: "nonveg" as const },
    { name: "Chicken & Veg Upma (small)", quantity: "1 cup (200g)", calories: 300, protein: 20, carbs: 30, fats: 8, fiber: 3, price: 70, type: "nonveg" as const }
  ],

  lunch: [
    // Vegetarian - Dal & Rice / Balanced plates
    { name: "Brown Rice with Toor Dal & Mixed Veg", quantity: "1 plate (300g)", calories: 420, protein: 15, carbs: 68, fats: 7, fiber: 8, price: 70, type: "veg" as const },
    { name: "Quinoa & Mixed Bean Bowl (Indian spices)", quantity: "1 plate (300g)", calories: 420, protein: 18, carbs: 52, fats: 9, fiber: 10, price: 110, type: "veg" as const },
    { name: "Sprouted Moong Salad + 1 Roti (multigrain)", quantity: "1 plate + 1 roti", calories: 360, protein: 18, carbs: 40, fats: 6, fiber: 12, price: 65, type: "veg" as const },

    // Added healthy options
    { name: "Palak Dal with Brown Rice", quantity: "1 plate (300g)", calories: 390, protein: 14, carbs: 62, fats: 6, fiber: 9, price: 60, type: "veg" as const },
    { name: "Rajma Salad Bowl", quantity: "1 bowl (250g)", calories: 320, protein: 12, carbs: 48, fats: 4, fiber: 10, price: 45, type: "veg" as const },
    { name: "Grilled Fish with Quinoa & Veggies", quantity: "1 plate (250g)", calories: 350, protein: 28, carbs: 30, fats: 10, fiber: 5, price: 180, type: "nonveg" as const },
    { name: "Egg Curry with Brown Rice", quantity: "2 eggs + 150g rice", calories: 340, protein: 16, carbs: 48, fats: 8, fiber: 3, price: 60, type: "nonveg" as const },
    { name: "Paneer Tikka Salad", quantity: "1 bowl (200g)", calories: 280, protein: 18, carbs: 18, fats: 14, fiber: 4, price: 70, type: "veg" as const },
    { name: "Chicken & Vegetable Stew", quantity: "1 bowl (250g)", calories: 320, protein: 24, carbs: 18, fats: 10, fiber: 4, price: 90, type: "nonveg" as const },

    // Vegetarian - Lighter rice dishes
    { name: "Lemon Brown Rice with Roasted Veg", quantity: "1 plate (300g)", calories: 380, protein: 8, carbs: 64, fats: 6, fiber: 6, price: 60, type: "veg" as const },
    { name: "Millet Pulao (Bajra/Jowar) with Raita", quantity: "1 plate (300g)", calories: 400, protein: 12, carbs: 58, fats: 8, fiber: 8, price: 85, type: "veg" as const },

    // Vegetarian - Roti Based (healthier)
    { name: "2 Multigrain Rotis + Paneer Bhurji (low-oil)", quantity: "2 rotis + 150g", calories: 420, protein: 24, carbs: 46, fats: 14, fiber: 6, price: 95, type: "veg" as const },
    { name: "2 Whole Wheat Rotis + Mixed Veg + Dal", quantity: "2 rotis + 200g veg + dal", calories: 410, protein: 16, carbs: 58, fats: 8, fiber: 9, price: 70, type: "veg" as const },
    { name: "Chana Masala (light oil) + Brown Rice", quantity: "1 plate (280g)", calories: 420, protein: 16, carbs: 62, fats: 8, fiber: 10, price: 70, type: "veg" as const },

    // Vegetarian - Protein-rich specials
    { name: "Paneer Tikka Bowl with Millet Rotis", quantity: "1 plate (280g)", calories: 480, protein: 28, carbs: 45, fats: 18, fiber: 5, price: 140, type: "veg" as const },
    { name: "Mixed Lentil Curry (Masoor+Toor+Moong) + Roti", quantity: "1 plate", calories: 380, protein: 20, carbs: 50, fats: 6, fiber: 10, price: 60, type: "veg" as const },

    // Non-Vegetarian - Balanced lunch
    { name: "Grilled Chicken Salad + 1 Multigrain Roti", quantity: "200g chicken + 1 roti", calories: 420, protein: 40, carbs: 30, fats: 10, fiber: 6, price: 160, type: "nonveg" as const },
    { name: "Tandoori Salmon with Brown Rice & Salad", quantity: "150g salmon + 120g rice", calories: 520, protein: 36, carbs: 48, fats: 18, fiber: 3, price: 320, type: "nonveg" as const },
    { name: "Chicken Curry (light) + Brown Rice", quantity: "180g chicken + 150g rice", calories: 480, protein: 36, carbs: 56, fats: 10, fiber: 2, price: 150, type: "nonveg" as const },

    // Non-Vegetarian - Seafood / Lean meats
    { name: "Fish Curry (made with minimal oil) + Millet", quantity: "180g fish + 150g millet", calories: 500, protein: 38, carbs: 50, fats: 14, fiber: 2, price: 220, type: "nonveg" as const },
    { name: "Prawns Stir-fry + Veg Rice", quantity: "150g prawns + 200g rice", calories: 430, protein: 32, carbs: 50, fats: 8, fiber: 2, price: 240, type: "nonveg" as const },

    // Healthy special combos
    { name: "Bajra Roti (2) + Mixed Vegetable Kurma (low-oil)", quantity: "2 rotis + 200g veg", calories: 390, protein: 10, carbs: 56, fats: 10, fiber: 8, price: 80, type: "veg" as const },
    { name: "Rajma with Brown Rice (reduced oil)", quantity: "1 plate (300g)", calories: 420, protein: 16, carbs: 62, fats: 6, fiber: 10, price: 70, type: "veg" as const },

    // Light bowls
    { name: "Kitchari (Moong+Brown Rice) with Ghee (small)", quantity: "1 plate (300g)", calories: 360, protein: 14, carbs: 58, fats: 6, fiber: 6, price: 60, type: "veg" as const }
  ],

  dinner: [
    // Vegetarian - Lighter dinners
    { name: "Khichdi (Moong+Brown Rice) + Veg Salad", quantity: "1 plate (300g)", calories: 340, protein: 14, carbs: 54, fats: 6, fiber: 6, price: 55, type: "veg" as const },
    { name: "Mixed Dal Soup + Multigrain Toast", quantity: "1 bowl + 1 slice", calories: 300, protein: 18, carbs: 38, fats: 6, fiber: 8, price: 60, type: "veg" as const },
    { name: "Grilled Vegetable Platter + 1 Roti", quantity: "1 plate", calories: 320, protein: 8, carbs: 48, fats: 8, fiber: 10, price: 75, type: "veg" as const },

    // Added healthy options
    { name: "Vegetable Oats Soup", quantity: "1 bowl (250g)", calories: 180, protein: 7, carbs: 28, fats: 3, fiber: 6, price: 30, type: "veg" as const },
    { name: "Grilled Paneer & Veggies", quantity: "1 plate (200g)", calories: 260, protein: 18, carbs: 16, fats: 12, fiber: 5, price: 70, type: "veg" as const },
    { name: "Chicken Tikka with Salad", quantity: "1 plate (200g)", calories: 320, protein: 28, carbs: 8, fats: 12, fiber: 3, price: 90, type: "nonveg" as const },
    { name: "Egg Bhurji with Spinach", quantity: "1 plate (180g)", calories: 220, protein: 16, carbs: 8, fats: 12, fiber: 3, price: 40, type: "nonveg" as const },
    { name: "Soya Chunks Curry + Roti", quantity: "1 plate (200g)", calories: 300, protein: 22, carbs: 32, fats: 6, fiber: 7, price: 35, type: "veg" as const },
    { name: "Fish Stew with Veggies", quantity: "1 bowl (200g)", calories: 240, protein: 20, carbs: 10, fats: 8, fiber: 2, price: 120, type: "nonveg" as const },

    // Vegetarian - Protein focused
    { name: "Moong Dal Cheela (3) + Mint Chutney", quantity: "3 pieces (240g)", calories: 330, protein: 20, carbs: 42, fats: 8, fiber: 8, price: 60, type: "veg" as const },
    { name: "Palak Paneer (light oil) + 2 Rotis (multigrain)", quantity: "1 plate", calories: 440, protein: 26, carbs: 44, fats: 16, fiber: 6, price: 120, type: "veg" as const },

    // Vegetarian - Millets & low-carb
    { name: "Bajra Khichdi with Bottle Gourd", quantity: "1 plate (300g)", calories: 360, protein: 12, carbs: 52, fats: 6, fiber: 8, price: 70, type: "veg" as const },
    { name: "Stir-fried Tofu with Veg + 1 Roti", quantity: "1 plate", calories: 380, protein: 22, carbs: 36, fats: 14, fiber: 6, price: 110, type: "veg" as const },

    // Non-Vegetarian - Light dinners
    { name: "Grilled Chicken with Steamed Veg (no roti)", quantity: "200g chicken + 150g veg", calories: 380, protein: 44, carbs: 18, fats: 10, fiber: 6, price: 160, type: "nonveg" as const },
    { name: "Tandoori Fish + Salad", quantity: "180g fish + salad", calories: 360, protein: 40, carbs: 10, fats: 12, fiber: 4, price: 220, type: "nonveg" as const },

    // Non-Vegetarian - Protein dinners
    { name: "Egg Curry (2 eggs) + 1 Multigrain Roti", quantity: "2 eggs + 1 roti", calories: 320, protein: 20, carbs: 28, fats: 12, fiber: 3, price: 80, type: "nonveg" as const },
    { name: "Prawn & Veg Stir Fry + Small Quinoa", quantity: "150g prawns + 100g quinoa", calories: 420, protein: 34, carbs: 44, fats: 8, fiber: 4, price: 260, type: "nonveg" as const },

    // Comfort-light
    { name: "Vegetable Soup + Whole Wheat Bread (2 slices)", quantity: "1 bowl + 2 slices", calories: 260, protein: 8, carbs: 38, fats: 6, fiber: 8, price: 55, type: "veg" as const },
    { name: "Methi Thepla (2) + Low-fat Curd", quantity: "2 pieces + 100g curd", calories: 300, protein: 10, carbs: 40, fats: 8, fiber: 6, price: 50, type: "veg" as const },

    // Heavier healthy options (for athletes / high needs)
    { name: "Lean Mutton Stew (small) + Millet Roti", quantity: "150g mutton + 1 roti", calories: 500, protein: 36, carbs: 40, fats: 18, fiber: 2, price: 220, type: "nonveg" as const },
    { name: "Chicken Shorba + Brown Rice (small)", quantity: "1 bowl + 100g rice", calories: 360, protein: 30, carbs: 30, fats: 8, fiber: 2, price: 140, type: "nonveg" as const }
  ],

  snack: [
    // Vegetarian - Savory healthy
    { name: "Roasted Chana + Peanuts Mix (50g)", quantity: "50g", calories: 260, protein: 13, carbs: 20, fats: 14, fiber: 7, price: 25, type: "veg" as const },
    { name: "Baked Samosa (1) with Salad", quantity: "1 piece (80g)", calories: 160, protein: 4, carbs: 24, fats: 6, fiber: 3, price: 20, type: "veg" as const },
    { name: "Makhana (roasted, light seasoning)", quantity: "50g", calories: 70, protein: 3, carbs: 14, fats: 1, fiber: 2, price: 40, type: "veg" as const },

    // Added healthy options
    { name: "Carrot & Cucumber Sticks with Greek Yogurt Dip", quantity: "150g veg + 50g dip", calories: 110, protein: 6, carbs: 14, fats: 3, fiber: 4, price: 30, type: "veg" as const },
    { name: "Boiled Soya Chunks", quantity: "50g", calories: 90, protein: 8, carbs: 7, fats: 1, fiber: 4, price: 15, type: "veg" as const },
    { name: "Egg White Salad", quantity: "2 egg whites + veg", calories: 80, protein: 10, carbs: 4, fats: 1, fiber: 2, price: 20, type: "nonveg" as const },
    { name: "Chicken Breast Slices (grilled)", quantity: "50g", calories: 90, protein: 16, carbs: 0, fats: 2, fiber: 0, price: 40, type: "nonveg" as const },
    { name: "Fruit & Nut Energy Bar (homemade)", quantity: "1 bar (40g)", calories: 140, protein: 4, carbs: 22, fats: 5, fiber: 3, price: 25, type: "veg" as const },
    { name: "Steamed Corn Chaat", quantity: "1 cup (100g)", calories: 120, protein: 4, carbs: 24, fats: 2, fiber: 3, price: 20, type: "veg" as const },

    // Vegetarian - Nuts, fruits
    { name: "Almonds (20g) + Walnuts (10g)", quantity: "30g", calories: 190, protein: 6, carbs: 4, fats: 16, fiber: 3, price: 45, type: "veg" as const },
    { name: "Apple + Peanut Butter (1 tbsp)", quantity: "1 apple + 15g PB", calories: 220, protein: 4, carbs: 32, fats: 9, fiber: 5, price: 50, type: "veg" as const },

    // Vegetarian - Savory low-cal
    { name: "Cucumber & Carrot Sticks + Hummus (2 tbsp)", quantity: "150g veg + 30g hummus", calories: 140, protein: 4, carbs: 14, fats: 8, fiber: 4, price: 45, type: "veg" as const },
    { name: "Sprouted Moong Chaat (light)", quantity: "1 cup (150g)", calories: 160, protein: 12, carbs: 22, fats: 2, fiber: 8, price: 40, type: "veg" as const },

    // Vegetarian - Sweets (healthier)
    { name: "Dates (3) + Mixed Nuts (10g)", quantity: "approx 40g", calories: 150, protein: 3, carbs: 30, fats: 5, fiber: 4, price: 30, type: "veg" as const },

    // Non-Vegetarian - Protein snacks
    { name: "Boiled Egg (1) + Sprouts Salad (small)", quantity: "1 egg + 50g sprouts", calories: 190, protein: 16, carbs: 6, fats: 10, fiber: 2, price: 30, type: "nonveg" as const },
    { name: "Grilled Chicken Strips (100g)", quantity: "100g", calories: 150, protein: 28, carbs: 2, fats: 4, fiber: 0, price: 90, type: "nonveg" as const },

    // Packable / on-the-go
    { name: "Home-made Trail Mix (30g)", quantity: "30g", calories: 160, protein: 4, carbs: 12, fats: 10, fiber: 3, price: 35, type: "veg" as const },
    { name: "Whole Fruit (Guava / Orange / Pear)", quantity: "1 medium", calories: 80, protein: 2, carbs: 18, fats: 0, fiber: 5, price: 25, type: "veg" as const },

    // Healthy packaged alternatives
    { name: "Roasted Fox Nuts (Makhana) Masala (50g)", quantity: "50g", calories: 140, protein: 4, carbs: 28, fats: 1, fiber: 2, price: 60, type: "veg" as const },
    { name: "Baked Sweet Potato Wedges (150g)", quantity: "150g", calories: 140, protein: 2, carbs: 32, fats: 0, fiber: 4, price: 35, type: "veg" as const }
  ],

  drink: [
    // Hot & low-calorie
    { name: "Green Tea - Lemon & Honey (no sugar)", quantity: "1 cup (200ml)", calories: 10, protein: 0, carbs: 2, fats: 0, fiber: 0, price: 15, type: "veg" as const },
    { name: "Herbal Tulsi Tea", quantity: "1 cup (200ml)", calories: 5, protein: 0, carbs: 1, fats: 0, fiber: 0, price: 12, type: "veg" as const },

    // Added healthy options
    { name: "Amla Juice (no sugar)", quantity: "1 glass (200ml)", calories: 30, protein: 1, carbs: 7, fats: 0, fiber: 2, price: 20, type: "veg" as const },
    { name: "Protein Shake (whey/pea, water)", quantity: "1 glass (250ml)", calories: 120, protein: 22, carbs: 4, fats: 2, fiber: 1, price: 60, type: "veg" as const },
    { name: "Lemon Ginger Detox Water", quantity: "1 glass (250ml)", calories: 8, protein: 0, carbs: 2, fats: 0, fiber: 0, price: 10, type: "veg" as const },
    { name: "Soy Milk (unsweetened)", quantity: "1 glass (200ml)", calories: 70, protein: 7, carbs: 4, fats: 3, fiber: 1, price: 25, type: "veg" as const },
    { name: "Black Coffee (no sugar)", quantity: "1 cup (150ml)", calories: 4, protein: 0, carbs: 0, fats: 0, fiber: 0, price: 10, type: "veg" as const },

    // Dairy & protein-rich
    { name: "Skim Milk (1 cup)", quantity: "200ml", calories: 90, protein: 9, carbs: 12, fats: 0, fiber: 0, price: 20, type: "veg" as const },
    { name: "Buttermilk (chaas) - no added sugar", quantity: "1 glass (200ml)", calories: 50, protein: 3, carbs: 4, fats: 1, fiber: 0, price: 12, type: "veg" as const },

    // Smoothies & shakes (healthy)
    { name: "Banana+Spinach Protein Smoothie (whey or pea)", quantity: "1 glass (300ml)", calories: 220, protein: 18, carbs: 30, fats: 4, fiber: 6, price: 80, type: "veg" as const },
    { name: "Mango Lassi (low sugar, small)", quantity: "1 glass (200ml)", calories: 150, protein: 6, carbs: 24, fats: 3, fiber: 1, price: 50, type: "veg" as const },

    // Juices & hydrating
    { name: "Coconut Water (fresh)", quantity: "1 glass (300ml)", calories: 60, protein: 2, carbs: 12, fats: 0, fiber: 0, price: 35, type: "veg" as const },
    { name: "Nimbu Pani (no sugar, salted)", quantity: "1 glass (200ml)", calories: 8, protein: 0, carbs: 1, fats: 0, fiber: 0, price: 8, type: "veg" as const },
    { name: "Carrot-Apple Juice (no sugar)", quantity: "1 glass (200ml)", calories: 90, protein: 1, carbs: 22, fats: 0, fiber: 3, price: 45, type: "veg" as const },

    // Traditional tonics & warm drinks
    { name: "Turmeric Milk (golden milk, low-fat)", quantity: "1 cup (200ml)", calories: 120, protein: 6, carbs: 10, fats: 4, fiber: 0, price: 30, type: "veg" as const },
    { name: "Jeera Water (warm)", quantity: "1 glass (200ml)", calories: 5, protein: 0, carbs: 1, fats: 0, fiber: 0, price: 5, type: "veg" as const }
  ]
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
    const tdee = bmr * activityFactor;
    let targetCalories = tdee;
    if (formData.goal === "lose") {
      targetCalories = tdee * 0.85; // 15% deficit
    } else if (formData.goal === "gain") {
      targetCalories = tdee * 1.15; // 15% surplus
    }

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
    const generated = generateMealPlan();
    setResults(generated);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start py-8 px-2 md:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-10 mt-4"
      >
        {showResults && results ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-emerald-700 flex items-center gap-2">
                <Calculator className="w-6 h-6" /> Your Results
              </h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-emerald-50 rounded-xl p-4 flex-1 min-w-[120px]">
                  <div className="text-xs text-gray-500">BMI</div>
                  <div className="text-lg font-semibold">{results.bmi}</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 flex-1 min-w-[120px]">
                  <div className="text-xs text-gray-500">BMR</div>
                  <div className="text-lg font-semibold">{results.bmr} kcal</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 flex-1 min-w-[120px]">
                  <div className="text-xs text-gray-500">Target Calories</div>
                  <div className="text-lg font-semibold">{results.targetCalories} kcal</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-emerald-50 rounded-xl p-4 flex-1 min-w-[120px]">
                  <div className="text-xs text-gray-500">Total Protein</div>
                  <div className="text-lg font-semibold">{results.totalProtein} g</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 flex-1 min-w-[120px]">
                  <div className="text-xs text-gray-500">Total Carbs</div>
                  <div className="text-lg font-semibold">{results.totalCarbs} g</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 flex-1 min-w-[120px]">
                  <div className="text-xs text-gray-500">Total Fats</div>
                  <div className="text-lg font-semibold">{results.totalFats} g</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 flex-1 min-w-[120px]">
                  <div className="text-xs text-gray-500">Total Fiber</div>
                  <div className="text-lg font-semibold">{results.totalFiber} g</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 flex-1 min-w-[120px]">
                  <div className="text-xs text-gray-500">Total Cost</div>
                  <div className="text-lg font-semibold">₹{results.totalCost}</div>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2 text-emerald-700 flex items-center gap-2">
                <Utensils className="w-5 h-5" /> Your Meal Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(results.mealPlan).map(([meal, food]) => (
                  <div key={meal} className="bg-emerald-100 rounded-xl p-4">
                    <div className="font-semibold capitalize text-emerald-800 mb-1">{meal}</div>
                    <div className="text-sm font-bold">{food.name}</div>
                    <div className="text-xs text-gray-600 mb-1">{food.quantity}</div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span>Calories: {food.calories}</span>
                      <span>Protein: {food.protein}g</span>
                      <span>Carbs: {food.carbs}g</span>
                      <span>Fats: {food.fats}g</span>
                      <span>Fiber: {food.fiber}g</span>
                      <span>Price: ₹{food.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl shadow"
                onClick={handleReset}
              >
                Start Over
              </button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-2 border-emerald-200"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={formData.age || ""}
                    onChange={(e) => updateFormData("age", Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sex</label>
                  <select
                    value={formData.sex}
                    onChange={(e) => updateFormData("sex", e.target.value as "male" | "female")}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    min={30}
                    max={200}
                    value={formData.weight || ""}
                    onChange={(e) => updateFormData("weight", Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height (cm)</label>
                  <input
                    type="number"
                    min={100}
                    max={250}
                    value={formData.height || ""}
                    onChange={(e) => updateFormData("height", Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Activity Level</label>
                  <select
                    value={formData.activityLevel}
                    onChange={(e) => updateFormData("activityLevel", e.target.value as any)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  >
                    <option value="">Select</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="veryActive">Very Active</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Goal</label>
                  <select
                    value={formData.goal}
                    onChange={(e) => updateFormData("goal", e.target.value as any)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  >
                    <option value="">Select</option>
                    <option value="lose">Lose Weight</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain">Gain Weight</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Diet Preference</label>
                  <select
                    value={formData.dietPreference}
                    onChange={(e) => updateFormData("dietPreference", e.target.value as any)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  >
                    <option value="">Select</option>
                    <option value="veg">Vegetarian</option>
                    <option value="nonveg">Non-Vegetarian</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Daily Budget (₹)</label>
                  <input
                    type="number"
                    min={30}
                    max={1000}
                    value={formData.budget || ""}
                    onChange={(e) => updateFormData("budget", Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl shadow"
                >
                  Generate Plan
                </button>
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-xl shadow"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Index;

