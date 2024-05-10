import React, { useState, useEffect } from "react";
import { auth, database, upload } from "../firebase";
import { ref, get, child } from "firebase/database";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoUrl] = useState(
    "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setUserData(null);
      }
    });

    return unsubscribe;
  }, []);

  const fetchUserData = async (user) => {
    try {
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(child(userRef, "/"));

      if (snapshot.exists()) {
        setUserData(snapshot.val());
        if (user?.photoURL) {
          setPhotoUrl(user.photoURL);
        }
      } else {
        // No user data
      }
    } catch (error) {
      // Error
    }
  };

  function handleImage(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }

  function handleUpload() {
    upload(photo, auth.currentUser, setLoading)
    .then(() => {
      alert("Image uploaded successfully");
      window.location.reload();
    })
    .catch((error) => {
      // Error handling
      alert("Error uploading image:");
    });
  }

  return (
    <div>
      {userData ? (
        <div className="user-profile">
          <div className="image-field">
            <img src={photoURL} alt="Profile Picture" className="profile-pic" />
          </div>
            <div className="player-stats">
              <input type="file" onChange={handleImage} />
              <button disabled={loading || !photo} onClick={handleUpload}>
                Upload
              </button>
              <p>Display Name: {userData.name}</p>
              <p>Email: {userData.email}</p>
              <p>Account Created: {new Date(userData.creation).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;