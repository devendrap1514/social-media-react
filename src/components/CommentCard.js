import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiCall from './apiService';

const CommentCard = ({ comment }) => {
  const [isLiked, setIsLiked] = useState(comment.liked);
  const [likesCount, setLikesCount] = useState(comment.likes_count);

  const handleLike = async (e) => {
    e.preventDefault();

    const likeData = {
      resource_type: 'Comment',
      resource_id: comment.comment_id,
    };

    try {
      const response = await apiCall('api/v1/likes', 'POST', likeData);

      if (response.status === 200) {
        const updatedLikedStatus = response.data.message === 'Liked';
        setIsLiked(updatedLikedStatus);
        setLikesCount((prevCount) => (updatedLikedStatus ? prevCount + 1 : prevCount - 1));
      } else if (response.status === 400) {
        console.log("Error liking comment.");
      }
    } catch (error) {
      console.error("Error while liking the comment:", error);
    }
  };

  return (
    <div className="card mb-4 shadow-sm border-1">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <img
            src={comment.author.thumb_url}
            alt={comment.name}
            className="rounded-circle me-3"
            style={{ width: '50px', height: '50px' }}
          />
          <div>
            <h6 className="mb-0">{comment.author.name}</h6>
            <small className="text-muted">@{comment.author.username}</small>
          </div>

          <span className="ms-auto text-muted">{comment.created_at}</span>
        </div>

        <h6 className="card-title">{comment.title}</h6>

        <div className="text-center my-3">
          { comment.thumb_url ? <img
            src={comment.thumb_url || comment.media_url}
            alt={''}
            className="img-fluid rounded"
            style={{ maxWidth: '100%', height: '300px', objectFit: 'cover' }}
          /> : '' }
        </div>

        <div className="d-flex justify-content-start mt-3">
          <div className="d-flex align-items-center me-4">
            {isLiked ? (
              <i className="bi bi-heart-fill" onClick={handleLike} style={{ fontSize: '1.8rem', color: 'red', cursor: 'pointer' }}></i>
            ) : (
              <i className="bi bi-heart" onClick={handleLike} style={{ fontSize: '1.8rem', cursor: 'pointer' }}></i>
            )}
            <div className="ms-2">
              <strong>{likesCount}</strong>
            </div>
          </div>

          <div className="d-flex align-items-center">
            <i className="bi bi-chat" style={{ fontSize: '1.8rem' }}></i>
            <div className="ms-2">
              <strong>{comment.comments_count}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
