'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import UserProfileForm from "@/components/ui/UserProfileForm";

const Profile = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("user", session?.user)

  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        if (session?.user?.uid) {
          console.log('Fetching profile for uid:', session.user.uid);  // Debug log for UID

          const response = await fetch(`/api/profile/get-user-profile?uid=${session.user.uid}`);
          const data = await response.json();
          console.log('Profile fetch response:', data);  // Debug log for API response

          if (response.ok) {
            setProfile(data.profile);
          } else {
            setError(data.error || 'Failed to fetch profile');
          }
        } else {
          setError('No user ID found in session');
        }
      } catch (err) {
        console.error('Error during profile fetch:', err);
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session?.user?.uid]);

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Please sign in to view your profile</p>;

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return profile ? (
    <UserProfileForm profile={profile} session={session} />
  ) : (
    <p>No profile data available</p>
  );
};

export default Profile;
