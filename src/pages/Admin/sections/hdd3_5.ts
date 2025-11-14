import type {Section} from "../../../shared/types/types.ts";

export const hdd3_5Sections: Section[] = [
    {
        title: "Основное",
        fields: [
            {name: "price", label: "Цена", type: "number"},
            {name: "warranty", label: "Гарантия", type: "number"},
            {name: "model", label: "Модель", type: "text"},
            {name: "manufacturerCode", label: "Код производителя", type: "text"},
            {name: "diskCapacity", label: "Объем накопителя", type: "number"},
            {name: "interface", label: "Интерфейс", type: "text"},
            {name: "interfaceBandwidth", label: "Пропускная способность интерфейса", type: "number"},
            {name: "recordingTechnology", label: "Технология записи", type: "text"},
            {name: "rAIDOptimization", label: "Оптимизация под RAID-массивы", type: "bool"},
            {name: "heliumFilled", label: "С гелиевым наполнением", type: "bool"}
        ]
    },
    {
        title: "Производительность/шум",
        fields: [
            {name: "cacheSize", label: "Объем кэш-памяти", type: "number"},
            {name: "spindleRotationSpeed", label: "Скорость вращения шпинделя", type: "number"},
            {name: "dataTransferRate", label: "Максимальная скорость передачи данных", type: "number"},
            {name: "noiseLevel", label: "Уровень шума во время работы", type: "number"},
            {name: "noiseLevelIdle", label: "Уровень шума в простое", type: "number"}
        ]
    },
    {
        title: "Энергопотребление",
        fields: [
            {name: "maxPowerConsumption", label: "Максимальное энергопотребление", type: "number"},
            {name: "standbyPowerConsumption", label: "Энергопотребление в режиме ожидания", type: "number"}
        ]
    },
    {
        title: "Надёжность",
        fields: [
            {name: "impactResistance", label: "Ударостойкость при работе", type: "number"},
            {name: "parkingCycles", label: "Число циклов позиционирования-парковки", type: "number"}
        ]
    },
    {
        title: "Температуры",
        fields: [
            {name: "maxWorkingTemp", label: "Максимальная рабочая температура", type: "number"}
        ]
    },
    {
        title: "Габариты и вес",
        fields: [
            {name: "width", label: "Ширина", type: "number"},
            {name: "length", label: "Длина", type: "number"},
            {name: "thickness", label: "Толщина", type: "number"},
            {name: "weight", label: "Вес", type: "number"}
        ]
    }
];