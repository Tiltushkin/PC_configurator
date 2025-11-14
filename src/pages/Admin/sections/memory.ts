import type {Section} from "../../../shared/types/types.ts";

export const memorySections: Section[] = [
    {
        title: "Основное",
        fields: [
            {name: "price", label: "Цена", type: "number"},
            {name: "warranty", label: "Гарантия", type: "number"},
            {name: "model", label: "Модель", type: "text"},
            {name: "manufacturerCode", label: "Код производителя", type: "text"},
            {name: "memoryType", label: "Тип памяти", type: "text"},
            {name: "memoryModuleType", label: "Тип модуля памяти", type: "text"},
            {name: "ranking", label: "Ранговость", type: "text"}
        ]
    },
    {
        title: "Объём/модули",
        fields: [
            {name: "totalMemory", label: "Суммарный объем памяти всего комплекта", type: "number"},
            {name: "oneModuleMemory", label: "Объем одного модуля памяти", type: "number"},
            {name: "totalModules", label: "Количество модулей в комплекте", type: "number"}
        ]
    },
    {
        title: "Профили/тайминги",
        fields: [
            {name: "clockFrequency", label: "Тактовая частота", type: "number"},
            {name: "aMDExpo", label: "Профили AMD EXPO", type: "string[]"},
            {name: "intelXMP", label: "Профили Intel XMP", type: "string[]"},
            {name: "cL", label: "CAS Latency (CL)", type: "number"},
            {name: "tRCD", label: "RAS to CAS Delay (tRCD)", type: "number"},
            {name: "tRP", label: "Row Precharge Delay (tRP)", type: "number"}
        ]
    },
    {
        title: "Фичи/охлаждение",
        fields: [
            {name: "registerMemory", label: "Регистровая память", type: "bool"},
            {name: "eCCMemory", label: "ECC-память", type: "bool"},
            {name: "radiator", label: "Наличие радиатора", type: "bool"},
            {name: "radiatorColor", label: "Цвет радиатора", type: "text"},
            {name: "lowProfile", label: "Низкопрофильная (Low Profile)", type: "bool"},
            {name: "boardElementBacklight", label: "Подсветка элементов платы", type: "text"}
        ]
    },
    {
        title: "Габариты/электрика",
        fields: [
            {name: "height", label: "Высота", type: "number"},
            {name: "voltage", label: "Напряжение питания", type: "number"}
        ]
    },
    {
        title: "Дополнительно",
        fields: [
            {name: "additionally", label: "Особенности, дополнительно", type: "string[]"}
        ]
    }
];