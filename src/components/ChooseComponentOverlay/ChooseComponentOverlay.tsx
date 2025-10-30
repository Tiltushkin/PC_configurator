import { useEffect, useMemo, useState } from "react";
import s from "../../pages/Build/BuildPage.module.scss";
import type { SlotType, allComponents, WithMaybeId } from "../../shared/types/types";
import utils from "../../shared/utils/utils";

interface RightOverlayProps {
    open: boolean;
    slot: SlotType | null;
    baseList: allComponents[];
    query: string;
    setQuery: (q: string) => void;
    onPick: (item: WithMaybeId<allComponents>) => void;
    onClose: () => void;
}

const uniq = <T,>(arr: T[]) => Array.from(new Set(arr)).filter(Boolean) as T[];

export default function RightOverlay({ open, slot, baseList, query, setQuery, onPick, onClose }: RightOverlayProps) {
    const [priceMin, setPriceMin] = useState<string>("");
    const [priceMax, setPriceMax] = useState<string>("");
    const [manufacturer, setManufacturer] = useState<string>("");

    const [cpuSocket, setCpuSocket] = useState<string>("");
    const [cpuMinCores, setCpuMinCores] = useState<number | "">("");

    const [gpuMinVram, setGpuMinVram] = useState<number | "">("");

    const [mbFormFactor, setMbFormFactor] = useState<string>("");

    const [psuMinPower, setPsuMinPower] = useState<number | "">("");

    const [ssdMinCapacity, setSsdMinCapacity] = useState<number | "">("");
    const [ssdNvmeOnly, setSsdNvmeOnly] = useState<boolean | null>(null);

    useEffect(() => {
        if (!open) {
            setPriceMin("");
            setPriceMax("");
            setManufacturer("");
            setCpuSocket(""); setCpuMinCores("");
            setGpuMinVram(""); setMbFormFactor(""); setPsuMinPower("");
            setSsdMinCapacity(""); setSsdNvmeOnly(null);
        }
    }, [open]);

    const derived = useMemo(() => {
        const allMans = uniq(baseList.map((x: any) => x.ManufacturerCode || (x as any).Manufacturer || null));
        const cpuSockets = uniq((baseList as any[]).filter(x => (x as any).Socket).map(x => (x as any).Socket));
        const mbFormFactors = uniq((baseList as any[]).flatMap(x => (x as any).FormFactor || []));
        const psuPowers = uniq((baseList as any[]).filter(x => (x as any).Power).map(x => (x as any).Power));
        const gpuVrams = uniq((baseList as any[]).filter(x => (x as any).VideoRAM).map(x => (x as any).VideoRAM));
        const ssdCaps = uniq((baseList as any[]).filter(x => (x as any).DiskCapacity).map(x => (x as any).DiskCapacity));
        return { allMans, cpuSockets, mbFormFactors, psuPowers, gpuVrams, ssdCaps };
    }, [baseList]);

    const filtered = useMemo(() => {
        if (!slot) return [] as allComponents[];
        let list = baseList.slice();

        const pmin = Number(priceMin || 0) || 0;
        const pmax = Number(priceMax) || Number.POSITIVE_INFINITY;
        list = list.filter((x: any) => typeof x.Price === "number" ? x.Price >= pmin && x.Price <= pmax : true);

        if (manufacturer) list = list.filter((x: any) => (x.ManufacturerCode || "").toLowerCase().includes(manufacturer.toLowerCase()));

        if (slot === "cpu") {
            if (cpuSocket) list = list.filter((x: any) => (x.Socket || "") === cpuSocket);
            if (cpuMinCores) list = list.filter((x: any) => (x.TotalCores || 0) >= Number(cpuMinCores));
        }
        if (slot === "gpu") {
            if (gpuMinVram) list = list.filter((x: any) => (x.VideoRAM || 0) >= Number(gpuMinVram));
        }
        if (slot === "mb") {
            if (mbFormFactor) list = list.filter((x: any) => (x.FormFactor || []).includes(mbFormFactor));
        }
        if (slot === "psu") {
            if (psuMinPower) list = list.filter((x: any) => (x.Power || 0) >= Number(psuMinPower));
        }
        if (slot === "storage-ssd") {
            if (ssdMinCapacity) list = list.filter((x: any) => (x.DiskCapacity || 0) >= Number(ssdMinCapacity));
            if (ssdNvmeOnly !== null) list = list.filter((x: any) => !!x.NVMe === ssdNvmeOnly);
        }

        return list;
    }, [slot, baseList, priceMin, priceMax, manufacturer, cpuSocket, cpuMinCores, gpuMinVram, mbFormFactor, psuMinPower, ssdMinCapacity, ssdNvmeOnly]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className={`${s.rightOverlay} ${s.rightOverlayShow}`} role="dialog" aria-modal>
            <div className={s.roPanel}>
                <div className={s.roHead}>
                    <div className={s.roTitle}>{slot ? `Выбор ${slot.toUpperCase()}` : "Выбор компонента"}</div>
                    <div style={{display: 'flex', gap: 8}}>
                        <input className={s.input} placeholder={`Поиск ${slot ?? ""}`} value={query} onChange={(e)=>setQuery(e.target.value)} />
                        <button className={s.roClose} onClick={onClose}>×</button>
                    </div>
                </div>

                <div className={s.roBody}>
                    <aside className={s.roFilters}>
                        <h4>Фильтры</h4>
                        <div className={s.filterRow}>
                            <label>Производитель</label>
                            <input className={s.input} value={manufacturer} onChange={(e)=>setManufacturer(e.target.value)} placeholder="код" />
                        </div>

                        <div className={s.filterRow}>
                            <label>Цена</label>
                            <div style={{display: 'flex', gap: 8}}>
                                <input className={s.input} value={priceMin} onChange={(e)=>setPriceMin(e.target.value)} placeholder="Мин" />
                                <input className={s.input} value={priceMax} onChange={(e)=>setPriceMax(e.target.value)} placeholder="Макс" />
                            </div>
                        </div>

                        {slot === 'cpu' && (
                            <>
                                <div className={s.filterRow}>
                                    <label>Сокет</label>
                                    <select className={s.input} value={cpuSocket} onChange={(e)=>setCpuSocket(e.target.value)}>
                                        <option value="">— любой —</option>
                                        {derived.cpuSockets.map(s=> <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className={s.filterRow}>
                                    <label>Мин. ядер</label>
                                    <input className={s.input} type="text" value={cpuMinCores as any} onChange={(e)=>setCpuMinCores(e.target.value === '' ? '' : Number(e.target.value) ? Number(e.target.value) : '')} placeholder="Кол-во" />
                                </div>
                            </>
                        )}

                        {slot === 'gpu' && (
                            <>
                                <div className={s.filterRow}>
                                    <label>Мин VRAM (ГБ)</label>
                                    <input className={s.input} type="number" value={gpuMinVram as any} onChange={(e)=>setGpuMinVram(e.target.value === '' ? '' : Number(e.target.value))} />
                                </div>
                            </>
                        )}

                        {slot === 'mb' && (
                            <div className={s.filterRow}>
                                <label>Форм-фактор</label>
                                <select className={s.input} value={mbFormFactor} onChange={(e)=>setMbFormFactor(e.target.value)}>
                                    <option value="">— любой —</option>
                                    {derived.mbFormFactors.map(s=> <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        )}

                        {slot === 'psu' && (
                            <div className={s.filterRow}>
                                <label>Мин. мощность</label>
                                <input className={s.input} type="number" value={psuMinPower as any} onChange={(e)=>setPsuMinPower(e.target.value === '' ? '' : Number(e.target.value))} />
                            </div>
                        )}

                        {slot === 'storage-ssd' && (
                            <>
                                <div className={s.filterRow}>
                                    <label>Мин. объём (ГБ)</label>
                                    <input className={s.input} type="number" value={ssdMinCapacity as any} onChange={(e)=>setSsdMinCapacity(e.target.value === '' ? '' : Number(e.target.value))} />
                                </div>
                                <div className={s.filterRow}>
                                    <label>NVMe</label>
                                    <select className={s.input} value={ssdNvmeOnly === null ? '' : ssdNvmeOnly ? 'yes' : 'no'} onChange={(e)=>{ const v=e.target.value; setSsdNvmeOnly(v===''? null : v==='yes'); }}>
                                        <option value="">— любой —</option>
                                        <option value="yes">Только NVMe</option>
                                        <option value="no">SATA только</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div style={{marginTop: 12}}>
                            <button className={s.ghostBtn} style={{marginLeft: 8}} onClick={() => {
                                setPriceMin("");
                                setPriceMax("");
                                setManufacturer("");
                                setCpuSocket("");
                                setCpuMinCores("");
                                setGpuMinVram("");
                                setMbFormFactor("");
                                setPsuMinPower("");
                                setSsdMinCapacity("");
                                setSsdNvmeOnly(null);
                            }}>Сбросить</button>
                        </div>
                    </aside>

                    <section className={s.roList}>
                        {filtered.length === 0 && <div className={s.empty}>Ничего не найдено</div>}
                        {filtered.map((x: any) => (
                            <button key={(x.Id || x.Id) || x.Model} className={s.roRow} onClick={() => onPick(x)}>
                                <img className={s.roRowImage} src={x.Images?.[0]} alt="component image" loading="lazy" decoding="async"/>
                                <div className={s.roRowMain}>
                                    <div className={s.roRowTitle}>{x.Model}</div>
                                    <div className={s.roRowMeta}>
                                        {utils.getComponentDescription(x)}
                                    </div>
                                </div>
                                <div className={s.roRowAside}>{x.Price ? `${x.Price.toLocaleString?.()} ₸` : ""}</div>
                            </button>
                        ))}
                    </section>
                </div>
            </div>
            <div className={s.rightOverlayBackdrop} onClick={onClose} />
        </div>
    );
}