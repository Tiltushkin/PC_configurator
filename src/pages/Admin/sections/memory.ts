import type {Section} from "../../../shared/types/types.ts";

export const memorySections: Section[] = [
    {
        title: "Основное",
        fields: [
            {name: "price", label: "Price", type: "number"},
            {name: "warranty", label: "Warranty", type: "number"},
            {name: "model", label: "Model", type: "text"},
            {name: "manufacturerCode", label: "ManufacturerCode", type: "text"},
            {name: "memoryType", label: "MemoryType", type: "text"},
            {name: "memoryModuleType", label: "MemoryModuleType", type: "text"},
            {name: "ranking", label: "Ranking", type: "text"}
        ]
    },
    {
        title: "Объём/модули",
        fields: [
            {name: "totalMemory", label: "TotalMemory", type: "number"},
            {name: "oneModuleMemory", label: "OneModuleMemory", type: "number"},
            {name: "totalModules", label: "TotalModules", type: "number"}
        ]
    },
    {
        title: "Профили/тайминги",
        fields: [
            {name: "clockFrequency", label: "ClockFrequency", type: "number"},
            {name: "aMDExpo", label: "AMDExpo", type: "string[]"},
            {name: "intelXMP", label: "IntelXMP", type: "string[]"},
            {name: "cL", label: "CL", type: "number"},
            {name: "tRCD", label: "tRCD", type: "number"},
            {name: "tRP", label: "tRP", type: "number"}
        ]
    },
    {
        title: "Фичи/охлаждение",
        fields: [
            {name: "registerMemory", label: "RegisterMemory", type: "bool"},
            {name: "eCCMemory", label: "ECCMemory", type: "bool"},
            {name: "radiator", label: "Radiator", type: "bool"},
            {name: "radiatorColor", label: "RadiatorColor", type: "text"},
            {name: "lowProfile", label: "LowProfile", type: "bool"},
            {name: "boardElementBacklight", label: "BoardElementBacklight", type: "text"}
        ]
    },
    {
        title: "Габариты/электрика",
        fields: [
            {name: "height", label: "Height", type: "number"},
            {name: "voltage", label: "Voltage", type: "number"}
        ]
    },
    {
        title: "Дополнительно",
        fields: [
            {name: "additionally", label: "Additionally", type: "string[]"}
        ]
    }
];