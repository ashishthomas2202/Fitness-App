import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import React from "react";

export const NewsletterSection = () => {
  return (
    <section className="bg-gray-100 dark:bg-neutral-900 border-b border-violet-100 dark:border-neutral-950 py-10">
      <div className="max-w-screen-xl mx-auto px-4 lg:flex lg:items-center">
        {/* Text Section */}
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-bold mb-4">Stay Updated with FlexFit</h2>
          <p className="text-lg mb-6">
            Subscribe to our newsletter and get the latest workout tips, expert
            guidance, and exclusive offers delivered straight to your inbox.
            Stay in the loop with everything FlexFit!
          </p>
        </div>

        {/* Form Section */}
        <div className="lg:w-1/2 bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg">
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-lg font-medium">
                Email Address
              </label>
              {/* <inputInpu
                type="email"
                id="email"
                required
                placeholder="Your Email"
                className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:border-violet-500"
              /> */}
              <Input
                type="email"
                id="email"
                required
                placeholder="Your Email"
                className="dark:bg-neutral-900 dark:border-neutral-800 dark:focus:ring-neutral-700"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-lg font-medium">
                Name (Optional)
              </label>
              <Input
                type="text"
                id="name"
                placeholder="Your Name"
                // className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:border-violet-500"
                className="dark:bg-neutral-900 dark:border-neutral-800 dark:focus:ring-neutral-700"
              />
            </div>
            {/* <button
              type="submit"
              className="w-full bg-violet-500 text-white py-3 rounded-lg hover:bg-violet-600 transition-all"
            >
              Subscribe Now
            </button> */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-6"
              // className="w-full bg-violet-500 text-white py-3 rounded-lg hover:bg-violet-600 transition-all"
            >
              Subscribe Now
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
