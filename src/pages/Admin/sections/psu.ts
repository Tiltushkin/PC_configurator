import type {Section} from "../../../shared/types/types.ts";

export const psuSections: Section[] = [
    {
        title: "Базовая информация",
        fields: [
            { name: "model", label: "Модель", type: "text" },
            { name: "price", label: "Цена", type: "number", step: 0.01 },
            { name: "warranty", label: "Гарантия (мес.)", type: "number" },
            { name: "power", label: "Мощность (Вт)", type: "number" },
            { name: "formFactor", label: "Форм-фактор", type: "text" },
            { name: "color", label: "Цвет", type: "text" },
            { name: "detachableCables", label: "Съемные кабели", type: "text" },
            { name: "cablesColor", label: "Цвет кабелей", type: "text" },
            { name: "backlightType", label: "Тип подсветки", type: "text" },
        ]
    },
    {
        title: "Коннекторы питания",
        fields: [
            { name: "mainPowerConnector", label: "Main Power (массив)", type: "string[]" },
            { name: "processorPowerConnectors", label: "CPU Power (массив)", type: "string[]" },
            { name: "floppy4PinConnector", label: "Floppy 4-pin", type: "bool" },
            { name: "videoCardPowerConnectors", label: "GPU Power (массив)", type: "string[]" },
        ]
    },
    {
        title: "Кабели и длины",
        fields: [
            { name: "sataConnectors", label: "SATA коннекторов", type: "number" },
            { name: "molexConnectors", label: "Molex коннекторов", type: "number" },
            { name: "mainPowerCableLength", label: "Длина Main (мм)", type: "number" },
            { name: "processorPowerCableLength", label: "Длина CPU (мм)", type: "number" },
            { name: "pciePowerCableLength", label: "Длина PCIe (мм)", type: "number" },
            { name: "sataPowerCableLength", label: "Длина SATA (мм)", type: "number" },
            { name: "molexPowerCableLength", label: "Длина Molex (мм)", type: "number" },
        ]
    },
    {
        title: "Электрика",
        fields: [
            { name: "powerV12Line", label: "Мощность +12V (Вт)", type: "number" },
            { name: "voltageV12Line", label: "Напряжение +12V (В)", type: "number" },
            { name: "voltageV3_3Line", label: "Напряжение +3.3V (В)", type: "number" },
            { name: "voltageV5Line", label: "Напряжение +5V (В)", type: "number" },
            { name: "standbyPowerSupply", label: "+5Vsb (Вт)", type: "number" },
            { name: "voltageMinusV12", label: "-12V (В)", type: "number" },
            { name: "inputVoltageRange", label: "Входное напряжение", type: "text" },
        ]
    },
    {
        title: "Охлаждение и сертификаты",
        fields: [
            { name: "coolingType", label: "Тип охлаждения", type: "text" },
            { name: "fanDimensions", label: "Габариты вентилятора", type: "text" },
            { name: "certificate", label: "Сертификат", type: "text" },
            { name: "PFC", label: "PFC", type: "text" },
            { name: "complianceWithStandards", label: "Соответствие стандартам", type: "string[]" },
            { name: "protectionTechnologies", label: "Технологии защиты", type: "string[]" },
        ]
    },
    {
        title: "Габариты",
        fields: [
            { name: "width", label: "Ширина (мм)", type: "number" },
            { name: "height", label: "Высота (мм)", type: "number" },
            { name: "thickness", label: "Толщина (мм)", type: "number" },
        ]
    },
];