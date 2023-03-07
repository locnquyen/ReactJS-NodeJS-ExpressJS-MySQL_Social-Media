import "./rightBar.scss";
import { useQuery } from '@tanstack/react-query'
import { apiConfig } from "../../API/apiConfigs";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";

const RightBar = () => {


  const { currentUser } = useContext(AuthContext)

  const { isLoading: fIsLoading, Error: fError, data: friends } = useQuery({
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

  return (
    <div className="rightBar">
      <div className="container">
        <div className="yourFriends">
          <span>Your follow</span>
          {fIsLoading ? "Loading..." : friends.map(friend => {
            return (
              <Link to={'/profile/' + friend.userId} style={{ textDecoration: "none" }} key={friend.userId}>
                <div className="friend">
                  <div className="friendInfo">
                    <img
                      src={friend.profilePicture ? "/upload/" + friend.profilePicture : "/upload/user.png"}
                      alt=""
                    />
                    <div className="online" />
                    <span>{friend.name}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
