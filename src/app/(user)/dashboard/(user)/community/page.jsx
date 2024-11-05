"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { CreatePostDialog } from "@/components/dashboard/social/CreatePostDialog";
import { Post } from "@/components/ui/Post";
import axios from "axios";
import { Page } from "@/components/dashboard/Page";
const CommunityPage = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    await axios
      .get("/api/post")
      .then((response) => {
        if (response?.data?.success) {
          setPosts(response.data.data);
          return response.data.data;
        }
        return [];
      })
      .catch((error) => {
        return [];
      });
  };

  const createPost = async (post) => {
    await axios
      .post("/api/post/create", post)
      .then((response) => {
        if (response?.data?.success) {
          fetchPosts();
          return response.data.data;
        }
        throw new Error("Failed to create post");
      })
      .catch((error) => {
        throw new Error("Failed to create post");
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Page className="px-2 dark:bg-transparent">
      {/* Main Content Area */}
      <main className=" flex-1 space-y-4">
        <header className="max-w-lg mx-auto top-0">
          <h1 className="text-3xl font-bold mb-10">Explore</h1>
          <span className="fixed z-50 bottom-4 right-4 md:relative md:top-0 md:left-0">
            <CreatePostDialog createPost={createPost} />
          </span>
        </header>
        <main>
          {!posts || posts?.length == 0 ? (
            <div className="min-h-40 flex justify-center items-center text-lg font-light bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-700 rounded-lg">
              <p>No posts to display</p>
            </div>
          ) : (
            posts.map((post) => (
              <Post key={post.id} data={post} {...console.log(post)} />
            ))
          )}
        </main>
      </main>
    </Page>
  );
};

export default CommunityPage;
