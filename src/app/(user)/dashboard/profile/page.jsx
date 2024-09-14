"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { storage } from '@/lib/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from '@/components/ui/input';

const Profile = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    height: '',
    weight: '',
    gender: '',
    profilePicture: '',
  });

  // Should fetch the user's profile from the API on load, will fix if not
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`/api/get-user-profile?email=${session?.user?.email}`);
      const data = await res.json();
      setProfile(data);
    };
    if (session) {
      fetchProfile();
    }
  }, [session]);

  // Try haandle form submission to update the profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/update-user-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (res.ok) {
      alert('Profile updated successfully');
    } else {
      alert('Error updating profile');
    }
  };

  // File upload to firebase
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `profile_pictures/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    setProfile({ ...profile, profilePicture: downloadURL });
  };

  return (
    <div className="profile-container">
      <h1>{session?.user?.name}s Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <Input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          disabled
        />

        <label>Phone Number:</label>
        <Input
          type="text"
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        />

        <label>First Name:</label>
        <Input
          type="text"
          value={profile.firstName}
          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
        />

        <label>Last Name:</label>
        <Input
          type="text"
          value={profile.lastName}
          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
        />

        <label>Height:</label>
        <input
          type="number"
          value={profile.height}
          onChange={(e) => setProfile({ ...profile, height: e.target.value })}
        />

        <label>Weight:</label>
        <input
          type="number"
          value={profile.weight}
          onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
        />

        <label>Gender:</label>
        <select
          value={profile.gender}
          onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label>Profile Picture:</label>
        <input type="file" onChange={handleFileUpload} />

        <button type="submit">Update Profile</button>
      </form>

      {profile.profilePicture && <img src={profile.profilePicture} alt="Profile" />}
    </div>
  );
};

export default Profile;