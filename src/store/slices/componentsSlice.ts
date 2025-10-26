import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { componentsApi } from "../../api/api";
import type {
    AirCooling,
    CASE, ComponentsAllResponse,
    CPU,
    GPU,
    HDD2_5,
    HDD3_5,
    MB,
    Memory,
    PagedResult,
    PSU,
    SSD,
    SZO
} from "../../shared/types/types";
import type {RootState} from "../store.ts";

type Status = "idle" | "loading" | "succeeded" | "failed";
type Kind = "all" | "cpu" | "gpu" | "mb" | "psu" | "case" | "szo" | "aircooling" | "memory" | "ssd" | "hdd2_5" | "hdd3_5";

export interface ComponentsQuery {
    type: Kind;
    page: number;
    pageSize: number;
    filters: Record<string, string | number | boolean | null | undefined>;
}

interface ComponentsState {
    kind: Kind;
    page: number;
    pageSize: number;
    filters: ComponentsQuery["filters"];
    cpus?: PagedResult<CPU>;
    gpus?: PagedResult<GPU>;
    mbs?: PagedResult<MB>;
    psus?: PagedResult<PSU>;
    cases?: PagedResult<CASE>;
    szos?: PagedResult<SZO>;
    airCoolings?: PagedResult<AirCooling>;
    memories?: PagedResult<Memory>;
    ssds?: PagedResult<SSD>;
    hdd2_5?: PagedResult<HDD2_5>;
    hdd3_5?: PagedResult<HDD3_5>;
    status: Status;
    error?: string | null;
}

const initialState: ComponentsState = {
    kind: "all",
    page: 1,
    pageSize: 20,
    filters: {},
    status: "idle",
    error: null,
};

export const fetchComponentsThunk = createAsyncThunk<
    ComponentsAllResponse
    | PagedResult<CPU>
    | PagedResult<GPU>
    | PagedResult<MB>
    | PagedResult<PSU>
    | PagedResult<CASE>
    | PagedResult<SZO>
    | PagedResult<AirCooling>
    | PagedResult<Memory>
    | PagedResult<SSD>
    | PagedResult<HDD2_5>
    | PagedResult<HDD3_5>,
    Partial<ComponentsQuery>,
    { state: RootState; rejectValue: string }
>(
    "components/fetch",
    async (q) => {
        const kind = q.type ?? "all";
        const page = q.page ?? 1;
        const pageSize = q.pageSize ?? 20;
        const filters = q.filters ?? {};
        return await componentsApi.get({ type: kind, page, pageSize, filters });
    }
);

const slice = createSlice({
    name: "components",
    initialState,
    reducers: {
        setFilters(state, { payload }: { payload: ComponentsQuery["filters"] }) {
            state.filters = payload ?? {};
            state.page = 1;
        },
        setPage(state, { payload }: { payload: number }) {
            state.page = Math.max(1, payload || 1);
        },
        setKind(state, { payload }: { payload: Kind }) {
            state.kind = payload;
            state.page = 1;
        }
    },
    extraReducers: (b) => {
        b.addCase(fetchComponentsThunk.pending, (s, a) => {
            s.status = "loading"; s.error = null;
            const arg = a.meta.arg;
            if (arg.type) s.kind = arg.type;
            if (arg.page) s.page = arg.page;
            if (arg.pageSize) s.pageSize = arg.pageSize;
            if (arg.filters) s.filters = arg.filters;
        });
        b.addCase(fetchComponentsThunk.fulfilled, (s, a) => {
            s.status = "succeeded";
            if ("cpus" in a.payload
                && "gpus" in a.payload
                && "mbs" in a.payload
                && "psus" in a.payload
                && "cases" in a.payload
                && "szos" in a.payload
                && "airCoolings" in a.payload
                && "memories" in a.payload
                && "ssds" in a.payload
                && "hdd2_5" in a.payload
                && "hdd3_5" in a.payload) {
                s.cpus = a.payload.cpus;
                s.gpus = a.payload.gpus;
                s.mbs = a.payload.mbs;
                s.psus = a.payload.psus;
                s.cases = a.payload.cases;
                s.szos = a.payload.szos;
                s.airCoolings = a.payload.airCoolings;
                s.memories = a.payload.memories;
                s.ssds = a.payload.ssds;
                s.hdd2_5 = a.payload.hdd2_5;
                s.hdd3_5 = a.payload.hdd3_5;
            } else {
                if (s.kind === "cpu") s.cpus = a.payload as PagedResult<CPU>;
                if (s.kind === "gpu") s.gpus = a.payload as PagedResult<GPU>;
                if (s.kind === "mb") s.mbs = a.payload as PagedResult<MB>;
                if (s.kind === "psu") s.psus = a.payload as PagedResult<PSU>;
                if (s.kind === "case") s.cases = a.payload as PagedResult<CASE>;
                if (s.kind === "szo") s.szos = a.payload as PagedResult<SZO>;
                if (s.kind === "aircooling") s.airCoolings = a.payload as PagedResult<AirCooling>;
                if (s.kind === "memory") s.memories = a.payload as PagedResult<Memory>;
                if (s.kind === "ssd") s.ssds = a.payload as PagedResult<SSD>;
                if (s.kind === "hdd2_5") s.hdd2_5 = a.payload as PagedResult<HDD2_5>;
                if (s.kind === "hdd3_5") s.hdd3_5 = a.payload as PagedResult<HDD3_5>;
            }
        });
        b.addCase(fetchComponentsThunk.rejected, (s, a) => {
            s.status = "failed";
            s.error = a.error.message ?? "Failed to load components";
        });
    }
});

export const { setFilters, setPage, setKind } = slice.actions;
export default slice.reducer;