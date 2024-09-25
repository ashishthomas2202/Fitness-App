"use client";

import { useState, useEffect } from "react";

export default function CalorieCalculator({ user }) {
  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    heightFeet: "",
    heightInches: "",
    weightLbs: "",
    activityLevel: "sedentary",
    goal: "maintain",
    unit: "imperial",
    formula: "mifflin",
  });

  const [errors, setErrors] = useState({});
  const [calories, setCalories] = useState(null); // Store calculated calories
  const [weightRecommendation, setWeightRecommendation] = useState(""); // Store weight recommendation
  const [bmi, setBmi] = useState(null); // Store BMI value
  const [calorieGoals, setCalorieGoals] = useState({}); // Store various calorie goals

  // Populate form if the user is logged in
  useEffect(() => {
    if (user) {
      setFormData({
        age: user.age,
        gender: user.gender || "male",
        weightLbs: user.weight, // assuming weight is stored in lbs in user data
        activityLevel: user.activityLevel,
        goal: "maintain",
        unit: "imperial", // keeping it imperial since user enters height in feet/inches
      });
    }
  }, [user]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form data
  const validateForm = () => {
    let errors = {};

    // Validate age (15-80)
    if (!formData.age || formData.age < 15 || formData.age > 80) {
      errors.age = "Age must be between 15 and 80.";
    }

    // Validate height
    if (!formData.heightFeet || formData.heightFeet <= 0) {
      errors.heightFeet = "Feet must be a positive number.";
    }
    if (!formData.heightInches || formData.heightInches < 0) {
      errors.heightInches = " Inches must be zero or positive.";
    }

    // Validate weight
    if (!formData.weightLbs || formData.weightLbs <= 0) {
      errors.weightLbs = "Weight in pounds must be a positive number.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateCalories = () => {
    if (!validateForm()) return;

    const {
      age,
      heightFeet,
      heightInches,
      weightLbs,
      activityLevel,
      goal,
      gender,
    } = formData;

    // Convert height to cm and weight to kg
    const heightCm =
      parseFloat(heightFeet) * 30.48 + parseFloat(heightInches) * 2.54;
    const weightKg = parseFloat(weightLbs) * 0.453592;

    let bmr = 0;

    // Mifflin-St Jeor Formula
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    // Activity Multiplier
    const activityMultiplier = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
    }[activityLevel];

    const maintenanceCalories = bmr * activityMultiplier;

    // Adjust for goal (deficit or surplus)
    const calorieAdjustment =
      goal === "deficit" ? -500 : goal === "surplus" ? 500 : 0;

    const totalCalories = Math.round(maintenanceCalories + calorieAdjustment);
    setCalories(totalCalories); // Update calories state

    // Calculate BMI
    const bmiValue = weightKg / (heightCm / 100) ** 2;
    setBmi(bmiValue);

    // Weight Recommendation Logic
    if (bmiValue < 18.5) {
      // Underweight
      setWeightRecommendation(
        "You are classified as underweight. It's advisable to gain weight for better health."
      );
    } else if (bmiValue >= 30) {
      // Obesity
      if (goal === "maintain") {
        setWeightRecommendation(
          "You are classified as obese. It's advisable to lose weight for better health."
        );
      } else if (goal === "deficit") {
        setWeightRecommendation("You need to lose weight.");
      } else if (goal === "surplus") {
        setWeightRecommendation("You probably don't need to gain weight.");
      }
    } else if (bmiValue >= 25) {
      // Overweight
      if (goal === "maintain") {
        setWeightRecommendation(
          "You are classified as overweight. It's advisable to lose weight for better health."
        );
      } else if (goal === "deficit") {
        setWeightRecommendation("You need to lose weight.");
      } else if (goal === "surplus") {
        setWeightRecommendation("You probably don't need to gain weight.");
      }
    } else {
      // Normal weight
      if (goal === "surplus") {
        setWeightRecommendation("You probably don't need to gain weight.");
      } else {
        setWeightRecommendation(
          "You are in a healthy weight range. Maintain your current weight."
        );
      }
    }

    // Calorie Goals
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
            disabled={!!user}
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
          <label>Height:</label>
          <input
            type="number"
            name="heightFeet"
            placeholder="Feet"
            value={formData.heightFeet}
            onChange={handleInputChange}
            min="0"
            style={{ color: "black" }}
          />
          <input
            type="number"
            name="heightInches"
            placeholder="Inches"
            value={formData.heightInches}
            onChange={handleInputChange}
            min="0"
            style={{ color: "black" }}
          />
          {errors.heightFeet && (
            <span style={{ color: "red" }}>{errors.heightFeet}</span>
          )}
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
            min="0"
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
            <option value="sedentary">Sedentary: little or no exercise</option>
            <option value="lightly_active">
              Lightly Active: 1-3 times/week
            </option>
            <option value="moderately_active">
              Moderately Active: 4-5 times/week
            </option>
            <option value="very_active">
              Very Active: intense exercise 6-7 times/week
            </option>
            <option value="extra_active">
              Extra Active: very intense exercise daily, or physical job
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
            <option value="maintain">Maintain</option>
            <option value="deficit">Lose Weight</option>
            <option value="surplus">Gain Weight</option>
          </select>
        </div>

        <button type="button" onClick={calculateCalories}>
          Calculate Calories
        </button>
      </form>
      <p>
        Daily Caloric Needs: {calories !== null ? calories : "N/A"} calories
      </p>
      {weightRecommendation && <p>{weightRecommendation}</p>}
      {calories !== null && (
        <div>
          <h3>Caloric Goals:</h3>
          <ul>
            <li>Maintain weight: {calorieGoals.maintain} calories/day</li>
            <li>
              Mild weight loss (0.5 lb/week): {calorieGoals.mild_weight_loss}{" "}
              calories/day
            </li>
            <li>
              Moderate weight loss (1 lb/week):{" "}
              {calorieGoals.moderate_weight_loss} calories/day
            </li>
            <li>
              Extreme weight loss (2 lb/week):{" "}
              {calorieGoals.extreme_weight_loss} calories/day
            </li>
          </ul>
        </div>
      )}
      <p>Your BMI: {bmi !== null ? bmi.toFixed(2) : "N/A"}</p>
    </div>
  );
}
