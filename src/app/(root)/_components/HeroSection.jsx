import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="w-full lg:flex lg:flex-row-reverse max-w-screen-2xl mx-auto lg:px-4 lg:mt-10">
      <article className="hidden lg:block sm:flex-1">
        <main className="relatiive h-full w-full overflow-hidden sm:rounded-3xl">
          <Image
            className="h-full object-center object-cover z-0"
            src="https://ik.imagekit.io/z1gqwes5lg/public/anastase-maragos-7kEpUPB8vNk-unsplash.jpg?updatedAt=1727405700614"
            alt="workout image"
            height={800}
            width={1200}
          />
        </main>
      </article>
      <article className="relative lg:flex-1">
        <Image
          className="h-full object-center object-cover z-10 lg:hidden"
          src="https://ik.imagekit.io/z1gqwes5lg/public/anastase-maragos-7kEpUPB8vNk-unsplash.jpg?updatedAt=1727405700614"
          alt="workout image"
          fill
        />
        <article className="w-full h-full z-10 absolute top-0 left-0 bg-black opacity-70 lg:hidden"></article>

        <main className="relative z-20 px-4 py-20 max-w-screen-sm mx-auto lg:mx-0">
          <h1 className=" text-white lg:text-black dark:lg:text-white font-bold text-[20vw]  leading-none sm:text-[15vw] md:text-9xl lg:text-8xl">
            ELEVATE
          </h1>
          <h1 className=" text-white lg:text-black dark:lg:text-white font-bold text-[20vw] leading-none sm:text-[15vw] md:text-9xl lg:text-8xl">
            YOUR
          </h1>
          <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-500 font-bold text-[20vw]  leading-none sm:text-[15vw] md:text-9xl lg:text-8xl">
            FITNESS
          </h1>
          <p className="text-white lg:text-black dark:lg:text-white font-light text-xl max-w-xl mx-auto sm:mx-0 mt-8">
            Unlock your potential with personalized plans, expert trainers, and
            cutting-edge tools. Whether you&apos;re aiming to lose weight, build
            muscle, or stay healthy, FlexFit is your all-in-one fitness
            companion.
          </p>
          <footer className="flex gap-2 sm:gap-4 justify-center sm:justify-start items-center mt-16">
            <Button
              variant="primary"
              className="px-2 py-6 shadow-lg "
              size="lg"
              asChild
            >
              <Link href="/auth/signup">Join Now for Free</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-white lg:text-black dark:lg:text-white px-2 py-6 shadow-lg lg:border border-slate-50"
              size="lg"
              asChild
            >
              <Link href="#learn">
                Learn More <ArrowRight size={20} />
              </Link>
            </Button>
          </footer>
        </main>
      </article>
    </section>
  );
};
