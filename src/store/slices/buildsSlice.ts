import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { buildsApi } from "../../api/api";
import type {BuildResponse, PagedResult, ShareResponse} from "../../shared/types/types.ts";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface BuildsState {
    list?: PagedResult<BuildResponse>;
    status: Status;
    error?: string | null;
    lastShare?: ShareResponse | null;
    page: number;
    pageSize: number;
}

const initialState: BuildsState = {
    status: "idle",
    error: null,
    lastShare: null,
    page: 1,
    pageSize: 20,
};

export const fetchBuildsThunk = createAsyncThunk<PagedResult<BuildResponse>, { page?: number; pageSize?: number } | undefined>(
    "builds/fetch",
    async (args) => {
        const page = args?.page ?? 1;
        const pageSize = args?.pageSize ?? 20;
        return await buildsApi.listMine(page, pageSize);
    }
);

export const createBuildThunk = createAsyncThunk<BuildResponse, { cpuId: string; gpuId: string }>(
    "builds/create",
    async (payload) => await buildsApi.create(payload)
);

export const deleteBuildThunk = createAsyncThunk<string, { id: string }>(
    "builds/delete",
    async ({ id }) => { await buildsApi.remove(id); return id; }
);

export const shareBuildThunk = createAsyncThunk<ShareResponse, { id: string }>(
    "builds/share",
    async ({ id }) => await buildsApi.share(id)
);

const slice = createSlice({
    name: "builds",
    initialState,
    reducers: {
        setPage(state, { payload }: { payload: number }) {
            state.page = Math.max(1, payload || 1);
        },
        setPageSize(state, { payload }: { payload: number }) {
            state.pageSize = Math.max(1, payload || 1);
        },
        clearShare(state) {
            state.lastShare = null;
        }
    },
    extraReducers: (b) => {
        b.addCase(fetchBuildsThunk.pending, (s) => { s.status = "loading"; s.error = null; });
        b.addCase(fetchBuildsThunk.fulfilled, (s, a) => { s.status = "succeeded"; s.list = a.payload; });
        b.addCase(fetchBuildsThunk.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message ?? "Failed to load builds"; });

        b.addCase(createBuildThunk.fulfilled, (s, a) => {
            if (s.list) {
                s.list.items = [a.payload, ...s.list.items];
                s.list.total += 1;
            }
        });

        b.addCase(deleteBuildThunk.fulfilled, (s, a) => {
            if (s.list) {
                s.list.items = s.list.items.filter(b => b.id !== a.payload);
                s.list.total = Math.max(0, s.list.total - 1);
            }
        });

        b.addCase(shareBuildThunk.fulfilled, (s, a) => { s.lastShare = a.payload; });
    }
});

export const { setPage, setPageSize, clearShare } = slice.actions;
export default slice.reducer;