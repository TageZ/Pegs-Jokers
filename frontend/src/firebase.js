import { initializeApp } from "firebase/app";
import { getAuth , browserLocalPersistence, setPersistence, updateProfile} from "firebase/auth";
import { getDatabase, update, get, ref, child } from "firebase/database";
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAmD5NQcO8WkvkVPJw0QGpBLCqPoz-Z8gY",
    authDomain: "pegsjokers.firebaseapp.com",
    projectId: "pegsjokers",
    storageBucket: "pegsjokers.appspot.com",
    messagingSenderId: "942657663662",
    appId: "1:942657663662:web:691366c02229df6e68f33f",
    measurementId: "G-PFTCDVJ3BJ"
  };

  // databaseURL: "https://pegsjokers-default-rtdb.firebaseio.com/",


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const database = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage();

export async function upload(file, currentUser, setLoading) {
  const fileRef = storageRef(storage, 'profiles/' + currentUser.uid + '.png');

  setLoading(true);

  const snapshot = await uploadBytes(fileRef, file);

  const photoURL = await getDownloadURL(fileRef)

  updateProfile(currentUser, {photoURL: photoURL});

  setLoading(false);
  // alert("Uploaded File!");
}

// export async function fetchUserData(userID) {
//   try {
//     const userRef = ref(database, `users/${userID}`);
//     const snapshot = await get(child(userRef, "/"));

//     if (snapshot.exists()) {
//       setUserData(snapshot.val());
//       if (user?.photoURL) {
//         setPhotoUrl(user.photoURL);
//       }
//     } else {
//       console.log("No user data available");
//     }
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//   }
// };



export async function getPlayer(userId) {

  try {
    const userRef = ref(database, `users/${userId}/name`);
    const name = await get(child(userRef, "/"));

    const fileRef = storageRef(storage, 'profiles/' + userId + '.png');
    const photoURL = await getDownloadURL(fileRef);
    return [photoURL, name.val()];

  } catch (error) {
    console.error('Error getting Player:', error);
    return ["https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg", "Unknown Player"];
  }
}

export default app;