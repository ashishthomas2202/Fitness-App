import React, { useState } from 'react';

const CommentsSection = () => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([...comments, comment]);
      setComment('');
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      <ul>
        {comments.map((cmt, index) => (
          <li key={index}>{cmt}</li>
        ))}
      </ul>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment"
      />
      <button onClick={handleAddComment}>Submit</button>
    </div>
  );
};

export default CommentsSection;
