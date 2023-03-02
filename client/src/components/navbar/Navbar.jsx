import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Message from "@mui/icons-material/Message";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Logout from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { buttonBaseClasses } from "@mui/material";
import axios from "axios";

const Navbar = () => {
  const nav = useNavigate()

  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [menuProfile, setMenuProfile] = useState(false)

  console.log("currentUser", currentUser)

  const handleLogOut = async () => {
    const res = await axios.post('http://localhost:8080/api/auth/logout');
    console.log("res", res)
    setCurrentUser(null)
    nav("/login")
  }

  return (
    <div className="navbar">

      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>LN-Social</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
      </div>

      <div className="search">
        <SearchOutlinedIcon className="search-icon" />
        <input type="text" placeholder="Search..." />
      </div>

      <div className="right">
        <PersonOutlinedIcon />
        <Link to={'/messenger/'+currentUser.id} style={{ textDecoration: "none" }}>
          <Message />
        </Link>
        <NotificationsOutlinedIcon />
        <div className="user" onClick={() => setMenuProfile(!menuProfile)}>
          <img
            src={currentUser.profilePicture ? "/upload/" + currentUser.profilePicture : "/upload/user.png"}
            alt=""
          />
          <span>{currentUser.name}</span>
          {menuProfile &&
            <div className="profile-menu">
              <Link to={"/profile/" + currentUser.id} style={{ textDecoration: "none" }}>
                <div className="menu-item" >
                  <div className="menu-item__icon">
                    <img
                      src={currentUser.profilePicture ? "/upload/" + currentUser.profilePicture : "/upload/user.png"}
                      alt=""
                    />
                  </div>
                  <button >{currentUser.name}</button>

                </div>
              </Link>

              <div className="menu-item" onClick={handleLogOut}>
                <div className="menu-item__icon">
                  <Logout />
                </div>
                <button >Logout</button>
              </div>
            </div>}
        </div>

      </div>
    </div>
  );
};

export default Navbar;
