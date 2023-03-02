import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useEffect, useState } from "react";
import moment from "moment";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiConfig } from "../../API/apiConfigs";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";




const Post = ({ post }) => {

  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  //request data likes table
  const { lIsLoading, lError, data: likes } = useQuery({
    queryKey: ['likes', post.id],
    queryFn: async () =>
      await apiConfig.get("/v1/likes?postId=" + post.id)
        .then(res => {
          return res.data;
        })
        .catch(err => {
          console.log("error", err)
        })
  });


  const { isLoading, error, data } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: async () =>
      await apiConfig.get("/v1/comments?postId=" + post.id)
        .then(res => {
          return res.data;
        })
        .catch(err => {
          console.log("error", err)
        })
  });


  // Mutations
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: liked => {
      if (liked) {
        return apiConfig.delete("/v1/likes?postId=" + post.id)

      }
      return apiConfig.post("/v1/likes", { postId: post.id })

    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['likes'] })
    },
  })

  const handleLike = () => {
    mutation.mutate(likes.includes(currentUser.id))
  }

  const deleteMutation = useMutation({
    mutationFn: postId => {
      if (postId) {
        return apiConfig.delete("/v1/posts/" + post.id)

      }
      return apiConfig.post("/v1/likes", { postId: post.id })

    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['post'] })
    },
  })
  const handleDelete = () => {
    deleteMutation.mutate(post.id)
  }



  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePicture ? "/upload/" + post.profilePicture : "/upload/user.png"} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && <button onClick={handleDelete}>Delete</button>}
        </div>
        <div className="content">
          <p>{post.description}</p>
          <img src={"./upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {lIsLoading ? (
              "loading"
            ) : likes?.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {likes?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {data?.length} Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments
          
          isLoading = {isLoading}
          error = {error}
          data = {data}
          postId = {post.id}

        />}
      </div>
    </div>
  );
};

export default Post;
