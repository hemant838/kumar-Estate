import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firbase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function Oauth() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
  const handlegoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      })
      const data = await res.json()
      dispatch(signInSuccess(data));
      navigate('/')
    } catch (error) {
      console.log("could not signin to google", error);
    }
  };

  return (
    <button
      onClick={handlegoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      CONTINUE WITH GOOGLE
    </button>
  );
}

export default Oauth;
