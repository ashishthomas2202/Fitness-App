import Image from "next/image";
import React from "react";

export const ConnectedSection = () => {
  return (
    <section className="px-4 py-16 max-w-screen-2xl  mx-auto flex flex-col gap-10  lg:flex-row items-center">
      {/* Left - Image Section */}
      <div className="relative w-full min-h-[400px] max-h-[800px] lg:w-1/2 flex justify-center mb-10 lg:mb-0">
        <Image
          src="https://ik.imagekit.io/z1gqwes5lg/public/insights__cr4ajybkqp8i_large.jpg?updatedAt=1727906952301"
          alt="Sync Devices"
          className="object-cover max-w-full max-h-[400px] rounded-2xl shadow-sm"
          fill
        />
      </div>

      {/* Right - Text Section */}
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h2 className="text-4xl lg:text-5xl font-bold mb-4">
          Stay Connected, Anytime, Anywhere
        </h2>
        <p className="text-lg lg:text-xl font-light mb-6">
          Whether you're on iOS, Android, or using a wearable fitness tracker,
          FlexFit effortlessly syncs your fitness data across all devices.
          Monitor your progress on the go, from your smartphone to your FlexFit
          dashboard, without the hassle.
        </p>

        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 mb-6">
          <div className="bg-slate-100 dark:bg-neutral-800 p-2 w-fit mx-auto sm:mx-0 flex justify-center items-center gap-2 rounded-lg dark:text-white shadow-sm">
            <img
              src="https://ik.imagekit.io/z1gqwes5lg/public/app-store.png?updatedAt=1727911323775"
              alt="Apple Watch"
              className="h-12 w-12 mr-2"
            />
            <div className="text-left">
              <h6 className="text-[10px]">GET IT ON</h6>
              <h3 className="text-lg">App Store</h3>
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-neutral-800 p-2 w-fit mx-auto sm:mx-0 flex justify-center items-center gap-2 rounded-lg dark:text-white shadow-sm">
            <img
              src="https://ik.imagekit.io/z1gqwes5lg/public/app.png?updatedAt=1727911323824"
              alt="Google Fit"
              className="h-12 w-12"
            />
            <div className="text-left">
              <h6 className="text-[10px]">GET IT ON</h6>
              <h3 className="text-lg">Google Play</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
