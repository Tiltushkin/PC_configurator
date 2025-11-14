import { useState } from "react";
import type { Field, FieldType, Section, Tab } from "../types/types";
import { defaults } from "../../pages/Admin/defaults/defaults";
import { cpuSections } from "../../pages/Admin/sections/cpu.ts";
import { gpuSections } from "../../pages/Admin/sections/gpu.ts";
import { mbSections } from "../../pages/Admin/sections/mb.ts";
import { psuSections } from "../../pages/Admin/sections/psu.ts";
import { caseSections } from "../../pages/Admin/sections/case.ts";
import { szoSections } from "../../pages/Admin/sections/szo.ts";
import { memorySections } from "../../pages/Admin/sections/memory.ts";
import { airCoolingSections } from "../../pages/Admin/sections/airCooling.ts";
import { ssdSections } from "../../pages/Admin/sections/ssd.ts";
import { hdd2_5Sections } from "../../pages/Admin/sections/hdd2_5.ts";
import { hdd3_5Sections } from "../../pages/Admin/sections/hdd3_5.ts";
import utils from "../utils/utils";
import { adminApi } from "../../api/api.ts";

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

export default function useAdmin() {
    const [tab, setTab] = useState<Tab>("cpu");
    const [form, setForm] = useState(() => ({ ...defaults["cpu"] }));
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    const [imgInput, setImgInput] = useState<string>("");
    const [localFiles, setLocalFiles] = useState<string[]>([]);

    const TITLE_MAP = {
        cpu: "Добавить процессор",
        gpu: "Добавить видеокарту",
        mb: "Добавить материнскую плату",
        psu: "Добавить блок питания",
        case: "Добавить корпус",
        szo: "Добавить водяное охлаждение",
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
            switch (tab) {
                case "cpu":
                    resp = await adminApi.addCpu(payload);
                    break;
                case "gpu":
                    resp = await adminApi.addGpu(payload);
                    break;
                case "mb":
                    resp = await adminApi.addMb(payload);
                    break;
                case "psu":
                    resp = await adminApi.addPsu(payload);
                    break;
                case "case":
                    resp = await adminApi.addCase(payload);
                    break;
                case "szo":
                    resp = await adminApi.addSzo(payload);
                    break;
                case "aircooling":
                    resp = await adminApi.addAirCooling(payload);
                    break;
                case "memory":
                    resp = await adminApi.addMemory(payload);
                    break;
                case "ssd":
                    resp = await adminApi.addSsd(payload);
                    break;
                case "hdd2_5":
                    resp = await adminApi.addHdd2_5(payload);
                    break;
                case "hdd3_5":
                    resp = await adminApi.addHdd3_5(payload);
                    break;
            }
            setResult(`OK: ${resp?.id}`);
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

    return {
        tab, form, busy, result, err, imgInput, localFiles, title, sections,
        onSwitch, bind, applyFieldValue, submit, addImage, onPickLocal, removeImageAt,
        setTab, setForm, setBusy, setResult, setErr, setImgInput, setLocalFiles
    }
}