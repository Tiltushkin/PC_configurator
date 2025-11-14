import type {Section} from "../../../shared/types/types.ts";

export const caseSections: Section[] = [
    {
        title: "Основное",
        fields: [
            {name: "price", label: "Цена", type: "number"},
            {name: "warranty", label: "Гарантия", type: "number"},
            {name: "model", label: "Модель", type: "text"},
            {name: "manufacturerCode", label: "Код производителя", type: "text"},
            {name: "mainColor", label: "Основной вет", type: "text"},
            {name: "motherBoardOrientation", label: "Ориентация материнской платы", type: "text"},
            {name: "bodySize", label: "Типоразмер корпуса", type: "text"},
            {name: "powerSupplyPlacement", label: "Размещение блока питания", type: "text"}
        ]
    },
    {
        title: "Габариты и вес",
        fields: [
            {name: "length", label: "Длина", type: "number"},
            {name: "width", label: "Ширина", type: "number"},
            {name: "height", label: "Высота", type: "number"},
            {name: "weight", label: "Вес", type: "number"}
        ]
    },
    {
        title: "Материалы и цвета",
        fields: [
            {name: "bodyMaterial", label: "Материал корпуса", type: "string[]"},
            {name: "windowMaterial", label: "Материал окна", type: "text"},
            {name: "frontPanelMaterial", label: "Материал фронтальной панели", type: "string[]"},
            {name: "backLightColor", label: "Цвет подсветки", type: "text"}
        ]
    },
    {
        title: "Подсветка",
        fields: [
            {name: "backLightType", label: "Тип подсветки", type: "text"},
            {name: "backLightSource", label: "Источник подсветки", type: "text"},
            {name: "backLightConnector", label: "Разъем подключения подсветки", type: "text"},
            {name: "backLightControl", label: "Способ управления подсветкой", type: "string[]"}
        ]
    },
    {
        title: "Совместимость",
        fields: [
            {name: "compatibleBoards", label: "Форм-фактор совместимых плат", type: "string[]"},
            {name: "compatiblePowerSupply", label: "Форм-фактор совместимых блоков питания", type: "string[]"},
            {name: "powerSupplyLength", label: "Максимальная длина блока питания", type: "number"},
            {name: "horizontalExpansionSlots", label: "Горизонтальные слоты расширения", type: "number"},
            {name: "gPULength", label: "Максимальная длина устанавливаемой видеокарты", type: "number"},
            {name: "maxCoolerHeight", label: "Максимальная высота процессорного кулера", type: "number"}
        ]
    },
    {
        title: "Отсеки",
        fields: [
            {name: "drives2_5", label: "Количество отсеков 2.5\" накопителей", type: "number"},
            {name: "internalCompartments3_5", label: "Число внутренних отсеков 3.5\"", type: "number"},
            {name: "externalCompartments3_5", label: "Число внешних отсеков 3.5\"", type: "number"},
            {name: "drives5_25", label: "Число отсеков 5.25\"", type: "number"}
        ]
    },
    {
        title: "Охлаждение (вентиляторы)",
        fields: [
            {name: "includedFans", label: "Вентиляторы в комплекте", type: "string[]"},
            {name: "rearFanSupport", label: "Поддержка тыловых вентиляторов", type: "string[]"},
            {name: "topFansSupport", label: "Поддержка верхних вентиляторов", type: "string[]"},
            {name: "bottomFansSupport", label: "Поддержка нижних вентиляторов", type: "string[]"},
            {name: "sideFansSupport", label: "Поддержка фронтальных вентиляторов", type: "string[]"}
        ]
    },
    {
        title: "СЖО",
        fields: [
            {name: "sZOSupport", label: "Возможность установки системы жидкостного охлаждения", type: "bool"},
            {name: "sZOUpperMountingDimension", label: "Верхний монтажный размер радиатора СЖО", type: "string[]"},
            {name: "sZORearMountingDimension", label: "Тыловой монтажный размер радиатора СЖО", type: "string[]"},
            {name: "sZOSideMountingDimension", label: "Боковой монтажный размер радиатора СЖО", type: "string[]"}
        ]
    },
    {
        title: "Прочее",
        fields: [
            {name: "sideWallWindow", label: "Боковое окно", type: "bool"}
        ]
    }
];