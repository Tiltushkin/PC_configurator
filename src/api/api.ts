import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type {
    AirCooling,
    AuthResponse,
    BuildResponse,
    CASE,
    ComponentsAllResponse,
    CPU,
    GPU,
    HDD2_5,
    HDD3_5,
    MB,
    Memory,
    PagedResult,
    ProfileResponse,
    PSU,
    ShareResponse,
    SSD,
    SZO
} from "../shared/types/types";

const API_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:5051";
export const axios_api = axios.create({ baseURL: API_URL });

export const TOKEN_KEY = "pc_conf_token";

export function setAuthToken(token: string | null) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        axios_api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        localStorage.removeItem(TOKEN_KEY);
        delete axios_api.defaults.headers.common["Authorization"];
    }
}

(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) setAuthToken(t);
})();

axios_api.interceptors.response.use(
    (r) => r,
    (err: AxiosError) => {
        if (err.response?.status === 401) setAuthToken(null);
        return Promise.reject(err);
    }
);

export class ApiError extends Error {
    status?: number;
    data?: unknown;
    constructor(message: string, status?: number, data?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

function normalizeError(e: unknown): ApiError {
    if (axios.isAxiosError(e)) {
        let msg =
            (e.response?.data as any)?.message ||
            (e.response?.data as any)?.error ||
            e.message ||
            "Request failed";

        const data: any = e.response?.data;
        if (data && typeof data === "object" && data.errors) {
            try {
                const parts: string[] = [];
                for (const [k, v] of Object.entries<any>(data.errors)) {
                    const arr = Array.isArray(v) ? v : [v];
                    arr.forEach((m: any) => parts.push(`${k}: ${m}`));
                }
                if (parts.length) msg = parts.join("; ");
            } catch { /* ignore */ }
        }

        return new ApiError(msg, e.response?.status, e.response?.data);
    }
    return new ApiError((e as Error)?.message ?? "Unknown error");
}

async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
        const { data } = await axios_api.get<T>(url, config);
        return data;
    } catch (e) {
        throw normalizeError(e);
    }
}
async function post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
        const { data } = await axios_api.post<T>(url, body, config);
        return data;
    } catch (e) {
        throw normalizeError(e);
    }
}
async function put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
        const { data } = await axios_api.put<T>(url, body, config);
        return data;
    } catch (e) {
        throw normalizeError(e);
    }
}
async function del<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
        const { data } = await axios_api.delete<T>(url, config);
        return data;
    } catch (e) {
        throw normalizeError(e);
    }
}

export const authApi = {
    async register(payload: { login: string; userName: string; password: string }): Promise<AuthResponse> {
        const tokenRes = await post<{ accessToken: string; expiresAtUtc: string }>("/api/auth/register", {
            login: payload.login,
            password: payload.password,
            displayName: payload.userName,
        });
        setAuthToken(tokenRes.accessToken);
        const me = await get<ProfileResponse>("/api/profiles/me");
        return { token: tokenRes.accessToken, user: me };
    },

    async login(payload: { login: string; password: string }): Promise<AuthResponse> {
        const tokenRes = await post<{ accessToken: string; expiresAtUtc: string }>("/api/auth/login", payload);
        setAuthToken(tokenRes.accessToken);
        const me = await get<ProfileResponse>("/api/profiles/me");
        return { token: tokenRes.accessToken, user: me };
    },

    async me(): Promise<ProfileResponse> {
        return await get<ProfileResponse>("/api/profiles/me");
    },

    async getProfile(id: string): Promise<ProfileResponse> {
        return await get<ProfileResponse>(`/api/profiles/${encodeURIComponent(id)}`);
    },

    async updateMe(payload: { userName?: string; avatarUrl?: string; }): Promise<void> {
        return await put<void>("/api/profiles/me", payload);
    },
};

export type ComponentType = "all" | "cpu" | "gpu" | "mb" | "psu" | "case" | "szo" | "aircooling" | "memory" | "ssd" | "hdd2_5" | "hdd3_5";
type Primitive = string | number | boolean | undefined | null;

export const componentsApi = {
    async get(opts: {
        type?: ComponentType;
        page?: number;
        pageSize?: number;
        filters?: Record<string, Primitive>;
    }): Promise<
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
        | PagedResult<HDD3_5>
    > {
        const page = opts.page ?? 1;
        const pageSize = opts.pageSize ?? 20;
        const params: Record<string, Primitive> = {
            type: opts.type ?? "all",
            offset: (page - 1) * pageSize,
            limit: pageSize,
            ...(opts.filters ?? {}),
        };

        const raw = await get<any>("/api/components", { params });
        const wrap = <T,>(items: T[]) => ({ items, total: items.length, page, pageSize });

        const kind = opts.type ?? "all";
        if (kind === "all") {
            const cpus = (raw?.cpus ?? []) as CPU[];
            const gpus = (raw?.gpus ?? []) as GPU[];
            const mbs  = (raw?.mbs  ?? []) as MB[];
            const psus = (raw?.psus ?? []) as PSU[];
            const cases = (raw?.cases ?? []) as CASE[];
            const szos = (raw?.szos ?? []) as SZO[];
            const airCoolings = (raw?.airCoolings ?? []) as AirCooling[];
            const memories = (raw?.memories ?? []) as Memory[];
            const ssds = (raw?.ssds ?? []) as SSD[];
            const hdd2_5 = (raw?.hdd2_5 ?? []) as HDD2_5[];
            const hdd3_5 = (raw?.hdd3_5 ?? []) as HDD3_5[];
            return {
                cpus: wrap(cpus),
                gpus: wrap(gpus),
                mbs: wrap(mbs),
                psus: wrap(psus),
                cases: wrap(cases),
                szos: wrap(szos),
                airCoolings: wrap(airCoolings),
                memories: wrap(memories),
                ssds: wrap(ssds),
                hdd2_5: wrap(hdd2_5),
                hdd3_5: wrap(hdd3_5),
            };
        }
        if (kind === "cpu") return wrap((raw?.cpus ?? []) as CPU[]);
        if (kind === "gpu") return wrap((raw?.gpus ?? []) as GPU[]);
        if (kind === "mb")  return wrap((raw?.mbs  ?? []) as MB[]);
        if (kind === "psu") return wrap((raw?.psus ?? []) as PSU[]);
        if (kind === "case") return wrap((raw?.cases ?? []) as CASE[]);
        if (kind === "szo") return wrap((raw?.szos ?? []) as SZO[]);
        if (kind === "aircooling") return wrap((raw?.airCoolings ?? []) as AirCooling[]);
        if (kind === "memory") return wrap((raw?.memories ?? []) as Memory[]);
        if (kind === "ssd") return wrap((raw?.ssds ?? []) as SSD[]);
        if (kind === "hdd2_5") return wrap((raw?.hdd2_5 ?? []) as HDD2_5[]);
        if (kind === "hdd3_5") return wrap((raw?.hdd3_5 ?? []) as HDD3_5[]);
        return wrap([] as any[]);
    },
};

export const buildsApi = {
    async listMine(page = 1, pageSize = 20): Promise<PagedResult<BuildResponse>> {
        const rows = await get<BuildResponse[]>("/api/builds", { params: { scope: "mine" } });
        const start = (page - 1) * pageSize;
        const items = rows.slice(start, start + pageSize);
        return { items, total: rows.length, page, pageSize };
    },

    async create(payload: {
        cpuId?: string | null;
        gpuId?: string | null;
        mbId?: string | null;
        psuId?: string | null;
        caseId?: string | null;
        coolingId?: string | null;
        memoryId?: string | null;
        ssdIds?: string[] | null;
        hddIds?: string[] | null;
        name?: string;
        description?: string | null;
        isPublic?: boolean;
    }): Promise<BuildResponse> {
        const body = {
            name: payload.name ?? "My Build",
            description: payload.description ?? null,
            cpuId: payload.cpuId ?? null,
            gpuId: payload.gpuId ?? null,
            mbId: payload.mbId ?? null,
            psuId: payload.psuId ?? null,
            caseId: payload.caseId ?? null,
            coolingId: payload.coolingId ?? null,
            memoryId: payload.memoryId ?? null,
            ssdIds: payload.ssdIds ?? null,
            hddIds: payload.hddIds ?? null,
            isPublic: payload.isPublic ?? false,
        };
        return await post<BuildResponse>("/api/builds", body);
    },

    async remove(id: string): Promise<void> {
        await del<void>(`/api/builds/${id}`);
    },

    async share(id: string): Promise<ShareResponse> {
        return await post<ShareResponse>(`/api/builds/${id}/share`, {});
    },

    async getShared(token: string): Promise<BuildResponse> {
        return await get<BuildResponse>(`/api/builds/shared/${encodeURIComponent(token)}`);
    },
};

function toStrArray(v: any): string[] {
    if (Array.isArray(v)) return v.map(String).map(s => s.trim()).filter(Boolean);
    if (v == null) return [];
    const s = String(v).trim();
    if (!s) return [];
    return s.includes(",") ? s.split(",").map(x => x.trim()).filter(Boolean) : [s];
}

export const adminApi = {
    async addCpu(payload: any): Promise<{ id: string }> {
        return await post<{ id: string }>("/api/admin/components/cpu", {
            ...payload,
            images: Array.isArray(payload.images) ? payload.images : toStrArray(payload.images),
            memoryTypes: toStrArray(payload.memoryTypes),
            memoryFrequency: toStrArray(payload.memoryFrequency),
            additionally: toStrArray(payload.additionally),
        });
    },

    async addGpu(payload: any): Promise<{ id: string }> {
        return await post<{ id: string }>("/api/admin/components/gpu", {
            ...payload,
            images: Array.isArray(payload.images) ? payload.images : toStrArray(payload.images),
            videoConnectors: toStrArray(payload.videoConnectors),
            completion: toStrArray(payload.completion),
            additionally: toStrArray(payload.additionally),
        });
    },

    async addMb(payload: any): Promise<{ id: string }> {
        return await post<{ id: string }>("/api/admin/components/mb", {
            ...payload,

            OutUSBTypeA: toStrArray(payload.OutUSBTypeA),
            OutUSBTypeC: toStrArray(payload.OutUSBTypeC),
            InUSBTypeA: toStrArray(payload.InUSBTypeA),
            InUSBTypeC: toStrArray(payload.InUSBTypeC),
            images: Array.isArray(payload.images) ? payload.images : toStrArray(payload.images),
            formFactor: toStrArray(payload.formFactor),
            memoryTypes: toStrArray(payload.memoryTypes),
            memoryFormFactor: toStrArray(payload.memoryFormFactor),
            maxMemoryBoostFrequency: Array.isArray(payload.maxMemoryBoostFrequency)
                ? payload.maxMemoryBoostFrequency.map((n: number) => n)
                : toStrArray(payload.maxMemoryBoostFrequency).map(Number),
            pciSlots: toStrArray(payload.pciSlots),
            m2ConnectorsPCIeProcessor: toStrArray(payload.m2ConnectorsPCIeProcessor),
            m2ConnectorsPCIeCheapSet: toStrArray(payload.m2ConnectorsPCIeCheapSet),
            sataRAID: toStrArray(payload.sataRAID),
            nvmeRAID: toStrArray(payload.nvmeRAID),
            videoOutputs: toStrArray(payload.videoOutputs),
            processorCoolingConnectors: toStrArray(payload.processorCoolingConnectors),
            passiveCooling: toStrArray(payload.passiveCooling),
            PortsJson: typeof payload.PortsJson === "string" && payload.PortsJson.trim()
                ? (() => { try { return JSON.parse(payload.PortsJson); } catch { return payload.PortsJson; } })()
                : payload.PortsJson,
        });
    },

    async addPsu(payload: any): Promise<{ id: string }> {
        const body = {
            ...payload,
            images: Array.isArray(payload.images) ? payload.images : toStrArray(payload.images),

            mainPowerConnector: toStrArray(payload.mainPowerConnector),
            processorPowerConnectors: toStrArray(payload.processorPowerConnectors),
            videoCardPowerConnectors: toStrArray(payload.videoCardPowerConnectors),
            complianceWithStandards: toStrArray(payload.complianceWithStandards),
            protectionTechnologies: toStrArray(payload.protectionTechnologies),
        };
        return await post<{ id: string }>("/api/admin/components/psu", body);
    },

    async addCase(payload: any): Promise<{ id: string }> {
        return await post<{ id: string }>("/api/admin/components/case", {
            ...payload,
            images: Array.isArray(payload.images) ? payload.images : toStrArray(payload.images),
            BodyMaterial: toStrArray(payload.BodyMaterial),
            FrontPanelMaterial: toStrArray(payload.FrontPanelMaterial),
            BackLightControl: toStrArray(payload.BackLightControl),
            CompatibleBoards: toStrArray(payload.CompatibleBoards),
            CompatiblePowerSupply: toStrArray(payload.CompatiblePowerSupply),
            IncludedFans: toStrArray(payload.IncludedFans),
            RearFanSupport: toStrArray(payload.RearFanSupport),
            TopFansSupport: toStrArray(payload.TopFansSupport),
            BottomFansSupport: toStrArray(payload.BottomFansSupport),
            SideFansSupport: toStrArray(payload.SideFansSupport),
            SZOUpperMountingDimension: toStrArray(payload.SZOUpperMountingDimension),
            SZORearMountingDimension: toStrArray(payload.SZORearMountingDimension),
            SZOSideMountingDimension: toStrArray(payload.SZOSideMountingDimension)
        });
    },
    async addSzo(payload: any): Promise<{ id: string }> {
        return await post<{ id: string }>("/api/admin/components/szo", {
            ...payload,
            images: Array.isArray(payload.images) ? payload.images : toStrArray(payload.images),
        });
    },
    async addAirCooling(payload: any): Promise<{ id: string }> {
        return await post<{ id: string }>("/api/admin/components/aircooling", {
            ...payload,
            images: Array.isArray(payload.images) ? payload.images : toStrArray(payload.images),
        });
    },
    async addSsd(payload: any): Promise<{ id: string }> {
        return await post<{ id: string }>("/api/admin/components/ssd", {
            ...payload,
            images: Array.isArray(payload.images) ? payload.images : toStrArray(payload.images),
        });
    },
    async addHdd2_5(payload: any): Promise<{ id: string }> {
        return await post<{ id: string }>("/api/admin/components/hdd2_5", {
            ...payload,
            images: Array.isArray(payload.images) ? payload.images : toStrArray(payload.images),
        });
    },
    async addHdd3_5(payload: any): Promise<{ id: string }> {
        return await post<{ id: string }>("/api/admin/components/hdd3_5", {
            ...payload,
            images: Array.isArray(payload.images) ? payload.images : toStrArray(payload.images),
        });
    },
    async addMemory(payload: any): Promise<{ id: string }> {
        return await post<{ id: string }>("/api/admin/components/memory", {
            ...payload,
            images: Array.isArray(payload.images) ? payload.images : toStrArray(payload.images),
        });
    },
};

export const api = { authApi, componentsApi, buildsApi, adminApi, setAuthToken, axios_api };