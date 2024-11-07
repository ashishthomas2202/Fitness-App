"use client";
import { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg space-y-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="firstName" className="block text-gray-600 dark:text-gray-400 font-medium">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-300"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="lastName" className="block text-gray-600 dark:text-gray-400 font-medium">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-300"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-600 dark:text-gray-400 font-medium">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-300"
            required
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-gray-600 dark:text-gray-400 font-medium">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-300"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-600 dark:text-gray-400 font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="mt-1 w-full p-2 border rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-300"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
