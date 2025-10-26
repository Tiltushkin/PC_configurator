import type {Section} from "../../../shared/types/types.ts";

export const mbSections: Section[] = [
    {
        title: "Базовая информация",
        fields: [
            { name: "model", label: "Модель", type: "text" },
            { name: "series", label: "Серия", type: "text" },
            { name: "price", label: "Цена", type: "number", step: 0.01 },
            { name: "warranty", label: "Гарантия (мес.)", type: "number" },
            { name: "color", label: "Цвет", type: "text" },
            { name: "releaseYear", label: "Год релиза", type: "number" },
            { name: "formFactor", label: "Форм-фактор", type: "string[]", placeholder: "ATX, mATX" },
            { name: "width", label: "Ширина (мм)", type: "number" },
            { name: "height", label: "Высота (мм)", type: "number" },
            { name: "socket", label: "Сокет", type: "text" },
            { name: "cheapSet", label: "Чипсет", type: "text" },
        ]
    },
    {
        title: "Память",
        fields: [
            { name: "memoryTypes", label: "Типы памяти", type: "string[]" },
            { name: "maxMemory", label: "Макс. память (ГБ)", type: "number" },
            { name: "memoryFormFactor", label: "Форм-фактор памяти", type: "string[]" },
            { name: "memorySlots", label: "Слоты памяти", type: "number" },
            { name: "memoryCanals", label: "Каналы", type: "number" },
            { name: "maxMemoryFrequency", label: "Макс. частота", type: "number" },
            { name: "maxMemoryBoostFrequency", label: "Boost частоты", type: "number[]" },
        ]
    },
    {
        title: "PCIe / Слоты / Накопители",
        fields: [
            { name: "PCIExpress", label: "PCIe", type: "text" },
            { name: "PCISlots", label: "PCI слоты", type: "string[]" },
            { name: "SLI", label: "SLI", type: "bool" },
            { name: "CardsInSLI", label: "Карт в SLI", type: "number" },
            { name: "PCIEx1Slots", label: "PCIe x1 слоты", type: "number" },
            { name: "NVMeSupport", label: "Поддержка NVMe", type: "bool" },
            { name: "DiskPCIExpress", label: "PCIe для дисков", type: "text" },
            { name: "M2Slots", label: "M.2 слоты", type: "number" },
            { name: "M2ConnectorsPCIeProcessor", label: "M.2 (CPU)", type: "string[]" },
            { name: "M2ConnectorsPCIeCheapSet", label: "M.2 (Chipset)", type: "string[]" },
        ]
    },
    {
        title: "SATA / RAID",
        fields: [
            { name: "SATAPorts", label: "SATA порты", type: "number" },
            { name: "SATARAID", label: "SATA RAID", type: "string[]" },
            { name: "NVMeRAID", label: "NVMe RAID", type: "string[]" },
        ]
    },
    {
        title: "Порты и видео",
        fields: [
            { name: "VideoOutputs", label: "Видео выходы", type: "string[]" },
            { name: "NetworkPorts", label: "Сетевых портов", type: "number" },
            { name: "ProcessorCoolingConnectors", label: "Разъёмы кулера CPU", type: "string[]" },
            { name: "SZOConnectors", label: "Коннекторы СЖО", type: "number" },
            { name: "CaseFansConnectors4Pin", label: "Разъёмы вент. 4-pin", type: "number" },
            { name: "CaseFansConnectors3Pin", label: "Разъёмы вент. 3-pin", type: "number" },
            { name: "VDGConnectors", label: "VDG", type: "number" },
            { name: "VGRBConnectors", label: "VGRB", type: "number" },
            { name: "M2Wireless", label: "M.2 Wireless", type: "bool" },
            { name: "RS232", label: "RS232 (COM)", type: "bool" },
            { name: "LPT", label: "LPT", type: "bool" },
        ]
    },
    {
        title: "Питание/Охлаждение",
        fields: [
            { name: "MainPowerConnector", label: "Main Power", type: "text" },
            { name: "ProcessorPowerConnector", label: "CPU Power", type: "text" },
            { name: "PowerPhases", label: "Фазы питания", type: "text" },
            { name: "PassiveCooling", label: "Пассивное охлаждение", type: "string[]" },
        ]
    },

    {
        title: "USB-порты",
        fields: [
            { name: "OutUSBTypeA", label: "Out USB Type-A", type: "string[]" },
            { name: "OutUSBTypeC", label: "Out USB Type-C", type: "string[]" },
            { name: "InUSBTypeA", label: "In USB Type-A", type: "string[]" },
            { name: "InUSBTypeC", label: "In USB Type-C", type: "string[]" },
        ]
    },
];