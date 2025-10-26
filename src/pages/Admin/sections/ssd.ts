import type {Section} from "../../../shared/types/types.ts";

export const ssdSections: Section[] = [
    {
        title: "Основное",
        fields: [
            {name: "price", label: "Price", type: "number"},
            {name: "warranty", label: "Warranty", type: "number"},
            {name: "model", label: "Model", type: "text"},
            {name: "manufacturerCode", label: "ManufacturerCode", type: "text"},
            {name: "diskCapacity", label: "DiskCapacity", type: "number"},
            {name: "formFactor", label: "FormFactor", type: "text"},
            {name: "physInterface", label: "PhysInterface", type: "text"},
            {name: "m2ConnectorKey", label: "M2ConnectorKey", type: "text"},
            {name: "nVMe", label: "NVMe", type: "bool"},
            {name: "memoryStructure", label: "MemoryStructure", type: "text"},
            {name: "dRAM", label: "DRAM", type: "bool"}
        ]
    },
    {
        title: "Производительность/ресурс",
        fields: [
            {name: "maxReadSpeed", label: "MaxReadSpeed", type: "number"},
            {name: "maxWriteSpeed", label: "MaxWriteSpeed", type: "number"},
            {name: "tBW", label: "TBW", type: "number"},
            {name: "dWPD", label: "DWPD", type: "number"}
        ]
    },
    {
        title: "Габариты/охлаждение",
        fields: [
            {name: "radiator", label: "Radiator", type: "bool"},
            {name: "length", label: "Length", type: "number"},
            {name: "width", label: "Width", type: "number"},
            {name: "thickness", label: "Thickness", type: "number"},
            {name: "weight", label: "Weight", type: "number"}
        ]
    }
];