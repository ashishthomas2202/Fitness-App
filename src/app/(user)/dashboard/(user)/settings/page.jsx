"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Loader2, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

// Profile validation schema
const profileSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  gender: yup
    .string()
    .required("Gender is required")
    .oneOf(["Male", "Female", "Other"], "Please select a gender"),
  dob: yup
    .date()
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth cannot be in the future"),
  height: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Height is required")
    .min(1, "Height must be greater than 0"),
  weight: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Weight is required")
    .min(1, "Weight must be greater than 0"),
  phoneNumber: yup
    .string()
    .nullable()
    .notRequired()
    .test(
      "is-valid-phone",
      "Phone number must be exactly 10 digits",
      (value) => !value || value.length === 0 || /^\d{10}$/.test(value)
    ),
});

const passwordChangeSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data: session } = useSession();
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  console.log("Password Change Schema:", passwordChangeSchema.describe());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(profileSchema),
  });
 
  const handleRegisterAsTrainer = async () => {
    try {
      const response = await fetch("/api/is-trainer", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session?.user.id }),
      });
  
      if (response.ok) {
        alert("Successfully updated to trainer role!");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update role.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };
  
  
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordChangeSchema),
    mode: "onChange", // This will validate on change
  });

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check for Google authentication using googleId
        const isGoogle = !!session?.user?.googleId;
        setIsGoogleUser(isGoogle);

        // Debug logs
        console.log("Session data:", session);
        console.log("Is Google User:", isGoogle);

        const response = await axios.get("/api/profile/get-profile");
        if (response.data.success) {
          const profileData = response.data.data;
          reset({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            gender: profileData.gender,
            dob: format(new Date(profileData.dob), "yyyy-MM-dd"),
            height: profileData.height,
            weight: profileData.weight,
            phoneNumber: profileData.phoneNumber || "",
          });
        }
      } catch (error) {
        toast.error("Failed to load profile data");
      }
    };

    if (session) {
      fetchProfile();
    }
  }, [reset, session]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/profile/update-profile", data);
      if (response.data.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsChangingPassword(true);
    try {
      // Log the data being sent
      console.log("Sending password change request with:", {
        hasCurrentPassword: !!data.currentPassword,
        hasNewPassword: !!data.newPassword,
        hasConfirmPassword: !!data.confirmPassword,
      });

      // Send all required fields
      const response = await axios.post("/api/user/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword, // Add this field
      });

      if (response.data.success) {
        toast.success("Password updated successfully");
        resetPassword();
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err));
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update password. Please try again.");
      }
      console.log("Full error response:", error.response?.data);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      {/* Profile Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your profile information and preferences.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                {...register("gender")}
                className={`w-full p-2 rounded-md border dark:bg-neutral-700 ${
                  errors.gender
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-800"
                }`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                {...register("dob")}
                className={errors.dob ? "border-red-500" : ""}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (inches)</Label>
              <Input
                id="height"
                type="number"
                {...register("height")}
                className={errors.height ? "border-red-500" : ""}
              />
              {errors.height && (
                <p className="text-red-500 text-sm">{errors.height.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                {...register("weight")}
                className={errors.weight ? "border-red-500" : ""}
              />
              {errors.weight && (
                <p className="text-red-500 text-sm">{errors.weight.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
              <Input
                id="phoneNumber"
                {...register("phoneNumber")}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-6">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </div>

      {/* Password Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Password & Security
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Update your password and security settings.
          </p>
        </div>

        {isGoogleUser ? (
          <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200 rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>
              You&apos;re signed in with Google. Password management is handled
              through your Google account.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  {...registerPassword("currentPassword")}
                  className={`pr-10 ${
                    passwordErrors.currentPassword ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-sm">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  {...registerPassword("newPassword")}
                  className={`pr-10 ${
                    passwordErrors.newPassword ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-sm">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  {...registerPassword("confirmPassword")}
                  className={`pr-10 ${
                    passwordErrors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isChangingPassword}
              className="mt-4"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Notification Preferences</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose how you want to receive updates.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive updates via email
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get real-time alerts
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Connected Accounts</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your connected fitness devices and apps.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <img
                src="https://ik.imagekit.io/z1gqwes5lg/public/app-store.png?updatedAt=1727911323775"
                alt="Apple Health"
                className="w-8 h-8"
              />
              <div>
                <h4 className="font-semibold">Apple Health</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connected
                </p>
              </div>
            </div>
            <Button variant="outline">Disconnect</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <img
                src="https://ik.imagekit.io/z1gqwes5lg/public/app.png?updatedAt=1727911323824"
                alt="Google Fit"
                className="w-8 h-8"
              />
              <div>
                <h4 className="font-semibold">Google Fit</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Not Connected
                </p>
              </div>
            </div>
            <Button>Connect</Button>
          </div>
        </div>
      </div>
        <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg">
        <div className="mb-6">
        <h2 className="text-2xl font-bold">Become a Trainer</h2>
        <p className="text-gray-600 dark:text-gray-400">
        Apply to become a trainer and share your knowledge with others.
        </p>
        </div>

        <Button
        onClick={handleRegisterAsTrainer}
        className="mt-4"
        disabled={isSubmitting || isChangingPassword} 
        >
        Register as Trainer
        </Button>
        </div>
      {/*
      Fitness Goals
<div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg">
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-black dark:text-white">Fitness Goals</h2>
    <p className="text-gray-600 dark:text-gray-400">Set and update your fitness objectives.</p>
  </div>
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="primary-goal" className="text-black dark:text-white">Primary Goal</Label>
      <select 
        id="primary-goal" 
        className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-black dark:text-white"
      >
        <option value="weight-loss">Weight Loss</option>
        <option value="muscle-gain">Muscle Gain</option>
        <option value="maintenance">Maintenance</option>
        <option value="endurance">Endurance</option>
        <option value="strength">Strength</option>
      </select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="weekly-goal" className="text-black dark:text-white">Weekly Goal</Label>
      <select 
        id="weekly-goal" 
        className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-black dark:text-white"
      >
        <option value="1">Lose 0.5 lb per week</option>
        <option value="2">Lose 1 lb per week</option>
        <option value="3">Lose 1.5 lbs per week</option>
        <option value="4">Maintain weight</option>
        <option value="5">Gain 0.5 lb per week</option>
        <option value="6">Gain 1 lb per week</option>
      </select>
    </div>
    <Button className="mt-4">Update Goals</Button>
  </div>
</div>

{/* Unit Preferences 
<div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg">
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-black dark:text-white">Unit Preferences</h2>
    <p className="text-gray-600 dark:text-gray-400">Customize how measurements are displayed.</p>
  </div>
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <Label className="text-black dark:text-white">Weight Units</Label>
        <p className="text-sm text-gray-600 dark:text-gray-400">Choose between pounds (lbs) or kilograms (kg)</p>
      </div>
      <select className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-black dark:text-white">
        <option value="imperial">Pounds (lbs)</option>
        <option value="metric">Kilograms (kg)</option>
      </select>
    </div>
    <div className="flex items-center justify-between">
      <div>
        <Label className="text-black dark:text-white">Height Units</Label>
        <p className="text-sm text-gray-600 dark:text-gray-400">Choose between inches or centimeters</p>
      </div>
      <select className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-black dark:text-white">
        <option value="imperial">Inches (in)</option>
        <option value="metric">Centimeters (cm)</option>
      </select>
    </div>
    <Button>Save Preferences</Button>
  </div>
</div>

{/* Workout Preferences
<div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg">
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-black dark:text-white">Workout Preferences</h2>
    <p className="text-gray-600 dark:text-gray-400">Customize your workout experience.</p>
  </div>
  <div className="space-y-4">
    <div className="space-y-2">
      <Label className="text-black dark:text-white">Preferred Workout Days</Label>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <button
            key={day}
            className="p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-violet-100 dark:hover:bg-violet-900 text-black dark:text-white"
          >
            {day}
          </button>
        ))}
      </div>
    </div>
    <div className="space-y-2">
      <Label className="text-black dark:text-white">Workout Duration Preference</Label>
      <select className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-black dark:text-white">
        <option value="15">15 minutes</option>
        <option value="30">30 minutes</option>
        <option value="45">45 minutes</option>
        <option value="60">60 minutes</option>
        <option value="90">90 minutes</option>
      </select>
    </div>
    <div className="space-y-2">
      <Label className="text-black dark:text-white">Preferred Workout Type</Label>
      <select className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-black dark:text-white">
        <option value="strength">Strength Training</option>
        <option value="cardio">Cardio</option>
        <option value="hiit">HIIT</option>
        <option value="yoga">Yoga</option>
        <option value="mixed">Mixed</option>
      </select>
    </div>
    <Button className="mt-4">Save Preferences</Button>
  </div>
</div>

{/* Diet Preferences 
<div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg">
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-black dark:text-white">Diet Preferences</h2>
    <p className="text-gray-600 dark:text-gray-400">Set your dietary preferences and restrictions.</p>
  </div>
  <div className="space-y-4">
    <div className="space-y-2">
      <Label className="text-black dark:text-white">Dietary Type</Label>
      <select className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-black dark:text-white">
        <option value="none">No Specific Diet</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="keto">Ketogenic</option>
        <option value="paleo">Paleo</option>
      </select>
    </div>
    <div className="space-y-2">
      <Label className="text-black dark:text-white">Allergies & Restrictions</Label>
      <div className="space-y-2">
        {['Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Soy'].map((allergy) => (
          <div key={allergy} className="flex items-center space-x-2">
            <input type="checkbox" id={allergy.toLowerCase()} className="h-4 w-4" />
            <Label htmlFor={allergy.toLowerCase()} className="text-black dark:text-white">
              {allergy}
            </Label>
          </div>
        ))}
      </div>
    </div>
    <Button className="mt-4">Update Diet Preferences</Button>
  </div>
</div>

{/* Privacy Settings 
<div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg">
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-black dark:text-white">Privacy Settings</h2>
    <p className="text-gray-600 dark:text-gray-400">Control your privacy and data sharing preferences.</p>
  </div>
  <div className="space-y-4">
    {[
      'Share workout activity with friends',
      'Show profile in search results',
      'Allow friend requests',
      'Share progress photos',
      'Share achievements publicly'
    ].map((setting) => (
      <div key={setting} className="flex items-center justify-between">
        <div>
          <Label className="text-black dark:text-white">{setting}</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400">Control who can see your {setting.toLowerCase()}</p>
        </div>
        <input type="checkbox" className="h-4 w-4" />
      </div>
    ))}
    <Button className="mt-4">Save Privacy Settings</Button>
  </div>
</div>
*/}
    </div>
  );
}
