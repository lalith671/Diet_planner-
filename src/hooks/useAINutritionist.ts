import { useState, useEffect, useRef, useCallback } from 'react';

interface UserData {
  age: number;
  sex: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: string;
  goal: 'lose' | 'maintain' | 'gain';
  dietPreference: 'veg' | 'nonveg' | 'both';
  budget: number;
}

interface MealPlan {
  breakfast: any;
  lunch: any;
  dinner: any;
  snack: any;
  drink: any;
}

interface NutritionData {
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

interface ConversationState {
  phase: 'greeting' | 'assessment' | 'analysis' | 'recommendation' | 'followup';
  messages: Array<{
    speaker: 'ai' | 'user';
    text: string;
    timestamp: Date;
  }>;
  currentTopic: string;
  analysisResults: any;
}

export const useAINutritionist = (userData: UserData, nutritionData: NutritionData) => {
  const [conversationState, setConversationState] = useState<ConversationState>({
    phase: 'greeting',
    messages: [],
    currentTopic: '',
    analysisResults: null
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }

    // Start conversation with greeting
    generateGreeting();
  }, []);

  const generateGreeting = useCallback(() => {
    const greetingMessages = {
      lose: [
        "Hello! I'm excited to help you on your weight loss journey. We'll create a plan that helps you lose weight while preserving muscle and feeling energized!",
        "Welcome! Let's design a sustainable weight loss plan that fits your lifestyle and helps you reach your goals healthily.",
        "Hi there! I'm here to support your weight loss goals with a personalized nutrition plan that makes you feel great!"
      ],
      maintain: [
        "Hello! Let's work together to optimize your nutrition for peak performance and maintaining your healthy weight.",
        "Welcome! We'll create the perfect nutrition plan to help you maintain your current weight while maximizing your health and energy.",
        "Hi! I'm here to help you fine-tune your nutrition for optimal health maintenance."
      ],
      gain: [
        "Hello! I'm excited to help you with healthy weight gain, focusing on lean muscle development and proper nutrition.",
        "Welcome! Let's create a nutrition plan that supports healthy weight gain and muscle building effectively.",
        "Hi there! We'll design the perfect plan to help you gain weight in a healthy, sustainable way."
      ]
    };

    const messages = greetingMessages[userData.goal] || greetingMessages.maintain;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    addAIMessage(randomMessage);
    speakText(randomMessage);
  }, [userData.goal]);

  const addAIMessage = useCallback((text: string) => {
    setConversationState(prev => ({
      ...prev,
      messages: [...prev.messages, {
        speaker: 'ai',
        text,
        timestamp: new Date()
      }]
    }));
    setCurrentMessage(text);
  }, []);

  const addUserMessage = useCallback((text: string) => {
    setConversationState(prev => ({
      ...prev,
      messages: [...prev.messages, {
        speaker: 'user',
        text,
        timestamp: new Date()
      }]
    }));
  }, []);

  const speakText = useCallback((text: string) => {
    if (!speechSynthesisRef.current) return;

    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesisRef.current.speak(utterance);
  }, []);

  const analyzeUserInput = useCallback((input: string) => {
    const lowerInput = input.toLowerCase();

    addUserMessage(input);

    // Phase-based responses
    switch (conversationState.phase) {
      case 'greeting':
        handleGreetingPhase(lowerInput);
        break;
      case 'assessment':
        handleAssessmentPhase(lowerInput);
        break;
      case 'analysis':
        handleAnalysisPhase(lowerInput);
        break;
      case 'recommendation':
        handleRecommendationPhase(lowerInput);
        break;
      case 'followup':
        handleFollowupPhase(lowerInput);
        break;
    }
  }, [conversationState.phase, addUserMessage]);

  const handleGreetingPhase = (input: string) => {
    setConversationState(prev => ({ ...prev, phase: 'assessment' }));

    if (input.includes('ready') || input.includes('start') || input.includes('begin')) {
      const message = "Perfect! Let me analyze your current nutrition profile. Based on your data, I can see you have specific goals. Let me examine your BMI, BMR, and create personalized recommendations.";
      addAIMessage(message);
      speakText(message);

      setTimeout(() => {
        performNutritionalAnalysis();
      }, 2000);
    } else {
      const message = "Great! I'm ready to help you. Would you like me to analyze your current nutrition profile and create personalized recommendations?";
      addAIMessage(message);
      speakText(message);
    }
  };

  const handleAssessmentPhase = (input: string) => {
    if (input.includes('analyze') || input.includes('profile') || input.includes('nutrition')) {
      performNutritionalAnalysis();
    } else {
      const message = "I'd love to help you with that! Could you tell me more about what specific aspects of your nutrition you'd like me to focus on?";
      addAIMessage(message);
      speakText(message);
    }
  };

  const handleAnalysisPhase = (input: string) => {
    setConversationState(prev => ({ ...prev, phase: 'recommendation' }));

    const message = "Excellent! Based on my analysis, I have some personalized recommendations for you. I'll show you your optimized meal plan and explain how it meets your specific goals.";
    addAIMessage(message);
    speakText(message);

    setTimeout(() => {
      generateRecommendations();
    }, 1500);
  };

  const handleRecommendationPhase = (input: string) => {
    setConversationState(prev => ({ ...prev, phase: 'followup' }));

    if (input.includes('good') || input.includes('great') || input.includes('perfect')) {
      const message = "I'm so glad you like the plan! Remember to track your progress and feel free to ask me any questions as you follow your nutrition journey.";
      addAIMessage(message);
      speakText(message);
    } else if (input.includes('question') || input.includes('confused') || input.includes('help')) {
      const message = "I'm here to help! What specific questions do you have about your nutrition plan? I can explain the reasoning behind any recommendation.";
      addAIMessage(message);
      speakText(message);
    } else {
      const message = "I understand you might have questions. Feel free to ask me anything about your nutrition plan, and I'll be happy to explain in detail.";
      addAIMessage(message);
      speakText(message);
    }
  };

  const handleFollowupPhase = (input: string) => {
    if (input.includes('thank') || input.includes('thanks')) {
      const message = "You're very welcome! Remember, I'm always here to help you on your nutrition journey. Check in anytime for updates or questions!";
      addAIMessage(message);
      speakText(message);
    } else {
      const message = "I'm here to support you! Would you like me to adjust anything in your plan or do you have other questions about your nutrition?";
      addAIMessage(message);
      speakText(message);
    }
  };

  const performNutritionalAnalysis = useCallback(() => {
    const bmi = nutritionData.bmi;
    const bmr = nutritionData.bmr;
    const calories = nutritionData.targetCalories;

    let bmiCategory = '';
    let bmiRecommendation = '';

    if (bmi < 18.5) {
      bmiCategory = 'underweight';
      bmiRecommendation = 'Your BMI indicates you\'re underweight. We\'ll focus on healthy weight gain with nutrient-dense foods.';
    } else if (bmi >= 18.5 && bmi < 25) {
      bmiCategory = 'healthy';
      bmiRecommendation = 'Your BMI is in the healthy range! We\'ll focus on optimal nutrition for health maintenance.';
    } else if (bmi >= 25 && bmi < 30) {
      bmiCategory = 'overweight';
      bmiRecommendation = 'Your BMI indicates you\'re slightly overweight. We\'ll create a plan for healthy weight loss.';
    } else {
      bmiCategory = 'obese';
      bmiRecommendation = 'Your BMI suggests we should focus on a structured weight loss plan with proper nutrition.';
    }

    const analysisMessage = `
      Analysis complete! Your BMI is ${bmi.toFixed(1)}, which falls into the ${bmiCategory} category.
      Your BMR is ${bmr} calories, and with your activity level, your target is ${calories} calories daily.
      ${bmiRecommendation}
    `;

    addAIMessage(analysisMessage);
    speakText(analysisMessage);

    setConversationState(prev => ({
      ...prev,
      phase: 'analysis',
      analysisResults: {
        bmiCategory,
        bmiRecommendation,
        analysisComplete: true
      }
    }));
  }, [nutritionData, addAIMessage, speakText]);

  const generateRecommendations = useCallback(() => {
    const recommendations = generatePersonalizedRecommendations(userData, nutritionData);

    let message = "Here are your personalized recommendations:\n\n";

    recommendations.forEach((rec, index) => {
      message += `${index + 1}. ${rec.title}\n${rec.description}\n\n`;
    });

    addAIMessage(message);
    speakText(message);

    setConversationState(prev => ({
      ...prev,
      currentTopic: 'recommendations'
    }));
  }, [userData, nutritionData, addAIMessage, speakText]);

  const generatePersonalizedRecommendations = (user: UserData, nutrition: NutritionData) => {
    const recommendations = [];

    // Budget optimization
    if (user.budget < 200) {
      recommendations.push({
        title: "Budget-Friendly Options",
        description: "I've selected affordable, nutritious foods that give you the best nutrition per rupee."
      });
    }

    // Goal-specific recommendations
    if (user.goal === 'lose') {
      recommendations.push({
        title: "Calorie Deficit Strategy",
        description: "Your plan creates a moderate calorie deficit while preserving muscle mass through adequate protein."
      });
    } else if (user.goal === 'gain') {
      recommendations.push({
        title: "Lean Mass Building",
        description: "I've increased protein intake and calories to support healthy weight gain and muscle development."
      });
    }

    // Activity level adjustments
    if (user.activityLevel === 'veryActive') {
      recommendations.push({
        title: "Performance Nutrition",
        description: "Your plan includes extra carbs and protein to fuel your active lifestyle and support recovery."
      });
    }

    // Diet preference considerations
    if (user.dietPreference === 'veg') {
      recommendations.push({
        title: "Complete Plant Proteins",
        description: "I've ensured your vegetarian meals provide complete amino acid profiles through complementary protein sources."
      });
    }

    return recommendations;
  };

  const stopSpeaking = useCallback(() => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const toggleSpeech = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(currentMessage);
    }
  }, [isSpeaking, currentMessage, speakText, stopSpeaking]);

  return {
    conversationState,
    currentMessage,
    isSpeaking,
    analyzeUserInput,
    speakText,
    stopSpeaking,
    toggleSpeech,
    performAnalysis: performNutritionalAnalysis,
    generateRecommendations
  };
};