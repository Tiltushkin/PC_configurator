import type {Section} from "../../../shared/types/types.ts";

export const gpuSections: Section[] = [
    {
        title: "Базовая информация",
        fields: [
            { name: "model", label: "Модель", type: "text" },
            { name: "price", label: "Цена", type: "number", step: 0.01 },
            { name: "warranty", label: "Гарантия (мес.)", type: "number" },
            { name: "manufacturerCode", label: "Код производителя", type: "text" },
            { name: "color", label: "Цвет", type: "text" },
            { name: "graphicalProcessor", label: "Графический процессор", type: "text" },
            { name: "microArch", label: "Микроархитектура", type: "text" },
            { name: "techProcess", label: "Техпроцесс (нм)", type: "number" },
        ]
    },
    {
        title: "Частоты и блоки",
        fields: [
            { name: "basicFrequency", label: "Базовая частота (МГц)", type: "number" },
            { name: "turboFrequency", label: "Турбо частота (МГц)", type: "number" },
            { name: "ALU", label: "ALU", type: "number" },
            { name: "textureBlocks", label: "Texture Units", type: "number" },
            { name: "rasterizationBlocks", label: "Raster Units", type: "number" },
            { name: "rayTracing", label: "Ray Tracing", type: "bool" },
            { name: "rtCores", label: "RT Cores", type: "number" },
            { name: "tensorCores", label: "Tensor Cores", type: "number" },
        ]
    },
    {
        title: "Память",
        fields: [
            { name: "videoRAM", label: "Видеопамять (ГБ)", type: "number" },
            { name: "memoryType", label: "Тип памяти", type: "text" },
            { name: "memoryBusWidth", label: "Шина памяти (бит)", type: "number" },
            { name: "memoryBandwidth", label: "Пропускная способность (ГБ/с)", type: "number" },
            { name: "memoryFrequency", label: "Частота памяти (МГц)", type: "number" },
        ]
    },
    {
        title: "Интерфейсы и выводы",
        fields: [
            { name: "videoConnectors", label: "Видео коннекторы", type: "string[]", placeholder: "HDMI, DP" },
            { name: "HDMIVersion", label: "HDMI версия", type: "text" },
            { name: "DisplayPortVersion", label: "DisplayPort версия", type: "text" },
            { name: "maximumMonitors", label: "Макс. мониторов", type: "number" },
            { name: "maximumResolution", label: "Макс. разрешение", type: "text" },
            { name: "connectionInterface", label: "Интерфейс", type: "text" },
            { name: "connectionFormFactor", label: "Форм-фактор", type: "text" },
            { name: "PCIExpressLines", label: "Линий PCIe", type: "number" },
        ]
    },
    {
        title: "Питание и охлаждение",
        fields: [
            { name: "powerConnections", label: "Коннекторы питания", type: "text" },
            { name: "recommendedPowerSupply", label: "Реком. БП (Вт)", type: "number" },
            { name: "powerConsumption", label: "Потребление (Вт)", type: "number" },
            { name: "coolingType", label: "Тип охлаждения", type: "text" },
            { name: "numberOfFans", label: "Кол-во вентиляторов", type: "text" },
            { name: "liquidCoolingRadiator", label: "Радиатор СЖО", type: "bool" },
        ]
    },
    {
        title: "Особенности",
        fields: [
            { name: "canMining", label: "Подходит для майнинга", type: "bool" },
            { name: "LHR", label: "LHR", type: "bool" },
            { name: "backlight", label: "Подсветка", type: "bool" },
            { name: "RGBSync", label: "RGB Sync", type: "bool" },
            { name: "LCD", label: "LCD", type: "bool" },
            { name: "biosToggler", label: "BIOS toggler", type: "bool" },
            { name: "completion", label: "Комплектация", type: "string[]" },
            { name: "additionally", label: "Дополнительно", type: "string[]" },
            { name: "LowProfile", label: "Low Profile", type: "bool" },
        ]
    },
    {
        title: "Габариты",
        fields: [
            { name: "expansionSlots", label: "Слотов расширения", type: "number" },
            { name: "width", label: "Ширина (мм)", type: "number" },
            { name: "height", label: "Высота (мм)", type: "number" },
            { name: "thickness", label: "Толщина (мм)", type: "number" },
            { name: "weight", label: "Вес (г)", type: "number" },
        ]
    },
];