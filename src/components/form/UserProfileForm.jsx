"use client";
import { useState, useEffect, useRef, useContext } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { CalendarIcon, UploadIcon } from "lucide-react";
import moment from "moment-timezone";
import Image from "next/image";
import { ProfilePictureUploader } from "../ProfilePictureUploader";
import axios from "axios";
import { toast } from "react-toastify";
import { ProfileContext } from "@/providers/ProfileProvider";

const UserProfileSchema = {
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
    .transform((value, originalValue) => {
      // If the original value is an empty string, cast it to 0 (or null if that's preferred)
      return originalValue === "" ? null : value;
    })
    .required("Height is required")
    .min(1, "Height must be greater than 0"),
  weight: yup
    .number()
    .transform((value, originalValue) => {
      // If the original value is an empty string, cast it to 0 (or null if that's preferred)
      return originalValue === "" ? null : value;
    })
    .required("Weight is required")
    .min(1, "Weight must be greater than 0"),
  phoneNumber: yup
    .string()
    .nullable() // Allows the field to be empty
    .notRequired() // Makes the field optional
    .test(
      "is-valid-phone",
      "Phone number must be exactly 10 digits", // Error message
      (value) => {
        // Skip validation if the field is empty
        if (!value || value.length === 0) return true;
        // Otherwise, check if it's exactly 10 digits
        return /^\d{10}$/.test(value);
      }
    ),
};
export const UserProfileForm = ({ profile }) => {
  const defaultValues = {
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    gender: profile?.gender || "",
    dob:
      moment(profile?.dob).format("YYYY-MM-DD") ||
      moment().format("YYYY-MM-DD"), // Format DOB correctly
    height: profile?.height || 1,
    weight: profile?.weight || 1,
    phoneNumber: profile?.phoneNumber || null,
  };

  // const { updateProfile } = useContext(ProfileContext);
  const { data: session, update } = useSession();
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yup.object().shape(UserProfileSchema)),
    defaultValues: defaultValues,
  });

  const handleImageUpload = async (url) => {
    // setValue("profilePicture", url);
    await axios
      .post("/api/profile/update-profile-picture", {
        profilePicture: url,
      })
      .then(async (response) => {
        if (response?.data?.success) {
          toast.success("Profile picture updated successfully");
          // updateProfile();
        } else {
          // console.error("Failed to update profile picture");
          toast.error("Failed to update profile picture");
        }
      });

    // Update the session with the new profile data
    await update();
  };

  const onSubmit = async (data) => {
    console.log(data);
    await axios
      .post("/api/profile/update-profile", data)
      .then(async (response) => {
        if (response?.data?.success) {
          toast.success("Profile updated successfully");
          // updateProfile();
          // Update the session with the new profile data
          await update();
        } else {
          toast.error("Failed to update profile");
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <div className="h-52 w-52 relative mx-auto mb-10">
          <Image
            className="object-cover object-center rounded-full m-4"
            // src={defaultValues?.profile || "/default-user-icon.png"}
            src={imagePreview || uploadedImageUrl || "/default-user-icon.png"} // Show preview or uploaded image
            alt="Profile Picture"
            fill
            priority
          />
          <Button
            className="bottom-0 right-0 h-10 y-10 rounded-full absolute"
            type="button"
            // onClick={handleFileUploadClick}
            onClick={() => fileInputRef.current.click()}
          >
            <UploadIcon className="h-6 w-6" />
          </Button>
        </div> */}

        <ProfilePictureUploader
          defaultURL={profile?.profilePicture}
          onImageUpload={handleImageUpload}
        />

        <fieldset className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <Label className="font-light mb-2 text-base">
              First Name<sup className="text-red-500">*</sup>
            </Label>
            <Input
              className="dark:bg-neutral-800 dark:border-none dark:focus:outline-neutral-600 dark:focus:ring-slate-600 dark:text-white"
              type="text"
              {...register("firstName")}
              placeholder="Enter your first name"
            />
            <p className="text-red-500">{errors?.firstName?.message}</p>
          </div>
          <div className="flex-1">
            <Label className="font-light mb-2 text-base">
              Last Name<sup className="text-red-500">*</sup>
            </Label>
            <Input
              className="dark:bg-neutral-800 dark:border-none dark:focus:outline-neutral-600 dark:focus:ring-slate-600 dark:text-white"
              type="text"
              {...register("lastName")}
              placeholder="Enter your last name"
            />
            <p className="text-red-500">{errors?.lastName?.message}</p>
          </div>
        </fieldset>
        <fieldset className="flex flex-col md:flex-row gap-2">
          <div className="mt-2 flex-1">
            <Label className="font-light mb-2 text-base">
              Gender<sup className="text-red-500">*</sup>
            </Label>
            <Select
              value={watch("gender")}
              // defaultValue={defaultValues?.gender}
              onValueChange={(value) => {
                setValue("gender", value);
                trigger("gender");
              }} // Manually update the value
            >
              <SelectTrigger className="py-6 focus:ring-0 focus-visible:ring-0  dark:bg-neutral-800 text-base font-light">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-red-500">{errors?.gender?.message}</p>
          </div>

          <div className="mt-2 flex-1">
            <Label className="font-light mb-2 text-base">
              Birth Date<sup className="text-red-500">*</sup>
            </Label>
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="dark:bg-neutral-800 dark:hover:bg-neutral-800 w-full font-light text-base py-6"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch("dob")?.toLocaleDateString() || "Select Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Calendar
                  mode="single"
                  selected={watch("dob")}
                  onSelect={(date) => setValue("dob", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover> */}
            {/* <Input
              type="date"
              className="dark:bg-neutral-800 dark:border-none dark:focus:outline-neutral-600 dark:focus:ring-slate-600 dark:text-white"
              {...register("dob")}
              defaultValues={defaultValues?.dob}
            /> */}

            <Input
              type="date"
              className="dark:bg-neutral-800 dark:border-none dark:focus:outline-neutral-600 dark:focus:ring-slate-600 dark:text-white"
              {...register("dob")}
              max={moment().format("YYYY-MM-DD")}
            />
            <p className="text-red-500">{errors?.dob?.message}</p>
          </div>
        </fieldset>
        <fieldset className="flex flex-col md:flex-row gap-2">
          <div className="mt-2 flex-1">
            <Label className="font-light mb-2 text-base">
              Height (Inches)<sup className="text-red-500">*</sup>
            </Label>
            <Input
              type="number"
              className="dark:bg-neutral-800 dark:border-none dark:focus:outline-neutral-600 dark:focus:ring-slate-600 dark:text-white"
              {...register("height")}
              placeholder="Enter your height in inches"
            />
            <p className="text-red-500">{errors?.height?.message}</p>
          </div>
          <div className="mt-2 flex-1">
            <Label className="font-light mb-2 text-base">
              Weight (Pounds)<sup className="text-red-500">*</sup>
            </Label>
            <Input
              type="number"
              className="dark:bg-neutral-800 dark:border-none dark:focus:outline-neutral-600 dark:focus:ring-slate-600 dark:text-white"
              {...register("weight")}
              placeholder="Enter your weight in Lbs"
            />
            <p className="text-red-500">{errors?.weight?.message}</p>
          </div>
        </fieldset>
        <div className="mt-2">
          <Label className="font-light mb-2 text-base">Phone Number</Label>
          <Input
            type="tel"
            className="dark:bg-neutral-800 dark:border-none dark:focus:outline-neutral-600 dark:focus:ring-slate-600 dark:text-white"
            {...register("phoneNumber")}
            placeholder="Enter your phone number"
          />
          <p className="text-red-500">{errors?.phoneNumber?.message}</p>
        </div>

        <Button type="submit" variant="primary" className="mt-4 w-full">
          Update Profile
        </Button>
      </form>
    </>
  );
};
