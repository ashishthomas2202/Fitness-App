import dbConnect from '@/lib/dbConnect';
import MealPlan from '@/models/MealPlan';

export default async function handler(req, res) {
  const { method, query } = req;
  await dbConnect();

  if (method === 'GET') {
    try {
      const today = new Date().toISOString().split('T')[0];
      const mealPlans = await MealPlan.find({ userId: query.userId, date: today });
      const totalCalories = mealPlans.reduce((sum, meal) => sum + meal.calories, 0);
      res.status(200).json({ success: true, data: totalCalories });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(400).json({ success: false });
  }
}
