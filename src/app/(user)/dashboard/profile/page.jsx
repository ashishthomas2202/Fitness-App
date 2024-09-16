"use client"
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import UserProfileForm from "@/components/ui/UserProfileForm";

const Profile = () => {
  const { data: session, status } = useSession();  // Get session data
  const [profile, setProfile] = useState(null);    // Holds the profile data fetched from Firebase
  const [loading, setLoading] = useState(true);    // To manage loading state
  const [error, setError] = useState(null);        // Holds any error messages

  // UseEffect to fetch profile once the session is available
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);  // Set loading to true before the request
      setError(null);    // Reset error state

      try {
        if (session?.user?.email) {
          // Fetch the user's profile based on their email
          const response = await fetch(`/api/profile/get-user?email=${session.user.email}`);
          const data = await response.json();

          // If the response is okay, set the profile data
          if (response.ok) {
            // Convert Firestore timestamp to JS Date for DOB
            const profileData = data.profile;
            if (profileData.DOB && profileData.DOB.seconds) {
              // Convert Firestore Timestamp to JavaScript Date
              profileData.DOB = new Date(profileData.DOB.seconds * 1000);
            } else {
              profileData.DOB = '';  // Set empty string if DOB is not present or invalid
            }

            setProfile(profileData);
          } else {
            setError(data.error || 'Failed to fetch profile');
          }
        } else {
          setError('No email found in session');  // If the session is missing an email
        }
      } catch (err) {
        // Handle any fetch errors
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);  // Ensure loading is turned off after request finishes
      }
    };

    // Trigger fetchProfile when the user's session email becomes available
    fetchProfile();
  }, [session?.user?.email]);

  // Function to handle profile updates
  const handleProfileUpdate = async (updatedProfile) => {
    try {
      // Make a POST request to the API to update the profile
      const response = await fetch('/api/profile/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,  // Use session email to identify the profile to update
          profileData: updatedProfile,  // The updated profile data
        }),
      });

      const data = await response.json();

      // Notify the user about the result of the update
      if (response.ok) {
        alert('Profile updated successfully');
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      alert('Failed to update profile');  // Handle any errors during the update
    }
  };

  // Display loading state
  if (status === 'loading') return <p>Loading...</p>;

  // If user is not logged in, prompt them to sign in
  if (!session) return <p>Please sign in to view your profile</p>;

  // Show the profile form once profile is loaded
  if (loading) return <p>Loading profile...</p>;

  // Show any errors that occurred during the fetch
  if (error) return <p>Error: {error}</p>;

  return (
    profile ? (
      <UserProfileForm profile={profile} onSubmit={handleProfileUpdate} />  // Pass profile and update handler to the form
    ) : (
      <p>No profile data available</p>  // Fallback if no profile is found
    )
  );
};

export default Profile;
