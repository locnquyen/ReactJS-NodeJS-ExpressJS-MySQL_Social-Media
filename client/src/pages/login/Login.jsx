import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";


const Login = () => {
  

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  })

  const [err, setErr] = useState(null);

  const navigate = useNavigate()

  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const { login, currentUser } = useContext(AuthContext);
  useEffect(()=>{
    if(currentUser){
      navigate("/")
    }
  })

  const handleLogin = (e) => {
    e.preventDefault();
      try {
        login(inputs);
      } catch (error) {
        console.log("error", error)
        alert(error.response.data)
        setErr(error)
      }
  };


  return (
    <div className="login">
      <div className="card">
        <div className="content">
          <h1>Login</h1>
          <h1>LN-SOCIAL</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}

            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}

            />
            {/* {err && err} */}
            <button onClick={handleLogin}>Login</button>
          </form>
          <Link to="/register">
            Don't you have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
