"use client";
import { useContext, useEffect, useState } from "react";
import AchievementsSection from "@/app/(user)/dashboard/(user)/profile/_components/AchievementsSection";
import { UserProfileForm } from "@/components/form/UserProfileForm";
import { Loader2, Pencil } from "lucide-react";
import { ProfileContext } from "@/providers/ProfileProvider";
import { Page } from "@/components/dashboard/Page";
import Image from "next/image";
import moment from "moment-timezone";
import { FiEdit2 } from "react-icons/fi";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import axios from "axios";

export default function UserProfilePage() {
  const { profile, loading: profileLoading } = useContext(ProfileContext); // Get profile and loading from context
  const [profileDataLoading, setProfileDataLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [totalFollowings, setTotalFollowings] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalBadges, setTotalBadges] = useState(0);
  const [editOpen, setEditOpen] = useState(false);

  const fetchProfileData = async () => {
    return await axios
      .get("/api/dashboard/user/profile")
      .then((response) => {
        if (response?.data?.success) {
          setTotalFollowers(response.data.data.followers);
          setTotalFollowings(response.data.data.followings);
          setTotalPosts(response.data.data.posts);
          // setTotalBadges(response.data.data.badges);
          return response.data.data;
        }
        return null;
      })
      .catch((error) => {
        console.error(error);
        return null;
      })
      .finally(() => {
        setProfileDataLoading(false);
      });
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (!profileLoading && loading) {
      setLoading(false);
    }
  }, [profileLoading]);

  return (
    <Page title="Profile" noBackground>
      {loading ? (
        <Loader2 className="w-16 h-16 animate-spin mx-auto my-20" />
      ) : (
        <>
          <section className="">
            <article className="relative flex flex-col items-center bg-white dark:bg-neutral-900 rounded-xl p-2 py-6 space-y-4 select-none">
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <button
                    className="h-10 w-10 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-800 absolute top-3 right-3 text-lg rounded-full shadow flex justify-center items-center"
                    onClick={() => setEditOpen(true)}
                  >
                    <FiEdit2 />
                  </button>
                </DialogTrigger>
                <DialogContent className="dark:bg-neutral-900">
                  <>
                    <UserProfileForm
                      profile={profile}
                      onComplete={() => {
                        setEditOpen(false);
                      }}
                    />
                  </>
                </DialogContent>
              </Dialog>

              <header className="relative aspect-square min-w-40 w-1/2 max-w-60">
                <Image
                  className="object-cover object-center rounded-full pointer-events-none"
                  src={profile?.profilePicture} // Fallback to default icon if no preview
                  alt="Profile Picture"
                  fill
                  priority
                />
              </header>
              <main className=" space-y-2">
                <div className="flex gap-2 justify-center text-2xl font-semibold">
                  <h1>{profile?.firstName}</h1>
                  <h1>{profile?.lastName}</h1>
                </div>
                {profile?.since && (
                  <p className="font-light text-xs text-center text-neutral-300 text-accent-foreground">
                    <span className="bg-neutral-700 dark:bg-neutral-950 text-white dark:text-neutral-400 px-2 py-1 rounded-md">
                      <span className="dark:text-neutral-700">Joined: </span>
                      {profile?.since &&
                        moment(profile?.since).format("MMM YYYY")}
                    </span>
                  </p>
                )}
              </main>
              <footer className="w-full max-w-md mx-auto flex gap-2">
                <article className="flex-1  rounded-xl flex flex-col bg-white dark:bg-neutral-800 dark:neutral-700 shadow-xl py-1">
                  <h3 className="text-xs font-normal p-1 text-center">
                    Followers
                  </h3>
                  <p className="flex-1 text-3xl text-center place-content-center">
                    {/* {totalFollowers} */}
                    {profileDataLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    ) : (
                      totalFollowers
                    )}
                  </p>
                </article>
                <article className="flex-1  rounded-xl flex flex-col bg-white dark:bg-neutral-800 dark:neutral-700 shadow-xl py-1">
                  <h3 className="text-xs font-normal p-1 text-center">
                    Following
                  </h3>
                  <p className="flex-1 text-3xl text-center place-content-center">
                    {/* {totalFollowings} */}
                    {profileDataLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    ) : (
                      totalFollowings
                    )}
                  </p>
                </article>
                <article className="flex-1  rounded-xl flex flex-col bg-white dark:bg-neutral-800 dark:neutral-700 shadow-xl py-1">
                  <h3 className="text-xs font-normal p-1 text-center">Posts</h3>
                  <p className="flex-1 text-3xl text-center place-content-center">
                    {/* {totalPosts} */}
                    {profileDataLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    ) : (
                      totalPosts
                    )}
                  </p>
                </article>
                <article className="flex-1  rounded-xl flex flex-col bg-white dark:bg-neutral-800 dark:neutral-700 shadow-xl py-1">
                  <h3 className="text-xs font-normal p-1 text-center">
                    Badges
                  </h3>
                  <p className="flex-1 text-3xl text-center place-content-center">
                    {/* {totalBadges} */}
                    {profileDataLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    ) : (
                      totalBadges
                    )}
                  </p>
                </article>
              </footer>
            </article>

            <article className=""></article>
          </section>
        </>
      )}
      <AchievementsSection
        userId={profile?.userId}
        onAchievementCompleted={(completedCount) => setTotalBadges(completedCount)}
      />
    </Page>
  );
}

// <section className="max-w-screen-sm mx-auto bg-gray-50 dark:bg-neutral-900 shadow-md p-2 rounded-xl my-10">
//   <h1 className="text-2xl font-bold text-center my-4">User Profile</h1>

// </section>
