import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { baseApiURL } from "../../baseUrl";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";

const Profile = () => {
  const [showPass, setShowPass] = useState(false);
  const router = useLocation();
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [password, setPassword] = useState({
    new: "",
    current: "",
  });

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/${router.state.type}/details/getDetails`,
        { employeeId: router.state.loginid },
        { headers: headers }
      )
      .then((response) => {
        if (response.data.success) {
          const userData = response.data.user || [];
          setData(userData);
          if (userData[0]) {
            dispatch(
              setUserData({
                fullname: `${userData[0].firstName || ""} ${userData[0].middleName || ""} ${userData[0].lastName || ""}`,
                employeeId: userData[0].employeeId,
              })
            );
          }
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [router.state.loginid, router.state.type, dispatch]);

  const checkPasswordHandler = (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/faculty/auth/login`,
        { loginid: router.state.loginid, password: password.current },
        { headers: headers }
      )
      .then((response) => {
        if (response.data.success) {
          changePasswordHandler(response.data.id);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "An error occurred");
        console.error(error);
      });
  };

  const changePasswordHandler = (id) => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .put(
        `${baseApiURL()}/faculty/auth/update/${id}`,
        { loginid: router.state.loginid, password: password.new },
        { headers: headers }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          setPassword({ new: "", current: "" });
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "An error occurred");
        console.error(error);
      });
  };

  return (
    <div className="w-full mx-auto my-8 flex justify-between items-start">
      {data.length > 0 ? (
        <>
          <div>
            <p className="text-2xl font-semibold">
              Hello {data[0].firstName || ""} {data[0].middleName || ""} {data[0].lastName || ""} 👋
            </p>
            <div className="mt-3">
              <p className="text-lg font-normal mb-2">
                Employee Id: {data[0].employeeId || "N/A"}
              </p>
              <p className="text-lg font-normal mb-2">Post: {data[0].post || "N/A"}</p>
              <p className="text-lg font-normal mb-2">
                Email Id: {data[0].email || "N/A"}
              </p>
              <p className="text-lg font-normal mb-2">
                Phone Number: {data[0].phoneNumber || "N/A"}
              </p>
              <p className="text-lg font-normal mb-2">
                Department: {data[0].department || "N/A"}
              </p>
            </div>
            <button
              className={`${
                showPass ? "bg-red-100 text-red-600" : "bg-blue-600 text-white"
              } px-3 py-1 rounded mt-4`}
              onClick={() => setShowPass(!showPass)}
            >
              {!showPass ? "Change Password" : "Close Change Password"}
            </button>
            {showPass && (
              <form
                className="mt-4 border-t-2 border-blue-500 flex flex-col justify-center items-start"
                onSubmit={checkPasswordHandler}
              >
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                  placeholder="Current Password"
                  className="px-3 py-1 border-2 border-blue-500 outline-none rounded mt-4"
                />
                <input
                  type="password"
                  value={password.new}
                  onChange={(e) =>
                    setPassword({ ...password, new: e.target.value })
                  }
                  placeholder="New Password"
                  className="px-3 py-1 border-2 border-blue-500 outline-none rounded mt-4"
                />
                <button
                  className="mt-4 hover:border-b-2 hover:border-blue-500"
                  type="submit"
                >
                  Change Password
                </button>
              </form>
            )}
          </div>
          <img
            src={process.env.REACT_APP_MEDIA_LINK + "/" + data[0].profile}
            alt="faculty profile"
            className="h-[200px] w-[200px] object-cover rounded-lg shadow-md"
          />
        </>
      ) : (
        <p>Loading or no data available...</p>
      )}
    </div>
  );
};

export default Profile;
