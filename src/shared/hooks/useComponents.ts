import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useMemo } from "react";
import type { AirCooling, BuildEx, CASE, CPU, GPU, HDD2_5, HDD3_5, MB, Memory, PSU, SlotType, SSD, SZO, WithMaybeId } from "../types/types";
import utils from "../utils/utils";

interface ComponentsProps {
    buildState?: BuildEx,
    query?: string;
    overlaySlot?: SlotType | null;
}

export default function useComponents({ buildState, query, overlaySlot } : ComponentsProps) {
    const componentsState = useSelector((st: RootState) => st.components);

    const cpus = useMemo(() => (componentsState?.cpus?.items as WithMaybeId<CPU>[] | undefined) ?? [], [componentsState?.cpus?.items]);
    const gpus = useMemo(() => (componentsState?.gpus?.items as WithMaybeId<GPU>[] | undefined) ?? [], [componentsState?.gpus?.items]);
    const mbs = useMemo(() => (componentsState?.mbs?.items as WithMaybeId<MB>[] | undefined) ?? [], [componentsState?.mbs?.items]);
    const psus = useMemo(() => (componentsState?.psus?.items as WithMaybeId<PSU>[] | undefined) ?? [], [componentsState?.psus?.items]);
    const cases = useMemo(() => (componentsState?.cases?.items as WithMaybeId<CASE>[] | undefined) ?? [], [componentsState?.cases?.items]);
    const szos = useMemo(() => (componentsState?.szos?.items as WithMaybeId<SZO>[] | undefined) ?? [], [componentsState?.szos?.items]);
    const airCoolings = useMemo(() => (componentsState?.airCoolings?.items as WithMaybeId<AirCooling>[] | undefined) ?? [], [componentsState?.airCoolings?.items]);
    const memories = useMemo(() => (componentsState?.memories?.items as WithMaybeId<Memory>[] | undefined) ?? [], [componentsState?.memories?.items]);
    const ssds = useMemo(() => (componentsState?.ssds?.items as WithMaybeId<SSD>[] | undefined) ?? [], [componentsState?.ssds?.items]);
    const hdd2_5 = useMemo(() => (componentsState?.hdd2_5?.items as WithMaybeId<HDD2_5>[] | undefined) ?? [], [componentsState?.hdd2_5?.items]);
    const hdd3_5 = useMemo(() => (componentsState?.hdd3_5?.items as WithMaybeId<HDD3_5>[] | undefined) ?? [], [componentsState?.hdd3_5?.items]);

    const selectedCpu = useMemo(
        () => buildState?.cpuId ? cpus.find(c => utils.getAnyId(c) === buildState?.cpuId) ?? null : null,
        [buildState?.cpuId, cpus]
    );
    const selectedGpu = useMemo(
        () => buildState?.gpuId ? gpus.find(g => utils.getAnyId(g) === buildState?.gpuId) ?? null : null,
        [buildState?.gpuId, gpus]
    );
    const selectedMb = useMemo(
        () => buildState?.mbId ? mbs.find(g => utils.getAnyId(g) === buildState?.mbId) ?? null : null,
        [buildState?.mbId, mbs]
    );
    const selectedPsu = useMemo(
        () => buildState?.psuId ? psus.find(g => utils.getAnyId(g) === buildState?.psuId) ?? null : null,
        [buildState?.psuId, psus]
    );
    const selectedCase = useMemo(
        () => buildState?.caseId ? cases.find(g => utils.getAnyId(g) === buildState?.caseId) ?? null : null,
        [buildState?.caseId, cases]
    );
    const selectedCooling = useMemo(
        () => buildState?.coolingId ? (szos.find(g => utils.getAnyId(g) === buildState?.coolingId) || airCoolings.find(g => utils.getAnyId(g) === buildState.coolingId)) ?? null : null,
        [buildState?.coolingId, szos, airCoolings]
    );
    const selectedMemory = useMemo(
        () => buildState?.memoryId ? memories.find(g => utils.getAnyId(g) === buildState?.memoryId) ?? null : null,
        [buildState?.memoryId, memories]
    );

    const storageMaps = useMemo(() => ({
        ssd: new Map(ssds.map(s => [utils.getAnyId(s), s] as const)),
        hdd2_5: new Map(hdd2_5.map(h => [utils.getAnyId(h), h] as const)),
        hdd3_5: new Map(hdd3_5.map(h => [utils.getAnyId(h), h] as const)),
    }), [ssds, hdd2_5, hdd3_5]);

    const resolvedStorages = useMemo(() => {
        const stor = buildState?.storages ?? [];
        return stor.map(st => {
            const item =
                st.kind === "ssd" ? storageMaps.ssd.get(st.id)
                    : st.kind === "hdd2_5" ? storageMaps.hdd2_5.get(st.id)
                        : storageMaps.hdd3_5.get(st.id);
            return { ...st, item: item ?? null };
        });
    }, [buildState?.storages, storageMaps]);

    const list = useMemo(() => {
        const q = query?.trim().toLowerCase();

        const filterBy = <T extends { Model: string; ManufacturerCode?: string }>(base: T[]) => {
            if (!q) return base;
            return base.filter(x =>
                x.Model.toLowerCase().includes(q) || (x.ManufacturerCode ?? "").toLowerCase().includes(q)
            );
        };

        switch (overlaySlot) {
            case "cpu": return filterBy(cpus);
            case "gpu": return filterBy(gpus);
            case "mb": return filterBy(mbs);
            case "psu": return filterBy(psus);
            case "case": return filterBy(cases);
            case "cooling": return filterBy([...szos, ...airCoolings]);
            case "memory": return filterBy(memories);
            case "storage-ssd": return filterBy(ssds);
            case "storage-hdd2_5": return filterBy(hdd2_5);
            case "storage-hdd3_5": return filterBy(hdd3_5);
            default: return [];
        }
    }, [overlaySlot, cpus, gpus, mbs, psus, cases, szos, airCoolings, memories, ssds, hdd2_5, hdd3_5, query]);

    const totalPrice = useMemo(() => {
        let diskPrice = 0;
        resolvedStorages.map((el) => {
           diskPrice += (el.item?.Price || 0) * (el.qty || 1);
        });
        return Math.floor((selectedCpu?.Price || 0) + (selectedGpu?.Price || 0) + (selectedMb?.Price || 0)
        + (selectedPsu?.Price || 0) + (selectedCase?.Price || 0) + (selectedCooling?.Price || 0) + (selectedMemory?.Price || 0) + diskPrice);
    }, [selectedCpu, selectedGpu, selectedMb, selectedPsu, selectedCase, selectedCooling, selectedMemory, resolvedStorages]);

    return {
        cpus, gpus, mbs, psus, cases, szos, airCoolings, memories, ssds, hdd2_5, hdd3_5, list,
        selectedCpu, selectedGpu, selectedMb, selectedPsu, selectedCase, selectedCooling,
        selectedMemory, resolvedStorages, totalPrice
    }
}