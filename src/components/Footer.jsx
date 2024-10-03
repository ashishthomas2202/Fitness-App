import React from "react";
// import { Link } from "next/link";
import { Brand } from "@/components/Brand";
import { CgFacebook } from "react-icons/cg";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { BsTwitterX } from "react-icons/bs";
import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialMedia = [
    { name: "Facebook", link: "/", icon: <CgFacebook size={25} /> },
    { name: "Instagram", link: "/", icon: <SiInstagram size={25} /> },
    { name: "Twitter", link: "/", icon: <BsTwitterX size={25} /> },
    { name: "Tiktok", link: "/", icon: <SiTiktok size={25} /> },
  ];

  const legalLinks = [
    { name: "Terms of Service", link: "/" },
    { name: "Privacy Policy", link: "/" },
    { name: "Security", link: "/" },
    { name: "Sitemap", link: "/" },
  ];

  const menuLinks = [
    {
      title: " Products",
      items: [
        {
          name: "Meal Plans",
          link: "/",
        },
        {
          name: "Workout Plans",
          link: "/",
        },
        {
          name: "Fitness Tracker",
          link: "/",
        },
        {
          name: "Fitness Calculators",
          link: "/",
        },
        {
          name: "Personal Training",
          link: "/",
        },
      ],
    },
    {
      title: "Company",
      items: [
        {
          name: "About",
          link: "/",
        },
        {
          name: "Careers",
          link: "/",
        },
        {
          name: "Blog",
          link: "/",
        },
        {
          name: "Press",
          link: "/",
        },
        {
          name: "Contact",
          link: "/",
        },
      ],
    },

    {
      title: "Support",
      items: [
        {
          name: "Help Center",
          link: "/",
        },
        {
          name: "FAQs",
          link: "/",
        },
        {
          name: "Accessibility",
          link: "/",
        },
        {
          name: "Cookies",
          link: "/",
        },
      ],
    },
  ];
  return (
    <footer className="pt-12 md:pt-20 pb-5 px-2 sm:px-4 lg:px-6 bg-violet-50 dark:bg-[#0e0e0e]">
      <section className="max-w-screen-2xl mx-auto">
        <main className="flex flex-col items-center sm:flex-row gap-2 sm:justify-between text-slate-500 dark:text-neutral-600  mb-6">
          <article className="flex flex-col items-center sm:items-start mb-10 sm:mb-0 max-w-min">
            <Brand noIcon />
            <p className="text-center sm:text-left font-light mt-2 w-72 md:w-80">
              We offer personalized workout plans and expert guidance to help
              you achieve your fitness goals. Train smarter, track your
              progress, and stay motivated anytime, anywhere.
            </p>
          </article>
          {menuLinks.map((menu) => (
            <article key={menu.title} className="">
              <h3 className="font-medium text-lg text-center sm:text-left mb-2">
                {menu.title}
              </h3>
              <ul className="flex flex-col items-center sm:items-start gap-2">
                {menu.items.map((item) => (
                  <li key={item.name} className="font-light">
                    <Link href={item.link}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </main>
        <hr className="border border-violet-100 dark:border-neutral-900" />
        <footer className="py-4 text-slate-500 dark:text-neutral-600 font-light flex flex-col lg:flex-row-reverse lg:justify-between lg:mt-4 gap-6 items-center">
          <main className="flex flex-col gap-12 md:flex-row-reverse items-center justify-between w-full lg:w-2/3">
            <article className="flex flex-col items-center">
              <h3 className="font-medium lg:hidden">Follow us on: </h3>
              <ul className="flex gap-6 pt-2 lg:pt-0">
                {socialMedia.map((social) => (
                  <li key={`footer-${social.name}`}>
                    <Link href={social.link}>{social.icon}</Link>
                  </li>
                ))}
              </ul>
            </article>
            <ul className="text-center text-nowrap flex flex-col gap-4 sm:flex-row">
              {legalLinks.map((link) => (
                <li key={`footer-${link.name}`}>
                  <Link href={link.link}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </main>
          <footer className="">
            <p className="text-nowrap">
              &copy;{currentYear} FlexFit. All rights reserved
            </p>
          </footer>
        </footer>
      </section>
    </footer>
  );
};
