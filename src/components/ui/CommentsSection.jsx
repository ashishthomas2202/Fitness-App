import React, { useState, useEffect } from 'react';
import moment from 'moment';

const CommentsSection = ({ post, handleAddComment = () => {}, session }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [reply, setReply] = useState({ text: '', commentId: null });

  const formatDate = (date) => {
    return moment(date).fromNow();
  };

  const handleAdd = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now().toString(), // Unique id for the comment
        userId: session?.user, // Updated to use session
        comment: comment,
        date: new Date().toISOString(),
        subComments: [], 
      };
      const updatedComments = [newComment, ...comments];
      setComments(updatedComments);
      setComment('');
      handleAddComment({ ...post, comments: updatedComments });
    }
  };

  const handleReply = (parentCommentId) => {
    if (reply.text.trim()) {
      const updatedComments = comments.map((cmt) => {
        if (cmt.id === parentCommentId) {
          const newReply = {
            id: Date.now().toString(), // Unique id for the reply
            userId: session?.user, // Updated to use session
            comment: reply.text,
            date: new Date().toISOString(),
            subComments: [], 
          };
          return {
            ...cmt,
            subComments: [...(cmt.subComments || []), newReply], // Update to subComments
          };
        }
        return cmt;
      });

      setComments(updatedComments);
      setReply({ text: '', commentId: null });
      handleAddComment({ ...post, comments: updatedComments });
    }
  };

  useEffect(() => {
    setComments(post.comments || []);
  }, [post]);

  const renderComments = (comments) => {
    return comments.map((cmt) => (
      <li key={cmt.id} className="my-2">
        <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-lg flex justify-between items-center">
          <div>
            <strong>
              {cmt.userId?.firstName || 'Anonymous'} {cmt.userId?.lastName || ''}
            </strong>: {cmt.comment}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(cmt.date)}
            </div>
          </div>
          <button
            onClick={() => setReply({ text: '', commentId: cmt.id })}
            className="text-blue-500 ml-2"
          >
            Reply
          </button>
        </div>
        {reply.commentId === cmt.id && (
          <div className="ml-6 mt-2">
            <textarea
              value={reply.text}
              onChange={(e) => setReply({ ...reply, text: e.target.value })}
              className="w-full p-2 bg-gray-200 dark:bg-neutral-700 rounded-lg"
              placeholder="Write a reply..."
              rows={1}
            />
            <button
              onClick={() => handleReply(cmt.id)}
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg"
            >
              Submit Reply
            </button>
          </div>
        )}
        {cmt.subComments && cmt.subComments.length > 0 && (
          <ul className="ml-4 mt-2 border-l-2 border-gray-300 dark:border-neutral-700 pl-4">
            {renderComments(cmt.subComments)} 
          </ul>
        )}
      </li>
    ));
  };

  return (
    <div className="comments-section">
      <div className="mt-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 bg-gray-200 dark:bg-neutral-700 rounded-lg"
          placeholder="Write a comment..."
          rows={2}
        />
        <button
          onClick={handleAdd}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Submit Comment
        </button>
      </div>
      <h3>Comments</h3>
      <ul>
        {renderComments(comments)}
      </ul>
    </div>
  );
};

export default CommentsSection;

// import React, { useState, useEffect } from 'react';
// import moment from 'moment';

// const CommentsSection = ({ post, handleAddComment = () => {}, session }) => {
//   const [comment, setComment] = useState('');
//   const [comments, setComments] = useState(post.comments || []);
//   const [reply, setReply] = useState({ text: '', commentId: null });

//   const formatDate = (date) => {
//     return moment(date).fromNow();
//   };

//   const handleAdd = () => {
//     if (comment.trim()) {
//       const newComment = {
//         id: Date.now().toString(), // Unique id for the comment
//         userId: session?.user, // Updated to use session
//         comment: comment,
//         date: new Date().toISOString(),
//         subComments: [], 
//       };
//       const updatedComments = [newComment, ...comments];
//       setComments(updatedComments);
//       setComment('');
//       handleAddComment({ ...post, comments: updatedComments });
//     }
//   };

//   const handleReply = (parentCommentId) => {
//     if (reply.text.trim()) {
//       const updatedComments = comments.map((cmt) => {
//         if (cmt.id === parentCommentId) {
//           const newReply = {
//             id: Date.now().toString(), // Unique id for the reply
//             userId: session?.user, // Updated to use session
//             comment: reply.text,
//             date: new Date().toISOString(),
//             subComments: [], 
//           };
//           return {
//             ...cmt,
//             subComments: [...(cmt.subComments || []), newReply], // Update to subComments
//           };
//         }
//         return cmt;
//       });

//       setComments(updatedComments);
//       setReply({ text: '', commentId: null });
//       handleAddComment({ ...post, comments: updatedComments });
//     }
//   };

//   useEffect(() => {
//     setComments(post.comments || []);
//   }, [post]);

//   const renderComments = (comments) => {
//     return comments.map((cmt) => (
//       <li key={cmt.id} className="my-2">
//         <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-lg flex justify-between items-center">
//           <div>
//             <strong>
//               {cmt.userId?.firstName || 'Anonymous'} {cmt.userId?.lastName || ''}
//             </strong>: {cmt.comment}
//             <div className="text-sm text-gray-500 dark:text-gray-400">
//               {formatDate(cmt.date)}
//             </div>
//           </div>
//           <button
//             onClick={() => {
//               // If the clicked reply is already open, close it; otherwise, open it
//               setReply((prev) => ({
//                 text: '',
//                 commentId: prev.commentId === cmt.id ? null : cmt.id,
//               }));
//             }}
//             className="text-blue-500 ml-2"
//           >
//             Reply
//           </button>
//         </div>
//         {reply.commentId === cmt.id && (
//           <div className="ml-6 mt-2">
//             <textarea
//               value={reply.text}
//               onChange={(e) => setReply({ ...reply, text: e.target.value })}
//               className="w-full p-2 bg-gray-200 dark:bg-neutral-700 rounded-lg"
//               placeholder="Write a reply..."
//               rows={1}
//             />
//             <button
//               onClick={() => handleReply(cmt.id)}
//               className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg"
//             >
//               Submit Reply
//             </button>
//           </div>
//         )}
//         {cmt.subComments && cmt.subComments.length > 0 && (
//           <ul className="ml-4 mt-2 border-l-2 border-gray-300 dark:border-neutral-700 pl-4">
//             {renderComments(cmt.subComments)} 
//           </ul>
//         )}
//       </li>
//     ));
//   };

//   return (
//     <div className="comments-section">
//       <div className="mt-4">
//         <textarea
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           className="w-full p-3 bg-gray-200 dark:bg-neutral-700 rounded-lg"
//           placeholder="Write a comment..."
//           rows={2}
//         />
//         <button
//           onClick={handleAdd}
//           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
//         >
//           Submit Comment
//         </button>
//       </div>
//       <h3>Comments</h3>
//       <ul>
//         {renderComments(comments)}
//       </ul>
//     </div>
//   );
// };

// export default CommentsSection;


// import React, { useState, useEffect } from 'react';
// import moment from 'moment';

// const CommentsSection = ({ post, handleAddComment = () => {}, session }) => {
//   const [comment, setComment] = useState('');
//   const [comments, setComments] = useState(post.comments || []);
//   const [reply, setReply] = useState({ text: '', commentId: null });

//   const formatDate = (date) => {
//     return moment(date).fromNow();
//   };

//   const handleAdd = () => {
//     if (comment.trim()) {
//       const newComment = {
//         id: Date.now().toString(), // Unique id for the comment
//         userId: session?.user, // Updated to use session
//         comment: comment,
//         date: new Date().toISOString(),
//         replies: [],
//       };
//       const updatedComments = [newComment, ...comments];
//       setComments(updatedComments);
//       setComment('');
//       handleAddComment({ ...post, comments: updatedComments });
//     }
//   };

//   const handleReply = (parentCommentId) => {
//     if (reply.text.trim()) {
//       const updatedComments = comments.map((cmt) => {
//         if (cmt.id === parentCommentId) {
//           const newReply = {
//             id: Date.now().toString(), // Unique id for the reply
//             userId: session?.user, // Updated to use session
//             comment: reply.text,
//             date: new Date().toISOString(),
//             replies: [],
//           };
//           return {
//             ...cmt,
//             replies: [...(cmt.replies || []), newReply],
//           };
//         }
//         return cmt;
//       });

//       setComments(updatedComments);
//       setReply({ text: '', commentId: null });
//       handleAddComment({ ...post, comments: updatedComments });
//     }
//   };

//   useEffect(() => {
//     setComments(post.comments || []);
//   }, [post]);

//   const renderComments = (comments) => {
//     return comments.map((cmt) => (
//       <li key={cmt.id} className="my-2">
//         <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-lg flex justify-between items-center">
//           <div>
//             <strong>
//               {cmt.userId?.firstName || 'Anonymous'} {cmt.userId?.lastName || ''}
//             </strong>: {cmt.comment}
//             <div className="text-sm text-gray-500 dark:text-gray-400">
//               {formatDate(cmt.date)}
//             </div>
//           </div>
//           <button
//             onClick={() => setReply({ text: '', commentId: cmt.id })}
//             className="text-blue-500 ml-2"
//           >
//             Reply
//           </button>
//         </div>
//         {reply.commentId === cmt.id && (
//           <div className="ml-6 mt-2">
//             <textarea
//               value={reply.text}
//               onChange={(e) => setReply({ ...reply, text: e.target.value })}
//               className="w-full p-2 bg-gray-200 dark:bg-neutral-700 rounded-lg"
//               placeholder="Write a reply..."
//               rows={1}
//             />
//             <button
//               onClick={() => handleReply(cmt.id)}
//               className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg"
//             >
//               Submit Reply
//             </button>
//           </div>
//         )}
//         {cmt.replies && cmt.replies.length > 0 && (
//           <ul className="ml-4 mt-2 border-l-2 border-gray-300 dark:border-neutral-700 pl-4">
//             {renderComments(cmt.replies)}
//           </ul>
//         )}
//       </li>
//     ));
//   };

//   return (
//     <div className="comments-section">
//       <div className="mt-4">
//         <textarea
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           className="w-full p-3 bg-gray-200 dark:bg-neutral-700 rounded-lg"
//           placeholder="Write a comment..."
//           rows={2}
//         />
//         <button
//           onClick={handleAdd}
//           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
//         >
//           Submit Comment
//         </button>
//       </div>
//       <h3>Comments</h3>
//       <ul>
//         {renderComments(comments)}
//       </ul>
//     </div>
//   );
// };

// export default CommentsSection;

//----------------------------------------
// import React, { useState, useEffect } from 'react';
// import moment from 'moment';

// const CommentsSection = ({ post, handleAddComment = () => {} }) => {
//   const [comment, setComment] = useState('');
//   const [comments, setComments] = useState(post.comments || []);

//   const formatDate = (date) => {
//     return moment(date).fromNow(); 
//   };

//   const handleAdd = () => {
//     if (comment.trim()) {
//       const newComment = {
//         userId: { firstName: "Declan", lastName: "Belfield" }, 
//         comment: comment,
//         date: new Date().toISOString(), 
//         subComments: null,
//       };
//       // Prepend the new comment to the top of the list
//       const updatedComments = [newComment, ...comments];
//       setComments(updatedComments);
//       setComment('');
//       handleAddComment({ ...post, comments: updatedComments });
//     }
//   };

//   useEffect(() => {
//     setComments(post.comments || []);
//   }, [post]);

//   // Recursive function to render comments and sub-comments with formatted dates
//   const renderComments = (comments) => {
//     return comments.map((cmt, index) => (
//       <li key={index} className="my-2">
//         <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-lg">
//           <strong>{cmt?.userId?.firstName} {cmt?.userId?.lastName}</strong>: {cmt.comment}
//           <div className="text-sm text-gray-500 dark:text-gray-400">
//             {formatDate(cmt.date)}
//           </div>
//         </div>
//         {cmt.subComments && (
//           <ul className="ml-4 mt-2 border-l-2 border-gray-300 dark:border-neutral-700 pl-4">
//             {renderComments([cmt.subComments])}
//           </ul>
//         )}
//       </li>
//     ));
//   };

//   return (
//     <div className="comments-section">
//       <div className="mt-4">
//         <textarea
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           className="w-full p-3 bg-gray-200 dark:bg-neutral-700 rounded-lg"
//           placeholder="Write a comment..."
//           rows={2}
//         />
//         <button
//           onClick={handleAdd}
//           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
//         >
//           Submit Comment
//         </button>
//       </div>
//       <h3>Comments</h3>
//       <ul>
//         {renderComments(comments)}
//       </ul>
//     </div>
//   );
// };

// export default CommentsSection;