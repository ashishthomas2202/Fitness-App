"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import UserProfileForm from "@/components/ui/UserProfileForm";

const Profile = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        if (session?.user?.email) {
          const response = await fetch(`/api/getUserProfile?email=${session.user.email}`);
          const data = await response.json();
          if (response.ok) {
            setProfile(data.profile);
          } else {
            setError(data.error || 'Failed to fetch profile');
          }
        } else {
          setError('No email found in session');
        }
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session?.user?.email]);

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const response = await fetch('/api/updateUserProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          profileData: updatedProfile,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Profile updated successfully');
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Please sign in to view your profile</p>;

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    profile ? (
      <UserProfileForm profile={profile} onSubmit={handleProfileUpdate} />
    ) : (
      <p>No profile data available</p>
    )
  );
};

export default Profile;
