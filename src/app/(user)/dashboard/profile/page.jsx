'use client'
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import UserProfileForm from '@/components/ui/UserProfileForm';

const UserProfile = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        if (session?.user?.uid) {
          const response = await fetch(`/api/profile/get-user-profile/${session?.user?.uid}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            //body: JSON.stringify({ user: { uid: session.user.uid } }),
          });
          const data = await response.json();

          if (response.ok) {
            setProfile(data.profile);
          } else {
            setError(data.error || "Failed to fetch profile");
          }
        } else {
          setError('No UID found in session');
        }
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.uid) {
      fetchProfile();
    }
  }, [session?.user?.uid]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Please sign in to view your profile</p>;

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return profile ? (
    <UserProfileForm profile={profile} session={session} />
  ) : (
    <p>No profile data found</p>
  );
};

export default UserProfile;
