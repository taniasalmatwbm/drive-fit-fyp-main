import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/auth";
import Spinner from "../admin/Spinner"; // Fixed typo

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      try {
        // const { data } = await axios.get(`${process.env.REACT_APP_API || ''}/api/user/user-auth`);
        const { data } = await axios.get("/api/user/user-auth");
        if (data?.ok) {
          setOk(true);
        } else {
          setOk(false);
          navigate("/login"); // Optional redirect
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setOk(false);
      }
    };

    if (auth?.token) {
      authCheck();
    } else {
      setOk(false); // immediately false if no token
    }
  }, [auth?.token, navigate]);

  return ok ? <Outlet /> : <Spinner />;
}
