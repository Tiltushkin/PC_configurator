import type {Section} from "../../../shared/types/types.ts";

export const hdd2_5Sections: Section[] = [
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
            {name: "recordingTechnology", label: "RecordingTechnology", type: "text"}
        ]
    },
    {
        title: "Производительность",
        fields: [
            {name: "bufferSize", label: "BufferSize", type: "number"},
            {name: "spindleRotationSpeed", label: "SpindleRotationSpeed", type: "number"},
            {name: "aVGAccessReading", label: "AVGAccessReading", type: "number"}
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
            {name: "minWorkingTemp", label: "MinWorkingTemp", type: "number"},
            {name: "maxWorkingTemp", label: "MaxWorkingTemp", type: "number"}
        ]
    },
    {
        title: "Габариты и вес",
        fields: [
            {name: "width", label: "Width", type: "number"},
            {name: "length", label: "Length", type: "number"},
            {name: "standardThickness", label: "StandardThickness", type: "number"},
            {name: "weight", label: "Weight", type: "number"}
        ]
    }
];