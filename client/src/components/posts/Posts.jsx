import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from '@tanstack/react-query'
import { apiConfig } from "../../API/apiConfigs";

const Posts = ({userId}) => {
  
  const { isLoading, error, data } = useQuery({
    queryKey: ['post'],
    queryFn: async () =>
      await apiConfig.get("/v1/posts?userId="+userId)
        .then(res => {
          return res.data;
        })
        .catch(err => {
          console.log("error", err)
        })
  });


  return (
    <div className="posts">
      {error ? "Something went wrong!!" : isLoading ?
        "Loading" : data.map(post => (
          <Post post={post} key={post.id} />
        ))}
    </div>
  )
};

export default Posts;
