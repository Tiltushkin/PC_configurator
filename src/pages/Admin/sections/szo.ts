import type {Section} from "../../../shared/types/types.ts";

export const szoSections: Section[] = [
    {
        title: "Основное",
        fields: [
            {name: "price", label: "Price", type: "number"},
            {name: "warranty", label: "Warranty", type: "number"},
            {name: "model", label: "Model", type: "text"},
            {name: "mainColor", label: "MainColor", type: "text"},
            {name: "backLightType", label: "BackLightType", type: "text"},
            {name: "backLightSource", label: "BackLightSource", type: "text"},
            {name: "backLightConnector", label: "BackLightConnector", type: "text"},
            {name: "lCD", label: "LCD", type: "bool"},
            {name: "purpose", label: "Purpose", type: "text"},
            {name: "sockets", label: "Sockets", type: "string[]"}
        ]
    },
    {
        title: "Водоблок",
        fields: [
            {name: "waterBlockMaterial", label: "WaterBlockMaterial", type: "text"},
            {name: "waterBlockSize", label: "WaterBlockSize", type: "text"}
        ]
    },
    {
        title: "Радиатор",
        fields: [
            {name: "radiatorMaterial", label: "RadiatorMaterial", type: "text"},
            {name: "radiatorMountingDimensions", label: "RadiatorMountingDimensions", type: "text"},
            {name: "radiatorLength", label: "RadiatorLength", type: "number"},
            {name: "radiatorWidth", label: "RadiatorWidth", type: "number"},
            {name: "radiatorThickness", label: "RadiatorThickness", type: "number"},
            {name: "tubeLength", label: "TubeLength", type: "number"}
        ]
    },
    {
        title: "Характеристики",
        fields: [
            {name: "tDP", label: "TDP", type: "number"}
        ]
    },
    {
        title: "Вентиляторы",
        fields: [
            {name: "includedFans", label: "IncludedFans", type: "number"},
            {name: "fanDimensions", label: "FanDimensions", type: "text"},
            {name: "fanBearingType", label: "FanBearingType", type: "text"},
            {name: "minRotationSpeed", label: "MinRotationSpeed", type: "number"},
            {name: "maxRotationSpeed", label: "MaxRotationSpeed", type: "number"},
            {name: "fanSpeedAdjustment", label: "FanSpeedAdjustment", type: "text"},
            {name: "maxNoiseLevel", label: "MaxNoiseLevel", type: "number"},
            {name: "maxAirFlow", label: "MaxAirFlow", type: "number"},
            {name: "maxStaticPressure", label: "MaxStaticPressure", type: "number"},
            {name: "fanConnectionSocket", label: "FanConnectionSocket", type: "text"}
        ]
    },
    {
        title: "Помпа",
        fields: [
            {name: "pumpNoiseLevel", label: "PumpNoiseLevel", type: "number"},
            {name: "pumpRotationSpeed", label: "PumpRotationSpeed", type: "number"},
            {name: "pumpConnectionSocket", label: "PumpConnectionSocket", type: "text"}
        ]
    }
];