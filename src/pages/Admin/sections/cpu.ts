import type {Section} from "../../../shared/types/types.ts";

export const cpuSections: Section[] = [
    {
        title: "Базовая информация",
        fields: [
            { name: "model", label: "Модель", type: "text" },
            { name: "price", label: "Цена", type: "number", step: 0.01 },
            { name: "warranty", label: "Гарантия (мес.)", type: "number" },
            { name: "releaseYear", label: "Год релиза", type: "number" },
            { name: "socket", label: "Сокет", type: "text" },
            { name: "manufacturerCode", label: "Код производителя", type: "text" },
            { name: "core", label: "Core/линейка", type: "text" },
            { name: "technicalProcess", label: "Техпроцесс", type: "text" },
        ]
    },
    {
        title: "Частоты",
        fields: [
            { name: "basicFrequency", label: "Базовая частота (ГГц)", type: "number", step: 0.01 },
            { name: "turboFrequency", label: "Турбо частота (ГГц)", type: "number", step: 0.01 },
            { name: "energyEfficientBasicFrequency", label: "EE баз. частота (ГГц)", type: "number", step: 0.01 },
            { name: "energyEfficientTurboFrequency", label: "EE турбо частота (ГГц)", type: "number", step: 0.01 },
        ]
    },
    {
        title: "Ядра/потоки/кэш",
        fields: [
            { name: "totalCores", label: "Всего ядер", type: "number" },
            { name: "productiveCores", label: "Производительные ядра", type: "number" },
            { name: "energyEfficientCores", label: "Энергоэффективные ядра", type: "number" },
            { name: "threads", label: "Потоки", type: "number" },
            { name: "cacheL1", label: "Кэш L1 (МБ)", type: "number" },
            { name: "cacheL2", label: "Кэш L2 (МБ)", type: "number" },
            { name: "cacheL3", label: "Кэш L3 (МБ)", type: "number" },
        ]
    },
    {
        title: "Память и шина",
        fields: [
            { name: "memoryTypes", label: "Типы памяти", type: "string[]", placeholder: "DDR5, ..." },
            { name: "maxMemory", label: "Макс. память (ГБ)", type: "number" },
            { name: "canals", label: "Каналы", type: "number" },
            { name: "memoryFrequency", label: "Частоты памяти", type: "string[]", placeholder: "DDR5-5600, ..." },
            { name: "ECCMode", label: "ECC", type: "bool" },
        ]
    },
    {
        title: "Энергопотребление/Др.",
        fields: [
            { name: "TDP", label: "TDP (Вт)", type: "number" },
            { name: "basicHeatProduction", label: "Тепловыделение баз. (Вт)", type: "number" },
            { name: "maxTemp", label: "Макс. температура (°C)", type: "number" },
            { name: "PCIExpress", label: "PCIe версия", type: "text" },
            { name: "PCIExpressLines", label: "Линий PCIe", type: "number" },
            { name: "freeMultiplier", label: "Свободный множитель", type: "bool" },
            { name: "coolingSystem", label: "В комплекте кулер", type: "bool" },
            { name: "thermalInterface", label: "Термопаста", type: "bool" },
            { name: "graphicalCore", label: "Встроенная графика", type: "bool" },
            { name: "virtualization", label: "Виртуализация", type: "bool" },
            { name: "additionally", label: "Дополнительно", type: "string[]" },
        ]
    },
];