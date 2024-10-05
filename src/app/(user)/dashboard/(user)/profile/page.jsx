"use client";
import { useContext } from "react";
import { UserProfileForm } from "@/components/form/UserProfileForm";
import { Loader2 } from "lucide-react";
import { ProfileContext } from "@/providers/ProfileProvider";

const UserProfile = () => {
  const { profile, loading } = useContext(ProfileContext); // Get profile and loading from context

  return (
    <section className="max-w-screen-sm mx-auto bg-gray-50 dark:bg-slate-800 shadow-md p-2 rounded-xl my-10">
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

// "use client";
// import { useSession } from "next-auth/react";
// import { useEffect, useLayoutEffect, useState, useContext } from "react";
// import { UserProfileForm } from "@/components/form/UserProfileForm";
// import axios from "axios";
// import { Loader2 } from "lucide-react";
// import { ProfileContext } from "@/providers/ProfileProvider";

// const UserProfile = () => {
//   const { data: session } = useSession();

//   // const [profile, setProfile] = useState(null);
//   const { profile, getProfile } = useContext(ProfileContext);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // const fetchProfile = async () => {
//   //   await getProfile();
//   //   setLoading(false);
//   // };

//   // const fetchProfile = async () => {
//   //   setLoading(true);
//   //   await getProfile();
//   //   setLoading(false);
//   // };

//   // useLayoutEffect(() => {
//   //   fetchProfile();
//   // }, []);

//   useEffect(() => {
//     setLoading(false);
//   }, []);

//   return (
//     <section className="max-w-screen-sm mx-auto bg-gray-50 dark:bg-slate-800 shadow-md p-2 rounded-xl my-10">
//       <h1 className="text-2xl font-bold text-center my-4">User Profile</h1>
//       {loading ? (
//         <Loader2 className="w-16 h-16 animate-spin mx-auto my-20" />
//       ) : (
//         <UserProfileForm profile={profile} />
//       )}
//     </section>
//   );
//   // return <>Profile Page</>;
// };

// export default UserProfile;
