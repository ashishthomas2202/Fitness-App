// import React from "react";

// export default function HomePage() {
//    return <div>Home Page</div>;
//  }
import React from "react";
import CalorieCalculator from "@/components/ui/CalorieCalculator";
import { getSession } from "next-auth/react";

export default async function HomePage() {
  let user = null;

  const session = await getSession();
  if (session) {
    const res = await fetch(`/api/userdata?email=${session.user.email}`);
    const userData = await res.json();
    user = userData;
  }

  return (
    <main>
      <h1>Welcome to the Calorie Calculator</h1>
      <CalorieCalculator user={user} />
    </main>
  );
}
