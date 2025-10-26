import type {Section} from "../../../shared/types/types.ts";

export const airCoolingSections: Section[] = [
    {
        title: "Основное",
        fields: [
            {name: "price", label: "Price", type: "number"},
            {name: "warranty", label: "Warranty", type: "number"},
            {name: "model", label: "Model", type: "text"},
            {name: "manufacturerCode", label: "ManufacturerCode", type: "text"},
            {name: "sockets", label: "Sockets", type: "string[]"},
            {name: "tDP", label: "TDP", type: "number"},
            {name: "constructionType", label: "ConstructionType", type: "text"}
        ]
    },
    {
        title: "Материалы",
        fields: [
            {name: "baseMaterial", label: "BaseMaterial", type: "text"},
            {name: "radiatorMaterial", label: "RadiatorMaterial", type: "text"},
            {name: "heatPipes", label: "HeatPipes", type: "number"},
            {name: "heatPipeDiameter", label: "HeatPipeDiameter", type: "number"},
            {name: "nickelPlatedCoating", label: "NickelPlatedCoating", type: "text"}
        ]
    },
    {
        title: "Цвета/внешний вид",
        fields: [
            {name: "radiatorColor", label: "RadiatorColor", type: "text"},
            {name: "fanColor", label: "FanColor", type: "text"}
        ]
    },
    {
        title: "Вентиляторы",
        fields: [
            {name: "fansIncluded", label: "FansIncluded", type: "number"},
            {name: "maxFans", label: "MaxFans", type: "number"},
            {name: "fansSize", label: "FansSize", type: "text"},
            {name: "fanConnector", label: "FanConnector", type: "text"},
            {name: "minRotationSpeed", label: "MinRotationSpeed", type: "number"},
            {name: "maxRotationSpeed", label: "MaxRotationSpeed", type: "number"},
            {name: "rotationAdjustment", label: "RotationAdjustment", type: "text"}
        ]
    },
    {
        title: "Производительность",
        fields: [
            {name: "airFlow", label: "AirFlow", type: "number"},
            {name: "maxStaticPressure", label: "MaxStaticPressure", type: "number"},
            {name: "maxNoiseLevel", label: "MaxNoiseLevel", type: "number"}
        ]
    },
    {
        title: "Электрика",
        fields: [
            {name: "ratedCurrent", label: "RatedCurrent", type: "number"},
            {name: "ratedVoltage", label: "RatedVoltage", type: "number"},
            {name: "bearingType", label: "BearingType", type: "text"}
        ]
    },
    {
        title: "Габариты и вес",
        fields: [
            {name: "height", label: "Height", type: "number"},
            {name: "length", label: "Length", type: "number"},
            {name: "width", label: "Width", type: "number"},
            {name: "weight", label: "Weight", type: "number"}
        ]
    },
    {
        title: "Дополнительно",
        fields: [
            {name: "additionally", label: "Additionally", type: "string[]"}
        ]
    }
];