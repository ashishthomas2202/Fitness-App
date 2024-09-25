"use client";
import { useSession } from "next-auth/react";
import { useEffect, useLayoutEffect, useState } from "react";
import { UserProfileForm } from "@/components/form/UserProfileForm";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { first, last } from "lodash";

const UserProfile = () => {
  const { data: session } = useSession();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const fetchProfile = async () => {

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       if (session?.user?.uid) {
  //         const response = await fetch(`/api/profile/get-profile`, {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           //body: JSON.stringify({ user: { uid: session.user.uid } }),
  //         });
  //         const data = await response.json();

  //         if (response.ok) {
  //           setProfile(data.profile);
  //         } else {
  //           setError(data.error || "Failed to fetch profile");
  //         }
  //       } else {
  //         setError("No UID found in session");
  //       }
  //     } catch (err) {
  //       setError("Failed to fetch profile");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (session?.user?.uid) {
  //     fetchProfile();
  //   }
  // }, [session?.user?.uid]);

  // if (status === "loading") return <p>Loading...</p>;
  // if (!session) return <p>Please sign in to view your profile</p>;

  // if (loading) return <p>Loading profile...</p>;
  // if (error) return <p>Error: {error}</p>;

  // return profile ? (
  //   <UserProfileForm profile={profile} session={session} />
  // ) : (
  //   <p>No profile data found</p>
  // );

  // console.log("session", session?.user);

  const fetchProfile = async () => {
    setLoading(true);
    await axios
      .get(`/api/profile/get-profile`)
      .then((response) => {
        if (response?.data?.success) {
          setProfile(response?.data?.data);
        } else {
          setProfile(null);
        }
      })
      .catch((error) => {
        setError(error?.response?.data?.message || "Failed to fetch profile");
      });
    setLoading(false);
  };

  // useEffect(() => {
  //   if (session?.user?.id) {
  //     fetchProfile();
  //   }
  // }, [session]);

  useLayoutEffect(() => {
    fetchProfile();
  }, []);

  return (
    <section className="max-w-screen-sm mx-auto bg-gray-50 dark:bg-slate-800 shadow-md p-2 rounded-xl my-10">
      <h1 className="text-2xl font-bold text-center my-4">User Profile</h1>
      {loading ? (
        <Loader2 className="w-16 h-16 animate-spin mx-auto my-20" />
      ) : (
        <UserProfileForm
          profile={{
            ...(profile || {}),
            firstName: session?.user?.firstName || "",
            lastName: session?.user?.lastName || "",
          }}
        />
      )}
    </section>
  );
  // return <>Profile Page</>;
};

export default UserProfile;
