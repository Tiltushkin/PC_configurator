import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import AnimatedBackground from "../../components/animations/AnimatedBackground.tsx";
import s from "./AdminPage.module.scss";
import { adminApi } from "../../api/api";
import utils from "../../shared/utils/utils";
import type {Tab, FieldType, Field, Section} from "../../shared/types/types.ts";
import {cpuSections} from "./sections/cpu.ts";
import {gpuSections} from "./sections/gpu.ts";
import {mbSections} from "./sections/mb.ts";
import {psuSections} from "./sections/psu.ts";
import {caseSections} from "./sections/case.ts";
import {szoSections} from "./sections/szo.ts";
import {memorySections} from "./sections/memory.ts";
import {airCoolingSections} from "./sections/airCooling.ts";
import {ssdSections} from "./sections/ssd.ts";
import {hdd2_5Sections} from "./sections/hdd2_5.ts";
import {hdd3_5Sections} from "./sections/hdd3_5.ts";
import {defaults} from "./defaults/defaults.ts";

const sectionsByTab: Record<Tab, Section[]> = {
    cpu: cpuSections,
    gpu: gpuSections,
    mb: mbSections,
    psu: psuSections,
    case: caseSections,
    szo: szoSections,
    aircooling: airCoolingSections,
    memory: memorySections,
    ssd: ssdSections,
    hdd2_5: hdd2_5Sections,
    hdd3_5: hdd3_5Sections,
};

export default function AdminPage() {
    const [tab, setTab] = useState<Tab>("cpu");
    const [form, setForm] = useState(() => ({ ...defaults["cpu"] }));
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    const [imgInput, setImgInput] = useState<string>("");
    const [localFiles, setLocalFiles] = useState<string[]>([]);

    const TITLE_MAP = {
        cpu: "Добавить CPU",
        gpu: "Добавить GPU",
        mb: "Добавить материнскую плату",
        psu: "Добавить блок питания",
        case: "Добавить корпус",
        szo: "Добавить водянку",
        aircooling: "Добавить воздушное охлаждение",
        memory: "Добавить оперативную память",
        ssd: "Добавить SSD",
        hdd2_5: "Добавить HDD 2.5",
        hdd3_5: "Добавить HDD 3.5",
    } as const;

    const title = TITLE_MAP[tab];
    const onSwitch = (next: Tab) => {
        setTab(next);
        setForm({ ...defaults[next] });
        setResult(null); setErr(null);
        setImgInput(""); setLocalFiles([]);
    };

    const bind = (key: string, type: FieldType = "text") => (e: any) => {
        let v: any;
        if (type === "bool") v = !!e.target.checked;
        else if (type === "number") v = Number(e.target.value);
        else v = e.target.value;
        setForm((prev: any) => ({ ...prev, [key]: v }));
    };

    const applyFieldValue = (f: Field) => {
        const v = form[f.name];
        if (f.type === "string[]") return Array.isArray(v) ? v.join(", ") : (v ?? "");
        if (f.type === "number[]") return Array.isArray(v) ? v.join(", ") : (v ?? "");
        if (f.type === "json") return v ?? "";
        return v ?? (f.type === "number" ? 0 : "");
    };

    const submit = async () => {
        try {
            setBusy(true); setErr(null); setResult(null);
            const payload = { ...form };

            const normalizeArrays = (fields: Field[]) => {
                for (const f of fields) {
                    if (f.type === "string[]") payload[f.name] = utils.toArray(payload[f.name]);
                    if (f.type === "number[]") payload[f.name] = utils.toNumArray(payload[f.name]);
                    if (f.type === "json") {
                        const raw = payload[f.name];
                        if (raw && typeof raw === "string") {
                            try { payload[f.name] = JSON.parse(raw); }
                            catch { /* Ignore */ }
                        }
                    }
                }
            };
            sectionsByTab[tab].forEach(sec => normalizeArrays(sec.fields));
            payload.images = Array.isArray(payload.images) ? payload.images : utils.toArray(payload.images);

            let resp: any;
            if (tab === "cpu") resp = await adminApi.addCpu(payload);
            if (tab === "gpu") resp = await adminApi.addGpu(payload);
            if (tab === "mb")  resp = await adminApi.addMb(payload);
            if (tab === "psu") resp = await adminApi.addPsu(payload);
            if (tab === "case") resp = await adminApi.addCase(payload);
            if (tab === "szo") resp = await adminApi.addSzo(payload);
            if (tab === "aircooling") resp = await adminApi.addAirCooling(payload);
            if (tab === "memory") resp = await adminApi.addMemory(payload);
            if (tab === "ssd") resp = await adminApi.addSsd(payload);
            if (tab === "hdd2_5") resp = await adminApi.addHdd2_5(payload);
            if (tab === "hdd3_5") resp = await adminApi.addHdd3_5(payload);setResult(`OK: ${resp?.id}`);
            setForm({ ...defaults[tab] });
            setImgInput(""); setLocalFiles([]);
        } catch (e: any) {
            setErr(e?.message ?? "Ошибка сохранения");
        } finally {
            setBusy(false);
        }
    };

    const addImage = () => {
        const url = imgInput.trim();
        if (!url) return;
        setForm((prev: any) => ({ ...prev, images: [...(prev.images ?? []), url] }));
        setImgInput("");
    };

    const onPickLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const urls = files.map((f) => URL.createObjectURL(f));
        setLocalFiles((prev) => [...prev, ...urls]);
    };

    const removeImageAt = (idx: number, local = false) => {
        if (local) {
            setLocalFiles((prev) => prev.filter((_, i) => i !== idx));
        } else {
            setForm((prev: any) => ({ ...prev, images: (prev.images ?? []).filter((_: any, i: number) => i !== idx) }));
        }
    };

    const sections = sectionsByTab[tab];

    return (
        <MainLayout>
            <AnimatedBackground />

            <div className={s.wrap}>
                <div className={s.header}>
                    <h1 className="glow">{title}</h1>
                    <div className={s.tabs}>
                        <button className={tab==="cpu"?s.active:""} onClick={()=>onSwitch("cpu")}>CPU</button>
                        <button className={tab==="gpu"?s.active:""} onClick={()=>onSwitch("gpu")}>GPU</button>
                        <button className={tab==="mb"?s.active:""}  onClick={()=>onSwitch("mb")}>MB</button>
                        <button className={tab==="psu"?s.active:""} onClick={()=>onSwitch("psu")}>PSU</button>
                        <button className={tab==="case"?s.active:""} onClick={()=>onSwitch("case")}>CASE</button>
                        <button className={tab==="szo"?s.active:""} onClick={()=>onSwitch("szo")}>SZO</button>
                        <button className={tab==="aircooling"?s.active:""} onClick={()=>onSwitch("aircooling")}>AirCooling</button>
                        <button className={tab==="memory"?s.active:""} onClick={()=>onSwitch("memory")}>Memory</button>
                        <button className={tab==="ssd"?s.active:""} onClick={()=>onSwitch("ssd")}>SSD</button>
                        <button className={tab==="hdd2_5"?s.active:""} onClick={()=>onSwitch("hdd2_5")}>HDD 2.5"</button>
                        <button className={tab==="hdd3_5"?s.active:""} onClick={()=>onSwitch("hdd3_5")}>HDD 3.5"</button>
                    </div>
                </div>

                <div className={s.layout}>
                    <div className={s.left}>
                        <div className={s.card}>
                            <h3>Изображения</h3>
                            <div className={s.imgRow}>
                                <input
                                    placeholder="https://... или /img/asset.png"
                                    type="text"
                                    value={imgInput}
                                    onChange={(e)=>setImgInput(e.target.value)}
                                />
                                <button className="btn" onClick={addImage}>Добавить URL</button>
                                <label className={s.fileBtn}>
                                    <input type="file" accept="image/*" multiple onChange={onPickLocal} />
                                    Выбрать файлы
                                </label>
                            </div>

                            <div className={s.previewGrid}>
                                {(form.images ?? []).map((src: string, idx: number) => (
                                    <div key={"url_"+idx} className={s.thumb}>
                                        <img src={src} alt={`img-${idx}`} loading="lazy" decoding="async" />
                                        <button className={s.del} onClick={()=>removeImageAt(idx,false)}>×</button>
                                    </div>
                                ))}
                                {localFiles.map((src, idx) => (
                                    <div key={"local_"+idx} className={s.thumb} title="Локальный предпросмотр (не отправляется)">
                                        <img src={src} alt={`local-${idx}`} loading="lazy" decoding="async" />
                                        <span className={s.badge}>local</span>
                                        <button className={s.del} onClick={()=>removeImageAt(idx,true)}>×</button>
                                    </div>
                                ))}
                            </div>

                            <p className={s.hint}>
                                <b>Важно:</b> локальные файлы показываются только для предпросмотра и <u>не отправляются</u> на сервер.
                                Для сохранения укажи их URL или путь из <code>/public</code>.
                            </p>
                        </div>

                        {sections.map((sec, si) => (
                            <div className={s.card} key={si}>
                                <h3>{sec.title}</h3>
                                <div className={s.grid}>
                                    {sec.fields.map((f) => (
                                        <label key={f.name} className={s.field}>
                                            <span>{f.label}</span>
                                            {f.type === "bool" ? (
                                                <div className={s.switch}>
                                                    <input type="checkbox" checked={!!form[f.name]} onChange={bind(f.name, "bool")} />
                                                    <div />
                                                </div>
                                            ) : f.type === "json" ? (
                                                <textarea
                                                    className={s.textarea}
                                                    placeholder={f.placeholder}
                                                    value={applyFieldValue(f)}
                                                    onChange={bind(f.name)}
                                                />
                                            ) : (
                                                <input
                                                    type={f.type === "number" ? "number" : "text"}
                                                    step={f.step ?? (f.type === "number" ? 1 : undefined)}
                                                    placeholder={f.placeholder}
                                                    value={applyFieldValue(f)}
                                                    onChange={bind(f.name, f.type)}
                                                />
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={s.right}>
                        <div className={s.cardSticky}>
                            <div className={s.actions}>
                                <button className="btn" disabled={busy} onClick={submit}>{busy ? "Сохраняю..." : "Сохранить"}</button>
                                {result && <div className={s.ok}>{result}</div>}
                                {err && <div className={s.err}>{err}</div>}
                            </div>

                            <details className={s.adv}>
                                <summary>Payload (JSON)</summary>
                                <pre>{JSON.stringify(form, null, 2)}</pre>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}