import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../store/store";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {loadMeThunk, selectToken} from "../../store/slices/authSlice";
import s from "./BuildPage.module.scss";
import MainLayout from "../../layouts/MainLayout";
import type {
    CPU, GPU, MB, PSU, SZO, AirCooling, CASE, Memory, SSD, HDD2_5, HDD3_5, BuildEx, SlotType, WithMaybeId,
    StorageItem, allComponents
} from "../../shared/types/types";
import AnimatedBackground from "../../components/animations/AnimatedBackground.tsx";
import utils from "../../shared/utils/utils";
import { createBuild, updateBuild, shareBuild } from "../../api/buildsClient";
import {checkCompatibility} from "../../shared/utils/compatibility.ts";
import RightOverlay from "../../components/RightOverlay/RightOverlay.tsx";

const BuildPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [shareErr, setShareErr] = useState<string | null>(null);

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

    const token = useSelector(selectToken);
    const componentsState = useSelector((st: RootState) => st.components);

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

    const [overlayOpen, setOverlayOpen] = useState(false);
    const [overlaySlot, setOverlaySlot] = useState<SlotType | null>(null);
    const [query, setQuery] = useState("");

    const [storagePickerOpen, setStoragePickerOpen] = useState(false);
    const addStorageRef = useRef<HTMLDivElement | null>(null);

    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        (async () => {
            if (!token) {
                navigate("/auth", { replace: true });
                return;
            }
            try { await dispatch(loadMeThunk()).unwrap(); }
            catch (e) { console.error("Не удалось загрузить пользователя:", e); }
        })();
    }, [token, dispatch, navigate]);

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
        () => buildState.cpuId ? cpus.find(c => utils.getAnyId(c) === buildState.cpuId) ?? null : null,
        [buildState.cpuId, cpus]
    );
    const selectedGpu = useMemo(
        () => buildState.gpuId ? gpus.find(g => utils.getAnyId(g) === buildState.gpuId) ?? null : null,
        [buildState.gpuId, gpus]
    );
    const selectedMb = useMemo(
        () => buildState.mbId ? mbs.find(g => utils.getAnyId(g) === buildState.mbId) ?? null : null,
        [buildState.mbId, mbs]
    );
    const selectedPsu = useMemo(
        () => buildState.psuId ? psus.find(g => utils.getAnyId(g) === buildState.psuId) ?? null : null,
        [buildState.psuId, psus]
    );
    const selectedCase = useMemo(
        () => buildState.caseId ? cases.find(g => utils.getAnyId(g) === buildState.caseId) ?? null : null,
        [buildState.caseId, cases]
    );
    const selectedCooling = useMemo(
        () => buildState.coolingId ? (szos.find(g => utils.getAnyId(g) === buildState.coolingId) || airCoolings.find(g => utils.getAnyId(g) === buildState.coolingId)) ?? null : null,
        [buildState.coolingId, szos, airCoolings]
    );
    const selectedMemory = useMemo(
        () => buildState.memoryId ? memories.find(g => utils.getAnyId(g) === buildState.memoryId) ?? null : null,
        [buildState.memoryId, memories]
    );

    const storageMaps = useMemo(() => ({
        ssd: new Map(ssds.map(s => [utils.getAnyId(s), s] as const)),
        hdd2_5: new Map(hdd2_5.map(h => [utils.getAnyId(h), h] as const)),
        hdd3_5: new Map(hdd3_5.map(h => [utils.getAnyId(h), h] as const)),
    }), [ssds, hdd2_5, hdd3_5]);

    const resolvedStorages = useMemo(() => {
        const stor = buildState.storages ?? [];
        return stor.map(st => {
            const item =
                st.kind === "ssd" ? storageMaps.ssd.get(st.id)
                    : st.kind === "hdd2_5" ? storageMaps.hdd2_5.get(st.id)
                        : storageMaps.hdd3_5.get(st.id);
            return { ...st, item: item ?? null };
        });
    }, [buildState.storages, storageMaps]);

    const compatibility = checkCompatibility({ CPU: selectedCpu, GPU: selectedGpu, MB: selectedMb, CASE: selectedCase, PSU: selectedPsu, cooling: selectedCooling, memory: selectedMemory }, resolvedStorages);

    const migratedRef = useRef(false);
    useEffect(() => {
        if (migratedRef.current) return;
        const hasOld = (buildState.ssdIds && buildState.ssdIds.length) || (buildState.hddIds && buildState.hddIds.length);
        const listsReady = ssds.length || hdd2_5.length || hdd3_5.length;
        if (!hasOld || !listsReady) return;

        const newStorages: StorageItem[] = [];

        const ssdCount = new Map<string, number>();
        for (const id of buildState.ssdIds ?? []) ssdCount.set(id, (ssdCount.get(id) ?? 0) + 1);
        ssdCount.forEach((qty, id) => {
            if (storageMaps.ssd.has(id)) newStorages.push({ kind: "ssd", id, qty });
        });

        const hddCount = new Map<string, number>();
        for (const id of buildState.hddIds ?? []) hddCount.set(id, (hddCount.get(id) ?? 0) + 1);
        hddCount.forEach((qty, id) => {
            if (storageMaps.hdd2_5.has(id)) newStorages.push({ kind: "hdd2_5", id, qty });
            else if (storageMaps.hdd3_5.has(id)) newStorages.push({ kind: "hdd3_5", id, qty });
            else newStorages.push({ kind: "hdd3_5", id, qty });
        });

        setBuildState(prev => ({
            ...prev,
            storages: [...(prev.storages ?? []), ...newStorages],
            ssdIds: undefined,
            hddIds: undefined
        }));
        migratedRef.current = true;
    }, [buildState.ssdIds, buildState.hddIds, ssds.length, hdd2_5.length, hdd3_5.length, storageMaps]);

    useEffect(() => { utils.writeLastBuild(buildState); }, [buildState]);

    const openOverlay = (slot: SlotType) => {
        setOverlaySlot(slot);
        setQuery("");
        setOverlayOpen(true);
    };

    const closeOverlay = () => setOverlayOpen(false);

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

    const list = useMemo(() => {
        const q = query.trim().toLowerCase();

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

    const renderSlotText = (slot: Exclude<SlotType, "storage-ssd" | "storage-hdd2_5" | "storage-hdd3_5">) => {
        if (slot === "cpu") return selectedCpu ? (
            <>
                {selectedCpu.Model} <br /> <span>• {selectedCpu.Socket}, {selectedCpu.TotalCores} x {selectedCpu.BasicFrequency} ГГц, L2 - {selectedCpu.CacheL2} МБ, L3 - {selectedCpu.CacheL3} МБ, 2 x {selectedCpu.MemoryFrequency}</span>
            </>
        ) : "Процессор";
        if (slot === "gpu") return selectedGpu ? (
            <>
                {selectedGpu.Model} <br /> <span>• {selectedGpu.ConnectionInterface}, {selectedGpu.VideoRAM} ГБ {selectedGpu.MemoryType}, {selectedGpu.MemoryBusWidth} бит, {selectedGpu.VideoConnectors.join(", ")}</span>
            </>
        ) : "Видеокарта";
        if (slot === "mb") return selectedMb ? (
            <>
                {selectedMb.Model} <br /> <span>• {selectedMb.Socket}, {selectedMb.CheapSet}, {selectedMb.MemorySlots}x{selectedMb.MemoryTypes}-{selectedMb.MaxMemoryFrequency}МГц, {selectedMb.PCISlots.join(", ")}, {selectedMb.FormFactor}</span>
            </>
        ) : "Материнская плата";
        if (slot === "psu") return selectedPsu ? (
            <>
                {selectedPsu.Model} <br /> <span>• {selectedPsu.Power}Вт, {selectedPsu.Certificate ? `80+ ${selectedPsu.Certificate}` : null}, {selectedPsu.MainPowerConnector}, {selectedPsu.ProcessorPowerConnectors} CPU</span>
            </>
        ) : "Блок питания";
        if (slot === "case") return selectedCase ? (
            <>
                {selectedCase.Model} <br /> <span>• {selectedCase.BodySize}, {selectedCase.CompatibleBoards.join(", ")}</span>
            </>
        ) : "Корпус";
        if (slot === "cooling") return selectedCooling ? (
            <>
                {utils.isSZO(selectedCooling) && (
                    <>
                        {selectedCooling.Model} <br /> <span>• {selectedCooling.RadiatorMountingDimensions}, разъем помпы - {selectedCooling.PumpConnectionSocket}, радиатор - {selectedCooling.RadiatorMaterial}, TDP - {selectedCooling.TDP} Вт</span>
                    </>
                )}

                {utils.isAirCooling(selectedCooling) && (
                    <>
                        {selectedCooling.Model} <br /> <span>• основание - {selectedCooling.BaseMaterial}, {selectedCooling.MaxRotationSpeed} об/мин, {selectedCooling.MaxNoiseLevel} дБ, {selectedCooling.FanConnector}, {selectedCooling.TDP} Вт</span>
                    </>
                )}
            </>
        ) : "Система охлаждения";
        if (slot === "memory") return selectedMemory ? (
            <>
                {selectedMemory.Model} <br /> <span>• {selectedMemory.MemoryType}, {selectedMemory.OneModuleMemory} ГБ x {selectedMemory.TotalModules} шт, {selectedMemory.ClockFrequency} МГц, {selectedMemory.CL}(CL)-{selectedMemory.TRCD}-{selectedMemory.TRP}</span>
            </>
        ) : "Оперативная память";
        return "Компонент";
    };

    const slotLabel = useMemo(() => {
        switch (overlaySlot) {
            case "storage-ssd": return "SSD (M.2)";
            case "storage-hdd2_5": return "HDD 2.5\"";
            case "storage-hdd3_5": return "HDD 3.5\"";
            default: return overlaySlot ? overlaySlot.toUpperCase() : "компонента";
        }
    }, [overlaySlot]);

    const totalPrice = useMemo(() => {
        let diskPrice = 0;
        resolvedStorages.map((el) => {
           diskPrice += (el.item?.Price || 0) * (el.qty || 1);
        });
        return Math.floor((selectedCpu?.Price || 0) + (selectedGpu?.Price || 0) + (selectedMb?.Price || 0)
        + (selectedPsu?.Price || 0) + (selectedCase?.Price || 0) + (selectedCooling?.Price || 0) + (selectedMemory?.Price || 0) + diskPrice).toLocaleString();
    }, [selectedCpu, selectedGpu, selectedMb, selectedPsu, selectedCase, selectedCooling, selectedMemory, resolvedStorages]);

    return (
        <MainLayout>
            <AnimatedBackground />
            <div className={s.actionsBar}>
              <button className={s.primaryBtn} onClick={handleSaveBuild} disabled={saving}>{saving ? "Сохранение…" : "Сохранить"}</button>
              <button className={s.ghostBtn} onClick={handleShareBuild} disabled={!currentId && saving}>Поделиться</button>
              {shareUrl && (
                <div className={s.shareBox}>
                  <span>Ссылка:</span>
                  <input className={s.shareInput} value={shareUrl} readOnly onFocus={(e)=>e.currentTarget.select()} />
                  <button className={s.copyBtn} onClick={()=>{ navigator.clipboard?.writeText(shareUrl!) }}>Копировать</button>
                </div>
              )}
              {shareErr && <div className={s.error}>{shareErr}</div>}
            </div>
            <div className={s.configContainer}>
                <div className="card" style={{position: "relative"}}>
                    {!editMode ? (
                        <>
                            <h2 className="glow">{buildState.name || "Название сборки"}</h2>
                            <img
                                className={s.editBtn}
                                src="/edit.svg"
                                alt="build edit"
                                loading="lazy"
                                decoding="async"
                                onClick={() => setEditMode(true)}
                                style={{cursor: "pointer"}}
                                title="Редактировать сборку"
                            />
                        </>
                    ) : (
                        <div className={s.editWrap}>
                            <div className={s.editRow}>
                                <label>Название</label>
                                <input
                                    className={s.input}
                                    value={buildState.name}
                                    onChange={(e) => setBuildState(prev => ({...prev, name: e.target.value}))}
                                    maxLength={64}
                                    placeholder="Например: Игровая 2025"
                                />
                            </div>
                            <div className={s.editRow}>
                                <label>Описание</label>
                                <textarea
                                    className={s.textarea}
                                    value={buildState.description ?? ""}
                                    onChange={(e) => setBuildState(prev => ({...prev, description: e.target.value}))}
                                    rows={3}
                                    placeholder="Коротко опиши сборку"
                                />
                            </div>
                            <label className={s.switchRow}>
                                <input
                                    type="checkbox"
                                    checked={!!buildState.isPublic}
                                    onChange={(e) => setBuildState(prev => ({...prev, isPublic: e.target.checked}))}
                                />
                                <span>Публичная сборка</span>
                            </label>
                            <div className={s.editActions}>
                                <button className={s.secondaryBtn} onClick={() => setEditMode(false)}>Готово</button>
                            </div>
                        </div>
                    )}
                </div>

                <span className={s.totalPrice}>Общая стоимость сборки: {totalPrice}₸</span>

                <div className={s.buildContainer}>
                    <div className={s.buildContainer__item} onClick={() => openOverlay("cpu")}>
                        <img src={selectedCpu ? selectedCpu.Images[0] : "/build/cpu.svg"} alt="CPU" loading="lazy" decoding="async" style={selectedCpu?.Images[0] ? { width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' } : { width: '48px', height: '48px' }}/>
                        <p className={s.itemTitle}>{renderSlotText("cpu")}</p>
                        {buildState.cpuId && (
                            <div className={s.subInfoContainer}>
                                <button className={s.clearBtn} onClick={(e) => { e.stopPropagation(); clearSlot("cpu"); }}><span>×</span></button>
                                <span className={s.itemPrice}>{selectedCpu?.Price?.toLocaleString?.()}₸</span>
                            </div>
                        )}
                    </div>

                    <div className={s.buildContainer__item} onClick={() => openOverlay("mb")}>
                        <img src={selectedMb ? selectedMb.Images[0] : "/build/motherboard.svg"} alt="motherboard" loading="lazy" decoding="async" style={selectedMb?.Images[0] ? { width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' } : { width: '48px', height: '48px' }}/>
                        <p className={s.itemTitle}>{renderSlotText("mb")}</p>
                        {buildState.mbId && (
                            <div className={s.subInfoContainer}>
                                <button className={s.clearBtn} onClick={(e) => { e.stopPropagation(); clearSlot("mb"); }}><span>×</span></button>
                                <span className={s.itemPrice}>{selectedMb?.Price?.toLocaleString?.()}₸</span>
                            </div>
                        )}
                    </div>

                    <div className={s.buildContainer__item} onClick={() => openOverlay("psu")}>
                        <img src={selectedPsu ? selectedPsu.Images[0] : "/build/power_supply.svg"} alt="power supply" loading="lazy" decoding="async" style={selectedPsu?.Images[0] ? { width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' } : { width: '48px', height: '48px' }}/>
                        <p className={s.itemTitle}>{renderSlotText("psu")}</p>
                        {buildState.psuId && (
                            <div className={s.subInfoContainer}>
                                <button className={s.clearBtn} onClick={(e) => { e.stopPropagation(); clearSlot("psu"); }}><span>×</span></button>
                                <span className={s.itemPrice}>{selectedPsu?.Price?.toLocaleString?.()}₸</span>
                            </div>
                        )}
                    </div>

                    <div className={s.buildContainer__item} onClick={() => openOverlay("case")}>
                        <img src={selectedCase ? selectedCase.Images[0] : "/build/pc_case.svg"} alt="pc case" loading="lazy" decoding="async" style={selectedCase?.Images[0] ? { width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' } : { width: '48px', height: '48px' }}/>
                        <p className={s.itemTitle}>{renderSlotText("case")}</p>
                        {buildState.caseId && (
                            <div className={s.subInfoContainer}>
                                <button className={s.clearBtn} onClick={(e) => { e.stopPropagation(); clearSlot("case"); }}><span>×</span></button>
                                <span className={s.itemPrice}>{selectedCase?.Price?.toLocaleString?.()}₸</span>
                            </div>
                        )}
                    </div>

                    <div className={s.buildContainer__item} onClick={() => openOverlay("gpu")}>
                        <img src={selectedGpu ? selectedGpu.Images[0] : "/build/gpu.svg"} alt="GPU" loading="lazy" decoding="async" style={selectedGpu?.Images[0] ? { width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' } : { width: '48px', height: '48px' }}/>
                        <p className={s.itemTitle}>{renderSlotText("gpu")}</p>
                        {buildState.gpuId && (
                            <div className={s.subInfoContainer}>
                                <button className={s.clearBtn} onClick={(e) => { e.stopPropagation(); clearSlot("gpu"); }}><span>×</span></button>
                                <span className={s.itemPrice}>{selectedGpu?.Price?.toLocaleString?.()}₸</span>
                            </div>
                        )}
                    </div>

                    <div className={s.buildContainer__item} onClick={() => openOverlay("cooling")}>
                        <img src={selectedCooling ? selectedCooling.Images[0] : "/build/cooling.svg"} alt="cooling" loading="lazy" decoding="async" style={selectedCooling?.Images[0] ? { width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' } : { width: '48px', height: '48px' }}/>
                        <p className={s.itemTitle}>{renderSlotText("cooling")}</p>
                        {buildState.coolingId && (
                            <div className={s.subInfoContainer}>
                                <button className={s.clearBtn} onClick={(e) => { e.stopPropagation(); clearSlot("cooling"); }}><span>×</span></button>
                                <span className={s.itemPrice}>{selectedCooling?.Price?.toLocaleString?.()}₸</span>
                            </div>
                        )}
                    </div>

                    <div className={s.buildContainer__item} onClick={() => openOverlay("memory")}>
                        <img src={selectedMemory ? selectedMemory.Images[0] : "/build/ram.svg"} alt="ram" loading="lazy" decoding="async" style={selectedMemory?.Images[0] ? { width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' } : { width: '48px', height: '48px' }}/>
                        <p className={s.itemTitle}>{renderSlotText("memory")}</p>
                        {buildState.memoryId && (
                            <div className={s.subInfoContainer}>
                                <button className={s.clearBtn} onClick={(e) => { e.stopPropagation(); clearSlot("memory"); }}><span>×</span></button>
                                <span className={s.itemPrice}>{selectedMemory?.Price?.toLocaleString?.()}₸</span>
                            </div>
                        )}
                    </div>

                    {resolvedStorages.map((st, idx) => {
                        const comp = st.item as allComponents | null;
                        const img = comp?.Images?.[0];
                        const title = comp?.Model ?? "Накопитель";
                        const priceNum = Number(comp?.Price ?? 0);
                        const totalPrice = priceNum * (st.qty ?? 1);

                        return (
                            <div key={`${st.kind}-${st.id}-${idx}`} className={s.buildContainer__item}>
                                <img
                                    src={img || "/build/disk_drive.svg"}
                                    alt="storage"
                                    loading="lazy"
                                    decoding="async"
                                    style={img ? { width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' } : { width: '48px', height: '48px' }}
                                />
                                <p className={s.itemTitle}>
                                    {title}
                                    <br />
                                    <span>• {st.kind === "ssd" ? `${(comp as SSD)?.PhysInterface}, чтение - ${(comp as SSD)?.MaxReadSpeed} Мбайт/сек, запись - ${(comp as SSD)?.MaxWriteSpeed} Мбайт/сек`
                                        : st.kind === "hdd2_5" ? `${(comp as HDD2_5)?.Interface}, ${(comp as HDD2_5)?.SpindleRotationSpeed} об/мин, кэш-память ${(comp as HDD2_5)?.BufferSize} МБ`
                                        : `${(comp as HDD3_5)?.Interface}, ${(comp as HDD3_5)?.InterfaceBandwidth / 1000} Гбит/с, ${(comp as HDD3_5)?.SpindleRotationSpeed} об/мин, кэш-память ${(comp as HDD3_5)?.CacheSize} МБ`}</span>
                                </p>

                                <div className={s.subInfoContainer}>
                                    <div className={s.qtyCtrl} onClick={(e) => e.stopPropagation()}>
                                        <button className={s.qtyBtn} onClick={() => decStorageQty(idx)}>-</button>
                                        <span className={s.qtyVal}>{st.qty}</span>
                                        <button className={s.qtyBtn} onClick={() => incStorageQty(idx)}>+</button>
                                    </div>
                                    <button className={s.clearBtn} onClick={(e) => { e.stopPropagation(); removeStorageAt(idx); }}>
                                        <span>×</span>
                                    </button>
                                    <span className={s.itemPrice}>
                                        {Number.isFinite(totalPrice) ? totalPrice.toLocaleString() : comp?.Price?.toLocaleString?.()}{Number.isFinite(totalPrice) ? "₸" : "₸"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    <div className={s.buildContainer__item} ref={addStorageRef} onClick={() => setStoragePickerOpen(v => !v)}>
                        <img src="/build/disk_drive.svg" alt="add storage" loading="lazy" decoding="async" />
                        <p className={s.itemTitle}>Накопители <br /><span>• Добавить диск (SSD / HDD)</span></p>

                        {storagePickerOpen && (
                            <div className={s.storagePicker} onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => openOverlay("storage-ssd")}>M.2 (SSD)</button>
                                <button onClick={() => openOverlay("storage-hdd2_5")}>HDD 2.5"</button>
                                <button onClick={() => openOverlay("storage-hdd3_5")}>HDD 3.5"</button>
                            </div>
                        )}
                    </div>
                </div>

                {compatibility.conflicts.length > 0 && (
                    <div className={s.conflicts}>
                        {compatibility.conflicts.map(conflict => (
                            <span>{ conflict.message }</span>
                        ))}
                    </div>
                )}

                <RightOverlay
                    open={overlayOpen}
                    slot={overlaySlot}
                    baseList={list}
                    query={query}
                    setQuery={setQuery}
                    onPick={onPick}
                    onClose={closeOverlay}
                />
            </div>
        </MainLayout>
    );
};

export default BuildPage;