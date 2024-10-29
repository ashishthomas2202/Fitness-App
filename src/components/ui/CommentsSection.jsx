import React, { useState, useEffect } from 'react';

const CommentsSection = ({ post, handleAddComment = () => {} }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);

  const handleAdd = () => {
    if (comment.trim()) {
      const newComment = {
        userId: { firstName: "Declan", lastName: "Belfield" }, // Replace with actual user info if available
        comment: comment,
        subComments: null,
      };
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      setComment('');
      handleAddComment({ ...post, comments: updatedComments });
    }
  };

  useEffect(() => {
    console.log(post.comments);
    setComments(post.comments || []); 
  }, [post]);

  // Recursive function to render comments and sub-comments
  const renderComments = (comments) => {
    return comments.map((cmt, index) => (
      <li key={index} className="my-2">
        <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-lg">
          <strong>{cmt?.userId?.firstName} {cmt?.userId?.lastName}</strong>: {cmt.comment}
        </div>
        {cmt.subComments && (
          <ul className="ml-4 mt-2 border-l-2 border-gray-300 dark:border-neutral-700 pl-4">
            {renderComments([cmt.subComments])}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      <ul>
        {renderComments(comments)}
      </ul>
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
    </div>
  );
};

export default CommentsSection;

// import React, { useState, useEffect } from 'react';

// const CommentsSection = ({ post,handleAddComment=()=>{}}) => {
//   const [comment, setComment] = useState('');
  
 
//   const handleAdd = () => {
//     if (comment.trim()) {
//       const newComment = {
//         userId: { firstName: "Current", lastName: "User" }, // Replace with actual user info if available
//         comment: comment,
//         subComments: null, // Assuming new comments do not have nested comments by default
//       };
//       setComments([...comments, newComment]);
//       setComment('');
//       handleAddComment({...post,comments:[...comments, newComment]})
//     }
//   };

//   useEffect(() => {
//     console.log(post.comments);
//   }, [post]);

//   // Recursive function to render comments and sub-comments
//   const renderComments = (comments) => {
//     return comments.map((cmt, index) => (
//       <li key={index} className="my-2">
//         <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-lg">
//           <strong>{cmt?.userId?.firstName} {cmt?.userId?.lastName}</strong>: {cmt.comment}
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
//       <h3>Comments</h3>
//       <ul>
//         {renderComments(post.comments)}
//       </ul>
//       <div className="mt-4">
//         <textarea
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           className="w-full p-3 bg-gray-200 dark:bg-neutral-700 rounded-lg"
//           placeholder="Write a comment..."
//           rows={2}
//         />
//         <button
//           onClick={handleAddComment}
//           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
//         >
//           Submit Comment
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CommentsSection;

// import React, { useState, useEffect } from 'react';

// const CommentsSection = ({comments=[]}) => {
//   //const [comments, setComments] = useState([]);
//   const [comment, setComment] = useState('');

//   const handleAddComment = () => {
//     if (comment.trim()) {
//      // setComments([...comments, comment]);
//       setComment('');
//     }
//   };
//  useEffect(()=>{console.log(comments)},[comments])
//   //return (
//       {/* Comment Input Window */}
//   //     {activeCommentPostId === post.id && (
//   //       <div className="mt-4">
//   //         <textarea
//   //           value={newCommentText}
//   //           onChange={(e) => setNewCommentText(e.target.value)}
//   //           className="w-full p-3 bg-gray-200 dark:bg-neutral-700 rounded-lg"
//   //           placeholder="Write a comment..."
//   //           rows={2}
//   //         />
//   //         <button
//   //           onClick={() => handleCommentSubmit(post.id)}
//   //           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
//   //         >
//   //           Submit Comment
//   //         </button>
//   //       </div>
//   // )})
//   //)}
//   return(
//     <div className="comments-section">
//       <h3>Comments</h3>
//       <ul>
//         {comments.map((cmt, index) => (
//           <li key={index}>{cmt}</li>
//         ))}
//       </ul>
//       <textarea
//            // value={newCommentText}
//           //  onChange={(e) => setNewCommentText(e.target.value)}
//             className="w-full p-3 bg-gray-200 dark:bg-neutral-700 rounded-lg"
//             placeholder="Write a comment..."
//             rows={2}
//           />
//       <button onClick={handleAddComment}>Submit</button>
//     </div>
//   );
// };

// export default CommentsSection;
