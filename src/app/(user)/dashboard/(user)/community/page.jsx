"use client";
import {
  Search,
  Heart,
  MessageSquare,
  Share,
  Home,
  User,
  MessageCircle,
  Users,
  Activity,
  Star,
  Bell,
  LogOut,
  HelpCircle,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import CommentsSection from "@/components/ui/CommentsSection";
import Link from "next/link";
import moment from "moment-timezone";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/Dialog";

import { CreatePostDialog } from "@/components/dashboard/social/CreatePostDialog";
import { Post } from "@/components/ui/Post";
import { toast } from "react-toastify";
import axios from "axios";
import { Page } from "@/components/dashboard/Page";
/* TODO Fix the comments visibitlity
TODO Add linking to the buttons
TODO*/
// Sample data for posts and sidebar items
// const posts = [
//   {
//     id: 1,
//     user: "John Doe",
//     activity: "Completed a 5k run",
//     time: "10 min ago",
//     description: "Just finished an amazing run with my fitness buddy @JoeyB !",
//     likes: 230,
//     comments: 6,
//     shares: 4,
//   },
//   {
//     id: 2,
//     user: "Kat Harpey",
//     activity: "Created a workout group",
//     time: "Thursday, 17 August 10:40 AM",
//     description: "Sell or swap your workout gear. Let's connect!",
//     likes: 18,
//     comments: 2,
//     shares: 2,
//   },
// ];
const postsData = [
  {
    id: "605c72ef",
    author: "605c72ef1c4a3a34b6f12c2d", // Replace with an actual user ObjectId
    contentType: "achievement",
    contentData: {
      title: "Completed 5K Run",
      description: "Ran a 5K marathon in under 30 minutes!",
      date: "2024-10-15",
    },
    visibility: "public",
    comments: [
      {
        commenter: "605c72ef1c4a3a34b6f12c2f",
        comment: "Congratulations! That's amazing!",
        timestamp: new Date("2024-10-16T10:00:00Z"),
        replies: [
          {
            commenter: "605c72ef1c4a3a34b6f12c30",
            comment: "Thank you! It was a tough run.",
            timestamp: new Date("2024-10-16T11:00:00Z"),
            replies: [
              {
                commenter: "605c72ef1c4a3a34b6f12c31",
                comment: "You should train for a 10K next!",
                timestamp: new Date("2024-10-16T12:00:00Z"),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "605c72ef1c4a3a34b6f12c2a",
    author: "605c72ef1c4a3a34b6f12c2e", // Replace with an actual user ObjectId
    contentType: "post",
    contentData: {
      title: "Morning Yoga Session",
      description: "Started my day with a peaceful yoga session.",
      images: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
      ],
    },
    visibility: "private",
    comments: [
      {
        commenter: "605c72ef1c4a3a34b6f12c32",
        comment: "Yoga is the best way to start the day!",
        timestamp: new Date("2024-10-17T08:30:00Z"),
        replies: [
          {
            commenter: "605c72ef1c4a3a34b6f12c33",
            comment: "Absolutely! I feel so much more energized.",
            timestamp: new Date("2024-10-17T09:00:00Z"),
          },
        ],
      },
    ],
  },
  {
    id: "605c72ef1c4a3a34b6f12c2b",
    author: "605c72ef1c4a3a34b6f12c2f", // Replace with an actual user ObjectId
    contentType: "share",
    contentData: {
      sharedPostId: "605c72ef1c4a3a34b6f12c2a",
      caption: "This post really inspired me!",
    },
    visibility: "public",
    comments: [
      {
        commenter: "605c72ef1c4a3a34b6f12c34",
        comment: "Thanks for sharing! Very motivating.",
        timestamp: new Date("2024-10-18T15:30:00Z"),
        replies: [
          {
            commenter: "605c72ef1c4a3a34b6f12c35",
            comment: "Glad you liked it!",
            timestamp: new Date("2024-10-18T16:00:00Z"),
          },
          {
            commenter: "605c72ef1c4a3a34b6f12c36",
            comment: "I also found this inspiring!",
            timestamp: new Date("2024-10-18T16:30:00Z"),
            replies: [
              {
                commenter: "605c72ef1c4a3a34b6f12c37",
                comment: "Agreed, it's really powerful.",
                timestamp: new Date("2024-10-18T17:00:00Z"),
              },
            ],
          },
        ],
      },
    ],
  },
];

const CommunityPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isPostWindowOpen, setIsPostWindowOpen] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [posts, setPosts] = useState([]);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [visibleComments, setVisibleComments] = useState({});
  const { data: session } = useSession();
  const [selectedTag, setSelectedTag] = useState(null);

  // const fetchPosts = () => {
  //   setPosts(postsData);
  //   return postsData;
  // };
  const checklike = (post) => {
    return post?.likes?.some((like) => like?.userId === session?.user?.id);
  };

  const countComments = (post) => {
    const countNestedComments = (comment) => {
      // Count the current comment
      let count = 1;

      // Recursively count each sub-comment if they exist
      if (comment.subComments && comment.subComments.length > 0) {
        comment.subComments.forEach((subComment) => {
          count += countNestedComments(subComment);
        });
      }

      return count;
    };

    // Count all comments in the post, including sub-comments
    let totalComments = 0;
    post.comments.forEach((comment) => {
      totalComments += countNestedComments(comment);
    });

    return totalComments;
  };

  // const handleAddComment = (updatedPost) => {
  //   // Update the post in the posts array
  //   setPosts((prevPosts) =>
  //     prevPosts.map((post) =>
  //       post.id === updatedPost.id ? { ...updatedPost } : post
  //     )
  //   );
  // };

  const formatDate = (date) => {
    return;
  };

  // const checklike=(post)=>{return post?.likes.find(like=>{like?.userId==session?.user?.id}).length>0}
  const openPostWindow = () => {
    setIsPostWindowOpen(true);
  };

  const closePostWindow = () => {
    setIsPostWindowOpen(false);
  };

  const handleLike = (post) => {
    const isliked = checklike(post);

    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === post.id
          ? {
              ...p,
              likes: isliked
                ? p.likes.filter((like) => like.userId !== session?.user?.id) // Remove like
                : [...p.likes, { userId: session?.user?.id }], // Add like
            }
          : p
      )
    );
  };

  const handlePostSubmit = () => {
    if (postTitle && newPostText) {
      const newPost = {
        date: new Date().toISOString(),
        userId: session?.user,
        id: posts.length + 1,
        title: postTitle,
        description: newPostText,
        likes: [],
        comments: [],
        shares: 0,
        tag: selectedTag,
      };

      setPosts([...posts, newPost]);
      closePostWindow();
    }
  };
  const toggleTag = (tag) => {
    setSelectedTag((prevTag) => (prevTag === tag ? null : tag));
  };

  const toggleCommentWindow = (postId) => {
    setActiveCommentPostId((prevId) => (prevId === postId ? null : postId));
  };

  const handleCommentSubmit = (postId) => {
    const trimmedComment = newCommentText.trim();
    if (!trimmedComment) {
      alert("Comment cannot be empty!");
      return;
    }
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...(post.comments || []),
              { user: "Current User", comment: newCommentText },
            ],
          }
        : post
    );
    setPosts(updatedPosts);
    setNewCommentText("");
  };

  const toggleComments = (postId) => {
    setActiveCommentPostId((prevId) => (prevId === postId ? null : postId));
  };
  const toggleCommentsVisibility = (postId) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  // ---------------------------

  const fetchPosts = async () => {
    await axios
      .get("/api/post")
      .then((response) => {
        if (response?.data?.success) {
          console.log(response.data.data);
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

 

  // const handleAddComment = async (postId, commentText = "") => {
  //   if (commentText.trim() === "") {
  //     return null;
  //   }
  //   return await axios
  //     .post(`/api/post/${postId}/comment/add`, {
  //       commentText,
  //     })
  //     .then((response) => {
  //       if (response?.data?.success) {
  //         console.log(response.data.data);
  //         //update the current post with the new likes
  //         setPosts((prevPosts) =>
  //           prevPosts.map((post) =>
  //             post.id === postId
  //               ? {
  //                   ...post,
  //                   comments: response.data.data,
  //                 }
  //               : post
  //           )
  //         );
  //         return response.data.data;
  //       }
  //       return null;
  //     })
  //     .catch((error) => {
  //       return null;
  //     });
  // };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    // <div className="min-h-screen flex bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-gray-200">
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
              <Post
                key={post.id}
                data={post}
                {...console.log(post)}
              />
            ))
          )}
        </main>

      </main>

      {/* Post Window */}
    </Page>
  );
};

export default CommunityPage;
