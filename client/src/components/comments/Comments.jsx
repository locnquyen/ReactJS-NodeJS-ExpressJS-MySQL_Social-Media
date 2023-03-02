import { useContext, useEffect, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiConfig } from "../../API/apiConfigs";
import moment from "moment";
import { Link } from "react-router-dom";



const Comments = ({ isLoading, error, data, postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  //handle add a comment
  const queryClient = useQueryClient();

  // Mutations
  const mutation = useMutation({
    mutationFn: newComment => {
      return apiConfig.post("/v1/comments", newComment)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })

  const handleComment = async (e) => {
    e.preventDefault();

    mutation.mutate({ desc, postId });
    setDesc("");
  }

  console.log("data", data)




  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePicture ? "/upload/" + currentUser.profilePicture : "/upload/user.png"} alt="" />
        <div className="input-comment">
          <input type="text" placeholder="write a comment" value={desc} onChange={e => setDesc(e.target.value)} />
          <button onClick={handleComment}>Send</button>
        </div>
      </div>
      {isLoading ? "Loading" : data.map((comment, index) => (
        <div className="comment" key={index}>
          <img src={comment.profilePicture ? "/upload/" + comment.profilePicture : "/upload/user.png"} alt="" />
          <div className="comment__info">
            <Link
              to={`/profile/${comment.userId}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span>{comment.name}</span>
            </Link>

            <p>{comment.description}</p>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>

          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
