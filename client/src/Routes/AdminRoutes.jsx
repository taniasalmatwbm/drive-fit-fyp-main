import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/auth";
import Sipnner from '../admin/Spinner'; // Spinner typo bhi fix kiya

export default function AdminRoutes() {
    const [ok, setOk] = useState(false);
    const [auth] = useAuth(); // only use auth, no need to destructure `setAuth` if not used

    useEffect(() => {
        const authCheck = async () => {
            try {
                const res = await axios.get(`/api/user/admin-auth`);
                setOk(res.data.ok);
            } catch (err) {
                console.log("Admin auth check failed:", err);
                setOk(false);
            }
        };
        if (auth?.token) authCheck();
    }, [auth?.token]);

    return ok ? <Outlet /> : <Sipnner path="" />;
}
