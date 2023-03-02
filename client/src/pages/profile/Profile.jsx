import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiConfig } from "../../API/apiConfigs";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";

const Profile = () => {
  const [opentUpdate, setOpenUpdate] = useState(false)

  const { currentUser } = useContext(AuthContext);
  //get userId from params
  const userId = parseInt(useLocation().pathname.split('/')[2]);

  const { isLoading, error, data } = useQuery({
    queryKey: ['user'],
    queryFn: async () =>
      await apiConfig.get("/v1/find/" + userId)
        .then(res => {
          return res.data;
        })
        .catch(err => {
          console.log("error", err)
        })
  });

  const { isLoading: rIsLoading, data: relationshipData } = useQuery({
    queryKey: ['relationship'],
    queryFn: async () =>
      await apiConfig.get("/v1/relationships?followedUserId=" + userId)
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
    mutationFn: folowing => {
      if (folowing) {
        return apiConfig.delete("/v1/relationships?userId=" + userId)

      }
      return apiConfig.post("/v1/relationships", { userId })

    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['relationship'] })
    },
  })

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id))
  }
  return (
    <div className="profile">
      {isLoading ? "loading" : <>
        <div className="images">
          <img
            src={data.coverPicture? "/upload/"+data.coverPicture : "/upload/cover.jpeg"}
            alt="cover"
            className="cover"
          />
          <img
            src={data.profilePicture ? "/upload/"+data.profilePicture : "/upload/user.png"}
            alt="profile"
            className="profilePic"
          />
        </div>

        <div className="profileContainer">
          <div className="uInfo">
            <div className="left">
              <a href="http://facebook.com">
                <FacebookTwoToneIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <InstagramIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <TwitterIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <LinkedInIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <PinterestIcon fontSize="large" />
              </a>
            </div>
            <div className="center">
              <span>{data.name}</span>
              <div className="info">
                <div className="item">
                  <PlaceIcon />
                  <span>{data.city}</span>
                </div>
                <div className="item">
                  <LanguageIcon />
                  <span>{data.website}</span>
                </div>
              </div>
              {rIsLoading ? "Loading" : userId === currentUser.id ?
                <button onClick={()=>setOpenUpdate(true)}>update</button>
                :
                <button onClick={handleFollow}>
                  {relationshipData.includes(currentUser.id) ? "Following" : "Follower"}
                </button>}
            </div>
            <div className="right">
              <EmailOutlinedIcon />
              <MoreVertIcon />
            </div>
          </div>
          <Posts userId={userId}/>
        </div>
      </>}
      {opentUpdate && <Update setOpenUpdate={setOpenUpdate} user={data}/>}
    </div>
  );
};

export default Profile;
