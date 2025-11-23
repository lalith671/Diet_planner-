import * as THREE from 'three';

export interface FoodItem {
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

export interface CelestialBody {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  price: number;
  type: "veg" | "nonveg";

  // Visual properties
  size: number;           // Based on calories
  color: string;          // Based on dominant nutrient
  dominantNutrient: 'protein' | 'carbs' | 'fats';
  hasRings: boolean;      // High fiber foods
  glowIntensity: number;  // Nutritional density
  orbitRadius: number;    // Position in universe
  orbitSpeed: number;     // Rotation speed

  // 3D position
  position: {
    x: number;
    y: number;
    z: number;
  };

  // Additional properties
  nutritionScore: number; // Overall nutritional value
  priceEfficiency: number; // Nutrition per rupee
  categoryColor: string;  // Color based on meal category
}

export function transformFoodToCelestialBody(
  food: FoodItem,
  category: string,
  index: number
): CelestialBody {
  // Calculate visual properties based on nutrition data

  // Size based on calories (20-500 calories -> 0.2-2.0 radius)
  const size = 0.2 + Math.min((food.calories / 500) * 1.8, 1.8);

  // Determine dominant nutrient for color
  const nutrients = [
    { type: 'protein' as const, value: food.protein },
    { type: 'carbs' as const, value: food.carbs },
    { type: 'fats' as const, value: food.fats }
  ];

  const dominantNutrient = nutrients.reduce((prev, current) =>
    prev.value > current.value ? prev : current
  ).type;

  // Color based on dominant nutrient
  const colorMap = {
    protein: '#4CAF50',      // Green
    carbs: '#FF9800',        // Orange
    fats: '#FFC107'          // Yellow
  };

  const color = colorMap[dominantNutrient];

  // High fiber foods get rings (like Saturn)
  const hasRings = food.fiber > 8;

  // Glow intensity based on nutritional density
  const nutritionDensity = (food.calories / 100) * (food.fiber / 10);
  const glowIntensity = Math.min(nutritionDensity, 1.0);

  // Orbit properties
  const orbitRadius = 5 + (index * 0.5) + (Math.random() * 2);
  const orbitSpeed = 0.1 + Math.random() * 0.5;

  // Calculate 3D position in spiral galaxy pattern
  const angle = (index * 0.5) + (category === 'breakfast' ? 0 :
               category === 'lunch' ? Math.PI / 2 :
               category === 'dinner' ? Math.PI :
               category === 'snack' ? 3 * Math.PI / 2 : Math.PI / 4);

  const spiralFactor = 1 + (index * 0.02);
  const height = (Math.random() - 0.5) * 4; // Random height variation

  const position = {
    x: Math.cos(angle) * orbitRadius * spiralFactor,
    y: height,
    z: Math.sin(angle) * orbitRadius * spiralFactor
  };

  // Calculate nutrition score (0-100)
  const proteinScore = Math.min((food.protein / 25) * 100, 100);
  const fiberScore = Math.min((food.fiber / 15) * 100, 100);
  const balancedScore = (100 - Math.abs(food.protein - food.carbs - food.fats) / food.calories * 100);
  const nutritionScore = (proteinScore + fiberScore + balancedScore) / 3;

  // Calculate price efficiency (nutrition per rupee)
  const totalNutrition = food.protein + food.carbs + food.fats + food.fiber;
  const priceEfficiency = food.price > 0 ? totalNutrition / food.price : 0;

  // Category colors for constellation grouping
  const categoryColorMap = {
    breakfast: '#FF9800',  // Orange
    lunch: '#4CAF50',      // Green
    dinner: '#2196F3',     // Blue
    snack: '#9C27B0',      // Purple
    drink: '#00BCD4'       // Cyan
  };

  const categoryColor = categoryColorMap[category as keyof typeof categoryColorMap] || '#757575';

  return {
    id: `${category}-${food.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: food.name,
    category,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fats: food.fats,
    fiber: food.fiber,
    price: food.price,
    type: food.type,

    // Visual properties
    size,
    color,
    dominantNutrient,
    hasRings,
    glowIntensity,
    orbitRadius,
    orbitSpeed,
    position,

    // Additional properties
    nutritionScore: Math.round(nutritionScore),
    priceEfficiency: Math.round(priceEfficiency * 10) / 10,
    categoryColor
  };
}

export function createFoodConstellation(foods: CelestialBody[]): {
  constellation: THREE.BufferGeometry;
  connections: Array<[number, number]>;
} {
  const positions = new Float32Array(foods.length * 3);
  const connections: Array<[number, number]> = [];

  // Create constellation connections based on nutritional similarity
  foods.forEach((food, i) => {
    positions[i * 3] = food.position.x;
    positions[i * 3 + 1] = food.position.y;
    positions[i * 3 + 2] = food.position.z;

    // Connect to nearby foods with similar nutrition
    foods.slice(i + 1).forEach((otherFood, j) => {
      const distance = Math.sqrt(
        Math.pow(food.position.x - otherFood.position.x, 2) +
        Math.pow(food.position.y - otherFood.position.y, 2) +
        Math.pow(food.position.z - otherFood.position.z, 2)
      );

      const nutritionSimilarity = 1 - Math.abs(food.nutritionScore - otherFood.nutritionScore) / 100;

      // Connect if close enough and nutritionally similar
      if (distance < 5 && nutritionSimilarity > 0.7) {
        connections.push([i, i + 1 + j]);
      }
    });
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  return {
    constellation: geometry,
    connections
  };
}

export function calculateOrbitalPositions(
  bodies: CelestialBody[],
  time: number
): CelestialBody[] {
  return bodies.map(body => {
    const angle = time * body.orbitSpeed + Math.atan2(body.position.z, body.position.x);
    const newX = Math.cos(angle) * body.orbitRadius;
    const newZ = Math.sin(angle) * body.orbitRadius;

    return {
      ...body,
      position: {
        ...body.position,
        x: newX,
        z: newZ
      }
    };
  });
}

export function filterByNutrientDensity(
  bodies: CelestialBody[],
  minDensity: number = 0.5
): CelestialBody[] {
  return bodies.filter(body => body.glowIntensity >= minDensity);
}

export function filterByPriceEfficiency(
  bodies: CelestialBody[],
  minEfficiency: number = 2.0
): CelestialBody[] {
  return bodies.filter(body => body.priceEfficiency >= minEfficiency);
}

export function sortByNutritionalValue(bodies: CelestialBody[]): CelestialBody[] {
  return [...bodies].sort((a, b) => b.nutritionScore - a.nutritionScore);
}

export function groupByCategory(bodies: CelestialBody[]): Record<string, CelestialBody[]> {
  return bodies.reduce((groups, body) => {
    if (!groups[body.category]) {
      groups[body.category] = [];
    }
    groups[body.category].push(body);
    return groups;
  }, {} as Record<string, CelestialBody[]>);
}

export function findBestValueFoods(bodies: CelestialBody[], topN: number = 10): CelestialBody[] {
  return sortByNutritionalValue(bodies)
    .filter(body => body.priceEfficiency > 2.0)
    .slice(0, topN);
}