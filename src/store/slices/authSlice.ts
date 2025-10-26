import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { authApi, setAuthToken } from "../../api/api";
import type {AuthResponse, ProfileResponse, UserSummary} from "../../shared/types/types.ts";
import type {RootState} from "../store.ts";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface AuthState {
    token: string | null;
    user: UserSummary | null;
    status: Status;
    error?: string | null;
}

const initialState: AuthState = {
    token: localStorage.getItem("pc_conf_token"),
    user: null,
    status: "idle",
    error: null,
};

export const registerThunk = createAsyncThunk<AuthResponse, { login: string; userName: string; password: string }>(
    "auth/register",
    async (payload) => await authApi.register(payload)
);

export const loginThunk = createAsyncThunk<AuthResponse, { login: string; password: string }>(
    "auth/login",
    async (payload) => await authApi.login(payload)
);

export const loadMeThunk = createAsyncThunk<ProfileResponse>(
    "auth/loadMe",
    async () => await authApi.me()
);

export const updateMeThunk = createAsyncThunk<void, { userName?: string; avatarUrl?: string; }>(
    "auth/updateMe",
    async (payload) => await authApi.updateMe(payload)
);

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.user = null;
            setAuthToken(null);
        },
        hydrateFromStorage(state) {
            const t = localStorage.getItem("pc_conf_token");
            if (t) {
                state.token = t;
                setAuthToken(t);
            }
        }
    },
    extraReducers: (b) => {
        b.addCase(registerThunk.pending, (s) => {
            s.status = "loading";
            s.error = null;
        });

        b.addCase(registerThunk.fulfilled, (s, a) => {
            s.status = "succeeded";
            s.token = a.payload.token;
            s.user = a.payload.user;
            setAuthToken(a.payload.token);
        });

        b.addCase(registerThunk.rejected, (s, a) => {
            s.status = "failed";
            s.error = a.error.message ?? "Register failed";
        });

        b.addCase(loginThunk.pending, (s) => {
            s.status = "loading"; s.error = null;
        });

        b.addCase(loginThunk.fulfilled, (s, a) => {
            s.status = "succeeded";
            s.token = a.payload.token;
            s.user = a.payload.user;
            setAuthToken(a.payload.token);
        });

        b.addCase(loginThunk.rejected, (s, a) => {
            s.status = "failed";
            s.error = a.error.message ?? "Login failed";
        });

        b.addCase(loadMeThunk.pending, (s) => {
            s.status = "loading";
        });

        b.addCase(loadMeThunk.fulfilled, (s, a: PayloadAction<ProfileResponse>) => {
            s.status = "succeeded";
            s.user = a.payload;
        });

        b.addCase(loadMeThunk.rejected, (s, a) => {
            s.status = "failed";
            s.error = a.error.message ?? "Load profile failed";
        });

        b.addCase(updateMeThunk.pending, (s) => {
            s.status = "loading";
        });

        b.addCase(updateMeThunk.rejected, (s, a) => {
            s.status = "failed";
            s.error = a.error.message ?? "Update profile failed";
        });
    }
});

export const { logout, hydrateFromStorage } = slice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export const selectStatus = (state: RootState) => state.auth.status;
export const selectError = (state: RootState) => state.auth.error;
export const selectToken = (state: RootState) => state.auth.token;
export default slice.reducer;