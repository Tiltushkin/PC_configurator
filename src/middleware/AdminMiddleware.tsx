import React, { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import {Outlet, useNavigate} from "react-router-dom";
import { type AppDispatch } from "../store/store";
import {loadMeThunk, selectUser} from "../store/slices/authSlice.ts";
import {TOKEN_KEY} from "../api/api.ts";

export const AdminMiddleware: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                await dispatch(loadMeThunk()).unwrap();
            } catch (e: any) {
                console.error(e);
                localStorage.removeItem(TOKEN_KEY);
                return navigate("/auth");
            }
        })();
    }, [dispatch])

    const user = useSelector(selectUser);

    if (!localStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)!.length < 1) {
        localStorage.removeItem(TOKEN_KEY);
        return navigate("/auth");
    }

    if (user && !user.isAdmin) return navigate("/");

    return <Outlet />;
};