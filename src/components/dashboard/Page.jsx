import React from "react";

export const Page = ({ title = "", children }) => {
  return (
    <section className="bg-white dark:bg-neutral-900 min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-70px)] py-5 px-4  max-w-[2500px] mx-auto rounded-xl">
      <h1 className="text-3xl font-bold text-center sm:text-left mb-10">
        {title}
      </h1>
      <div>{children}</div>
    </section>
  );
};
