"use client";
import { useContext } from "react";
import { UserProfileForm } from "@/components/form/UserProfileForm";
import { Loader2 } from "lucide-react";
import { ProfileContext } from "@/providers/ProfileProvider";

const UserProfile = () => {
  const { profile, loading } = useContext(ProfileContext); // Get profile and loading from context

  return (
    <section className="max-w-screen-sm mx-auto bg-gray-50 dark:bg-neutral-900 shadow-md p-2 rounded-xl my-10">
      <h1 className="text-2xl font-bold text-center my-4">User Profile</h1>
      {loading ? (
        <Loader2 className="w-16 h-16 animate-spin mx-auto my-20" />
      ) : (
        <UserProfileForm profile={profile} />
      )}
    </section>
  );
};

export default UserProfile;
