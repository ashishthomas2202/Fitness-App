import moment from "moment-timezone";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { Carousel } from "@/components/dashboard/social/Carousel";
import { FaGlobeAmericas, FaUsers } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { GoHeart, GoHeartFill } from "react-icons/go";
import {
  IoChatbubbleOutline,
  IoChatbubble,
  IoShareSocialOutline,
} from "react-icons/io5";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { IoIosSend } from "react-icons/io";
import { SlOptions, SlOptionsVertical } from "react-icons/sl";
import { FiMinus, FiPlus, FiSearch } from "react-icons/fi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import { Loader2, Trash2 } from "lucide-react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/Alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { LuClipboard, LuMail, LuMessageCircle, LuShare2 } from "react-icons/lu";
import { toast } from "react-toastify";
import Link from "next/link";

export const MinimalPost = ({
  data: post = {},
  onDelete = () => {},
  isFollowing = false,
  onFollowChange = () => {},
}) => {
  const router = useRouter();

  const [likes, setLikes] = useState(post?.likes || []);
  const [liked, setLiked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(post?.totalComments || 0);
  const [commentLoading, setCommentLoading] = useState(true);

  const { data: session } = useSession();

  const id = post?.id;
  const authorId = post?.author?._id;
  const selfPost = session?.user?.id === authorId;
  const profilePicture = post?.author?.profile?.profilePicture;
  const firstName = post?.author?.firstName;
  const lastName = post?.author?.lastName;
  const type = post?.contentType;
  const time = moment(post?.createdAt).fromNow();
  const visibility = post?.visibility;
  let body = null;

  const fetchComments = async () => {
    setCommentLoading(true);
    return await axios
      .get(`/api/post/${id}/comment`)
      .then((response) => {
        if (response?.data?.success) {
          setComments(response.data.data);
          return response.data.data;
        }
        return [];
      })
      .catch((error) => {
        return [];
      })
      .finally(() => {
        setCommentLoading(false);
      });
  };

  const handleLikeChange = async () => {
    return await axios
      .patch(`/api/post/${id}/likes`)
      .then((response) => {
        if (response?.data?.success) {
          //   setLikes(response.data.data);

          const addOrRemove = liked ? "remove" : "add"; // Add or remove like

          if (addOrRemove === "add") {
            setLikes((prev) => [...prev, session?.user?.id]);
          } else {
            setLikes((prev) => prev.filter((id) => id !== session?.user?.id));
          }
          setLiked((prev) => !prev);
          return response.data.data;
        }
        return null;
      })
      .catch((error) => {
        return null;
      });
  };

  useEffect(() => {
    setLikes(post?.likes);
    setLiked(post?.likes?.includes(session?.user?.id));
  }, [post]);

  useEffect(() => {
    if (commentOpen) {
      fetchComments();
    }
  }, [commentOpen]);

  switch (type) {
    case "post":
      body = <PostType type={type} data={post} />;
      break;
    default:
      <></>;
  }

  // const handleFollowChange = async () => {
  //   if (isFollowing) {
  //     return await axios
  //       .delete(`/api/follower/unfollow`, {})
  //       .then((response) => {
  //         if (response?.data?.success) {
  //           setIsFollowing(false);
  //           return response.data.data;
  //         }
  //         return null;
  //       })
  //       .catch((error) => {
  //         return null;
  //       });
  //   }
  //   return await axios
  //     .post(`/api/follower/follow`, {
  //       userId: authorId,
  //     })
  //     .then((response) => {
  //       if (response?.data?.success) {
  //         setIsFollowing(true);
  //         return response.data.data;
  //       }
  //       return null;
  //     })
  //     .catch((error) => {
  //       return null;
  //     });
  // };

  return (
    <article className="bg-neutral-100 dark:bg-neutral-800  max-w-3xl mx-auto rounded-2xl p-2 space-y-2 ring-1 ring-neutral-100 dark:ring-neutral-900">
      <header className="flex items-center gap-2">
        <div className="relative h-10 w-10 rounded-full bg-violet-100 flex justify-center items-center border border-neutral-100 dark:border-neutral-700">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt={`${firstName} ${lastName} profile picture`}
              className="object-cover rounded-full pointer-events-none select-none"
              sizes="10vh"
              fill
            />
          ) : (
            <AiOutlineUser size={20} />
          )}
        </div>
        <div>
          <h3 className="text-base font-semibold">
            {firstName} {lastName}
          </h3>
          <h4 className="text-xs font-light flex items-center gap-1 text-slate-400 dark:text-neutral-500 select-none">
            <Tooltip>
              <TooltipTrigger>
                <span>
                  {visibility == "public" ? <FaGlobeAmericas /> : <FaUsers />}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {visibility == "public" ? "Everyone" : "Followers"}
              </TooltipContent>
            </Tooltip>
            {time}
          </h4>
        </div>

        {/* <div className="flex-1 text-right select-none">
          {!selfPost && (
            <button
              className={cn(
                "px-2 py-1 rounded-full text-sm bg-gradient-to-br text-white",
                isFollowing
                  ? "px-2 py-1 rounded-full text-sm bg-gradient-to-br text-white from-neutral-300 to-neutral-400"
                  : "from-violet-400 to-indigo-400 shadow-inner "
              )}
              onClick={() => {
                onFollowChange(isFollowing, authorId);
              }}
            >
              {isFollowing ? (
                <div className="flex gap-1 items-center justify-center">
                  <p>Unfollow</p>
                </div>
              ) : (
                <div className="flex gap-1 items-center justify-center">
                  <p>Follow</p>
                </div>
              )}
            </button>
          )}

          {selfPost && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-2 p-2 rounded-full dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700">
                  <SlOptionsVertical />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <AlertDialog>
                  <AlertDialogTrigger className="hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-sm w-full">
                    <div className="flex gap-2 justify-center items-center p-2">
                      {" "}
                      <span className="text-red-500">
                        <Trash2 size={14} />
                      </span>
                      <p className="text-sm dark:text-white">Delete Post</p>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Deleting will permanently remove all content, comments,
                      and replies associated with this post.
                      <br />
                      <br />
                      <span className="text-sm">
                        This action cannot be undone.
                      </span>
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <DropdownMenuItem className="focus:bg-transparent focus:hover:bg-transparent gap-2">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 hover:bg-red-600 text-white dark:text-neutral-900"
                          onClick={() => onDelete(id)}
                        >
                          <span className=" mr-2">
                            <Trash2 size={14} />
                          </span>
                          Delete
                        </AlertDialogAction>
                      </DropdownMenuItem>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div> */}
        <div className="flex-1 text-right">
          <Button
            className="px-2 py-1 rounded-full text-sm bg-gradient-to-br text-white from-violet-400 to-indigo-400 shadow-inner"
            onClick={() => router.push(`/dashboard/community/${id}`)}
          >
            View Post
          </Button>
        </div>
      </header>
      {body}
      <footer>
        <nav className="flex justify-between">
          <article className="flex">
            <div className="flex items-center">
              <button
                className="text-rose-500 h-10 w-10 flex justify-center items-center hover:bg-rose-100 dark:hover:bg-neutral-700 rounded-full"
                onClick={handleLikeChange}
              >
                <span
                  className={cn("text-2xl font-bold", liked && "animate-pulse")}
                >
                  {liked ? <GoHeartFill /> : <GoHeart />}
                </span>
              </button>

              <span className="text-sm font-semibold">
                {likes?.length > 0 ? likes.length : ""}
              </span>
            </div>
            <div className="flex items-center">
              <button
                className="text-orange-500 h-10 w-10 flex justify-center items-center hover:bg-orange-100 dark:hover:bg-neutral-700 rounded-full"
                onClick={() => setCommentOpen((prev) => !prev)}
              >
                <span className="text-2xl font-bold">
                  {commentOpen ? <IoChatbubble /> : <IoChatbubbleOutline />}
                </span>
              </button>
              <span className="text-sm font-semibold">
                {totalComments > 0 ? totalComments : ""}
              </span>
            </div>
          </article>
          <ShareButtonDialog postId={id} />
        </nav>
        <CommentsSection
          open={commentOpen}
          postId={id}
          loading={commentLoading}
          comments={comments}
          refetchComments={fetchComments}
          updateComments={setComments}
          updateTotalComments={setTotalComments}
          user={session?.user}
        />
      </footer>
    </article>
  );
};

const CommentsSection = ({
  open,
  loading = false,
  postId,
  comments: defaultComments,
  refetchComments = () => {},
  updateComments = () => {},
  updateTotalComments = () => {},
  user,
}) => {
  const [comments, setComments] = useState(defaultComments);
  const [visibleComments, setVisibleComments] = useState(4);

  const loadMoreComments = () => {
    setVisibleComments((prev) => prev + 4); // Increase by 4
  };

  const handleAddComment = async (commentText = "") => {
    if (commentText.trim() === "") {
      return null;
    }
    return await axios
      .post(`/api/post/${postId}/comment/add`, {
        commentText,
      })
      .then((response) => {
        if (response?.data?.success) {
          updateTotalComments((prev) => prev + 1);
          setComments((prevComments) => [...prevComments, response.data.data]);
          return response.data.data;
        }
        return null;
      })
      .catch((error) => {
        return null;
      });
  };

  const handleCommentDelete = async (commentId) => {
    return await axios
      .delete(`/api/post/${postId}/comment/${commentId}/delete`)
      .then((response) => {
        if (response?.data?.success) {
          const deletedCommentIds = response.data.data;

          updateTotalComments((prev) => prev - deletedCommentIds?.length || 1);
          refetchComments();
          return response.data.data;
        }
        return null;
      })
      .catch((error) => {
        return null;
      });
  };

  useEffect(() => {
    comments && setComments(defaultComments);
  }, [defaultComments]);

  if (!open) return null;

  if (loading)
    return (
      <div className="py-4">
        <Loader2 className="h-10 w-10 mx-auto animate-spin" />
      </div>
    );
  return (
    <div className="mt-1 bg-neutral-200 shadow-inner dark:bg-neutral-900 p-2 rounded-lg space-y-3">
      <CommentInput
        user={user}
        onComment={(text) => {
          handleAddComment(text);
        }}
      />
      {comments &&
        comments.length > 0 &&
        comments
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, visibleComments) // Limit to visible comments
          .map((comment, i) => (
            <Comment
              key={`${comment?.id}-post-comments-list`}
              data={comment}
              updateTotalComments={updateTotalComments}
              user={user}
              postId={postId}
              onDelete={handleCommentDelete}
            />
          ))}

      {/* Show "Load More" button if there are more comments to display */}
      {visibleComments < comments?.length && (
        <button
          className="text-sm text-center font-light py-2 text-neutral-600 w-full"
          onClick={loadMoreComments}
        >
          Show More
        </button>
      )}
    </div>
  );
};

const Comment = ({
  data = {},
  updateTotalComments = () => {},
  onDelete = () => {},
  user,
  postId,
}) => {
  const [liked, setLiked] = useState(data?.likes?.includes(user?.id));
  const [likes, setLikes] = useState(data?.likes || []);
  const [replies, setReplies] = useState(data?.replies || []);
  const [replyOpen, setReplyOpen] = useState(false);
  const [visibleReplies, setVisibleReplies] = useState(4);

  // Function to load more replies
  const loadMoreReplies = () => {
    setVisibleReplies((prev) => prev + 4); // Increase by 4
  };

  const selfComment = user?.id === data?.commenter?.id;
  const firstName = data?.commenter?.firstName;
  const lastName = data?.commenter?.lastName;
  const profilePicture = data?.commenter?.profile?.profilePicture;
  const timestamp = moment(data?.updatedAt).fromNow();
  const commentId = data?.id;
  const comment = data?.comment;

  const onLikeChange = async () => {
    return await axios
      .patch(`/api/post/${postId}/comment/${commentId}/likes`)
      .then((response) => {
        if (response?.data?.success) {
          //   setLikes(response.data.data);
          const addOrRemove = liked ? "remove" : "add"; // Add or remove like

          if (addOrRemove === "add") {
            setLikes((prev) => [...prev, user?.id]);
          } else {
            setLikes((prev) => prev.filter((id) => id !== user?.id));
          }
          setLiked((prev) => !prev);
          return response.data.data;
        }
        return null;
      })
      .catch((error) => {
        return null;
      });
  };

  const handleAddReply = async (replyText = "") => {
    if (replyText.trim() === "") {
      return null;
    }
    return await axios
      .post(`/api/post/${postId}/comment/${commentId}/reply/add`, {
        replyText,
      })
      .then((response) => {
        if (response?.data?.success) {
          //   fetchComments();
          updateTotalComments((prev) => prev + 1);
          setReplies((prevReplies) => [...prevReplies, response.data.data]);
          return response.data.data;
        }
        return null;
      })
      .catch((error) => {
        return null;
      });
  };

  if (typeof data === "string") {
    return <div>{data}</div>;
  }

  return (
    <section className="">
      <header className="flex gap-2 items-center">
        <div className="relative h-6 w-6 rounded-full overflow-hidden">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt={`${firstName} ${lastName} profile picture`}
              className="object-cover"
              sizes="10vh"
              fill
            />
          ) : (
            <AiOutlineUser size={20} />
          )}
        </div>
        <div>
          <h4 className="text-xs font-semibold">
            {firstName} {lastName}
          </h4>
          <h5 className="text-[10px] font-light text-slate-400 dark:text-neutral-500">
            {timestamp}
          </h5>
        </div>

        {selfComment && (
          <div className="flex-1 text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-neutral-400 hover:bg-neutral-100 dark:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-800 p-2 rounded-full">
                  <SlOptions size={15} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => onDelete(commentId)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </header>
      <main className="pl-8 pr-4 py-1">
        <p className="break-words text-sm font-light">{comment}</p>
      </main>
      <footer className="ml-7">
        <nav className="flex justify-between">
          <article className="flex">
            <div className="flex items-center">
              <button
                className="text-rose-500 h-7 w-7 flex justify-center items-center hover:bg-rose-100 dark:hover:bg-neutral-700 rounded-full"
                onClick={() => onLikeChange(commentId)}
              >
                <span
                  className={cn("text-lg font-bold", liked && "animate-pulse")}
                >
                  {liked ? <GoHeartFill /> : <GoHeart />}
                </span>
              </button>

              <span className="text-xs font-semibold">
                {likes?.length > 0 ? likes.length : ""}
              </span>
            </div>
            <div className="flex items-center">
              <button
                className="text-orange-500 h-7 w-7 flex justify-center items-center hover:bg-orange-100 dark:hover:bg-neutral-700 rounded-full"
                onClick={() => setReplyOpen((prev) => !prev)}
              >
                <span className="text-lg font-bold">
                  {replyOpen ? <IoChatbubble /> : <IoChatbubbleOutline />}
                </span>
              </button>

              <span className="text-xs font-semibold">
                {replies?.length > 0 ? replies.length : ""}
              </span>
            </div>
          </article>
        </nav>

        {replyOpen && (
          <div className="space-y-2 py-2 pl-1">
            <CommentInput
              parentId={null}
              user={user}
              onComment={(text) => {
                handleAddReply(text);
              }}
            />

            {replies &&
              replies.length > 0 &&
              replies
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, visibleReplies) // Limit to visible replies
                .map((reply, i) => (
                  <Comment
                    key={`${reply?.id}-post-replies-list`}
                    data={reply}
                    onReply={reply}
                    user={user}
                    postId={postId}
                    onDelete={onDelete}
                    updateTotalComments={updateTotalComments}
                  />
                ))}

            {/* Show "Load More" button if there are more replies to display */}
            {visibleReplies < replies.length && (
              //   <button onClick={loadMoreReplies}>Load More</button>
              <button
                className="text-sm text-center font-light py-2 text-neutral-600 w-full"
                onClick={loadMoreReplies}
              >
                Show More
              </button>
            )}
          </div>
        )}
      </footer>
    </section>
  );
};

const CommentInput = ({ user, onComment = async () => {} }) => {
  const [commentText, setCommentText] = useState("");

  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const profilePicture = user?.profilePicture;

  return (
    <div className=" flex gap-2 items-center">
      <div>
        <div className="relative h-6 w-6 rounded-full overflow-hidden">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt={`${firstName} ${lastName} profile picture`}
              className="object-cover"
              sizes="10vh"
              fill
            />
          ) : (
            <AiOutlineUser size={20} />
          )}
        </div>
      </div>
      <textarea
        rows={1}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onComment(commentText.trim());
            setCommentText("");
          }
        }}
        placeholder="Write a reply..."
        className="resize-none w-full rounded-lg p-2 text-sm font-light focus-visible:outline-violet-500 dark:bg-neutral-950"
      />
      <div className="flex space-x-2">
        <button
          onClick={() => {
            onComment(commentText.trim());
            setCommentText("");
          }}
          className={cn(
            "p-2 bg-violet-200 dark:bg-neutral-800 rounded-lg text-white text-xl",
            commentText.trim().length > 0
              ? "bg-violet-400 dark:bg-violet-500"
              : "cursor-default"
          )}
        >
          <IoIosSend />
        </button>
      </div>
    </div>
  );
};

const PostType = ({ type, data }) => {
  const content = data?.contentData?.content;
  const media = data?.media;
  const mediaPresent = media && media.length > 0;
  const formattedMedia = media.map((m) => {
    return {
      url: m.url,
      file: {
        type: m.type,
        metadata: {
          size: m.metadata.size,
          resolution: {
            width: m.metadata.resolution.width,
            height: m.metadata.resolution.height,
          },
        },
      },
    };
  });

  return (
    <main>
      {mediaPresent && (
        <div className="aspect-square max-w-3xl">
          <Carousel media={formattedMedia} />
        </div>
      )}

      {content && content.length > 0 && (
        <p
          className={cn(
            "text-base font-light text-black dark:text-gray-100 pt-4 pb-1 pr-4",
            !mediaPresent && "pl-12"
          )}
        >
          {content}
        </p>
      )}
    </main>
  );
};

const ShareButtonDialog = ({ postId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecentUsers = async () => {
    return await axios
      .get(`/api/message/user-list`)
      .then((res) => {
        if (res.data.success) {
          setUsers(res.data.data);
          return res.data.data;
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  };

  const fetchUsers = async () => {
    setLoading(true);
    return await axios
      .get(`/api/search-users/${searchTerm}`)
      .then((res) => {
        if (res.data.success) {
          setUsers(res.data.data);
          return res.data.data;
        }
        setUsers([]);
        return [];
      })
      .catch((err) => {
        setUsers([]);
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const sharePost = async (user) => {
    return await axios
      .post(`/api/post/${postId}/share/${user?.id}`, {})
      .then((res) => {
        if (res.data.success) {
          toast.success("Post shared successfully");
          return res.data.data;
        }
        return null;
      })
      .catch((err) => {
        return null;
      });
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      fetchUsers();
    } else {
      fetchRecentUsers();
    }
  }, [searchTerm]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none" asChild>
          <button
            className="text-violet-500 h-10 w-10 flex justify-center items-center hover:bg-violet-100 dark:hover:bg-neutral-700 rounded-full"
            onClick={() => setDialogOpen(true)}
          >
            <span className="text-2xl font-bold pr-1">
              <IoShareSocialOutline />
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setDialogOpen(true)}
          >
            <span>
              <IoIosSend className="text-xl mr-1" />
            </span>
            Direct Message
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/dashboard/community/${postId}`
              );
              toast.success("Link copied to clipboard");
            }}
          >
            <span>
              <LuClipboard className="text-xl mr-1" />
            </span>
            Copy Link
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              navigator.share({
                title: "Share Post",
                text: "Check out this post",
                url: `${window.location.origin}/dashboard/community/${postId}`,
              });
            }}
          >
            <span>
              <LuShare2 className="text-xl mr-1" />
            </span>
            Share
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            {/* <Link
              href={`mailto:?subject=Check out this post&body=Check out this post: ${window.location.origin}/dashboard/community/${postId}`}
              target="_blank"
            >
              <span>
              <LuMail className="text-xl mr-1" />
              </span>
              Email
            </Link> */}
            <Link
              href={`mailto:?subject=Check out this amazing post!&body=Hi there,%0D%0A%0D%0A
  I found this post that I thought you'd be interested in:%0D%0A%0D%0A
  You can view the post by clicking the link below:%0D%0A%0D%0A
  ${window.location.origin}/dashboard/community/${postId}%0D%0A%0D%0A
  Best regards,%0D%0A[Your Name]`}
              target="_blank"
              className="flex "
            >
              <span>
                <LuMail className="text-xl mr-1" />
              </span>
              Email
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="md:max-w-screen-md">
          <DialogTitle>Share</DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-2 overflow-hidden">
            <FiSearch className="text-gray-500 dark:text-gray-400" />
            <input
              className="flex-1 bg-none bg-transparent py-2 font-light focus-visible:outline-none"
              placeholder="Find by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <main className="bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-inner">
              <Loader2 className="w-16 h-16 animate-spin mx-auto my-20" />
            </main>
          ) : users.length > 0 ? (
            <main className="space-y-2 overflow-y-auto max-h-60 p-2 shadow-inner bg-neutral-50 dark:bg-neutral-900 rounded-lg">
              {users.map((user, i) => {
                return (
                  <div
                    key={`${user?.id}-user-list`}
                    className="flex gap-2 justify-between items-center rounded-lg p-2 hover:bg-white hover:shadow-sm dark:hover:bg-neutral-950"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={
                          user?.profile?.profilePicture ||
                          "/default-user-icon.png"
                        }
                        height={50}
                        width={50}
                        className="rounded-full object-cover object-center h-[50px] w-[50px] overflow-hidden"
                        alt="user profile picture"
                      />

                      <div className="">
                        <h1 className="text-lg font-semibold">
                          {user?.firstName} {user?.lastName}
                        </h1>
                        <h3 className="text-xs font-light">{user?.email}</h3>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        sharePost(user);
                        setDialogOpen(false);
                      }}
                    >
                      <IoIosSend className="text-xl" />
                    </Button>
                  </div>
                );
              })}
            </main>
          ) : (
            <main className="bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-inner">
              <p className="text-center text-lg font-light text-neutral-300 dark:text-gray-400 py-8">
                No User Found
              </p>
            </main>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
