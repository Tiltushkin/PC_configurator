import { axios_api } from "./api";
import type { BuildEx, BuildSavePayload, StorageItem } from "../shared/types/types";

export function explodeStorages(storages?: StorageItem[]): { ssdIds: string[]; hddIds: string[] } {
  const ssd: string[] = [];
  const hdd: string[] = [];
  (storages ?? []).forEach(s => {
    const qty = Math.max(1, Math.floor(s.qty || 1));
    if (s.kind === "ssd") for (let i=0;i<qty;i++) ssd.push(s.id);
    if (s.kind === "hdd2_5" || s.kind === "hdd3_5") for (let i=0;i<qty;i++) hdd.push(s.id);
  });
  return { ssdIds: ssd, hddIds: hdd };
}

export function toSavePayload(state: BuildEx): BuildSavePayload {
  const { ssdIds, hddIds } = explodeStorages(state.storages);
  return {
    name: (state as any).name ?? "My Build",
    description: (state as any).description ?? null,
    cpuId: state.cpuId ?? null,
    gpuId: state.gpuId ?? null,
    mbId: state.mbId ?? null,
    psuId: state.psuId ?? null,
    caseId: state.caseId ?? null,
    coolingId: state.coolingId ?? null,
    memoryId: state.memoryId ?? null,
    ssdIds,
    hddIds
  };
}

export async function createBuild(state: BuildEx) {
  const payload = toSavePayload(state);
  const { data } = await axios_api.post("/api/builds", payload);
  return data;
}

export async function updateBuild(id: string, state: BuildEx) {
  const payload = toSavePayload(state);
  const { data } = await axios_api.put(`/api/builds/${encodeURIComponent(id)}`, payload);
  return data;
}

export async function getBuildById(id: string) {
  const { data } = await axios_api.get(`/api/builds/${encodeURIComponent(id)}`);
  return data;
}

export async function deleteBuild(id: string) {
  await axios_api.delete(`/api/builds/${encodeURIComponent(id)}`);
}

export async function shareBuild(id: string) {
  const { data } = await axios_api.post(`/api/builds/${encodeURIComponent(id)}/share`, {});
  return data as { token: string; url: string; expiresAt?: string | null };
}