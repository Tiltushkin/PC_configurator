import type {Section} from "../../../shared/types/types.ts";

export const ssdSections: Section[] = [
    {
        title: "Основное",
        fields: [
            {name: "price", label: "Цена", type: "number"},
            {name: "warranty", label: "Гарантия", type: "number"},
            {name: "model", label: "Модель", type: "text"},
            {name: "manufacturerCode", label: "Код производителя", type: "text"},
            {name: "diskCapacity", label: "Объем накопителя", type: "number"},
            {name: "formFactor", label: "Форм-фактор", type: "text"},
            {name: "physInterface", label: "Физический интерфейс", type: "text"},
            {name: "m2ConnectorKey", label: "Ключ M.2 разъема", type: "text"},
            {name: "nVMe", label: "NVMe", type: "bool"},
            {name: "memoryStructure", label: "Структура памяти", type: "text"},
            {name: "dRAM", label: "DRAM буфер", type: "bool"}
        ]
    },
    {
        title: "Производительность/ресурс",
        fields: [
            {name: "maxReadSpeed", label: "Максимальная скорость последовательного чтения", type: "number"},
            {name: "maxWriteSpeed", label: "Максимальная скорость последовательной записи", type: "number"},
            {name: "tBW", label: "Максимальный ресурс записи (TBW)", type: "number"},
            {name: "dWPD", label: "DWPD", type: "number"}
        ]
    },
    {
        title: "Габариты/охлаждение",
        fields: [
            {name: "radiator", label: "Радиатор в комплекте", type: "bool"},
            {name: "length", label: "Длина", type: "number"},
            {name: "width", label: "Ширина", type: "number"},
            {name: "thickness", label: "Толщина", type: "number"},
            {name: "weight", label: "Вес", type: "number"}
        ]
    }
];