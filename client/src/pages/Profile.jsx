import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useRef } from "react";
import { app } from "../firbase";
import {
  updateuserStart,
  updateuserStartSuccess,
  updateuserStartFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [FormData, setFormData] = useState({});
  const [fileUploadError, setFileUploadError] = useState(false);
  const dispatch = useDispatch();

  console.log(FormData);
  console.log(filePerc);
  console.log(fileUploadError);
  //firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 *1024 &&
  // request.resource.contentType.matches('images/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...FormData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...FormData, [e.target.value]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatchEvent(updateuserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FormData),
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(updateuserStartFailure(data.message))
      }
    } catch (error) {
      dispatch(updateuserStartFailure(error.message));
    }
    dispatch(updateuserStartSuccess);
  };

  const handleDeleteUser = async(user) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${user._id}`,{
        method: "POST",
      });
      const data = await res.json();
      if(data.success === false )
      {
        dispatch(deleteUserFailure(data.message))
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async() =>{
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      if(data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col ">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          onClick={() => fileRef.current.click()}
          src={FormData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center
          mt-2 "
        />
        <div className="flex flex-col mt-2 ">
          <input
            type="text"
            placeholder="username"
            id="username"
            defaultValue={currentUser.username}
            className="border p-3 rounded-lg "
            onChange={handleChange}
          />
          <input
            type="text"
            id="email"
            placeholder="email"
            defaultChecked={currentUser.email}
            className="border p-3 rounded-lg mt-2"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="password"
            id="password"
            className="border p-3 rounded-lg mt-2"
            onChange={handleChange}
          />
        </div>
        <button className="bg-slate-700 text-white rounded-lg mt-2 uppercase p-3 hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}

export default Profile;
