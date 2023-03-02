import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useState } from "react";

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { apiConfig } from "../../API/apiConfigs";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const upload = async () => {

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiConfig.post("/upload", formData);
      return res.data;

    } catch (err) {
      console.log(err)
    }
  }

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  // Mutations
  const mutation = useMutation({
    mutationFn: newPost => {
      return apiConfig.post("/v1/posts", newPost)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['post'] })
    },
  })

  const handleShare = async (e) => {
    e.preventDefault();

    let imgUrl = "";
    console.log("file", file)

    if (file) {
      imgUrl = await upload();
    }
    mutation.mutate({ desc, img: imgUrl });
    setDesc("");
    setFile(null);
  }


  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={ currentUser.profilePicture ? "/upload/" +currentUser.profilePicture : "/upload/user.png"}
              alt=""
            />
            <input
              type="text" 
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={e => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && <img className="file" alt="" src={URL.createObjectURL(file)}/> }
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            {/* file input */}
            <input type="file" id="file" style={{ display: "none" }} onChange={e => {
              console.log(e.target.files[0]);
              setFile(e.target.files[0])
            }} />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleShare}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
