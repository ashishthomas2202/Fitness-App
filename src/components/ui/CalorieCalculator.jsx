//CalorieCalculator.jsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// Helper function to calculate age from DOB
const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export default function CalorieCalculator() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    heightInches: "",
    weightLbs: "",
    activityLevel: "sedentary",
    goal: "maintain",
    unit: "imperial",
    formula: "mifflin",
  });

  const [errors, setErrors] = useState({});
  const [calories, setCalories] = useState(null);
  const [weightRecommendation, setWeightRecommendation] = useState("");
  const [bmi, setBmi] = useState(null);
  const [calorieGoals, setCalorieGoals] = useState({});

  // Fetch profile data using axios
  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/profile/get-profile");
      console.log("Profile API response:", response); // Log the full response

      const result = response.data;
      console.log("Profile data:", result); // Log the result data

      if (result.success && result.data) {
        const { height, weight, dob, gender, activityLevel } = result.data;

        setFormData({
          age: calculateAge(dob),
          gender: gender || "male",
          heightInches: height,
          weightLbs: weight,
          activityLevel: activityLevel || "sedentary",
          goal: "maintain",
          unit: "imperial",
          formula: "mifflin",
        });
      } else {
        console.error("Failed to fetch profile:", result.message);
      }
    } catch (error) {
      console.error("Error fetching profile with axios:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.age || formData.age < 15 || formData.age > 80) {
      errors.age = "Age must be between 15 and 80.";
    }

    if (!formData.heightInches || formData.heightInches < 12) {
      errors.heightInches = "Height must be at least 12 inches.";
    }

    if (!formData.weightLbs || formData.weightLbs <= 0) {
      errors.weightLbs = "Weight in pounds must be a positive number.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateCalories = () => {
    if (!validateForm()) return;

    const { age, heightInches, weightLbs, activityLevel, goal, gender } =
      formData;

    // Convert height to cm and weight to kg for BMR calculation
    const heightCm = heightInches * 2.54; // 1 inch = 2.54 cm
    const weightKg = parseFloat(weightLbs) * 0.453592; // 1 lb = 0.453592 kg

    let bmr = 0;

    // Mifflin-St Jeor Formula
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    const activityMultiplier = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
    }[activityLevel];

    const maintenanceCalories = bmr * activityMultiplier;

    const calorieAdjustment =
      goal === "deficit" ? -500 : goal === "surplus" ? 500 : 0;

    const totalCalories = Math.round(maintenanceCalories + calorieAdjustment);
    setCalories(totalCalories);

    // Calculate BMI
    const bmiValue = weightKg / (heightCm / 100) ** 2;
    setBmi(bmiValue);

    // Weight Recommendation Logic
    if (bmiValue < 18.5) {
      setWeightRecommendation(
        "You are classified as underweight. It's advisable to gain weight for better health."
      );
    } else if (bmiValue >= 30) {
      setWeightRecommendation(
        "You are classified as obese. It's advisable to consider weight loss for improved health."
      );
    } else if (bmiValue >= 25) {
      setWeightRecommendation(
        "You are classified as overweight. Weight loss could be beneficial for your health."
      );
    } else {
      setWeightRecommendation(
        "You are in a healthy weight range. Maintain your current weight."
      );
    }

    const calorieGoals = {
      maintain: Math.round(maintenanceCalories),
      mild_weight_loss: Math.round(maintenanceCalories - 250),
      moderate_weight_loss: Math.round(maintenanceCalories - 500),
      extreme_weight_loss: Math.round(maintenanceCalories - 1000),
    };
    setCalorieGoals(calorieGoals);
  };

  return (
    <div>
      <h2>Calorie Deficit Calculator</h2>
      <form>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            min="15"
            max="80"
            style={{ color: "black" }}
          />
          {errors.age && <span style={{ color: "red" }}>{errors.age}</span>}
        </div>
        <div>
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            style={{ color: "black" }}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Height (inches):</label>
          <input
            type="number"
            name="heightInches"
            placeholder="Inches"
            value={formData.heightInches}
            onChange={handleInputChange}
            min="0"
            style={{ color: "black" }}
          />
          {errors.heightInches && (
            <span style={{ color: "red" }}>{errors.heightInches}</span>
          )}
        </div>
        <div>
          <label>Weight (lbs):</label>
          <input
            type="number"
            name="weightLbs"
            value={formData.weightLbs}
            onChange={handleInputChange}
            style={{ color: "black" }}
          />
          {errors.weightLbs && (
            <span style={{ color: "red" }}>{errors.weightLbs}</span>
          )}
        </div>
        <div>
          <label>Activity Level:</label>
          <select
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleInputChange}
            style={{ color: "black" }}
          >
            <option value="sedentary">Sedentary (Little or no exercise)</option>
            <option value="lightly_active">
              Lightly Active (Exercise 1-3 days per week)
            </option>
            <option value="moderately_active">
              Moderately Active (Exercise 4-5 days per week)
            </option>
            <option value="very_active">
              Very Active (Exercise 6-7 days per week)
            </option>
            <option value="extra_active">
              Extra Active (Intense exercise daily)
            </option>
          </select>
        </div>
        <div>
          <label>Goal:</label>
          <select
            name="goal"
            value={formData.goal}
            onChange={handleInputChange}
            style={{ color: "black" }}
          >
            <option value="maintain">Maintain Weight</option>
            <option value="deficit">Lose Weight (Deficit)</option>
            <option value="surplus">Gain Weight (Surplus)</option>
          </select>
        </div>
      </form>
      <button onClick={calculateCalories}>Calculate</button>

      {calories && (
        <div>
          <h3>Results:</h3>
          <p>Estimated Daily Calorie Needs: {calories} Calories</p>
          <p>BMI: {bmi.toFixed(2)}</p>
          <p>{weightRecommendation}</p>

          <h4>Calorie Goals:</h4>
          <ul>
            <li>
              <strong>Maintain weight:</strong> {calorieGoals.maintain}{" "}
              Calories/day
            </li>
            <li>
              <strong>Mild weight loss (0.5 lb/week):</strong>{" "}
              {calorieGoals.mild_weight_loss} Calories/day
            </li>
            <li>
              <strong>Moderate weight loss (1 lb/week):</strong>{" "}
              {calorieGoals.moderate_weight_loss} Calories/day
            </li>
            <li>
              <strong>Extreme weight loss (2 lb/week):</strong>{" "}
              {calorieGoals.extreme_weight_loss} Calories/day
              {calorieGoals.extreme_weight_loss < 1500 && (
                <li style={{ color: "red", fontSize: "12px" }}>
                  Please consult with a healthcare provider if you are
                  considering losing 2 lbs or more per week, as this may require
                  consuming fewer calories than recommended for your individual
                  needs.
                </li>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
