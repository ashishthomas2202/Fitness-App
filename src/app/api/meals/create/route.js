import Meal from "@/db/models/Meal";
import * as Yup from "yup";

// Define the Yup validation schema
const mealSchema = Yup.object().shape({
  name: Yup.string().required("Meal name is required"),
  category: Yup.string().required("Category is required"),
  macros: Yup.object().shape({
    protein: Yup.number().required("Protein amount is required"),
    carbs: Yup.number().required("Carbohydrate amount is required"),
    fat: Yup.number().required("Fat amount is required"),
  }).required(),
  calories: Yup.number().required("Calories are required"),
  ingredients: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Ingredient name is required"),
        amount: Yup.string().required("Ingredient amount is required"),
      })
    )
    .min(1, "At least one ingredient is required"),
  preparation_time_min: Yup.number().required("Preparation time is required"),
});

export async function POST(req) {
  try {
    // Parse the request body
    const jsonData = await req.json();

    // Validate the meal data using Yup
    const { isValid, validatedData, errors } = await validateMealData(jsonData);

    if (!isValid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Validation failed",
          errors,
        }),
        { status: 400 }
      );
    }

    console.log("Validated Data: ", validatedData); // Debugging step

    // Destructure the validated fields from the body
    const { name, category, macros, calories, ingredients, preparation_time_min } = validatedData;

    // Flatten the ingredients array into string format (e.g., "Chicken: 1 lb")
    const formattedIngredients = ingredients.map(ing => `${ing.name}: ${ing.amount}`);

    // Create a new meal document with flattened ingredients
    const newMeal = new Meal({
      name,
      category,
      macros,
      calories,
      ingredients: formattedIngredients, // Store flattened ingredients as array of strings
      preparation_time_min,
    });

    console.log("Final data before saving to MongoDB: ", newMeal); // Debugging step

    // Save the meal to the database
    await newMeal.save();

    // Return a success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Meal added successfully",
        data: newMeal,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding meal: ", error); // Debugging step
    // Handle any errors that occur during the request
    return new Response(
      JSON.stringify({
        success: false,
        message: "An unexpected error occurred.",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

async function validateMealData(data) {
  try {
    const validatedData = await mealSchema.validate(data, {
      abortEarly: false,
    });
    return { isValid: true, validatedData, errors: null };
  } catch (error) {
    return { isValid: false, errors: error.errors };
  }
}
