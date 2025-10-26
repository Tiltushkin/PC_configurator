import type {Section} from "../../../shared/types/types.ts";

export const caseSections: Section[] = [
    {
        title: "Основное",
        fields: [
            {name: "price", label: "Price", type: "number"},
            {name: "warranty", label: "Warranty", type: "number"},
            {name: "model", label: "Model", type: "text"},
            {name: "manufacturerCode", label: "ManufacturerCode", type: "text"},
            {name: "mainColor", label: "MainColor", type: "text"},
            {name: "motherBoardOrientation", label: "MotherBoardOrientation", type: "text"},
            {name: "bodySize", label: "BodySize", type: "text"},
            {name: "powerSupplyPlacement", label: "PowerSupplyPlacement", type: "text"}
        ]
    },
    {
        title: "Габариты и вес",
        fields: [
            {name: "length", label: "Length", type: "number"},
            {name: "width", label: "Width", type: "number"},
            {name: "height", label: "Height", type: "number"},
            {name: "weight", label: "Weight", type: "number"}
        ]
    },
    {
        title: "Материалы и цвета",
        fields: [
            {name: "bodyMaterial", label: "BodyMaterial", type: "string[]"},
            {name: "windowMaterial", label: "WindowMaterial", type: "text"},
            {name: "frontPanelMaterial", label: "FrontPanelMaterial", type: "string[]"},
            {name: "backLightColor", label: "BackLightColor", type: "text"}
        ]
    },
    {
        title: "Подсветка",
        fields: [
            {name: "backLightType", label: "BackLightType", type: "text"},
            {name: "backLightSource", label: "BackLightSource", type: "text"},
            {name: "backLightConnector", label: "BackLightConnector", type: "text"},
            {name: "backLightControl", label: "BackLightControl", type: "string[]"}
        ]
    },
    {
        title: "Совместимость",
        fields: [
            {name: "compatibleBoards", label: "CompatibleBoards", type: "string[]"},
            {name: "compatiblePowerSupply", label: "CompatiblePowerSupply", type: "string[]"},
            {name: "powerSupplyLength", label: "PowerSupplyLength", type: "number"},
            {name: "horizontalExpansionSlots", label: "HorizontalExpansionSlots", type: "number"},
            {name: "gPULength", label: "GPULength", type: "number"},
            {name: "maxCoolerHeight", label: "MaxCoolerHeight", type: "number"}
        ]
    },
    {
        title: "Отсеки",
        fields: [
            {name: "drives2_5", label: "Drives2_5", type: "number"},
            {name: "internalCompartments3_5", label: "InternalCompartments3_5", type: "number"},
            {name: "externalCompartments3_5", label: "ExternalCompartments3_5", type: "number"},
            {name: "drives5_25", label: "Drives5_25", type: "number"}
        ]
    },
    {
        title: "Охлаждение (вентиляторы)",
        fields: [
            {name: "includedFans", label: "IncludedFans", type: "string[]"},
            {name: "rearFanSupport", label: "RearFanSupport", type: "string[]"},
            {name: "topFansSupport", label: "TopFansSupport", type: "string[]"},
            {name: "bottomFansSupport", label: "BottomFansSupport", type: "string[]"},
            {name: "sideFansSupport", label: "SideFansSupport", type: "string[]"}
        ]
    },
    {
        title: "СЖО",
        fields: [
            {name: "sZOSupport", label: "SZOSupport", type: "bool"},
            {name: "sZOUpperMountingDimension", label: "SZOUpperMountingDimension", type: "string[]"},
            {name: "sZORearMountingDimension", label: "SZORearMountingDimension", type: "string[]"},
            {name: "sZOSideMountingDimension", label: "SZOSideMountingDimension", type: "string[]"}
        ]
    },
    {
        title: "Прочее",
        fields: [
            {name: "sideWallWindow", label: "SideWallWindow", type: "bool"}
        ]
    }
];