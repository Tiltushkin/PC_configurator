import type {Section} from "../../../shared/types/types.ts";

export const airCoolingSections: Section[] = [
    {
        title: "Основное",
        fields: [
            {name: "price", label: "Цена", type: "number"},
            {name: "warranty", label: "Гарантия", type: "number"},
            {name: "model", label: "Модель", type: "text"},
            {name: "manufacturerCode", label: "Код производителя", type: "text"},
            {name: "sockets", label: "Сокеты", type: "string[]"},
            {name: "tDP", label: "Рассеиваемая мощность, TDP", type: "number"},
            {name: "constructionType", label: "Тип конструкции", type: "text"}
        ]
    },
    {
        title: "Материалы",
        fields: [
            {name: "baseMaterial", label: "Материал основания", type: "text"},
            {name: "radiatorMaterial", label: "Материал радиатора", type: "text"},
            {name: "heatPipes", label: "Количество тепловых трубок", type: "number"},
            {name: "heatPipeDiameter", label: "Диаметр тепловых трубок ", type: "number"},
            {name: "nickelPlatedCoating", label: "Никелированное покрытие", type: "text"}
        ]
    },
    {
        title: "Цвета/внешний вид",
        fields: [
            {name: "radiatorColor", label: "Цвет радиатора", type: "text"},
            {name: "fanColor", label: "Цвет вентилятора", type: "text"}
        ]
    },
    {
        title: "Вентиляторы",
        fields: [
            {name: "fansIncluded", label: "Количество вентиляторов в комплекте", type: "number"},
            {name: "maxFans", label: "Максимальное число устанавливаемых вентиляторов", type: "number"},
            {name: "fansSize", label: "Размеры комплектных вентиляторов", type: "text"},
            {name: "fanConnector", label: "Разъем для подключения вентиляторов", type: "text"},
            {name: "minRotationSpeed", label: "Минимальная скорость вращения", type: "number"},
            {name: "maxRotationSpeed", label: "Максимальная скорость вращения", type: "number"},
            {name: "rotationAdjustment", label: "Регулировка скорости вращения", type: "text"}
        ]
    },
    {
        title: "Производительность",
        fields: [
            {name: "airFlow", label: "Максимальный воздушный поток", type: "number"},
            {name: "maxStaticPressure", label: "Максимальное статическое давление", type: "number"},
            {name: "maxNoiseLevel", label: "Максимальный уровень шума", type: "number"}
        ]
    },
    {
        title: "Электрика",
        fields: [
            {name: "ratedCurrent", label: "Номинальный ток", type: "number"},
            {name: "ratedVoltage", label: "Номинальное напряжение", type: "number"},
            {name: "bearingType", label: "Тип подшипника", type: "text"}
        ]
    },
    {
        title: "Габариты и вес",
        fields: [
            {name: "height", label: "Высота", type: "number"},
            {name: "length", label: "Длина", type: "number"},
            {name: "width", label: "Ширина", type: "number"},
            {name: "weight", label: "Вес", type: "number"}
        ]
    },
    {
        title: "Дополнительно",
        fields: [
            {name: "additionally", label: "Дополнительно", type: "string[]"}
        ]
    }
];