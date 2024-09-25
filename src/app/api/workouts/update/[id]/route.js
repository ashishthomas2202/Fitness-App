import * as Yup from 'yup';
import { db } from '../../../../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function PUT(request, { params }) {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({
      success: false,
      message: "Workout ID is required",
      error: "Missing workout ID"
    }), { status: 400 });
  }

  // Define Yup validation schema
  const updateWorkoutSchema = Yup.object().shape({
    name: Yup.string(),
    type: Yup.array().of(Yup.string()),
    category: Yup.array().of(Yup.string()),
    muscle_groups: Yup.array().of(Yup.string()),
    difficulty_level: Yup.string(),
    equipment: Yup.array().of(Yup.string()),
    duration_min: Yup.number().positive(),
    calories_burned_per_min: Yup.number().positive(),
  });

  const body = await request.json();

  try {
    // Validate the request body
    await updateWorkoutSchema.validate(body);
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "Invalid workout data",
      error: error.errors
    }), { status: 400 });
  }

  try {
    // Find the workout in Firestore
    const workoutRef = doc(db, 'workouts', id);
    const workoutDoc = await getDoc(workoutRef);

    if (!workoutDoc.exists()) {
      return new Response(JSON.stringify({
        success: false,
        message: "Workout not found",
        error: "No workout found with the provided ID"
      }), { status: 404 });
    }

    // Update workout with validated data
    await updateDoc(workoutRef, body);

    const updatedWorkout = (await getDoc(workoutRef)).data();

    return new Response(JSON.stringify({
      success: true,
      data: updatedWorkout
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to update workout in the database",
      error: error.message
    }), { status: 500 });
  }
}
