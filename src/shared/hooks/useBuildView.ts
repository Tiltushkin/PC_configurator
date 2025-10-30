import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { loadMeThunk } from "../../store/slices/authSlice";
import { getBuildById } from "../../api/buildsClient";
import { componentsApi } from "../../api/api";
import type { AirCooling, allComponents, BuildEx, BuildResponse, CASE, CompMaps, ComponentsAllResponse, COOLING, CPU, GPU, HDD2_5, HDD3_5, MB, Memory, PSU, SlotType, SSD, SZO } from "../types/types";
import utils from "../utils/utils";
import { updateBuild, deleteBuild as apiDeleteBuild } from "../../api/buildsClient";

export default function useBuildView() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();
    const { token, user } = useSelector((st: RootState) => st.auth);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [maps, setMaps] = useState<CompMaps | null>(null);
    const [buildRaw, setBuildRaw] = useState<BuildResponse | null>(null);
    const [buildState, setBuildState] = useState<BuildEx | null>(null);
    const [overlayOpen, setOverlayOpen] = useState(false);
    const [overlaySlot, setOverlaySlot] = useState<SlotType | null>(null);
    const [query, setQuery] = useState("");
    const [storagePickerOpen, setStoragePickerOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const addStorageRef = useRef<HTMLDivElement | null>(null);

    const isOwner = !!(user && buildRaw && user.id === buildRaw.ownerId);

    useEffect(() => {
        if (!id) { setError("ID не указан"); setLoading(false); return; }
        (async () => {
            try {
                if (token && !user) {
                    try {
                        await dispatch(loadMeThunk()).unwrap();
                    } catch { /* Ignore */ }
                }

                const data = await getBuildById(id);
                setBuildRaw(data);

                const rawAll = await componentsApi.get({ type: "all", pageSize: 500 }) as ComponentsAllResponse;

                const szoMap = utils.toMap<SZO>(rawAll.szos);
                const airMap = utils.toMap<AirCooling>(rawAll.airCoolings);
                const cooling = new Map<string, COOLING>([...Array.from(szoMap), ...Array.from(airMap)]);

                const cm: CompMaps = {
                    cpu: utils.toMap<CPU>(rawAll.cpus),
                    gpu: utils.toMap<GPU>(rawAll.gpus),
                    mb: utils.toMap<MB>(rawAll.mbs),
                    psu: utils.toMap<PSU>(rawAll.psus),
                    case: utils.toMap<CASE>(rawAll.cases),
                    cooling,
                    memory: utils.toMap<Memory>(rawAll.memories),
                    ssd: utils.toMap<SSD>(rawAll.ssds),
                    hdd2_5: utils.toMap<HDD2_5>(rawAll.hdd2_5),
                    hdd3_5: utils.toMap<HDD3_5>(rawAll.hdd3_5),
                };
                setMaps(cm);
                setBuildState(utils.toBuildEx(data, cm));
            } catch (e: any) {
                setError(e?.message ?? "Ошибка загрузки сборки");
            } finally {
                setLoading(false);
            }
        })();
    }, [id, token]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!storagePickerOpen) return;
            const target = e.target as Node;
            if (addStorageRef.current && !addStorageRef.current.contains(target)) {
                setStoragePickerOpen(false);
            }
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, [storagePickerOpen]);

    const listBySlot = useMemo(() => {
        if (!maps) return {} as Record<SlotType, any[]>;
        return {
            cpu: Array.from(maps.cpu.values()),
            gpu: Array.from(maps.gpu.values()),
            mb: Array.from(maps.mb.values()),
            psu: Array.from(maps.psu.values()),
            case: Array.from(maps.case.values()),
            cooling: Array.from(maps.cooling.values()),
            memory: Array.from(maps.memory.values()),
            "storage-ssd": Array.from(maps.ssd.values()),
            "storage-hdd2_5": Array.from(maps.hdd2_5.values()),
            "storage-hdd3_5": Array.from(maps.hdd3_5.values()),
        } as Record<SlotType, any[]>;
    }, [maps]);

    const selected: any = useMemo(() => {
        if (!maps || !buildState) return {};
        return {
            cpu: buildState.cpuId ? maps.cpu.get(buildState.cpuId) ?? null : null,
            gpu: buildState.gpuId ? maps.gpu.get(buildState.gpuId) ?? null : null,
            mb: buildState.mbId ? maps.mb.get(buildState.mbId) ?? null : null,
            psu: buildState.psuId ? maps.psu.get(buildState.psuId) ?? null : null,
            case: buildState.caseId ? maps.case.get(buildState.caseId) ?? null : null,
            cooling: buildState.coolingId ? maps.cooling.get(buildState.coolingId) ?? null : null,
            memory: buildState.memoryId ? maps.memory.get(buildState.memoryId) ?? null : null,
        } as Record<"cpu"|"gpu"|"mb"|"psu"|"case"|"cooling"|"memory", any | null>;
    }, [maps, buildState]);

    const resolvedStorages = useMemo(() => {
        if (!maps || !buildState) return [];
        return (buildState.storages ?? []).map(st => {
            const item =
                st.kind === "ssd" ? maps.ssd.get(st.id)
                    : st.kind === "hdd2_5" ? maps.hdd2_5.get(st.id)
                        : maps.hdd3_5.get(st.id);
            return { ...st, item: item ?? null };
        });
    }, [maps, buildState]);

    const totalPrice = useMemo(() => {
        if (!maps || !buildState) return "0";
        let sum = 0;

        const add = (c: allComponents) => {
            if (c) sum += c.Price;
        };

        add(selected.cpu);
        add(selected.gpu);
        add(selected.mb);
        add(selected.psu);
        add(selected.case);
        add(selected.cooling);
        add(selected.memory);

        resolvedStorages.forEach(st => {
            const p = (st.item && typeof st.item.Price === "number") ? st.item.Price : 0;
            sum += p * (st.qty ?? 1);
        });

        return Math.floor(sum).toLocaleString();
    }, [selected, resolvedStorages, maps, buildState]);

    const openOverlay = (slot: SlotType) => {
        if (!isOwner) return;
        setOverlaySlot(slot);
        setQuery("");
        setOverlayOpen(true);
    };

    const closeOverlay = () => setOverlayOpen(false);

    const applyAndSave = async (patch: Partial<BuildEx>) => {
        if (!buildRaw || !buildState || !isOwner) return;
        const next = { ...buildState, ...patch };
        setBuildState(next);
        try {
            setSaving(true);
            const saved = await updateBuild(buildRaw.id, next);
            setBuildRaw({ ...buildRaw, ...saved });
        } catch (e: any) { /* Ignore */ }
        finally { setSaving(false); }
    };

    const clearSlot = (slot: Exclude<SlotType, "storage-ssd" | "storage-hdd2_5" | "storage-hdd3_5">) => {
        if (!isOwner) return;
        if (slot === "cpu") applyAndSave({ cpuId: undefined });
        if (slot === "gpu") applyAndSave({ gpuId: undefined });
        if (slot === "mb") applyAndSave({ mbId: undefined });
        if (slot === "psu") applyAndSave({ psuId: undefined });
        if (slot === "case") applyAndSave({ caseId: undefined });
        if (slot === "cooling") applyAndSave({ coolingId: undefined });
        if (slot === "memory") applyAndSave({ memoryId: undefined });
    };

    const removeStorageAt = (idx: number) => {
        if (!isOwner || !buildState) return;
        const arr = [...(buildState.storages ?? [])];
        arr.splice(idx, 1);
        applyAndSave({ storages: arr });
    };
    const incStorageQty = (idx: number) => {
        if (!isOwner || !buildState) return;
        const arr = [...(buildState.storages ?? [])];
        arr[idx] = { ...arr[idx], qty: Math.min(99, (arr[idx].qty ?? 1) + 1) };
        applyAndSave({ storages: arr });
    };
    const decStorageQty = (idx: number) => {
        if (!isOwner || !buildState) return;
        const arr = [...(buildState.storages ?? [])];
        arr[idx] = { ...arr[idx], qty: Math.max(1, (arr[idx].qty ?? 1) - 1) };
        applyAndSave({ storages: arr });
    };

    const onPick = (item: allComponents) => {
        if (!isOwner || !overlaySlot) return;
        const id = item?.Id as string;
        if (overlaySlot === "cpu") applyAndSave({ cpuId: id });
        if (overlaySlot === "gpu") applyAndSave({ gpuId: id });
        if (overlaySlot === "mb") applyAndSave({ mbId: id });
        if (overlaySlot === "psu") applyAndSave({ psuId: id });
        if (overlaySlot === "case") applyAndSave({ caseId: id });
        if (overlaySlot === "cooling") applyAndSave({ coolingId: id });
        if (overlaySlot === "memory") applyAndSave({ memoryId: id });

        if (overlaySlot === "storage-ssd") applyAndSave({ storages: [...(buildState!.storages ?? []), { kind: "ssd", id, qty: 1 }] });
        if (overlaySlot === "storage-hdd2_5") applyAndSave({ storages: [...(buildState!.storages ?? []), { kind: "hdd2_5", id, qty: 1 }] });
        if (overlaySlot === "storage-hdd3_5") applyAndSave({ storages: [...(buildState!.storages ?? []), { kind: "hdd3_5", id, qty: 1 }] });

        closeOverlay();
        setStoragePickerOpen(true);
    };

    const onDeleteBuild = async () => {
        if (!isOwner || !buildRaw) return;
        if (!confirm("Удалить сборку?")) return;
        try {
            await apiDeleteBuild(buildRaw.id);
            try { localStorage.removeItem("lastBuild"); } catch { /* Ignore */ }
            navigate("/profile", { replace: true });
        } catch (e:any) {
            alert(e?.message ?? "Ошибка удаления");
        }
    };

    return {
        id, token, user, loading, error, maps, buildRaw, buildState, overlayOpen, overlaySlot,
        query, storagePickerOpen, saving, addStorageRef, isOwner, setLoading, setError,
        setMaps, setBuildRaw, setBuildState, setOverlayOpen, setOverlaySlot, setQuery,
        setStoragePickerOpen, setSaving, listBySlot, resolvedStorages, selected, totalPrice,
        openOverlay, closeOverlay, applyAndSave, clearSlot, removeStorageAt, incStorageQty,
        decStorageQty, onPick, onDeleteBuild
    };
}