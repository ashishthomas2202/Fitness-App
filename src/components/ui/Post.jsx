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
import { GoComment, GoHeart, GoHeartFill } from "react-icons/go";
import {
  IoChatbubbleOutline,
  IoChatbubble,
  IoShareSocialOutline,
} from "react-icons/io5";

import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";
import { IoIosSend } from "react-icons/io";
import { SlOptions } from "react-icons/sl";
import { FiMinus, FiPlus } from "react-icons/fi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { set } from "mongoose";

export const Post = ({
  data: post = {},
  onLikeChange = async () => {},
  onCommentAdd = async () => {},
}) => {
  const [likes, setLikes] = useState(post?.likes || []);
  const [liked, setLiked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const { data: session } = useSession();

  const id = post?.id;
  const profilePicture = post?.author?.profile?.profilePicture;
  const firstName = post?.author?.firstName;
  const lastName = post?.author?.lastName;
  const type = post?.contentType;
  const time = moment(post?.createdAt).fromNow();
  const visibility = post?.visibility;
  let body = null;

  //   const fetchComments = async () => {
  //     await getComments(id).then((receivedComments) => {
  //       setCommentLoading(true);
  //       setComments(receivedComments);
  //       setCommentLoading(false);
  //     });
  //   };

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

  const handleAddComment = async (commentText = "") => {
    if (commentText.trim() === "") {
      return null;
    }
    return await axios
      .post(`/api/post/${id}/comment/add`, {
        commentText,
      })
      .then((response) => {
        if (response?.data?.success) {
          fetchComments();
          return response.data.data;
        }
        return null;
      })
      .catch((error) => {
        return null;
      });
  };

  const handleAddReply = async (commentId, replyText = "") => {
    if (replyText.trim() === "") {
      return null;
    }
    return await axios
      .post(`/api/post/${id}/comment/${commentId}/reply/add`, {
        replyText,
      })
      .then((response) => {
        if (response?.data?.success) {
          fetchComments();
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

  return (
    <article className="bg-neutral-100 dark:bg-neutral-800  max-w-lg mx-auto rounded-2xl p-2 space-y-2 ring-1 ring-neutral-100 dark:ring-neutral-900">
      <header className="flex items-center gap-2">
        <div className="relative h-10 w-10 rounded-full bg-violet-100 flex justify-center items-center border border-neutral-100 dark:border-neutral-700">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt={`${firstName} ${lastName} profile picture`}
              className="object-cover rounded-full"
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
          <h4 className="text-xs font-light flex items-center gap-1 text-slate-400 dark:text-neutral-500">
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

        <div className="flex-1 text-right">
          <button
            className={cn(
              "px-4 py-1 rounded-full text-sm bg-gradient-to-br text-white",
              isFollowing
                ? "from-neutral-300 to-neutral-400"
                : "from-violet-400 to-indigo-400 shadow-inner "
            )}
            onClick={() => {
              setIsFollowing((prev) => !prev);
            }}
          >
            {isFollowing ? (
              <div className="flex gap-1 items-center justify-center">
                <FiMinus />
                <p>Unfollow</p>
              </div>
            ) : (
              <div className="flex gap-1 items-center justify-center">
                <FiPlus />
                <p>Follow</p>
              </div>
            )}
          </button>
        </div>
      </header>
      {body}
      <footer>
        <nav className="flex justify-between">
          <article className="flex">
            <div className="flex items-center">
              <button
                className="text-rose-500 h-10 w-10 flex justify-center items-center hover:bg-rose-100 dark:hover:bg-neutral-700 rounded-full"
                onClick={() => onLikeChange(id)}
              >
                <span
                  className={cn("text-2xl font-bold", liked && "animate-pulse")}
                >
                  {liked ? <GoHeartFill /> : <GoHeart />}
                </span>
              </button>
              {likes && likes.length > 0 && (
                <span className="text-sm font-semibold">{likes.length}</span>
              )}
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
              {comments && comments.length > 0 && (
                <span className="text-sm font-semibold">{comments.length}</span>
              )}
            </div>
          </article>
          <button className="text-violet-500 h-10 w-10 flex justify-center items-center hover:bg-violet-100 dark:hover:bg-neutral-700 rounded-full">
            <span className="text-2xl font-bold pr-1">
              <IoShareSocialOutline />
            </span>
          </button>
        </nav>
        <CommentsSection
          open={commentOpen}
          postId={id}
          loading={commentLoading}
          comments={comments}
          onCommentAdd={handleAddComment}
          onReplyAdd={handleAddReply}
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
  comments,
  onCommentAdd,
  parentReplyId,
  replies,
  onReplyAdd,
  user,
}) => {
  if (!open) return null;

  if (loading)
    return (
      <div>
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );

  return (
    <div className="mt-1 bg-neutral-200 shadow-inner dark:bg-neutral-900 p-2 rounded-lg space-y-4">
      <CommentInput
        parentId={null}
        user={user}
        onComment={(text) => {
          if (!parentReplyId) {
            onCommentAdd(text);
          } else {
            onReplyAdd(parentReplyId, text);
          }
        }}
      />
      {/* {console.log("comments", comments)} */}

      {comments &&
        comments.length > 0 &&
        comments
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .map((comment, i) => (
            <Comment
              key={`${comment?.id}-post-comments-list`}
              data={comment}
              onReply={onReplyAdd}
              user={user}
              postId={postId}
            />
          ))}
      {replies &&
        replies.length > 0 &&
        replies.map((reply, i) => (
          <Comment
            key={`${reply?.id}-post-replies-list`}
            data={reply}
            onReply={onReplyAdd}
            user={user}
            postId={postId}
          />
        ))}

      {/* Render comments
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} onReply={handleReply} />
      ))} */}
    </div>
  );
};

const Comment = ({ data = {}, user, postId, onReply }) => {
  //   console.log("comment", data);
  const [liked, setLiked] = useState(data?.likes?.includes(user?.id));
  const [likes, setLikes] = useState(data?.likes || []);
  const [replies, setReplies] = useState(data?.replies || []);
  const [replyOpen, setReplyOpen] = useState(false);

  const selfComment = user?.id === data?.commenter?.id;
  const firstName = data?.commenter?.firstName;
  const lastName = data?.commenter?.lastName;
  const profilePicture = data?.commenter?.profile?.profilePicture;
  const timestamp = moment(data?.updatedAt).fromNow();
  const commentId = data?.id;
  const comment = data?.comment;
  const formattedComment = comment.split("\n").map((str, i) => (
    <p
      key={`${commentId}-comment-${i}`}
      className="break-words text-sm font-light"
    >
      {str.length > 0 ? str : <br />}
    </p>
  ));
  //   console.log("comment", data);
  //   const formattedComment = "Hello";
  //   const comment = data?.comment;
  const onLikeChange = async (commentId) => {
    setLiked((prev) => !prev);
    if (liked) {
      setLikes((prev) => prev.filter((id) => id !== user?.id));
    } else {
      setLikes((prev) => [...prev, user?.id]);
    }
  };

  if (typeof data === "string") {
    return <div>{data}</div>;
  }

  return (
    <section className="ml-2">
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
          <h4 className="text-sm font-semibold">
            {firstName} {lastName}
          </h4>
          <h5 className="text-xs font-light text-slate-400 dark:text-neutral-500">
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
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </header>
      <main className="pl-8 pr-4">{formattedComment}</main>
      <footer className="ml-4">
        <nav className="flex justify-between">
          <article className="flex">
            <div className="flex items-center">
              <button
                className="text-rose-500 h-8 w-8 flex justify-center items-center hover:bg-rose-100 dark:hover:bg-neutral-700 rounded-full"
                onClick={() => onLikeChange(commentId)}
              >
                <span
                  className={cn("text-xl font-bold", liked && "animate-pulse")}
                >
                  {liked ? <GoHeartFill /> : <GoHeart />}
                </span>
              </button>
              {likes && likes.length > 0 && (
                <span className="text-sm font-semibold">{likes.length}</span>
              )}
            </div>
            <div className="flex items-center">
              <button
                className="text-orange-500 h-8 w-8 flex justify-center items-center hover:bg-orange-100 dark:hover:bg-neutral-700 rounded-full"
                onClick={() => setReplyOpen((prev) => !prev)}
              >
                <span className="text-xl font-bold">
                  {replyOpen ? <IoChatbubble /> : <IoChatbubbleOutline />}
                </span>
              </button>
              {replies && replies.length > 0 && (
                <span className="text-sm font-semibold">{replies.length}</span>
              )}
            </div>
          </article>
        </nav>
        <CommentsSection
          open={replyOpen}
          postId={postId}
          replies={replies}
          onReplyAdd={onReply}
          parentReplyId={commentId}
          user={user}
        />
      </footer>
    </section>
  );
};
// const Comment = ({ comment, onReply }) => {
//   const [showReplyInput, setShowReplyInput] = useState(false);

//   const handleReplyClick = () => {
//     setShowReplyInput(!showReplyInput);
//     onReply(comment._id);
//   };

//   return (
//     <div className="pl-4 my-2">
//       {/* Display comment */}
//       <div className="bg-white dark:bg-neutral-800 p-2 rounded-md">
//         <div className="font-bold">{comment.commenter?.firstName}</div>
//         <div className="text-sm">{comment.comment}</div>
//         <button
//           className="text-xs text-blue-500 mt-1"
//           onClick={handleReplyClick}
//         >
//           Reply
//         </button>
//       </div>

//       {/* Show reply input if this comment is being replied to */}
//       {showReplyInput && (
//         <ReplyInput
//           parentId={comment._id}
//           onReply={onReply}
//           onCancel={() => setShowReplyInput(false)}
//         />
//       )}

//       {/* Recursive rendering of replies */}
//       {comment.replies && comment.replies.length > 0 && (
//         <div className="ml-4 border-l-2 border-gray-200 dark:border-neutral-800">
//           {comment.replies.map((reply) => (
//             <Comment key={reply._id} comment={reply} onReply={onReply} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

const CommentInput = ({ user, onComment = async () => {} }) => {
  const [commentText, setCommentText] = useState("");

  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const profilePicture = user?.profilePicture;

  return (
    <div className=" flex gap-2 items-center">
      <div>
        <div className="relative h-8 w-8 rounded-full overflow-hidden">
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
        placeholder="Write a reply..."
        className="resize-none w-full rounded-lg p-2 text-base font-light focus-visible:outline-violet-500 dark:bg-neutral-950"
      />
      <div className="flex space-x-2">
        <button
          onClick={() => {
            onComment(commentText.trim());
            setCommentText("");
          }}
          className={cn(
            "p-2 bg-violet-200 dark:bg-neutral-800 rounded-lg text-white text-2xl",
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

const ReplyInput = ({
  user,
  parentId,
  onCancel = () => {},
  onReply = async () => {},
}) => {
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = async () => {
    if (replyText.trim()) {
      // Send reply to server, including parentId
      // This example assumes an API function addReply
      await onReply(parentId, replyText);
      setReplyText("");
      onCancel();
    }
  };

  return (
    <div className="mt-2">
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write a reply..."
        className="resize-none mb-2  w-full rounded-lg p-2 text-base font-light focus-visible:outline-violet-500"
      />
      <div className="flex space-x-2">
        <button onClick={handleReplySubmit} size="sm">
          Submit
        </button>
        <button onClick={onCancel} size="sm" variant="outline">
          Cancel
        </button>
      </div>
    </div>
  );
};

const PostType = ({ type, data }) => {
  const content = data?.contentData?.content;
  const media = data?.media;
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
      {formattedMedia && formattedMedia.length > 0 && (
        <div className="aspect-square max-w-lg">
          <Carousel media={formattedMedia} />
        </div>
      )}

      {content && content.length > 0 && (
        <p className="text-base font-light text-black dark:text-gray-100 pt-4 pb-1">
          {content}
        </p>
      )}
    </main>
  );
};
// export const Post = ({ data }) => {
//   if (!data) return null;

//   const {
//     author,
//     contentType,
//     contentData,
//     createdAt,
//     likes = [],
//     comments = [],
//     visibility,
//   } = data;

//   const formattedDate = new Date(createdAt).toLocaleString();

//   return (
//     <div className="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-800 mb-4">
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-semibold">{author}</h3>
//         <span className="text-sm text-gray-500">{formattedDate}</span>
//       </div>
//       <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
//         {visibility === "public" ? "Public" : "Private"}
//       </p>
//       <div className="mt-2">
//         <p className="text-sm font-medium">{contentType}</p>
//         <div className="text-base text-gray-800 dark:text-gray-200 mt-2">
//           {typeof contentData === "string"
//             ? contentData
//             : JSON.stringify(contentData)}
//         </div>
//       </div>
//       <div className="mt-4">
//         <p className="text-sm font-semibold">Likes: {likes.length}</p>
//         <div className="mt-2">
//           <h4 className="text-sm font-semibold">Comments:</h4>
//           {comments.length > 0 ? (
//             comments.map((comment, index) => (
//               <div
//                 key={index}
//                 className="mt-1 text-gray-700 dark:text-gray-300 text-sm"
//               >
//                 <p>
//                   <strong>{comment.commenter}</strong>: {comment.comment}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 dark:text-gray-400 text-sm">
//               No comments yet
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // import React from "react";
// // import moment from "moment-timezone";

// // export const Post = ({ data: post = {} }) => {
// //   return (
// //     <div
// //       key={post?.id}
// //       className="relative bg-white dark:bg-neutral-700 p-6 rounded-lg shadow"
// //     >
// //       {/* Tag Label at the Top Right */}
// //       {post?.tag && (
// //         <div className={`absolute top-2 right-2 flex items-center space-x-2`}>
// //           <div
// //             className={`w-4 h-4 rounded-full ${
// //               post.tag === "Workout Plan"
// //                 ? "bg-blue-500"
// //                 : post.tag === "Meal Plan"
// //                 ? "bg-green-500"
// //                 : post.tag === "Event"
// //                 ? "bg-yellow-500"
// //                 : "bg-gray-500"
// //             }`}
// //           ></div>
// //           <span
// //             className={`text-sm font-medium ${
// //               post.tag === "Workout Plan"
// //                 ? "text-blue-500"
// //                 : post.tag === "Meal Plan"
// //                 ? "text-green-500"
// //                 : post.tag === "Event"
// //                 ? "text-yellow-500"
// //                 : "text-gray-500"
// //             }`}
// //           >
// //             {post.tag}
// //           </span>
// //         </div>
// //       )}

// //       <header className="flex items-center justify-between">
// //         <div>
// //           <h3 className="text-xl font-semibold">
// //             {post?.userId?.firstName} {post?.userId?.lastName}
// //           </h3>
// //           <p className="text-gray-500 text-sm">
// //             {moment(post?.date).fromNow()}
// //           </p>
// //           <p className="text-gray-500 text-sm">{post?.title}</p>
// //         </div>
// //       </header>
// //       <p className="mt-4">{post?.description}</p>
// //       <footer className="flex justify-between items-center mt-4">
// //         <div className="flex space-x-4">
// //           <button
// //             className="flex items-center space-x-1"
// //             onClick={() => handleLike(post)}
// //           >
// //             <Heart
// //               className={checklike(post) ? "text-red-600" : "text-red-600"}
// //               fill={checklike(post) ? "currentColor" : "none"}
// //             />
// //             <span>{post?.likes?.length || 0}</span>
// //           </button>
// //           <button
// //             className="flex items-center space-x-1"
// //             onClick={() => toggleCommentWindow(post.id)}
// //           >
// //             <MessageSquare />
// //             <span>{countComments(post)}</span>
// //           </button>
// //           <button className="flex items-center space-x-1">
// //             <Share />
// //             <span>{post.shares}</span>
// //           </button>
// //         </div>

// //         <p className="absolute right-6 bottom-6 text-gray-500 text-sm">
// //           {post.time}
// //         </p>
// //       </footer>
// //       <div>
// //         {/* Comments Section */}
// //         {activeCommentPostId === post.id && (
// //           <CommentsSection
// //             post={post}
// //             handleAddComment={handleAddComment}
// //             newCommentText={newCommentText}
// //             setNewCommentText={setNewCommentText}
// //             handleCommentSubmit={handleCommentSubmit}
// //           />
// //         )}
// //       </div>
// //     </div>
// //   );
// // };
