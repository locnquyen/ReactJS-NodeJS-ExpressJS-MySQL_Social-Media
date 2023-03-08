import "./profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import Posts from "../../components/posts/Posts"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiConfig } from "../../API/apiConfigs";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
import { BsMessenger } from "react-icons/bs";
import { AiFillCheckCircle } from "react-icons/ai";
import Share from "../../components/share/Share";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false)

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
    mutationFn: following => {
      if (following) {
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
        <div className="wrapperPicture">
          <div className="images">
            <div className="coverPicture">
              <img
                src={data.coverPicture ? "/upload/" + data.coverPicture : "/upload/cover.jpeg"}
                alt="cover"
                className="cover"
              />
            </div>
            <div className="profilePicture">
              <img
                src={data.profilePicture ? "/upload/" + data.profilePicture : "/upload/user.png"}
                alt="profile"
                className="profile"
              />
            </div>
          </div>

          <div className="wrapperInfo">
            <div className="left">
              <span className="nameUser">{data.name}</span>
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

            </div>
            <div className="right">
              {rIsLoading ? "Loading" : userId === currentUser.id ?
                <button className="updateProfile" onClick={() => setOpenUpdate(true)}>Edit profile</button>
                :
                <div className="friendProfile">
                  <div className="followFriend">
                    <div className="btnFollow">
                      <AiFillCheckCircle />
                      <button onClick={handleFollow}>
                        {relationshipData.includes(currentUser.id) ? "Following" : "Follower"}
                      </button>
                    </div>
                  </div>
                  <div className="sendMessage">
                    <div className="btnMessage">
                      <BsMessenger />
                      <button>Message</button>
                    </div>
                  </div>

                </div>
              }

            </div>
          </div>
        </div>

        <div className="infoContainer">

          <div className="leftInfo">

          </div>
          <div className="rightInfo">
            <Share/>
            <Posts userId={userId} />
          </div>
        </div>
      </>}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
