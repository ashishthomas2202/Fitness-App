import { db } from '@/lib/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import * as Yup from 'yup';

// Define the validation schema using Yup
const mealSchema = Yup.object().shape({
    name: Yup.string().required('Meal name is required'),
    category: Yup.string().required('Category is required'),
    macros: Yup.object().shape({
        protein: Yup.number().required('Protein amount is required'),
        carbs: Yup.number().required('Carbohydrate amount is required'),
        fat: Yup.number().required('Fat amount is required'),
    }),
    calories: Yup.number().required('Calories are required'),
    ingredients: Yup.array().of(Yup.string()).required('Ingredients are required'),
    preparation_time_min: Yup.number().required('Preparation time is required'),
});

export async function POST(request) {
    try {
        const body = await request.json();

        // Validate request body using Yup
        await mealSchema.validate(body);

        // Add the meal to Firestore
        const mealRef = collection(db, 'meals');
        const newMeal = {
            ...body,
            createdAt: new Date().toISOString(),
        };

        const docRef = await addDoc(mealRef, newMeal);

        return new Response(
            JSON.stringify({ success: true, data: { id: docRef.id, ...newMeal } }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error creating meal:', error);
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}
