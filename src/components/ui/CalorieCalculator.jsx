// //CalorieCalculator.jsx
// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";

// // Helper function to calculate age from DOB
// const calculateAge = (dob) => {
//   const today = new Date();
//   const birthDate = new Date(dob);
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();

//   if (
//     monthDiff < 0 ||
//     (monthDiff === 0 && today.getDate() < birthDate.getDate())
//   ) {
//     age--;
//   }
//   return age;
// };

// export default function CalorieCalculator() {
//   const [formData, setFormData] = useState({
//     age: "",
//     gender: "male",
//     heightInches: "",
//     weightLbs: "",
//     activityLevel: "sedentary",
//     goal: "maintain",
//     unit: "imperial",
//     formula: "mifflin",
//   });

//   const [errors, setErrors] = useState({});
//   const [calories, setCalories] = useState(null);
//   const [weightRecommendation, setWeightRecommendation] = useState("");
//   const [bmi, setBmi] = useState(null);
//   const [calorieGoals, setCalorieGoals] = useState({});

//   // Fetch profile data using axios
//   const fetchProfile = async () => {
//     try {
//       const response = await axios.get("/api/profile/get-profile");
//       console.log("Profile API response:", response); // Log the full response

//       const result = response.data;
//       console.log("Profile data:", result); // Log the result data

//       if (result.success && result.data) {
//         const { height, weight, dob, gender, activityLevel } = result.data;

//         setFormData({
//           age: calculateAge(dob),
//           gender: gender || "male",
//           heightInches: height,
//           weightLbs: weight,
//           activityLevel: activityLevel || "sedentary",
//           goal: "maintain",
//           unit: "imperial",
//           formula: "mifflin",
//         });
//       } else {
//         console.error("Failed to fetch profile:", result.message);
//       }
//     } catch (error) {
//       console.error("Error fetching profile with axios:", error);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const validateForm = () => {
//     let errors = {};

//     if (!formData.age || formData.age < 15 || formData.age > 80) {
//       errors.age = "Age must be between 15 and 80.";
//     }

//     if (!formData.heightInches || formData.heightInches < 12) {
//       errors.heightInches = "Height must be at least 12 inches.";
//     }

//     if (!formData.weightLbs || formData.weightLbs <= 0) {
//       errors.weightLbs = "Weight in pounds must be a positive number.";
//     }

//     setErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const calculateCalories = () => {
//     if (!validateForm()) return;

//     const { age, heightInches, weightLbs, activityLevel, goal, gender } =
//       formData;

//     // Convert height to cm and weight to kg for BMR calculation
//     const heightCm = heightInches * 2.54; // 1 inch = 2.54 cm
//     const weightKg = parseFloat(weightLbs) * 0.453592; // 1 lb = 0.453592 kg

//     let bmr = 0;

//     // Mifflin-St Jeor Formula
//     if (gender === "male") {
//       bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
//     } else {
//       bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
//     }

//     const activityMultiplier = {
//       sedentary: 1.2,
//       lightly_active: 1.375,
//       moderately_active: 1.55,
//       very_active: 1.725,
//       extra_active: 1.9,
//     }[activityLevel];

//     const maintenanceCalories = bmr * activityMultiplier;

//     const calorieAdjustment =
//       goal === "deficit" ? -500 : goal === "surplus" ? 500 : 0;

//     const totalCalories = Math.round(maintenanceCalories + calorieAdjustment);
//     setCalories(totalCalories);

//     // Calculate BMI
//     const bmiValue = weightKg / (heightCm / 100) ** 2;
//     setBmi(bmiValue);

//     // Weight Recommendation Logic
//     if (bmiValue < 18.5) {
//       setWeightRecommendation(
//         "You are classified as underweight. It's advisable to gain weight for better health."
//       );
//     } else if (bmiValue >= 30) {
//       setWeightRecommendation(
//         "You are classified as obese. It's advisable to consider weight loss for improved health."
//       );
//     } else if (bmiValue >= 25) {
//       setWeightRecommendation(
//         "You are classified as overweight. Weight loss could be beneficial for your health."
//       );
//     } else {
//       setWeightRecommendation(
//         "You are in a healthy weight range. Maintain your current weight."
//       );
//     }

//     const calorieGoals = {
//       maintain: Math.round(maintenanceCalories),
//       mild_weight_loss: Math.round(maintenanceCalories - 250),
//       moderate_weight_loss: Math.round(maintenanceCalories - 500),
//       extreme_weight_loss: Math.round(maintenanceCalories - 1000),
//     };
//     setCalorieGoals(calorieGoals);
//   };

//   return (
//     <div>
//       <h2>Calorie Deficit Calculator</h2>
//       <form>
//         <div>
//           <label>Age:</label>
//           <input
//             type="number"
//             name="age"
//             value={formData.age}
//             onChange={handleInputChange}
//             min="15"
//             max="80"
//             style={{ color: "black" }}
//           />
//           {errors.age && <span style={{ color: "red" }}>{errors.age}</span>}
//         </div>
//         <div>
//           <label>Gender:</label>
//           <select
//             name="gender"
//             value={formData.gender}
//             onChange={handleInputChange}
//             style={{ color: "black" }}
//           >
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//           </select>
//         </div>
//         <div>
//           <label>Height (inches):</label>
//           <input
//             type="number"
//             name="heightInches"
//             placeholder="Inches"
//             value={formData.heightInches}
//             onChange={handleInputChange}
//             min="0"
//             style={{ color: "black" }}
//           />
//           {errors.heightInches && (
//             <span style={{ color: "red" }}>{errors.heightInches}</span>
//           )}
//         </div>
//         <div>
//           <label>Weight (lbs):</label>
//           <input
//             type="number"
//             name="weightLbs"
//             value={formData.weightLbs}
//             onChange={handleInputChange}
//             style={{ color: "black" }}
//           />
//           {errors.weightLbs && (
//             <span style={{ color: "red" }}>{errors.weightLbs}</span>
//           )}
//         </div>
//         <div>
//           <label>Activity Level:</label>
//           <select
//             name="activityLevel"
//             value={formData.activityLevel}
//             onChange={handleInputChange}
//             style={{ color: "black" }}
//           >
//             <option value="sedentary">Sedentary (Little or no exercise)</option>
//             <option value="lightly_active">
//               Lightly Active (Exercise 1-3 days per week)
//             </option>
//             <option value="moderately_active">
//               Moderately Active (Exercise 4-5 days per week)
//             </option>
//             <option value="very_active">
//               Very Active (Exercise 6-7 days per week)
//             </option>
//             <option value="extra_active">
//               Extra Active (Intense exercise daily)
//             </option>
//           </select>
//         </div>
//         <div>
//           <label>Goal:</label>
//           <select
//             name="goal"
//             value={formData.goal}
//             onChange={handleInputChange}
//             style={{ color: "black" }}
//           >
//             <option value="maintain">Maintain Weight</option>
//             <option value="deficit">Lose Weight (Deficit)</option>
//             <option value="surplus">Gain Weight (Surplus)</option>
//           </select>
//         </div>
//       </form>
//       <button onClick={calculateCalories}>Calculate</button>

//       {calories && (
//         <div>
//           <h3>Results:</h3>
//           <p>Estimated Daily Calorie Needs: {calories} Calories</p>
//           <p>BMI: {bmi.toFixed(2)}</p>
//           <p>{weightRecommendation}</p>

//           <h4>Calorie Goals:</h4>
//           <ul>
//             <li>
//               <strong>Maintain weight:</strong> {calorieGoals.maintain}{" "}
//               Calories/day
//             </li>
//             <li>
//               <strong>Mild weight loss (0.5 lb/week):</strong>{" "}
//               {calorieGoals.mild_weight_loss} Calories/day
//             </li>
//             <li>
//               <strong>Moderate weight loss (1 lb/week):</strong>{" "}
//               {calorieGoals.moderate_weight_loss} Calories/day
//             </li>
//             <li>
//               <strong>Extreme weight loss (2 lb/week):</strong>{" "}
//               {calorieGoals.extreme_weight_loss} Calories/day
//               {calorieGoals.extreme_weight_loss < 2000 && (
//                 <li style={{ color: "red", fontSize: "12px" }}>
//                   Please consult with a healthcare provider if you are
//                   considering losing 2 lbs or more per week, as this may require
//                   consuming fewer calories than recommended for your individual
//                   needs.
//                 </li>
//               )}
//             </li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      console.log("Profile API response:", response);

      const result = response.data;
      console.log("Profile data:", result);

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
      mild_weight_gain: Math.round(maintenanceCalories + 250),
      moderate_weight_gain: Math.round(maintenanceCalories + 500),
      fast_weight_gain: Math.round(maintenanceCalories + 1000),
    };
    setCalorieGoals(calorieGoals);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-black">
        Calorie Deficit Calculator
      </h2>
      <div className="mb-4">
        <Label htmlFor="age" className="text-black">
          Age:
        </Label>
        <Input
          id="age"
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          min="15"
          max="80"
          className="text-black mt-1 border border-gray-300 focus:border-black focus:ring-black"
        />
        {errors.age && <p className="text-red-500">{errors.age}</p>}
      </div>
      <div className="mb-4">
        <Label htmlFor="gender" className="text-black">
          Gender:
        </Label>
        <select
          name="gender"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="block w-full mt-1 border border-gray-300 rounded-md p-2 text-black focus:border-black focus:ring-black"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="mb-4">
        <Label htmlFor="heightInches" className="text-black">
          Height (inches):
        </Label>
        <Input
          id="heightInches"
          type="number"
          name="heightInches"
          placeholder="Inches"
          value={formData.heightInches}
          onChange={handleInputChange}
          min="0"
          className="text-black mt-1 border border-gray-300 focus:border-black focus:ring-black"
        />
        {errors.heightInches && (
          <p className="text-red-500">{errors.heightInches}</p>
        )}
      </div>
      <div className="mb-4">
        <Label htmlFor="weightLbs" className="text-black">
          Weight (lbs):
        </Label>
        <Input
          id="weightLbs"
          type="number"
          name="weightLbs"
          placeholder="Pounds"
          value={formData.weightLbs}
          onChange={handleInputChange}
          className="text-black mt-1 border border-gray-300 focus:border-black focus:ring-black"
        />
        {errors.weightLbs && <p className="text-red-500">{errors.weightLbs}</p>}
      </div>
      <div className="mb-4">
        <Label htmlFor="activityLevel" className="text-black">
          Activity Level:
        </Label>
        <select
          name="activityLevel"
          value={formData.activityLevel}
          onChange={(e) =>
            setFormData({ ...formData, activityLevel: e.target.value })
          }
          className="block w-full mt-1 border border-gray-300 rounded-md p-2 text-black focus:border-black focus:ring-black"
        >
          <option value="sedentary">Sedentary (Little or no exercise)</option>
          <option value="lightly_active">
            Lightly Active (Exercise 1-3 days/week)
          </option>
          <option value="moderately_active">
            Moderately Active (Exercise 4-5 days/week)
          </option>
          <option value="very_active">
            Very Active (Exercise 6-7 days/week)
          </option>
          <option value="extra_active">
            Extra Active (Intense exercise daily)
          </option>
        </select>
      </div>
      <div className="mb-4">
        <Label htmlFor="goal" className="text-black">
          Goal:
        </Label>
        <select
          name="goal"
          value={formData.goal}
          onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
          className="block w-full mt-1 border border-gray-300 rounded-md p-2 text-black focus:border-black focus:ring-black"
        >
          <option value="maintain">Maintain Weight</option>
          <option value="deficit">Lose Weight (Deficit)</option>
          <option value="surplus">Gain Weight (Surplus)</option>
        </select>
      </div>
      <Button
        onClick={calculateCalories}
        className="w-full bg-blue-600 text-white hover:bg-blue-700"
      >
        Calculate
      </Button>

      {calories && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-black">Results:</h3>
          <p className="mt-2 text-black">
            Estimated Daily Calorie Needs: <strong>{calories} Calories</strong>
          </p>
          <p className="text-black">
            BMI: <strong>{bmi?.toFixed(2)}</strong>
          </p>
          <p className="text-black">{weightRecommendation}</p>

          <h4 className="mt-4 font-semibold text-black">Calorie Goals:</h4>
          <ul className="list-disc list-inside text-black">
            <li>
              <strong>Maintain weight:</strong> {calorieGoals.maintain}{" "}
              Calories/day
            </li>
            <li>
              <strong>Mild weight gain (+0.5 lb/week):</strong>{" "}
              {calorieGoals.mild_weight_gain} Calories/day
            </li>
            <li>
              <strong>Moderate weight gain (+1 lb/week):</strong>{" "}
              {calorieGoals.moderate_weight_gain} Calories/day
            </li>
            <li>
              <strong>Extreme weight gain (+2 lb/week):</strong>{" "}
              {calorieGoals.fast_weight_gain} Calories/day
            </li>

            <li>
              <strong>Mild weight loss (-0.5 lb/week):</strong>{" "}
              {calorieGoals.mild_weight_loss} Calories/day
            </li>
            <li>
              <strong>Moderate weight loss (-1 lb/week):</strong>{" "}
              {calorieGoals.moderate_weight_loss} Calories/day
            </li>
            <li>
              <strong>Extreme weight loss (-2 lb/week):</strong>{" "}
              {calorieGoals.extreme_weight_loss} Calories/day
              {calorieGoals.extreme_weight_loss < 2000 && (
                <p className="text-red-500 mt-2">
                  Please consult with a healthcare provider if you are
                  considering losing 2 lbs or more per week, as this may require
                  consuming fewer calories than recommended for your individual
                  needs.
                </p>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
