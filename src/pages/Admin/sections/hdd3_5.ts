import type {Section} from "../../../shared/types/types.ts";

export const hdd3_5Sections: Section[] = [
    {
        title: "Основное",
        fields: [
            {name: "price", label: "Price", type: "number"},
            {name: "warranty", label: "Warranty", type: "number"},
            {name: "model", label: "Model", type: "text"},
            {name: "manufacturerCode", label: "ManufacturerCode", type: "text"},
            {name: "diskCapacity", label: "DiskCapacity", type: "number"},
            {name: "interface", label: "Interface", type: "text"},
            {name: "interfaceBandwidth", label: "InterfaceBandwidth", type: "number"},
            {name: "recordingTechnology", label: "RecordingTechnology", type: "text"},
            {name: "rAIDOptimization", label: "RAIDOptimization", type: "bool"},
            {name: "heliumFilled", label: "HeliumFilled", type: "bool"}
        ]
    },
    {
        title: "Производительность/шум",
        fields: [
            {name: "cacheSize", label: "CacheSize", type: "number"},
            {name: "spindleRotationSpeed", label: "SpindleRotationSpeed", type: "number"},
            {name: "dataTransferRate", label: "DataTransferRate", type: "number"},
            {name: "noiseLevel", label: "NoiseLevel", type: "number"},
            {name: "noiseLevelIdle", label: "NoiseLevelIdle", type: "number"}
        ]
    },
    {
        title: "Энергопотребление",
        fields: [
            {name: "maxPowerConsumption", label: "MaxPowerConsumption", type: "number"},
            {name: "standbyPowerConsumption", label: "StandbyPowerConsumption", type: "number"}
        ]
    },
    {
        title: "Надёжность",
        fields: [
            {name: "impactResistance", label: "ImpactResistance", type: "number"},
            {name: "parkingCycles", label: "ParkingCycles", type: "number"}
        ]
    },
    {
        title: "Температуры",
        fields: [
            {name: "maxWorkingTemp", label: "MaxWorkingTemp", type: "number"}
        ]
    },
    {
        title: "Габариты и вес",
        fields: [
            {name: "width", label: "Width", type: "number"},
            {name: "length", label: "Length", type: "number"},
            {name: "thickness", label: "Thickness", type: "number"},
            {name: "weight", label: "Weight", type: "number"}
        ]
    }
];