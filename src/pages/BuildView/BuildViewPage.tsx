import bp from "../Build/BuildPage.module.scss";
import s from "./BuildViewPage.module.scss";
import MainLayout from "../../layouts/MainLayout";
import AnimatedBackground from "../../components/animations/AnimatedBackground.tsx";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { loadMeThunk } from "../../store/slices/authSlice";
import { useEffect, useMemo, useRef, useState } from "react";
import utils from "../../shared/utils/utils";

import {
    componentsApi
} from "../../api/api";
import { getBuildById, updateBuild, deleteBuild as apiDeleteBuild } from "../../api/buildsClient";

import type {
    CPU, GPU, MB, PSU, SZO, AirCooling, CASE, Memory,
    SSD, HDD2_5, HDD3_5, COOLING,
    BuildEx, StorageItem, SlotType, CompMaps, BuildResponse, PagedResult, ComponentsAllResponse, allComponents
} from "../../shared/types/types";
import RightOverlay from "../../components/RightOverlay/RightOverlay.tsx";

const toMap = <T extends { Id: string }>(paged?: PagedResult<T>) =>
    new Map((paged?.items ?? []).map(i => [i.Id, i]));

function toBuildEx(b: BuildResponse, maps: CompMaps): BuildEx {
    const storages: StorageItem[] = [];

    const ssdCount = new Map<string, number>();
    (b.ssdIds ?? []).forEach(id => ssdCount.set(id, (ssdCount.get(id) ?? 0) + 1));
    ssdCount.forEach((qty, id) => storages.push({ kind: "ssd", id, qty }));

    const hddCount = new Map<string, number>();
    (b.hddIds ?? []).forEach(id => hddCount.set(id, (hddCount.get(id) ?? 0) + 1));
    hddCount.forEach((qty, id) => {
        if (maps.hdd2_5.has(id)) storages.push({ kind: "hdd2_5", id, qty });
        else storages.push({ kind: "hdd3_5", id, qty });
    });

    return {
        name: b.name ?? "Название сборки",
        description: b.description ?? "",
        cpuId: b.cpuId ?? undefined,
        gpuId: b.gpuId ?? undefined,
        mbId: b.mbId ?? undefined,
        psuId: b.psuId ?? undefined,
        caseId: b.caseId ?? undefined,
        coolingId: b.coolingId ?? undefined,
        memoryId: b.memoryId ?? undefined,
        ssdIds: undefined,
        hddIds: undefined,
        isPublic: !!b.isPublic,
        storages,
    };
}

const imgOf = (images?: string[] | null, fallback = "") => {
    const first = images && images.length ? images[0] : null;
    return utils.resolveImageUrl(first) ?? (fallback || undefined);
};

export default function BuildViewPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { token, user } = useSelector((st: RootState) => st.auth);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [buildRaw, setBuildRaw] = useState<BuildResponse | null>(null);
    const [maps, setMaps] = useState<CompMaps | null>(null);
    const [buildState, setBuildState] = useState<BuildEx | null>(null);

    const isOwner = !!(user && buildRaw && user.id === buildRaw.ownerId);

    const [overlayOpen, setOverlayOpen] = useState(false);
    const [overlaySlot, setOverlaySlot] = useState<SlotType | null>(null);
    const [query, setQuery] = useState("");
    const [storagePickerOpen, setStoragePickerOpen] = useState(false);
    const addStorageRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!id) { setError("ID не указан"); setLoading(false); return; }
        (async () => {
            try {
                if (token && !user) { try { await dispatch(loadMeThunk()).unwrap(); } catch { /* Ignore */ } }

                const data = await getBuildById(id);
                setBuildRaw(data);

                const rawAll = await componentsApi.get({ type: "all", pageSize: 500 }) as ComponentsAllResponse;

                const szoMap = toMap<SZO>(rawAll.szos);
                const airMap = toMap<AirCooling>(rawAll.airCoolings);
                const cooling = new Map<string, COOLING>([...Array.from(szoMap), ...Array.from(airMap)]);

                const cm: CompMaps = {
                    cpu: toMap<CPU>(rawAll.cpus),
                    gpu: toMap<GPU>(rawAll.gpus),
                    mb: toMap<MB>(rawAll.mbs),
                    psu: toMap<PSU>(rawAll.psus),
                    case: toMap<CASE>(rawAll.cases),
                    cooling,
                    memory: toMap<Memory>(rawAll.memories),
                    ssd: toMap<SSD>(rawAll.ssds),
                    hdd2_5: toMap<HDD2_5>(rawAll.hdd2_5),
                    hdd3_5: toMap<HDD3_5>(rawAll.hdd3_5),
                };
                setMaps(cm);
                setBuildState(toBuildEx(data, cm));
            } catch (e: any) {
                setError(e?.message ?? "Ошибка загрузки сборки");
            } finally {
                setLoading(false);
            }
        })();
    }, [id, token]);

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

    const slotLabel = useMemo(() => {
        switch (overlaySlot) {
            case "storage-ssd": return "SSD (M.2)";
            case "storage-hdd2_5": return "HDD 2.5\"";
            case "storage-hdd3_5": return "HDD 3.5\"";
            default: return overlaySlot ? overlaySlot.toUpperCase() : "компонента";
        }
    }, [overlaySlot]);

    const filteredList = useMemo(() => {
        if (!overlaySlot) return [];
        const base = (listBySlot as any)[overlaySlot] as any[] || [];
        const q = query.trim().toLowerCase();
        if (!q) return base;
        return base.filter(x =>
            (x.Model ?? "").toLowerCase().includes(q) ||
            (x.ManufacturerCode ?? "").toLowerCase().includes(q)
        );
    }, [overlaySlot, listBySlot, query]);

    return (
        <MainLayout>
            <AnimatedBackground />

            <div className={s.wrap}>
                <div className={bp.actionsBar}>
                    {isOwner && <button className={bp.dangerBtn} onClick={onDeleteBuild} disabled={saving}>{saving ? "..." : "Удалить сборку"}</button>}
                    <Link to="/build" className={bp.ghostBtn}>Создать новую</Link>
                    <Link to="/profile" className={bp.ghostBtn}>Профиль</Link>
                    <div style={{marginLeft:"auto"}} className={bp.totalPrice}>Общая стоимость сборки: {totalPrice}₸</div>
                </div>

                <div className="card" style={{position:"relative", width:"fit-content", padding:15, left:"50%", transform:"translateX(-50%)", display:"flex", gap:15, alignItems:"center", justifyContent:"center"}}>
                    <h2 className="glow">{buildState?.name || "Название сборки"}</h2>
                </div>

                {loading && <div className="card" style={{marginTop:20, padding:20}}>Загрузка…</div>}
                {error && <div className={bp.error}>{error}</div>}

                {!loading && !error && buildState && maps && (
                    <div className={bp.configContainer}>
                        <div className={bp.buildContainer}>
                            <div className={bp.buildContainer__item} onClick={() => openOverlay("cpu")}>
                                <img src={imgOf(selected.cpu?.Images, "/build/cpu.svg")} alt="CPU" />
                                <p className={bp.itemTitle}>
                                    {selected.cpu ? (
                                        <> {selected.cpu.Model} <br/><span>• {selected.cpu.Socket}, {selected.cpu.TotalCores} x {selected.cpu.BasicFrequency} ГГц, L2 - {selected.cpu.CacheL2} МБ, L3 - {selected.cpu.CacheL3} МБ, 2 x {selected.cpu.MemoryFrequency}</span></>
                                    ) : "Процессор"}
                                </p>
                                {buildState.cpuId && isOwner && (
                                    <div className={bp.subInfoContainer}>
                                        <button className={bp.clearBtn} onClick={(e)=>{e.stopPropagation(); clearSlot("cpu");}}><span>×</span></button>
                                        <span className={bp.itemPrice}>{selected.cpu?.Price?.toLocaleString?.()}₸</span>
                                    </div>
                                )}
                                {buildState.cpuId && !isOwner && <div className={bp.subInfoContainer}><span className={bp.itemPrice}>{selected.cpu?.Price?.toLocaleString?.()}₸</span></div>}
                            </div>

                            <div className={bp.buildContainer__item} onClick={() => openOverlay("mb")}>
                                <img src={imgOf(selected.mb?.Images, "/build/motherboard.svg")} alt="MB" />
                                <p className={bp.itemTitle}>
                                    {selected.mb ? (
                                        <> {selected.mb.Model} <br/><span>• {selected.mb.Socket}, {selected.mb.CheapSet}, {selected.mb.MemorySlots}x{selected.mb.MemoryTypes}-{selected.mb.MaxMemoryFrequency}МГц, {selected.mb.PCISlots.join(", ")}, {selected.mb.FormFactor}</span></>
                                    ) : "Материнская плата"}
                                </p>
                                {buildState.mbId && isOwner && (
                                    <div className={bp.subInfoContainer}>
                                        <button className={bp.clearBtn} onClick={(e)=>{e.stopPropagation(); clearSlot("mb");}}><span>×</span></button>
                                        <span className={bp.itemPrice}>{selected.mb?.Price?.toLocaleString?.()}₸</span>
                                    </div>
                                )}
                                {buildState.mbId && !isOwner && <div className={bp.subInfoContainer}><span className={bp.itemPrice}>{selected.mb?.Price?.toLocaleString?.()}₸</span></div>}
                            </div>

                            <div className={bp.buildContainer__item} onClick={() => openOverlay("psu")}>
                                <img src={imgOf(selected.psu?.Images, "/build/power_supply.svg")} alt="PSU" />
                                <p className={bp.itemTitle}>
                                    {selected.psu ? (
                                        <> {selected.psu.Model} <br/><span>• {selected.psu.Power}Вт, {selected.psu.Certificate ? `80+ ${selected.psu.Certificate}` : null}, {selected.psu.MainPowerConnector}, {selected.psu.ProcessorPowerConnectors} CPU</span></>
                                    ) : "Блок питания"}
                                </p>
                                {buildState.psuId && isOwner && (
                                    <div className={bp.subInfoContainer}>
                                        <button className={bp.clearBtn} onClick={(e)=>{e.stopPropagation(); clearSlot("psu");}}><span>×</span></button>
                                        <span className={bp.itemPrice}>{selected.psu?.Price?.toLocaleString?.()}₸</span>
                                    </div>
                                )}
                                {buildState.psuId && !isOwner && <div className={bp.subInfoContainer}><span className={bp.itemPrice}>{selected.psu?.Price?.toLocaleString?.()}₸</span></div>}
                            </div>

                            <div className={bp.buildContainer__item} onClick={() => openOverlay("case")}>
                                <img src={imgOf(selected.case?.Images, "/build/pc_case.svg")} alt="CASE" />
                                <p className={bp.itemTitle}>
                                    {selected.case ? (
                                        <> {selected.case.Model} <br/><span>• {selected.case.BodySize}, {selected.case.CompatibleBoards.join(", ")}</span></>
                                    ) : "Корпус"}
                                </p>
                                {buildState.caseId && isOwner && (
                                    <div className={bp.subInfoContainer}>
                                        <button className={bp.clearBtn} onClick={(e)=>{e.stopPropagation(); clearSlot("case");}}><span>×</span></button>
                                        <span className={bp.itemPrice}>{selected.case?.Price?.toLocaleString?.()}₸</span>
                                    </div>
                                )}
                                {buildState.caseId && !isOwner && <div className={bp.subInfoContainer}><span className={bp.itemPrice}>{selected.case?.Price?.toLocaleString?.()}₸</span></div>}
                            </div>

                            <div className={bp.buildContainer__item} onClick={() => openOverlay("gpu")}>
                                <img src={imgOf(selected.gpu?.Images, "/build/gpu.svg")} alt="GPU" />
                                <p className={bp.itemTitle}>
                                    {selected.gpu ? (
                                        <> {selected.gpu.Model} <br/><span>• {selected.gpu.ConnectionInterface}, {selected.gpu.VideoRAM} ГБ {selected.gpu.MemoryType}, {selected.gpu.MemoryBusWidth} бит, {selected.gpu.VideoConnectors.join(", ")}</span></>
                                    ) : "Видеокарта"}
                                </p>
                                {buildState.gpuId && isOwner && (
                                    <div className={bp.subInfoContainer}>
                                        <button className={bp.clearBtn} onClick={(e)=>{e.stopPropagation(); clearSlot("gpu");}}><span>×</span></button>
                                        <span className={bp.itemPrice}>{selected.gpu?.Price?.toLocaleString?.()}₸</span>
                                    </div>
                                )}
                                {buildState.gpuId && !isOwner && <div className={bp.subInfoContainer}><span className={bp.itemPrice}>{selected.gpu?.Price?.toLocaleString?.()}₸</span></div>}
                            </div>

                            <div className={bp.buildContainer__item} onClick={() => openOverlay("cooling")}>
                                <img src={imgOf(selected.cooling?.Images, "/build/cooling.svg")} alt="Cooling" />
                                <p className={bp.itemTitle}>
                                    {selected.cooling ? (
                                        <>
                                            {utils.isSZO(selected.cooling) && (<>
                                                {selected.cooling.Model} <br/><span>• {selected.cooling.RadiatorMountingDimensions}, разъем помпы - {selected.cooling.PumpConnectionSocket}, радиатор - {selected.cooling.RadiatorMaterial}, TDP - {selected.cooling.TDP} Вт</span>
                                            </>)}
                                            {utils.isAirCooling(selected.cooling) && (<>
                                                {selected.cooling.Model} <br/><span>• основание - {selected.cooling.BaseMaterial}, {selected.cooling.MaxRotationSpeed} об/мин, {selected.cooling.MaxNoiseLevel} дБ, {selected.cooling.FanConnector}, {selected.cooling.TDP} Вт</span>
                                            </>)}
                                        </>
                                    ) : "Система охлаждения"}
                                </p>
                                {buildState.coolingId && isOwner && (
                                    <div className={bp.subInfoContainer}>
                                        <button className={bp.clearBtn} onClick={(e)=>{e.stopPropagation(); clearSlot("cooling");}}><span>×</span></button>
                                        <span className={bp.itemPrice}>{selected.cooling?.Price?.toLocaleString?.()}₸</span>
                                    </div>
                                )}
                                {buildState.coolingId && !isOwner && <div className={bp.subInfoContainer}><span className={bp.itemPrice}>{selected.cooling?.Price?.toLocaleString?.()}₸</span></div>}
                            </div>

                            <div className={bp.buildContainer__item} onClick={() => openOverlay("memory")}>
                                <img src={imgOf(selected.memory?.Images, "/build/ram.svg")} alt="Memory" />
                                <p className={bp.itemTitle}>
                                    {selected.memory ? (
                                        <> {selected.memory.Model} <br/><span>• {selected.memory.MemoryType}, {selected.memory.OneModuleMemory} ГБ x {selected.memory.TotalModules} шт, {selected.memory.ClockFrequency} МГц, {selected.memory.CL}(CL)-{selected.memory.TRCD}-{selected.memory.TRP}</span></>
                                    ) : "Оперативная память"}
                                </p>
                                {buildState.memoryId && isOwner && (
                                    <div className={bp.subInfoContainer}>
                                        <button className={bp.clearBtn} onClick={(e)=>{e.stopPropagation(); clearSlot("memory");}}><span>×</span></button>
                                        <span className={bp.itemPrice}>{selected.memory?.Price?.toLocaleString?.()}₸</span>
                                    </div>
                                )}
                                {buildState.memoryId && !isOwner && <div className={bp.subInfoContainer}><span className={bp.itemPrice}>{selected.memory?.Price?.toLocaleString?.()}₸</span></div>}
                            </div>

                            {resolvedStorages.map((st, idx) => {
                                const comp: any = st.item;
                                const img = imgOf(comp?.Images, "/build/disk_drive.svg");
                                const title = comp?.Model ?? "Накопитель";
                                const priceNum = Number(comp?.Price ?? 0);
                                const rowTotal = priceNum * (st.qty ?? 1);

                                return (
                                    <div key={`${st.kind}-${st.id}-${idx}`} className={bp.buildContainer__item}>
                                        <img src={img} alt="storage" />
                                        <p className={bp.itemTitle}>
                                            {title}
                                            <br/>
                                            <span>
                                                • {st.kind === "ssd"
                                                ? `${comp?.PhysInterface}, чтение - ${comp?.MaxReadSpeed} Мбайт/сек, запись - ${comp?.MaxWriteSpeed} Мбайт/сек`
                                                : st.kind === "hdd2_5"
                                                    ? `${comp?.Interface}, ${comp?.SpindleRotationSpeed} об/мин, кэш-память ${comp?.BufferSize} МБ`
                                                    : `${comp?.Interface}, ${comp?.InterfaceBandwidth / 1000} Гбит/с, ${comp?.SpindleRotationSpeed} об/мин, кэш-память ${comp?.CacheSize} МБ`}
                                            </span>
                                        </p>

                                        <div className={bp.subInfoContainer}>
                                            {isOwner && (
                                                <div className={bp.qtyCtrl} onClick={(e)=> e.stopPropagation()}>
                                                    <button className={bp.qtyBtn} onClick={() => decStorageQty(idx)}>-</button>
                                                    <span className={bp.qtyVal}>{st.qty}</span>
                                                    <button className={bp.qtyBtn} onClick={() => incStorageQty(idx)}>+</button>
                                                </div>
                                            )}
                                            {isOwner && (
                                                <button className={bp.clearBtn} onClick={(e)=>{ e.stopPropagation(); removeStorageAt(idx); }}>
                                                    <span>×</span>
                                                </button>
                                            )}
                                            <span className={bp.itemPrice}>{Number.isFinite(rowTotal) ? rowTotal.toLocaleString() : comp?.Price?.toLocaleString?.()}₸</span>
                                        </div>
                                    </div>
                                );
                            })}

                            {isOwner && (
                                <div className={bp.buildContainer__item} ref={addStorageRef} onClick={() => setStoragePickerOpen(v => !v)}>
                                    <img src="/build/disk_drive.svg" alt="add storage" />
                                    <p className={bp.itemTitle}>Накопители <br/><span>• Добавить диск (SSD / HDD)</span></p>

                                    {storagePickerOpen && (
                                        <div className={bp.storagePicker} onClick={(e)=> e.stopPropagation()}>
                                            <button onClick={() => openOverlay("storage-ssd")}>M.2 (SSD)</button>
                                            <button onClick={() => openOverlay("storage-hdd2_5")}>HDD 2.5"</button>
                                            <button onClick={() => openOverlay("storage-hdd3_5")}>HDD 3.5"</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {isOwner && (
                            <RightOverlay
                                open={overlayOpen}
                                slot={overlaySlot}
                                baseList={overlaySlot ? (listBySlot[overlaySlot] || []) : []}
                                query={query}
                                setQuery={setQuery}
                                onPick={onPick}
                                onClose={closeOverlay}
                            />
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}