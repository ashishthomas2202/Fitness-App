"use client";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import axios from "axios";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  subject: yup.string().required("Subject is required"),
  message: yup.string().required("Message is required"),
});
const SupportForm = () => {
  // const [formData, setFormData] = useState({
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   title: "",
  //   description: "",
  // });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Add form submission logic here
  //   console.log("Form submitted:", formData);
  // };

  const onSubmit = async (data) => {
    console.log(data);
    await axios
      .post("/api/support/ticket/create", data)
      .then((res) => {
        if (res.data.success) {
          toast.success("Ticket created successfully");
          reset();
        }
      })
      .catch((error) => {
        toast.error("Failed to create ticket");
      });
  };

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg space-y-4 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Contact & Support
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="firstName"
              className="block text-gray-600 dark:text-gray-400 font-medium"
            >
              First Name
            </label>
            <Input type="text" {...register("firstName")} />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div className="flex-1">
            <label
              htmlFor="lastName"
              className="block text-gray-600 dark:text-gray-400 font-medium"
            >
              Last Name
            </label>
            <Input type="text" {...register("lastName")} />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-gray-600 dark:text-gray-400 font-medium"
          >
            Email
          </label>
          <Input type="email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="title"
            className="block text-gray-600 dark:text-gray-400 font-medium"
          >
            Subject
          </label>
          <Input type="text" {...register("subject")} />
          {errors.subject && (
            <p className="text-red-500 text-sm">{errors.subject.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-gray-600 dark:text-gray-400 font-medium"
          >
            Message
          </label>
          <Textarea
            rows="5"
            className="mt-1 w-full p-2 border rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-300"
            {...register("message")}
          ></Textarea>
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-violet-400 text-white rounded-lg font-medium hover:bg-violet-500 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SupportForm;
