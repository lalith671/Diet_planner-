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
  calories: number;
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
  totalCost: number;
}

const FOOD_DATABASE = {
  breakfast: [
    { name: "Poha", calories: 250, price: 25, type: "veg" as const },
    { name: "Upma", calories: 200, price: 20, type: "veg" as const },
    { name: "Idli (3 pcs)", calories: 180, price: 30, type: "veg" as const },
    { name: "Dosa", calories: 220, price: 35, type: "veg" as const },
    { name: "Paratha with Curd", calories: 320, price: 40, type: "veg" as const },
    { name: "Aloo Paratha", calories: 350, price: 45, type: "veg" as const },
    { name: "Bread Omelette", calories: 280, price: 30, type: "nonveg" as const },
    { name: "Egg Bhurji", calories: 240, price: 35, type: "nonveg" as const },
    { name: "Masala Oats", calories: 180, price: 25, type: "veg" as const },
    { name: "Vermicelli Upma", calories: 210, price: 22, type: "veg" as const },
  ],
  lunch: [
    { name: "Dal Rice", calories: 350, price: 50, type: "veg" as const },
    { name: "Rajma Rice", calories: 420, price: 60, type: "veg" as const },
    { name: "Chole Rice", calories: 450, price: 65, type: "veg" as const },
    { name: "Veg Pulao", calories: 380, price: 55, type: "veg" as const },
    { name: "Roti with Dal and Sabzi", calories: 400, price: 60, type: "veg" as const },
    { name: "Paneer Sabzi with Roti", calories: 480, price: 90, type: "veg" as const },
    { name: "Chicken Curry with Rice", calories: 550, price: 120, type: "nonveg" as const },
    { name: "Egg Curry with Rice", calories: 450, price: 70, type: "nonveg" as const },
    { name: "Fish Curry with Rice", calories: 500, price: 150, type: "nonveg" as const },
    { name: "Sambar Rice", calories: 370, price: 55, type: "veg" as const },
  ],
  dinner: [
    { name: "Khichdi", calories: 300, price: 40, type: "veg" as const },
    { name: "Dal Roti", calories: 350, price: 50, type: "veg" as const },
    { name: "Veg Biryani", calories: 420, price: 80, type: "veg" as const },
    { name: "Palak Paneer with Roti", calories: 450, price: 95, type: "veg" as const },
    { name: "Sabzi Roti", calories: 320, price: 55, type: "veg" as const },
    { name: "Grilled Chicken with Roti", calories: 480, price: 130, type: "nonveg" as const },
    { name: "Egg Fried Rice", calories: 400, price: 75, type: "nonveg" as const },
    { name: "Mixed Dal with Rice", calories: 360, price: 50, type: "veg" as const },
    { name: "Paneer Tikka with Roti", calories: 500, price: 110, type: "veg" as const },
    { name: "Butter Chicken with Naan", calories: 580, price: 150, type: "nonveg" as const },
  ],
  snack: [
    { name: "Samosa (2 pcs)", calories: 260, price: 20, type: "veg" as const },
    { name: "Banana", calories: 105, price: 10, type: "veg" as const },
    { name: "Apple", calories: 95, price: 30, type: "veg" as const },
    { name: "Roasted Chana", calories: 150, price: 15, type: "veg" as const },
    { name: "Biscuits (4 pcs)", calories: 200, price: 20, type: "veg" as const },
    { name: "Pakora", calories: 180, price: 25, type: "veg" as const },
    { name: "Boiled Egg", calories: 155, price: 12, type: "nonveg" as const },
    { name: "Mixed Nuts", calories: 170, price: 40, type: "veg" as const },
    { name: "Fruit Chaat", calories: 120, price: 35, type: "veg" as const },
    { name: "Peanuts", calories: 160, price: 15, type: "veg" as const },
  ],
  drink: [
    { name: "Chai", calories: 80, price: 10, type: "veg" as const },
    { name: "Coffee", calories: 60, price: 15, type: "veg" as const },
    { name: "Lassi", calories: 150, price: 30, type: "veg" as const },
    { name: "Buttermilk", calories: 60, price: 15, type: "veg" as const },
    { name: "Lemon Water", calories: 10, price: 5, type: "veg" as const },
    { name: "Coconut Water", calories: 45, price: 30, type: "veg" as const },
    { name: "Nimbu Pani", calories: 40, price: 10, type: "veg" as const },
    { name: "Milk", calories: 150, price: 20, type: "veg" as const },
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
    let filtered = foods.filter((food) => {
      if (dietPref === "veg") return food.type === "veg";
      if (dietPref === "nonveg") return food.type === "nonveg";
      return true;
    });

    if (filtered.length === 0) filtered = foods.filter((f) => f.type === "veg");

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
          </motion.header>

          <motion.div
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
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Daily Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Total Calories</p>
                <p className="text-4xl font-bold text-foreground">{results.totalCalories}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Target: {results.targetCalories} cal
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Total Cost</p>
                <p className="text-4xl font-bold text-foreground">₹{results.totalCost}</p>
                <p className="text-sm text-muted-foreground mt-1">Budget: ₹{formData.budget}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Budget Status</p>
                <p
                  className={`text-4xl font-bold ${
                    results.totalCost <= formData.budget ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {results.totalCost <= formData.budget ? "✓" : "⚠"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {results.totalCost <= formData.budget
                    ? "Within Budget"
                    : `₹${results.totalCost - formData.budget} over`}
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
