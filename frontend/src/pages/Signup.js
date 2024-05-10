import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebase";
import {ref, set} from "firebase/database"
import "../Styling.css"

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("")

  const onSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        const userRef = ref(database, `users/${user.uid}`);

        const user_data = {
          email : email,
          name : displayName,
          last_login : Date.now(),
          creation : Date.now()
        }

        set(userRef, user_data)
        navigate("/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <>
    <main>
      <section>
        <div className="login-container">
          <h1 className="title">Sign Up</h1>
          <form className="login-form">
          <div className="form-group">
              <label htmlFor="display-name">Display Name</label>
              <input
                id="display-name"
                name="display-name"
                type="text"
                required
                placeholder="Display Name"
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email-address">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <button className="button-3" onClick={onSubmit}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  </>
  );
};

export default Signup;
