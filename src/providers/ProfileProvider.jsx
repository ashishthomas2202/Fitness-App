"use client";
import React, {
  createContext,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);

  const getProfile = async () => {
    return await axios
      .get("/api/profile/get-profile")
      .then((response) => {
        // console.log("Profile data:", response.data);
        if (response?.data?.success) {
          setProfile(response.data.data);
          return response.data.data;
        }
        return null;
      })
      .catch((error) => {
        // console.error("Error fetching profile:", error);
        return null;
      });
  };

  useLayoutEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
    }
  }, [session]);

  return (
    <ProfileContext.Provider
      value={{ getProfile, updateProfile: getProfile, profile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
