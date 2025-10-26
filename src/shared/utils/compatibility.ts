import type {
    CompatibilityComponents,
    CompMaps,
    StorageItem,
    SSD,
    CPU,
    MB,
    PSU,
    CASE,
    COOLING,
    Memory, GPU, AirCooling, HDD2_5, HDD3_5, SZO
} from "../types/types.ts";
import utils from "./utils.ts";

type Conflict = {
    slots: string[];
    message: string;
    level?: "error" | "warn";
    details?: object;
};

export type CompatibilityResult = {
    ok: boolean;
    conflicts: Conflict[];
    warnings: string[];
};

const norm = (v?: string | null) => (v ?? "").toString().trim().toLowerCase();

export function checkCompatibility(components?: CompatibilityComponents, storage?: StorageItem[] | null): CompatibilityResult {
    const conflicts: Conflict[] = [];
    const warnings: string[] = [];

    if (!components) return { ok: true, conflicts, warnings };

    const cpu = components.CPU as CPU | null | undefined;
    const mb = components.MB as MB | null | undefined;
    const psu = components.PSU as PSU | null | undefined;
    const kase = components.CASE as CASE | null | undefined;
    const gpu = components.GPU as GPU | null | undefined;
    const cooling = components.cooling as COOLING | null | undefined;
    const memory = components.memory as Memory | null | undefined;

    if (cpu && mb) {
        if (!norm(cpu.Socket) || !norm(mb.Socket) || norm(cpu.Socket) !== norm(mb.Socket)) {
            conflicts.push({
                slots: ["CPU", "MB"],
                message: `Несовпадающий сокет: CPU (${cpu.Socket}) ≠ MB (${mb.Socket})`,
                level: "error",
                details: { cpuSocket: cpu.Socket, mbSocket: mb.Socket }
            });
        }
    }

    if (cpu && memory) {
        const cpuMemTypes = (cpu.MemoryTypes ?? []).map(norm);
        if (cpuMemTypes.length && !cpuMemTypes.includes(norm(memory.MemoryType))) {
            warnings.push(`Память (${memory.MemoryType}) может не поддерживаться процессором (${cpu.Model}).`);
            conflicts.push({
                slots: ["CPU", "Memory"],
                message: `Потенциальная несовместимость памяти: CPU поддерживает ${cpu.MemoryTypes?.join(", ") ?? "—"}, память — ${memory.MemoryType}`,
                level: "warn"
            });
        }
    }

    if (mb && memory) {
        const mbMemTypes = (mb.MemoryTypes ?? []).map(norm);
        if (mbMemTypes.length && !mbMemTypes.includes(norm(memory.MemoryType))) {
            conflicts.push({
                slots: ["MB", "Memory"],
                message: `Материнская плата (${mb.Model}) не заявляет поддержку типа памяти ${memory.MemoryType}.`,
                level: "error"
            });
        }

        if (typeof memory.TotalModules === "number" && typeof mb.MemorySlots === "number") {
            if (memory.TotalModules > mb.MemorySlots) {
                conflicts.push({
                    slots: ["MB", "Memory"],
                    message: `Модулей памяти (${memory.TotalModules}) больше, чем слотов на плате (${mb.MemorySlots}).`,
                    level: "error"
                });
            }
        }

        if (typeof memory.OneModuleMemory === "number" && typeof memory.TotalModules === "number" && typeof mb.MaxMemory === "number") {
            const total = memory.OneModuleMemory * memory.TotalModules;
            if (total > mb.MaxMemory) {
                conflicts.push({
                    slots: ["MB", "Memory"],
                    message: `Общий объём памяти ${total}ГБ превышает максимально поддерживаемый платой ${mb.MaxMemory}ГБ.`,
                    level: "error"
                });
            }
        }
    }

    if (cooling && cpu) {
        const sockets: string[] = cooling.Sockets ?? [];
        if (Array.isArray(sockets) && sockets.length && cpu.Socket) {
            const supports = sockets.map(norm).some(s => norm(cpu.Socket) === s);
            if (!supports) {
                conflicts.push({
                    slots: ["Cooling", "CPU"],
                    message: `Система охлаждения (${cooling.Model}) может не поддерживать сокет CPU (${cpu.Socket}).`,
                    level: "warn"
                });
            }
        }

        const coolingTdp = cooling.TDP;
        if (typeof coolingTdp === "number" && typeof cpu.TDP === "number" && coolingTdp < cpu.TDP) {
            conflicts.push({
                slots: ["Cooling", "CPU"],
                message: `TDP охлаждения (${coolingTdp}Вт) меньше TDP процессора (${cpu.TDP}Вт).`,
                level: "warn"
            });
        }
    }

    if (kase && cooling) {
        const isSZO = utils.isSZO(cooling);
        if (isSZO) {
            if (!kase.SZOSupport) {
                conflicts.push({
                    slots: ["CASE", "Cooling"],
                    message: `Корпус (${kase.Model}) не поддерживает установку СЖО (SZO).`,
                    level: "error"
                });
            }
        } else {
            const coolerHeight = (cooling as AirCooling).Height;
            const caseMax = kase.MaxCoolerHeight;
            if (typeof coolerHeight === "number" && typeof caseMax === "number" && coolerHeight > caseMax) {
                conflicts.push({
                    slots: ["CASE", "Cooling"],
                    message: `Высота кулера (${coolerHeight}мм) превышает допустимую высоту в корпусе (${caseMax}мм).`,
                    level: "error"
                });
            }
        }
    }

    if (kase && mb) {
        const mbForms = (mb.FormFactor ?? []).map(norm);
        const caseBoards = (kase.CompatibleBoards ?? []).map(norm);
        const intersects = mbForms.some(f => caseBoards.includes(f));
        if (!intersects) {
            conflicts.push({
                slots: ["CASE", "MB"],
                message: `Форм-фактор материнской платы (${mb.FormFactor?.join(", ")}) не поддерживается корпусом (${kase.CompatibleBoards?.join(", ")}).`,
                level: "error"
            });
        }

        if (psu && Array.isArray(kase.CompatiblePowerSupply)) {
            if (!kase.CompatiblePowerSupply.map(norm).includes(norm(psu.FormFactor))) {
                conflicts.push({
                    slots: ["CASE", "PSU"],
                    message: `Форм-фактор блока питания (${psu.FormFactor}) может не поместиться в корпус (${kase.CompatiblePowerSupply.join(", ")}).`,
                    level: "warn"
                });
            }
        }
    }

    if (psu) {
        const cpuTdp = cpu?.TDP ?? 0;
        const gpuPower = gpu?.PowerConsumption ? Number(gpu?.PowerConsumption) : 0;
        const required = Math.ceil(cpuTdp + gpuPower + 150) <= gpu?.PowerConsumption! ? gpu?.PowerConsumption : Math.ceil(cpuTdp + gpuPower + 150);

        if (typeof psu.Power === "number" && psu.Power < required!) {
            conflicts.push({
                slots: ["PSU", "CPU", "GPU"],
                message: `Мощности блока питания (${psu.Power}Вт) может не хватить. Рекомендуем минимум ~${required}Вт.`,
                level: "error",
                details: { required, cpuTdp, gpuPower }
            });
        }

        if (gpu && Array.isArray(psu.VideoCardPowerConnectors) && gpu.PowerConnections) {
            if (!psu.VideoCardPowerConnectors.length) {
                warnings.push(`У блока питания нет заявленных видеовыходов питания, проверьте совместимость с видеокартой.`);
            }
        }
    }

    if (gpu && kase) {
        const gpuWidth = gpu.Width ?? null;
        const caseGpuLen = kase.GPULength;
        if (typeof gpuWidth === "number" && typeof caseGpuLen === "number" && gpuWidth > caseGpuLen) {
            conflicts.push({
                slots: ["GPU", "CASE"],
                message: `Видеокарта может не поместиться: размер GPU ${gpuWidth}мм > допустимая длина корпуса ${caseGpuLen}мм.`,
                level: "error"
            });
        }
    }

    if (mb && Array.isArray(storage) && storage.length) {
        const m2Slots = Number(mb.M2Slots ?? 0);
        const sataPorts = Number(mb.SATAPorts ?? 0);
        let m2Count = 0;
        let sataCount = 0;

        for (const st of storage) {
            const kind = st.kind;
            if (kind === "ssd") {
                const s = st as StorageItem & { item?: SSD | null };
                const item = s.item as SSD | undefined | null;
                const phys = norm(item?.PhysInterface ?? "");
                if (phys.includes("m.2") || item?.NVMe) m2Count += (st.qty ?? 1);
                else sataCount += (st.qty ?? 1);
            } else if (kind === "hdd2_5" || kind === "hdd3_5") {
                sataCount += (st.qty ?? 1);
            }
        }

        if (m2Count > m2Slots) {
            conflicts.push({
                slots: ["MB", "Storage"],
                message: `На плате доступно M.2 слотов: ${m2Slots}, а в сборке M.2 накопителей: ${m2Count}.`,
                level: "error"
            });
        }

        if (sataCount > sataPorts) {
            conflicts.push({
                slots: ["MB", "Storage"],
                message: `На плате SATA портов: ${sataPorts}, а накопителей SATA в сборке: ${sataCount}.`,
                level: "error"
            });
        }
    }

    const ok = conflicts.every(c => c.level !== "error") && conflicts.length === 0;

    return { ok, conflicts, warnings };
}

export function getCompatibilityComponents(compMaps: CompMaps, selected?: CompatibilityComponents, storage?: StorageItem[] | null) {
    const mapToArray = <T>(m: Map<string, T>) => Array.from(m.values());
    const result: Partial<Record<keyof CompMaps, any[]>> = {};

    const types: (keyof CompMaps)[] = [
        "cpu", "gpu", "mb", "psu", "case", "cooling", "memory", "ssd", "hdd2_5", "hdd3_5"
    ];

    for (const t of types) {
        const map = compMaps[t] as Map<string, any> | undefined;
        if (!map) {
            result[t] = [];
            continue;
        }
        const arr = mapToArray(map);
        const filtered = arr.filter(candidate => {
            const temp: CompatibilityComponents = {
                CPU: selected?.CPU ?? null,
                GPU: selected?.GPU ?? null,
                MB: selected?.MB ?? null,
                PSU: selected?.PSU ?? null,
                CASE: selected?.CASE ?? null,
                cooling: selected?.cooling ?? null,
                memory: selected?.memory ?? null
            };

            switch (t) {
                case "cpu": temp.CPU = candidate; break;
                case "gpu": temp.GPU = candidate; break;
                case "mb": temp.MB = candidate; break;
                case "psu": temp.PSU = candidate; break;
                case "case": temp.CASE = candidate; break;
                case "cooling": temp.cooling = candidate; break;
                case "memory": temp.memory = candidate; break;
                case "ssd":
                case "hdd2_5":
                case "hdd3_5":
                    break;
            }

            let stor: StorageItem[] | undefined = storage ? [...storage] : undefined;
            if (t === "ssd" || t === "hdd2_5" || t === "hdd3_5") {
                const kind: "ssd" | "hdd2_5" | "hdd3_5" = t === "ssd" ? "ssd" : (t === "hdd2_5" ? "hdd2_5" : "hdd3_5");
                stor = [...(stor ?? []), { kind, id: String(candidate.Id ?? candidate.Id ?? candidate.Id ?? candidate.Id), qty: 1 }];
            }

            const r = checkCompatibility(temp, stor ?? null);
            const hasError = r.conflicts.some(c => c.level === "error");
            return !hasError;
        });

        result[t] = filtered;
    }

    return result as {
        cpu: CPU[];
        gpu: GPU[];
        mb: MB[];
        psu: PSU[];
        case: CASE[];
        cooling: SZO[] | AirCooling[];
        memory: Memory[];
        ssd: SSD[];
        hdd2_5: HDD2_5[];
        hdd3_5: HDD3_5[];
    };
}