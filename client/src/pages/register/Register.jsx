import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import validator from 'validator';

import "./register.scss";
import axios from 'axios';
import { AuthContext } from "../../context/authContext";

const Register = () => {
  const navigate = useNavigate()
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
    name: ""
  })

  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    console.log("currentUser", currentUser)
    if (currentUser) {
      navigate("/")
    }
  })

  const [isFormValid, setIsFormValid] = useState(false);
  const [isHideValid, setIsHideValid] = useState(false);

  const [err, setErr] = useState(null);

  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmit = async e => {
    e.preventDefault();

    if (rules.username === false && rules.name === false && rules.email && rules.password && rules.rePassword) {
      setIsFormValid(true);
      setIsHideValid(false);
    } else {
      setIsHideValid(true);

    }

    if (isFormValid) {
      await axios.post('http://localhost:8080/api/auth/register', inputs)
        .then(function (response) {
          alert("Register success, login now?");
          navigate("/login")

        })
        .catch(function (error) {
          setErr(error)
          console.log(error.response.data);
        });
    }

    
  }

  //validator
  const rules = {
    username: validator.isEmpty(inputs.username, { ignore_whitespace: false }),
    name: validator.isEmpty(inputs.name, { ignore_whitespace: false }),
    email: validator.isEmail(inputs.email),
    password: validator.isStrongPassword(inputs.password,
      {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1, minSymbols: 0,
        returnScore: false,
        pointsPerUnique: 0,
        pointsPerRepeat: 0,
        pointsForContainingLower: 0,
        pointsForContainingUpper: 0,
        pointsForContainingNumber: 0,
        pointsForContainingSymbol: 0
      }),
    rePassword: validator.equals(inputs.rePassword, inputs.password)
  }

  useEffect(() => {
    console.log("currentUser", currentUser)
    if (currentUser) {
      navigate("/")
    }
  })


  return (
    <div className="register">
      <div className="card">
        <div className="content">
          <h1>Register</h1>
          <form>
            <div className="input-info">
              <input
                type="text"
                placeholder="Username"
                name="username"
                onChange={handleChange}
              />
              {isHideValid ? rules.username ? <span className="validator">Please enter your username</span> : null : null}
            </div>
            <div className="input-info">
              <input
                type="text"
                placeholder="Name"
                name="name"
                onChange={handleChange} />


              {isHideValid ? rules.name ? <span className="validator">Please enter your name</span> : null : null}
            </div>
            <div className="input-info">
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
              />
              {isHideValid ? rules.email ? "" : <span className="validator">Email not correct</span> : null}
            </div>
            <div className="input-info">
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              />
              {isHideValid ? rules.password ? "" : <span className="validator">Password must be at least 6 characters, 1 uppercase letter, 1 lowercase letter, 1 number</span> : null}
            </div>
            <div className="input-info">
              <input
                type="password"
                placeholder="Re-password"
                name="rePassword"
                onChange={handleChange}
              />
              {isHideValid ? rules.rePassword ? "" : <span className="validator">Invalid password</span> : null}
            </div>

            {/* {err} */}
            <button onClick={handleSubmit}>Register</button>
          </form>
          <Link to="/login">
            Do you have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
