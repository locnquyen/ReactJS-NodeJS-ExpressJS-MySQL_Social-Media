import "./rightBar.scss";
import { useQuery } from '@tanstack/react-query'
import { apiConfig } from "../../API/apiConfigs";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const RightBar = () => {

  const { currentUser } = useContext(AuthContext)
  console.log("currentUser", currentUser)

  const { isLoading, error, data } = useQuery({
    queryKey: ['friends'],
    queryFn: async () =>
      await apiConfig.get("/v1/friends?userId=" + currentUser.id)
        .then(res => {
          return res.data;
        })
        .catch(err => {
          console.log("error", err)
        })
  });

  console.log("data", data)
  return (
    <div className="rightBar">
      <div className="container">
        <div className="suggestItem">
          <span>Suggestions For You</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://i.pinimg.com/originals/5b/1c/6d/5b1c6d63575120a403341a60e3d34f57.jpg"
                alt=""
              />
              <span>New Friend</span>
            </div>
            <div className="buttons">
              <button>Follow</button>
            </div>
          </div>

        </div>

        <div className="yourFriends">
          <span>Your Friends</span>
          {isLoading ? "Loading..." : data.map(friend => {
            return (
              <div className="friend" key={friend.userId}>
                <div className="friendInfo">
                  <img
                    src={friend.profilePicture ?  "/upload/"+friend.profilePicture : "/upload/user.png" }
                    alt=""
                  />
                  <div className="online" />
                  <span>{friend.name}</span>
                </div>
              </div>
            )
          })}

        </div>
      </div>
    </div>
  );
};

export default RightBar;
