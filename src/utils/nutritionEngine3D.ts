import { FOOD_DATABASE } from '../pages/Index';
import { CelestialBody } from './foodToCelestialBody';

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

interface NutritionScore {
  overall: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  balance: number;
}

interface SpatialNutritionData {
  mealPlan: MealPlan;
  nutritionScore: NutritionScore;
  spatialRelationships: SpatialRelationship[];
  recommendations: string[];
}

interface SpatialRelationship {
  food1: string;
  food2: string;
  relationshipType: 'complementary' | 'similar' | 'contrasting';
  strength: number; // 0-1
  reasoning: string;
}

export class NutritionEngine3D {
  // Enhanced food selection with spatial relationships
  static selectBestFoodWithSpatial(
    foods: FoodItem[],
    targetCalories: number,
    maxBudget: number,
    dietPref: string,
    existingMeals: FoodItem[] = [],
    celestialBodies?: CelestialBody[]
  ): FoodItem {
    let filtered = foods;

    // Apply diet preference filter
    if (dietPref === "veg") {
      filtered = foods.filter((food) => food.type === "veg");
    } else if (dietPref === "nonveg") {
      filtered = foods.filter((food) => food.type === "nonveg");
    } else if (dietPref === "both") {
      const vegItems = foods.filter((food) => food.type === "veg");
      const nonVegItems = foods.filter((food) => food.type === "nonveg");

      filtered = Math.random() > 0.5 ? nonVegItems : vegItems;

      if (filtered.length === 0) {
        filtered = vegItems.length > 0 ? vegItems : nonVegItems;
      }
    }

    // Fallback to all veg if filter is empty
    if (filtered.length === 0) {
      filtered = foods.filter((f) => f.type === "veg");
    }

    // Enhanced scoring system with 3D visualization factors
    filtered.sort((a, b) => {
      const aScore = this.calculateFoodScore(a, targetCalories, maxBudget, existingMeals, celestialBodies);
      const bScore = this.calculateFoodScore(b, targetCalories, maxBudget, existingMeals, celestialBodies);
      return bScore - aScore;
    });

    return filtered[0];
  }

  // Calculate comprehensive food score for 3D visualization
  private static calculateFoodScore(
    food: FoodItem,
    targetCalories: number,
    maxBudget: number,
    existingMeals: FoodItem[],
    celestialBodies?: CelestialBody[]
  ): number {
    let score = 0;

    // Calorie match (30% weight)
    const calorieDiff = Math.abs(food.calories - targetCalories);
    const calorieScore = Math.max(0, 100 - (calorieDiff / targetCalories) * 100);
    score += calorieScore * 0.3;

    // Budget fit (25% weight)
    const budgetScore = food.price <= maxBudget ? 100 : Math.max(0, 100 - ((food.price - maxBudget) / maxBudget) * 100);
    score += budgetScore * 0.25;

    // Nutritional balance (20% weight)
    const nutritionScore = this.calculateNutritionalBalance(food);
    score += nutritionScore * 0.2;

    // Meal diversity (15% weight)
    const diversityScore = this.calculateDiversityScore(food, existingMeals);
    score += diversityScore * 0.15;

    // 3D visualization appeal (10% weight)
    if (celestialBodies) {
      const visualScore = this.calculateVisualAppeal(food, celestialBodies);
      score += visualScore * 0.1;
    }

    return score;
  }

  // Calculate nutritional balance score
  private static calculateNutritionalBalance(food: FoodItem): number {
    const totalNutrients = food.protein + food.carbs + food.fats;
    if (totalNutrients === 0) return 0;

    // Calculate macro balance (ideal roughly 40% carbs, 30% protein, 30% fats)
    const proteinRatio = food.protein / totalNutrients;
    const carbsRatio = food.carbs / totalNutrients;
    const fatsRatio = food.fats / totalNutrients;

    const idealProtein = 0.3;
    const idealCarbs = 0.4;
    const idealFats = 0.3;

    const balanceScore = 100 - (
      Math.abs(proteinRatio - idealProtein) * 50 +
      Math.abs(carbsRatio - idealCarbs) * 50 +
      Math.abs(fatsRatio - idealFats) * 50
    );

    // Bonus for high fiber
    const fiberBonus = Math.min(food.fiber * 5, 20);

    return Math.min(balanceScore + fiberBonus, 100);
  }

  // Calculate diversity score to avoid repetition
  private static calculateDiversityScore(food: FoodItem, existingMeals: FoodItem[]): number {
    if (existingMeals.length === 0) return 100;

    let diversityScore = 100;

    existingMeals.forEach(meal => {
      // Penalize similar foods
      if (food.name.toLowerCase().includes(meal.name.toLowerCase().split(' ')[0]) ||
          meal.name.toLowerCase().includes(food.name.toLowerCase().split(' ')[0])) {
        diversityScore -= 30;
      }

      // Penalize similar nutritional profiles
      const nutritionDiff = Math.abs(food.calories - meal.calories) +
                           Math.abs(food.protein - meal.protein) +
                           Math.abs(food.carbs - meal.carbs) +
                           Math.abs(food.fats - meal.fats);

      if (nutritionDiff < 50) {
        diversityScore -= 20;
      }
    });

    return Math.max(diversityScore, 0);
  }

  // Calculate visual appeal for 3D representation
  private static calculateVisualAppeal(food: FoodItem, celestialBodies: CelestialBody[]): number {
    const celestialBody = celestialBodies.find(cb => cb.name === food.name);
    if (!celestialBody) return 50;

    let appealScore = 50;

    // Bonus for interesting visual properties
    if (celestialBody.hasRings) appealScore += 20; // High fiber foods look cool
    if (celestialBody.glowIntensity > 0.7) appealScore += 15; // Dense foods glow nicely
    if (celestialBody.size > 1.0) appealScore += 10; // Larger foods are more prominent
    if (celestialBody.priceEfficiency > 3.0) appealScore += 5; // Value foods get golden indicators

    return Math.min(appealScore, 100);
  }

  // Generate spatial relationships between foods
  static generateSpatialRelationships(mealPlan: MealPlan): SpatialRelationship[] {
    const relationships: SpatialRelationship[] = [];
    const meals = Object.values(mealPlan);

    for (let i = 0; i < meals.length; i++) {
      for (let j = i + 1; j < meals.length; j++) {
        const food1 = meals[i];
        const food2 = meals[j];
        const relationship = this.analyzeFoodRelationship(food1, food2);

        if (relationship) {
          relationships.push(relationship);
        }
      }
    }

    return relationships;
  }

  // Analyze relationship between two foods
  private static analyzeFoodRelationship(food1: FoodItem, food2: FoodItem): SpatialRelationship | null {
    const nutritionDiff = Math.abs(food1.calories - food2.calories) +
                         Math.abs(food1.protein - food2.protein) +
                         Math.abs(food1.carbs - food2.carbs) +
                         Math.abs(food1.fats - food2.fats);

    // Complementary relationship (good nutrition pairing)
    if (this.isComplementary(food1, food2)) {
      return {
        food1: food1.name,
        food2: food2.name,
        relationshipType: 'complementary',
        strength: Math.max(0, 1 - nutritionDiff / 200),
        reasoning: this.getComplementReason(food1, food2)
      };
    }

    // Similar relationship
    if (nutritionDiff < 30) {
      return {
        food1: food1.name,
        food2: food2.name,
        relationshipType: 'similar',
        strength: 1 - nutritionDiff / 30,
        reasoning: 'Similar nutritional profile and calorie content'
      };
    }

    // Contrasting relationship
    if (nutritionDiff > 150) {
      return {
        food1: food1.name,
        food2: food2.name,
        relationshipType: 'contrasting',
        strength: Math.min(1, nutritionDiff / 300),
        reasoning: 'Significant nutritional differences create balance'
      };
    }

    return null;
  }

  // Check if foods are nutritionally complementary
  private static isComplementary(food1: FoodItem, food2: FoodItem): boolean {
    // Complementary if one is high in protein and the other in carbs
    const proteinRatio1 = food1.protein / (food1.protein + food1.carbs + food1.fats);
    const proteinRatio2 = food2.protein / (food2.protein + food2.carbs + food2.fats);

    const carbsRatio1 = food1.carbs / (food1.protein + food1.carbs + food1.fats);
    const carbsRatio2 = food2.carbs / (food2.protein + food2.carbs + food2.fats);

    return (proteinRatio1 > 0.4 && carbsRatio2 > 0.4) ||
           (proteinRatio2 > 0.4 && carbsRatio1 > 0.4);
  }

  // Get reasoning for complementary relationship
  private static getComplementReason(food1: FoodItem, food2: FoodItem): string {
    const proteinRatio1 = food1.protein / (food1.protein + food1.carbs + food1.fats);
    const proteinRatio2 = food2.protein / (food2.protein + food2.carbs + food2.fats);

    if (proteinRatio1 > proteinRatio2) {
      return `${food1.name} provides protein while ${food2.name} provides energy-rich carbohydrates`;
    } else {
      return `${food2.name} provides protein while ${food1.name} provides energy-rich carbohydrates`;
    }
  }

  // Calculate comprehensive nutrition score
  static calculateNutritionScore(mealPlan: MealPlan): NutritionScore {
    const totalProtein = mealPlan.breakfast.protein + mealPlan.lunch.protein +
                        mealPlan.dinner.protein + mealPlan.snack.protein + mealPlan.drink.protein;
    const totalCarbs = mealPlan.breakfast.carbs + mealPlan.lunch.carbs +
                      mealPlan.dinner.carbs + mealPlan.snack.carbs + mealPlan.drink.carbs;
    const totalFats = mealPlan.breakfast.fats + mealPlan.lunch.fats +
                     mealPlan.dinner.fats + mealPlan.snack.fats + mealPlan.drink.fats;
    const totalFiber = mealPlan.breakfast.fiber + mealPlan.lunch.fiber +
                      mealPlan.dinner.fiber + mealPlan.snack.fiber + mealPlan.drink.fiber;

    // Individual nutrient scores (0-100)
    const proteinScore = Math.min((totalProtein / 60) * 100, 100); // Target 60g protein
    const carbsScore = Math.min((totalCarbs / 250) * 100, 100);  // Target 250g carbs
    const fatsScore = Math.min((totalFats / 65) * 100, 100);     // Target 65g fats
    const fiberScore = Math.min((totalFiber / 30) * 100, 100);   // Target 30g fiber

    // Balance score based on macro ratios
    const totalNutrients = totalProtein + totalCarbs + totalFats;
    const proteinRatio = totalProtein / totalNutrients;
    const carbsRatio = totalCarbs / totalNutrients;
    const fatsRatio = totalFats / totalNutrients;

    const idealProtein = 0.3;
    const idealCarbs = 0.4;
    const idealFats = 0.3;

    const balanceScore = 100 - (
      Math.abs(proteinRatio - idealProtein) * 100 +
      Math.abs(carbsRatio - idealCarbs) * 100 +
      Math.abs(fatsRatio - idealFats) * 100
    );

    // Overall score (weighted average)
    const overall = (proteinScore * 0.3 + carbsScore * 0.25 +
                    fatsScore * 0.25 + fiberScore * 0.1 + balanceScore * 0.1);

    return {
      overall: Math.round(overall),
      protein: Math.round(proteinScore),
      carbs: Math.round(carbsScore),
      fats: Math.round(fatsScore),
      fiber: Math.round(fiberScore),
      balance: Math.round(balanceScore)
    };
  }

  // Generate personalized recommendations
  static generateRecommendations(
    userData: any,
    mealPlan: MealPlan,
    nutritionScore: NutritionScore
  ): string[] {
    const recommendations: string[] = [];

    // Protein recommendations
    if (nutritionScore.protein < 70) {
      recommendations.push("Consider adding more protein-rich foods to meet your daily protein needs.");
    }

    // Fiber recommendations
    if (nutritionScore.fiber < 60) {
      recommendations.push("Increase fiber intake by adding more vegetables, whole grains, and legumes.");
    }

    // Balance recommendations
    if (nutritionScore.balance < 60) {
      recommendations.push("Your meal plan could benefit from better macronutrient balance.");
    }

    // Goal-specific recommendations
    if (userData.goal === 'lose' && nutritionScore.overall > 80) {
      recommendations.push("Great balanced nutrition for weight loss! Maintain portion control.");
    } else if (userData.goal === 'gain' && nutritionScore.protein < 80) {
      recommendations.push("For muscle gain, consider increasing protein intake.");
    }

    // Budget recommendations
    const totalCost = Object.values(mealPlan).reduce((sum, food) => sum + food.price, 0);
    if (totalCost > userData.budget) {
      recommendations.push("Your meal plan exceeds budget. Consider more cost-effective protein sources.");
    }

    return recommendations;
  }

  // Create spatial nutrition data for 3D visualization
  static createSpatialNutritionData(
    userData: any,
    mealPlan: MealPlan
  ): SpatialNutritionData {
    const nutritionScore = this.calculateNutritionScore(mealPlan);
    const spatialRelationships = this.generateSpatialRelationships(mealPlan);
    const recommendations = this.generateRecommendations(userData, mealPlan, nutritionScore);

    return {
      mealPlan,
      nutritionScore,
      spatialRelationships,
      recommendations
    };
  }
}