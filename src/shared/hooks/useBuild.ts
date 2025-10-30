import { useEffect, useRef, useState } from "react";
import { createBuild, shareBuild, updateBuild } from "../../api/buildsClient";
import type { allComponents, BuildEx, SlotType, WithMaybeId } from "../types/types";
import { useNavigate } from "react-router-dom";
import utils from "../utils/utils";

export default function useBuild() {
    const navigate = useNavigate();
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [shareErr, setShareErr] = useState<string | null>(null);
    const [overlaySlot, setOverlaySlot] = useState<SlotType | null>(null);
    const [overlayOpen, setOverlayOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [storagePickerOpen, setStoragePickerOpen] = useState(false);

    const addStorageRef = useRef<HTMLDivElement | null>(null);

    const [buildState, setBuildState] = useState<BuildEx>(() => {
        return (
            utils.readLastBuild() ?? {
                name: "Название сборки",
                description: "",
                cpuId: undefined,
                gpuId: undefined,
                mbId: undefined,
                psuId: undefined,
                caseId: undefined,
                coolingId: undefined,
                memoryId: undefined,
                ssdIds: undefined,
                hddIds: undefined,
                storages: [],
                isPublic: false
            }
        );
    });

    const handleSaveBuild = async () => {
        try {
            setSaving(true);
            let saved;
            if (currentId) {
                saved = await updateBuild(currentId, buildState);
            } else {
                saved = await createBuild(buildState);
            }
            const id = saved?.id ?? currentId;
            if (id) {
                setCurrentId(id);
                try {
                    localStorage.removeItem("lastBuild");
                } catch { /* Ignore */ }
                navigate(`/builds/${id}`, { replace: true });
            }
        } catch (e: any) {
            alert(e?.message ?? "Ошибка сохранения");
        } finally {
            setSaving(false);
        }
    };

    const handleShareBuild = async () => {
        setShareErr(null);
        setShareUrl(null);
        try {
            setSaving(true);
            let id = currentId;
            if (!id) {
                const saved = await createBuild(buildState);
                id = saved?.id;
                if (id) setCurrentId(id);
            } else {
                const saved = await updateBuild(id, buildState);
                id = saved?.id ?? id;
            }
            if (!id) throw new Error("Не удалось сохранить сборку");
            try {
                localStorage.removeItem("lastBuild");
            } catch { /* Ignore */ }
            navigate(`/builds/${id}`, { replace: true });
            const res = await shareBuild(id);
            setShareUrl(res.url);
            try { await navigator.clipboard?.writeText(res.url); } catch { /* Ignore */ }
            alert("Ссылка на сборку скопирована в буфер обмена");
        } catch (e: any) {
            setShareErr(e?.message ?? "Не удалось создать ссылку");
        } finally {
            setSaving(false);
        }
    };

    const openOverlay = (slot: SlotType) => {
        setOverlaySlot(slot);
        setQuery("");
        setOverlayOpen(true);
    };
    
    const closeOverlay = () => setOverlayOpen(false);

    const removeStorageAt = (idx: number) => {
        setBuildState(prev => {
            const arr = [...(prev.storages ?? [])];
            arr.splice(idx, 1);
            return { ...prev, storages: arr };
        });
    };
    const incStorageQty = (idx: number) => {
        setBuildState(prev => {
            const arr = [...(prev.storages ?? [])];
            arr[idx] = { ...arr[idx], qty: Math.min(99, (arr[idx].qty ?? 1) + 1) };
            return { ...prev, storages: arr };
        });
    };

    const decStorageQty = (idx: number) => {
        setBuildState(prev => {
            const arr = [...(prev.storages ?? [])];
            arr[idx] = { ...arr[idx], qty: Math.max(1, (arr[idx].qty ?? 1) - 1) };
            return { ...prev, storages: arr };
        });
    };

    const onPick = (item: WithMaybeId<allComponents>) => {
        const id = utils.getAnyId(item);
        if (overlaySlot === "cpu") setBuildState(prev => ({ ...prev, cpuId: id }));
        if (overlaySlot === "gpu") setBuildState(prev => ({ ...prev, gpuId: id }));
        if (overlaySlot === "mb") setBuildState(prev => ({ ...prev, mbId: id }));
        if (overlaySlot === "psu") setBuildState(prev => ({ ...prev, psuId: id }));
        if (overlaySlot === "case") setBuildState(prev => ({ ...prev, caseId: id }));
        if (overlaySlot === "cooling") setBuildState(prev => ({ ...prev, coolingId: id }));
        if (overlaySlot === "memory") setBuildState(prev => ({ ...prev, memoryId: id }));

        if (overlaySlot === "storage-ssd")
            setBuildState(prev => ({ ...prev, storages: [...(prev.storages ?? []), { kind: "ssd", id, qty: 1 }] }));
        if (overlaySlot === "storage-hdd2_5")
            setBuildState(prev => ({ ...prev, storages: [...(prev.storages ?? []), { kind: "hdd2_5", id, qty: 1 }] }));
        if (overlaySlot === "storage-hdd3_5")
            setBuildState(prev => ({ ...prev, storages: [...(prev.storages ?? []), { kind: "hdd3_5", id, qty: 1 }] }));

        closeOverlay();
        setStoragePickerOpen(true);
    };

    const clearSlot = (slot: Exclude<SlotType, "storage-ssd" | "storage-hdd2_5" | "storage-hdd3_5">) => {
        if (slot === "cpu") setBuildState(prev => ({ ...prev, cpuId: undefined }));
        if (slot === "gpu") setBuildState(prev => ({ ...prev, gpuId: undefined }));
        if (slot === "mb") setBuildState(prev => ({ ...prev, mbId: undefined }));
        if (slot === "psu") setBuildState(prev => ({ ...prev, psuId: undefined }));
        if (slot === "case") setBuildState(prev => ({ ...prev, caseId: undefined }));
        if (slot === "cooling") setBuildState(prev => ({ ...prev, coolingId: undefined }));
        if (slot === "memory") setBuildState(prev => ({ ...prev, memoryId: undefined }));
    };

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

    useEffect(() => { utils.writeLastBuild(buildState); }, [buildState]);

    return {
        buildState, currentId, saving, shareUrl, shareErr, overlaySlot, overlayOpen,
        query, storagePickerOpen, addStorageRef,
        handleSaveBuild, handleShareBuild, openOverlay, closeOverlay, removeStorageAt,
        incStorageQty, decStorageQty, onPick, clearSlot, setBuildState, setStoragePickerOpen, setQuery
    }
}