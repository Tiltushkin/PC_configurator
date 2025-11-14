import type {Section} from "../../../shared/types/types.ts";

export const hdd2_5Sections: Section[] = [
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
            {name: "recordingTechnology", label: "Технология записи", type: "text"}
        ]
    },
    {
        title: "Производительность",
        fields: [
            {name: "bufferSize", label: "Объем буфера", type: "number"},
            {name: "spindleRotationSpeed", label: "Скорость вращения шпинделя", type: "number"},
            {name: "aVGAccessReading", label: "Среднее время доступа, чтение", type: "number"}
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
            {name: "minWorkingTemp", label: "Минимальная рабочая температура", type: "number"},
            {name: "maxWorkingTemp", label: "Максимальная рабочая температура", type: "number"}
        ]
    },
    {
        title: "Габариты и вес",
        fields: [
            {name: "width", label: "Ширина", type: "number"},
            {name: "length", label: "Длина", type: "number"},
            {name: "standardThickness", label: "Стандартная толщина", type: "number"},
            {name: "weight", label: "Вес", type: "number"}
        ]
    }
];