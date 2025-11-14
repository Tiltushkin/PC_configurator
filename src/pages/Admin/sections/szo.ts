import type {Section} from "../../../shared/types/types.ts";

export const szoSections: Section[] = [
    {
        title: "Основное",
        fields: [
            {name: "price", label: "Цена", type: "number"},
            {name: "warranty", label: "Гарантия", type: "number"},
            {name: "model", label: "Модель", type: "text"},
            {name: "mainColor", label: "Основной цвет", type: "text"},
            {name: "backLightType", label: "Тип подсветки", type: "text"},
            {name: "backLightSource", label: "Источник подсветки", type: "text"},
            {name: "backLightConnector", label: "Разъем подключения подсветки", type: "text"},
            {name: "lCD", label: "LCD дисплей", type: "bool"},
            {name: "purpose", label: "Назначение", type: "text"},
            {name: "sockets", label: "Сокеты", type: "string[]"}
        ]
    },
    {
        title: "Водоблок",
        fields: [
            {name: "waterBlockMaterial", label: "Материал водоблока", type: "text"},
            {name: "waterBlockSize", label: "Размеры водоблока", type: "text"}
        ]
    },
    {
        title: "Радиатор",
        fields: [
            {name: "radiatorMaterial", label: "Материал радиатора", type: "text"},
            {name: "radiatorMountingDimensions", label: "Монтажный размер радиатора", type: "text"},
            {name: "radiatorLength", label: "Длина радиатора", type: "number"},
            {name: "radiatorWidth", label: "Ширина радиатора", type: "number"},
            {name: "radiatorThickness", label: "Толщина радиатора", type: "number"},
            {name: "tubeLength", label: "Длина трубок", type: "number"}
        ]
    },
    {
        title: "Характеристики",
        fields: [
            {name: "tDP", label: "Рассеиваемая мощность, TDP", type: "number"}
        ]
    },
    {
        title: "Вентиляторы",
        fields: [
            {name: "includedFans", label: "Количество вентиляторов в комплекте", type: "number"},
            {name: "fanDimensions", label: "Размеры вентиляторов", type: "text"},
            {name: "fanBearingType", label: "Тип подшипника вентилятора", type: "text"},
            {name: "minRotationSpeed", label: "Минимальная скорость вращения", type: "number"},
            {name: "maxRotationSpeed", label: "Максимальная скорость вращения", type: "number"},
            {name: "fanSpeedAdjustment", label: "Регулировка скорости вращения вентилятора", type: "text"},
            {name: "maxNoiseLevel", label: "Максимальный уровень шума", type: "number"},
            {name: "maxAirFlow", label: "Максимальный воздушный поток", type: "number"},
            {name: "maxStaticPressure", label: "Максимальное статическое давление", type: "number"},
            {name: "fanConnectionSocket", label: "Разъем подключения вентиляторов", type: "text"}
        ]
    },
    {
        title: "Помпа",
        fields: [
            {name: "pumpNoiseLevel", label: "Уровень шума помпы", type: "number"},
            {name: "pumpRotationSpeed", label: "Скорость вращения помпы", type: "number"},
            {name: "pumpConnectionSocket", label: "Разъем подключения помпы", type: "text"}
        ]
    }
];