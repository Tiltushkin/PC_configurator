import type {allComponents, BuildEx, WithMaybeId, SZO, AirCooling, CPU, GPU, MB, PSU, CASE, Memory, SSD, HDD2_5, HDD3_5} from "../types/types.ts";

export class Utils {
    toArray(val: any): string[] {
        if (Array.isArray(val)) return val;
        if (!val) return [];
        return String(val).split(",").map((v) => v.trim()).filter(Boolean);
    }

    toNumArray(val: any): number[] {
        if (Array.isArray(val)) return val.map(Number).filter((n) => !Number.isNaN(n));
        if (!val) return [];
        return String(val).split(",").map((v) => Number(v.trim())).filter((n) => !Number.isNaN(n));
    }

    readLastBuild(): BuildEx | null {
        try {
            const raw = localStorage.getItem("lastBuild");
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== "object") return null;
            return parsed as BuildEx;
        } catch {
            return null;
        }
    }

    writeLastBuild(b: BuildEx) {
        try {
            localStorage.setItem("lastBuild", JSON.stringify(b));
        } catch (e) {
            console.error("Не удалось установить ключ в localStorage", e);
        }
    }

    getAnyId(x: WithMaybeId<allComponents>) {
        return (x.Id ?? x.ManufacturerCode ?? (x as any).Model) as string;
    }

    toggleId = (arr: string[] | undefined, id: string): string[] => {
        const a = arr ?? [];
        const i = a.indexOf(id);
        return i === -1 ? [...a, id] : [...a.slice(0, i), ...a.slice(i + 1)];
    }

    isCPU(value: unknown): value is CPU {
        return (
            typeof value === "object" && value !== null && "TotalCores" in value
        );
    }

    isGPU(value: unknown): value is GPU {
        return (
            typeof value === "object" && value !== null && "GraphicalProcessor" in value
        );
    }

    isMB(value: unknown): value is MB {
        return (
            typeof value === "object" && value !== null && "MemorySlots" in value
        );
    }

    isPSU(value: unknown): value is PSU {
        return (
            typeof value === "object" && value !== null && "PowerV12Line" in value
        );
    }

    isCASE(value: unknown): value is CASE {
        return (
            typeof value === "object" && value !== null && "MotherBoardOrientation" in value
        );
    }

    isMemory(value: unknown): value is Memory {
        return (
            typeof value === "object" && value !== null && "TotalMemory" in value
        );
    }

    isSZO(value: unknown): value is SZO {
        return (
            typeof value === "object" && value !== null && "LCD" in value
        );
    }

    isAirCooling(value: unknown): value is AirCooling {
        return (
            typeof value === "object" && value !== null && "HeatPipes" in value
        );
    }

    isSSD(value: unknown): value is SSD {
        return (
            typeof value === "object" && value !== null && "PhysInterface" in value
        );
    }

    isHDD2_5(value: unknown): value is HDD2_5 {
        return (
            typeof value === "object" && value !== null && "AVGAccessReading" in value
        );
    }

    isHDD3_5(value: unknown): value is HDD3_5 {
        return (
            typeof value === "object" && value !== null && "CacheSize" in value
        );
    }

    getComponentDescription(component: unknown): string {
        if (this.isCPU(component)) return `${component.Socket}, ${component.TotalCores} x ${component.BasicFrequency} ГГц, L2 - ${component.CacheL2} МБ, L3 - ${component.CacheL3} МБ, 2 x ${component.MemoryFrequency}`;
        if (this.isGPU(component)) return `${component.ConnectionInterface}, ${component.VideoRAM} ГБ ${component.MemoryType}, ${component.MemoryBusWidth} бит, ${component.VideoConnectors.join(", ")}`;
        if (this.isMB(component)) return `${component.Socket}, ${component.CheapSet}, ${component.MemorySlots}x${component.MemoryTypes}-${component.MaxMemoryFrequency}МГц, ${component.PCISlots.join(", ")}, ${component.FormFactor}`;
        if (this.isPSU(component)) return `${component.Power}Вт, ${component.Certificate ? `80+ ${component.Certificate}` : null}, ${component.MainPowerConnector}, ${component.ProcessorPowerConnectors} CPU`;
        if (this.isCASE(component)) return `${component.BodySize}, ${component.CompatibleBoards.join(", ")}`;
        if (this.isSZO(component)) return `${component.RadiatorMountingDimensions}, разъем помпы - ${component.PumpConnectionSocket}, радиатор - ${component.RadiatorMaterial}, TDP - ${component.TDP} Вт`;
        if (this.isAirCooling(component)) return `основание - ${component.BaseMaterial}, ${component.MaxRotationSpeed} об/мин, ${component.MaxNoiseLevel} дБ, ${component.FanConnector}, ${component.TDP} Вт`;
        if (this.isMemory(component)) return `${component.MemoryType}, ${component.OneModuleMemory} ГБ x ${component.TotalModules} шт, ${component.ClockFrequency} МГц, ${component.CL}(CL)-${component.TRCD}-${component.TRP}`;
        if (this.isSSD(component)) return `${component.PhysInterface}, чтение - ${component.MaxReadSpeed} Мбайт/сек, запись - ${component.MaxWriteSpeed} Мбайт/сек`;
        if (this.isHDD2_5(component)) return `${component.Interface}, ${component.SpindleRotationSpeed} об/мин, кэш-память ${component.BufferSize} МБ`;
        if (this.isHDD3_5(component)) return `${component.Interface}, ${component.InterfaceBandwidth / 1000} Гбит/с, ${component.SpindleRotationSpeed} об/мин, кэш-память ${component.CacheSize} МБ`;
        return ""
    }

    getBadgeName(component: allComponents): string {
        if (this.isCPU(component)) return `CPU`;
        if (this.isGPU(component)) return `GPU`;
        if (this.isMB(component)) return `Motherboard`;
        if (this.isPSU(component)) return `PSU`;
        if (this.isCASE(component)) return `CASE`;
        if (this.isSZO(component)) return `SZO`;
        if (this.isAirCooling(component)) return `Aircooling`;
        if (this.isMemory(component)) return `Memory`;
        if (this.isSSD(component)) return `SSD`;
        if (this.isHDD2_5(component)) return `HDD 2.5'`;
        if (this.isHDD3_5(component)) return `HDD 3.5'`;
        return '';
    }

    resolveImageUrl(src?: string | null): string | null {
        if (!src) return null;
        let p = String(src).trim();
        p = p.replace(/^\.\/public\//, "").replace(/^public\//, "").replace(/^\.\//, "");
        p = p.replace(/\s/g, "%20");
        if (/^https?:\/\//i.test(p)) return p;
        const base = (import.meta as any).env?.BASE_URL || "/";
        if (p.startsWith("/")) return base + p.replace(/^\//, "");
        return base + p;
    }
}

export default new Utils();