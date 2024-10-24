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
import { useState } from "react";
import { Button } from "@/components/ui/Button";

// Sample data for posts and sidebar items
const posts = [
  {
    id: 1,
    user: "John Doe",
    activity: "Completed a 5k run",
    time: "10 min ago",
    description: "Just finished an amazing run with my fitness buddy @JoeyB !",
    likes: 230,
    comments: 6,
    shares: 4,
  },
  {
    id: 2,
    user: "Kat Harpey",
    activity: "Created a workout group",
    time: "Thursday, 17 August 10:40 AM",
    description: "Sell or swap your workout gear. Let's connect!",
    likes: 18,
    comments: 2,
    shares: 2,
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

  const openPostWindow = () => {
    setIsPostWindowOpen(true);
  };

  const closePostWindow = () => {
    setIsPostWindowOpen(false);
  };
  const handleLike = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked, // Toggle like status
              likes: post.liked ? post.likes - 1 : post.likes + 1, 
            }
          : post
      )
    );
  };

  const handlePostSubmit = () => {
    if (postTitle && newPostText) {
      const newPost = {
        id: posts.length + 1,
        user: "Current User", 
        activity: "Posted an update",
        time: "Just now",
        description: newPostText,
        likes: 0,
        comments: 0,
        shares: 0,
      };

    setPosts([...posts, newPost]); 
    closePostWindow();
  };
}
const toggleCommentWindow = (postId) => {
  if (activeCommentPostId === postId) {
    setActiveCommentPostId(null); 
  } else {
    setActiveCommentPostId(postId); 
  }
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
          comments: [...(post.comments || []), { user: "Current User", comment: newCommentText }],
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
  return (
    
    <div className="min-h-screen flex bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-gray-200">
      {/* Left Sidebar */}
      <aside className="w-1/5 bg-white dark:bg-neutral-800 p-6 space-y-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Community Hub</h2>
        <nav className="space-y-3">
          <button
            className={` w-full text-left flex items-center space-x-2 py-2 transition-all duration-200 ${
              selectedFilter === "Home"
                ? "bg-purple-200 dark:bg-purple-600 text-gray-900 dark:text-white rounded-lg"
                : "text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setSelectedFilter("Home")}
          >
            <Home className="text-gray-600 dark:text-gray-300" />
            <span>Home</span>
          </button>
          <button
            className={` w-full text-left flex items-center space-x-2 py-2 transition-all duration-200 ${
              selectedFilter === "Profile"
                ? "bg-purple-200 dark:bg-purple-600 text-gray-900 dark:text-white rounded-lg"
                : "text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setSelectedFilter("Profile")}
          >
            <User className="text-gray-600 dark:text-gray-300" />
            <span>Profile</span>
          </button>
        </nav>

        <h3 className="font-semibold mt-8">Favorites</h3>
        <ul className="space-y-3">
          <li
            className={`flex items-center space-x-2 py-2 transition-all duration-200 ${
              selectedFilter === "Messages"
                ? "bg-purple-200 dark:bg-purple-600 text-gray-900 dark:text-white rounded-lg"
                : "text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setSelectedFilter("Messages")}
          >
            <MessageCircle className="text-gray-600 dark:text-gray-300" />
            <span>Messages</span>
          </li>
          <li
            className={`flex items-center space-x-2 py-2 transition-all duration-200 ${
              selectedFilter === "Friends"
                ? "bg-purple-200 dark:bg-purple-600 text-gray-900 dark:text-white rounded-lg"
                : "text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setSelectedFilter("Friends")}
          >
            <Users className="text-gray-600 dark:text-gray-300" />
            <span>Friends</span>
          </li>
          <li
            className={`flex items-center space-x-2 py-2 transition-all duration-200 ${
              selectedFilter === "Feed"
                ? "bg-purple-200 dark:bg-purple-600 text-gray-900 dark:text-white rounded-lg"
                : "text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setSelectedFilter("Feed")}
          >
            <Activity className="text-gray-600 dark:text-gray-300" />
            <span>Feed</span>
          </li>
          <li
            className={`flex items-center space-x-2 py-2 transition-all duration-200 ${
              selectedFilter === "Stories"
                ? "bg-purple-200 dark:bg-purple-600 text-gray-900 dark:text-white rounded-lg"
                : "text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setSelectedFilter("Stories")}
          >
            <Star className="text-gray-600 dark:text-gray-300" />
            <span>Stories</span>
          </li>
          <li
            className={`flex items-center space-x-2 py-2 transition-all duration-200 ${
              selectedFilter === "Events"
                ? "bg-purple-200 dark:bg-purple-600 text-gray-900 dark:text-white rounded-lg"
                : "text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setSelectedFilter("Events")}
          >
            <Bell className="text-gray-600 dark:text-gray-300" />
            <span>Events</span>
          </li>
          <li
            className={`flex items-center space-x-2 py-2 transition-all duration-200 ${
              selectedFilter === "Progress"
                ? "bg-purple-200 dark:bg-purple-600 text-gray-900 dark:text-white rounded-lg"
                : "text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setSelectedFilter("Progress")}
          >
            <Activity className="text-gray-600 dark:text-gray-300" />
            <span>Progress Tracker</span>
          </li>
        </ul>

        <h3 className="font-semibold mt-8">Groups</h3>
        <ul className="space-y-3">
          <li
            className={`flex items-center space-x-2 py-2 transition-all duration-200 ${
              selectedFilter === "Gym RatZzZ"
                ? "bg-purple-200 dark:bg-purple-600 text-gray-900 dark:text-white rounded-lg"
                : "text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setSelectedFilter("Gym RatZzZ")}
          >
            <Users className="text-gray-600 dark:text-gray-300" />
            <span>Gym RatZzZ</span>
          </li>
          <li
            className={`flex items-center space-x-2 py-2 transition-all duration-200 ${
              selectedFilter === "Pet Fitness"
                ? "bg-purple-200 dark:bg-purple-600 text-gray-900 dark:text-white rounded-lg"
                : "text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setSelectedFilter("Pet Fitness")}
          >
            <Users className="text-gray-600 dark:text-gray-300" />
            <span>Pet Fitness</span>
          </li>
          <li
            className={`flex items-center space-x-2 py-2 transition-all duration-200 ${
              selectedFilter === "Fitness Memes"
                ? "bg-purple-200 dark:bg-purple-600 text-gray-900 dark:text-white rounded-lg"
                : "text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setSelectedFilter("Fitness Memes")}
          >
            <Users className="text-gray-600 dark:text-gray-300" />
            <span>Fitness Memes</span>
          </li>
        </ul>

        <div className="space-y-4 mt-10">
          <button
            className={` w-full text-left flex items-center space-x-2 py-2 transition-all duration-200 ${
              selectedFilter === "Help"
                ? "bg-purple-200 dark:bg-purple-600 text-gray-900 dark:text-white rounded-lg"
                : "text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setSelectedFilter("Help")}
          >
            <HelpCircle className="text-gray-600 dark:text-gray-300" />
            <span>Help & Support</span>
          </button>
          <button
            className={`w-full text-left flex items-center space-x-2 py-2 transition-all duration-200 ${
              selectedFilter === "Logout"
                ? "bg-purple-200 dark:bg-purple-600 text-gray-900 dark:text-white rounded-lg"
                : "text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setSelectedFilter("Logout")}
          >
            <LogOut className="text-gray-600 dark:text-gray-300" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="w-3/5 p-8">
        <div className="flex justify-between items-center mb-6 px-4">
          <div className="relative flex-shrink-0 w-full max-w-xs">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 rounded-full bg-gray-200 dark:bg-neutral-700 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -tranneutral-y-1/2 text-gray-500" />
          </div>

          {/* Buttons */}
          <div className="flex space-x-2 ml-4 overflow-x-auto whitespace-nowrap">
            <button
              className={`px-4 py-2 rounded-full ${
                selectedFilter === "All"
                  ? "bg-purple-300 dark:bg-purple-600"
                  : "bg-gray-200 dark:bg-neutral-600"
              }`}
              onClick={() => setSelectedFilter("All")}
            >
              All
            </button>

            <button
              className={`px-4 py-2 rounded-full ${
                selectedFilter === "Chats"
                  ? "bg-purple-300 dark:bg-purple-600"
                  : "bg-gray-200 dark:bg-neutral-600"
              }`}
              onClick={() => setSelectedFilter("Chats")}
            >
              Chats
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                selectedFilter === "Events"
                  ? "bg-purple-300 dark:bg-purple-600"
                  : "bg-gray-200 dark:bg-neutral-600"
              }`}
              onClick={() => setSelectedFilter("Events")}
            >
              Events
            </button>
          </div>
        </div>
          {/* Post Button */}
          <div>
          <button
              className="px-4 py-2 bg-purple-500 text-white rounded-full"
              onClick={openPostWindow}
            >
              Create Post
            </button>
        </div>
        {/* Posts Section */}
        <section className="space-y-6">
          
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow relative"
            >
              <header className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{post.user}</h3>
                  <p className="text-gray-500 text-sm">{post.activity}</p>
                </div>
              </header>
              <p className="mt-4">{post.description}</p>
              <footer className="flex justify-between items-center mt-4">
                <div className="flex space-x-4">
                <button
                    className="flex items-center space-x-1"
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart
                      className={post.liked ? "text-red-600" : "text-red-600"}
                      fill={post.liked ? "currentColor" : "none"}
                    />
                    <span>{post.likes}</span>
                  </button>
                  <button 
                 className="flex items-center space-x-1"
                   onClick={() => toggleCommentWindow(post.id)} 
                >
               <MessageSquare />
                 <span>{post.comments.length}</span> {}
                  </button>
                  <button className="flex items-center space-x-1">
                    <Share />
                    <span>{post.shares}</span>
                  </button>
                </div>
                
                <p className="absolute right-6 bottom-6 text-gray-500 text-sm">
                  {post.time}
                </p>
                
              </footer>
         {/* Comments Button */}
           <div className="flex justify-center mt-4 -mt-8">
          <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          onClick={() => toggleComments(post.id)}
          >
          {activeCommentPostId === post.id ? "Hide Comments" : "View Comments"}
        </button>
      </div>

                {/* Comments Section */}
                  {post.comments.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold">Comments:</h4>
                  {post.comments.map((comment, index) => (
                    <p key={index} className="mt-2 text-sm">
                      <span className="font-semibold">{comment.user}:</span> {comment.comment}
                    </p>
                  ))}
                </div>
              )}

              {/* Comment Input Window */}
              {activeCommentPostId === post.id && (
                <div className="mt-4">
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full p-3 bg-gray-200 dark:bg-neutral-700 rounded-lg"
                    placeholder="Write a comment..."
                    rows={2}
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Submit Comment
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
      {/* Post Window */}
      {isPostWindowOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white dark:bg-neutral-800 w-full max-w-md p-6 rounded-lg shadow-lg">

              <button
                onClick={closePostWindow}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X />
              </button>
      {/* Title Input */}
      <div className="flex flex-col mb-4">
        <input
          type="text"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          className="w-full p-3 bg-gray-200 dark:bg-neutral-700 rounded-lg"
          placeholder="Enter post title"
        />
            </div>

            {/* Post Content Input */}
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="w-full p-3 bg-gray-200 dark:bg-neutral-700 rounded-lg mb-4"
              placeholder="What's on your mind?"
              rows={5}
            ></textarea>

            {/* Submit Button */}
            <button
              onClick={handlePostSubmit}
              className="w-full py-2 bg-blue-500 text-white rounded-lg"
            >
              Submit Post
            </button>
          </div>
        </div>
      )}

      {/* Right Sidebar */}
      <aside className="w-1/5 bg-white dark:bg-neutral-800 p-6 space-y-8 rounded-lg shadow-lg ml-6">
        {" "}
        {/* Increased margin */}
        <h3 className="font-semibold">Community Chats</h3>
        <ul className="space-y-2">
          <li>Dog Walkers LI</li>
          <li>Copenhagen Gyms</li>
        </ul>
        <h3 className="font-semibold">Search for Workouts</h3>
        <div>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-200 dark:bg-neutral-700"
            placeholder="Enter workout"
          />
        </div>
        <h3 className="font-semibold">Advertisement</h3>
        <div className="bg-gray-200 dark:bg-neutral-700 p-4 rounded-lg">
          <p>
            Summer sale is on! Buy your favorite fitness gear up to 70% off.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default CommunityPage;
