# 🎯 Nourish India Diet Planner - Presentation Guide

## 📋 Project Overview

**Nourish India Diet Planner** is a personalized meal planning web application that generates customized diet plans based on user's health metrics, fitness goals, dietary preferences, and budget constraints.

---

## 🎨 Key Features

### 1. **User Profile Input**
- **Age, Sex, Weight, Height** - Demographic data collection
- **Activity Level** - Sedentary, Light, Moderate, Active, Very Active
- **Fitness Goal** - Lose Weight, Maintain, Gain Weight
- **Diet Preference** - Vegetarian, Non-Vegetarian, or Both
- **Daily Budget** - Cost constraint for meal planning

### 2. **Health Metrics Calculation**
- **BMI (Body Mass Index)** - Shows current health status
  - Calculated as: Weight(kg) / Height²(m)
  - Categories: Underweight, Normal, Overweight, Obese
  
- **BMR (Basal Metabolic Rate)** - Daily calorie burn at rest
  - Mifflin-St Jeor formula used
  - Male: 10×weight + 6.25×height - 5×age + 5
  - Female: 10×weight + 6.25×height - 5×age - 161
  
- **Target Calories** - Daily calorie goal
  - Calculated as: BMR × Activity Factor ± Goal Adjustment
  - Lose Weight: -500 calories/day
  - Maintain: Same calories
  - Gain Weight: +500 calories/day

### 3. **Comprehensive Food Database**
- **180+ Indian Food Items** across 5 meal categories
- **Breakfast** (30 items) - Poha, Dosa, Paratha, Eggs, etc.
- **Lunch** (34 items) - Rice curries, Dal, Biryani, etc.
- **Dinner** (20 items) - Light options, Roti-based, etc.
- **Snacks** (38 items) - Samosa, Fruits, Nuts, Boiled Eggs, etc.
- **Drinks** (20 items) - Chai, Coffee, Juices, Lassi, etc.

### 4. **Complete Nutritional Information**
Each food item includes:
- **Calories** - Energy content per serving
- **Protein (g)** - Muscle building and repair
- **Carbs (g)** - Energy source
- **Fats (g)** - Essential nutrients
- **Fiber (g)** - Digestive health
- **Quantity** - Serving size mentioned (e.g., "2 rotis + 150g sabzi")
- **Price (₹)** - Cost in Indian Rupees
- **Type** - Vegetarian or Non-Vegetarian

### 5. **Smart Meal Selection Algorithm**
The app selects best foods based on:
1. **Calorie Matching** - Closest to target calorie for that meal
2. **Budget Fit** - Within allocated budget for that meal
3. **Diet Preference** - Respects veg/non-veg/both preferences
4. **Randomization** - For "both" option, 50-50 chance veg/non-veg for variety

### 6. **Personalized Meal Plan Generation**
Daily calorie distribution:
- **Breakfast** - 25% of total calories
- **Lunch** - 35% of total calories (heaviest meal)
- **Dinner** - 30% of total calories
- **Snack** - 7% of total calories
- **Drink** - 3% of total calories

Budget distribution:
- **Breakfast** - 20% of budget
- **Lunch** - 35% of budget
- **Dinner** - 30% of budget
- **Snack** - 10% of budget
- **Drink** - 5% of budget

---

## 📊 Results Display

### Individual Meal Cards
Each meal shows:
- Meal name (Breakfast, Lunch, etc.)
- Selected food name
- Veg/Non-Veg badge with emoji
- **Quantity to consume**
- Protein, Carbs, Fats, Fiber breakdown
- Calories and Price

### Daily Nutritional Summary
Shows totals with recommendations:
- **Total Calories** vs Target Calories
- **Total Protein** (50-60g recommended)
- **Total Carbs** (200-300g recommended)
- **Total Fats** (50-70g recommended)
- **Total Fiber** (25-35g recommended)
- **Total Cost** vs Budget with status

---

## 🛠️ Technology Stack

### Frontend
- **React** - UI library for interactive components
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **shadcn/ui** - Pre-built accessible components

### Build & Deployment
- **Vite** - Fast build tool and dev server
- **Netlify** - Cloud deployment platform
- **Git/GitHub** - Version control

### Key Libraries
- **Lucide React** - Icon library
- **Radix UI** - Accessible component primitives

---

## 🎯 How It Works - Step by Step

### Step 1: User Input
User fills form with:
- Personal metrics (age, weight, height, sex)
- Activity level
- Fitness goal
- Diet preference
- Daily budget

### Step 2: Calculations
App calculates:
- BMI status
- BMR (basal metabolic rate)
- Target daily calories based on goal
- Calorie distribution for each meal
- Budget allocation for each meal

### Step 3: Meal Selection
For each meal (breakfast, lunch, dinner, snack, drink):
1. Filter foods by diet preference
2. Sort by calorie match + budget fit
3. Select best matching food item
4. Calculate total nutrition

### Step 4: Results Generation
Creates personalized plan with:
- 5 meal suggestions
- Individual nutrition breakdown
- Daily totals
- Budget comparison
- Visual status indicators

---

## 💡 Key Innovations

### 1. **Budget-Aware Planning**
- Respects user's daily budget constraint
- Distributes budget across meals intelligently
- Shows total cost vs budget

### 2. **Nutritional Balance**
- Includes all macro nutrients
- Shows recommendations for each nutrient
- Helps users understand nutritional needs

### 3. **Cultural Relevance**
- 180+ Indian foods specifically
- Vegetarian-friendly
- Non-vegetarian options
- Regional variety (South Indian, North Indian, etc.)
- Realistic Indian pricing

### 4. **Flexibility**
- 3 diet preference options (veg, non-veg, both)
- 5 activity levels
- 3 fitness goals
- Randomization for variety in future plans

### 5. **User-Friendly UI**
- Clean, modern design
- Professional branding (Nourish India logo)
- Smooth animations
- Clear visual hierarchy
- Easy to understand results

---

## 📈 Real-World Use Cases

### Case 1: Weight Loss on Budget
- Goal: Lose weight
- Budget: ₹500/day
- Preference: Vegetarian
- App generates low-calorie, affordable veg meals

### Case 2: Muscle Gain with Variety
- Goal: Gain weight
- Budget: ₹1000/day
- Preference: Both
- App includes protein-rich non-veg options
- High calorie meals included

### Case 3: Maintenance with Health
- Goal: Maintain weight
- Budget: ₹700/day
- Preference: Non-veg
- Balanced meals with healthy options
- Consistent calories

---

## 🌟 Unique Selling Points

1. **Holistic Approach** - Combines health metrics + budget + preference
2. **Indian Focus** - Authentic Indian foods, not generic
3. **Complete Nutrition** - All macro nutrients included, not just calories
4. **Educational** - Users learn about BMI, BMR, nutrition
5. **Practical** - Includes prices, quantities, realistic servings
6. **Beautiful** - Professional design with smooth animations
7. **Smart Algorithm** - Intelligent food selection based on multiple factors

---

## 📱 User Flow

```
START
  ↓
[Input Personal Data & Preferences]
  ↓
[Calculate BMI, BMR, Target Calories]
  ↓
[Allocate Calories & Budget to Meals]
  ↓
[Select Best Food for Each Meal]
  ↓
[Calculate Totals & Macros]
  ↓
[Display Beautiful Results]
  ↓
[Option to Create New Plan]
  ↓
END
```

---

## 📊 Data Insights

### Food Database Structure
```
Breakfast: 30 items (20 veg, 10 non-veg)
Lunch: 34 items (23 veg, 11 non-veg)
Dinner: 20 items (15 veg, 10 non-veg) - Light options
Snacks: 38 items (25 veg, 5 non-veg)
Drinks: 20 items (all veg)
─────────────────────────────
TOTAL: 180+ items
```

### Calorie Range
- **Breakfast**: 180-450 calories
- **Lunch**: 320-600 calories
- **Dinner**: 280-580 calories (lighter than lunch)
- **Snacks**: 45-280 calories
- **Drinks**: 0-220 calories

### Budget Range
- Vegetarian meals: ₹20-120
- Non-Vegetarian meals: ₹28-220
- Drinks: ₹0-60

---

## 🎨 Design Highlights

### Logo
- **Nourish India** with green star design
- Symbolizes nutrition, health, and wellness
- Professional and modern appearance

### Color Scheme
- **Primary Green (#10b981)** - Health, trust, growth
- **Dark Green (#059669)** - Strength and vitality
- **White Background** - Clean, professional

### Animations
- Smooth transitions on page load
- Interactive button effects
- Staggered card animations
- Motion provides visual feedback

---

## 🔧 Technical Implementation

### Calculations Used
1. **BMI Formula**: weight / (height²)
2. **BMR Formula**: Mifflin-St Jeor equation
3. **TDEE**: BMR × Activity Factor
4. **Goal Adjustment**: ±500 calories for weight change
5. **Sorting Algorithm**: Multi-criteria (calorie match + budget fit)
6. **Randomization**: 50-50 veg/non-veg for "both" preference

### Smart Features
- Type-safe with TypeScript
- Responsive design (mobile & desktop)
- Real-time form validation
- Error handling for edge cases
- Efficient state management with React hooks

---

## 💻 Deployment

### Local Development
- Run: `npm run dev`
- Access: `http://localhost:8080/`
- Hot reload enabled

### Production
- Platform: Netlify
- Build: `npm run build`
- Deployment: Automatic from GitHub

### Repository
- GitHub: `lalith671/Diet_planner-`
- Branch: main
- Latest commit includes logo and all features

---

## 🎓 Learning Outcomes

Users learn:
1. Their personal health metrics (BMI, BMR)
2. Daily calorie requirements
3. Macro nutrient importance
4. Budget-conscious meal planning
5. Nutritional composition of foods
6. Importance of balanced diet

---

## 🚀 Future Enhancements

Potential features:
1. **Weekly Meal Plans** - 7-day customized plans
2. **Shopping List** - Auto-generated from meal plan
3. **Recipe Integration** - Cooking instructions for each meal
4. **Fitness Tracking** - Progress monitoring
5. **Multi-Language** - Support for regional languages
6. **User Accounts** - Save favorite plans
7. **Dietary Restrictions** - Allergies, Jain, etc.
8. **Restaurant Integration** - Order recommendations

---

## ✅ Summary

**Nourish India Diet Planner** is a comprehensive, user-friendly application that combines:
- ✅ Health science (BMI, BMR calculations)
- ✅ Nutritional knowledge (complete macro breakdown)
- ✅ Budget awareness (realistic Indian pricing)
- ✅ Cultural relevance (180+ Indian foods)
- ✅ Modern technology (React, TypeScript, Tailwind)
- ✅ Beautiful design (professional branding & animations)
- ✅ Smart algorithms (intelligent food selection)

Perfect for anyone looking to:
- 🎯 Achieve fitness goals
- 💰 Plan meals within budget
- 🥘 Enjoy authentic Indian cuisine
- 📊 Understand nutritional needs
- 🌟 Make healthy lifestyle choices

---

## 📞 Contact & Support

- **Repository**: https://github.com/lalith671/Diet_planner-
- **Live Demo**: https://your-netlify-domain.netlify.app/
- **Developer**: [Your Name]

---

**Thank you for using Nourish India Diet Planner! 🌟**
