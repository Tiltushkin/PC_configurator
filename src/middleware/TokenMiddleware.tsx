import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {Outlet, useNavigate} from "react-router-dom";
import { type AppDispatch } from "../store/store";
import {loadMeThunk} from "../store/slices/authSlice.ts";
import {TOKEN_KEY} from "../api/api.ts";

export const TokenMiddleware: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem(TOKEN_KEY)) return;
        (async () => {
            try {
                await dispatch(loadMeThunk()).unwrap();
                return navigate("/");
            } catch (e: any) {
                console.error(e);
            }
        })();
    }, [dispatch])

    if (localStorage.getItem(TOKEN_KEY) && localStorage.getItem(TOKEN_KEY)!.length > 0) {
        return navigate("/");
    }

    return <Outlet />;
};