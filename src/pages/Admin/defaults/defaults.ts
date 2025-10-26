import type {Tab} from "../../../shared/types/types.ts";

export const defaults: Record<Tab, any> = {
    cpu: {
        price: 0, images: [], warranty: 12, model: "", socket: "", manufacturerCode: "",
        releaseYear: new Date().getFullYear(), coolingSystem: false, thermalInterface: false,
        totalCores: 0, productiveCores: 0, energyEfficientCores: 0, threads: 0,
        cacheL1: 0, cacheL2: 0, cacheL3: 0, technicalProcess: "", core: "",
        basicFrequency: 0, turboFrequency: 0, energyEfficientBasicFrequency: 0, energyEfficientTurboFrequency: 0,
        freeMultiplier: false, memoryTypes: [], maxMemory: 0, canals: 2, memoryFrequency: [], ECCMode: false,
        TDP: 0, basicHeatProduction: 0, maxTemp: 0, graphicalCore: false, PCIExpress: "", PCIExpressLines: 0,
        virtualization: false, additionally: []
    },
    gpu: {
        price: 0, images: [], warranty: 12, model: "", manufacturerCode: "", color: "",
        canMining: false, LHR: false, graphicalProcessor: "", microArch: "", techProcess: 0,
        basicFrequency: 0, turboFrequency: 0, ALU: 0, textureBlocks: 0, rasterizationBlocks: 0,
        rayTracing: false, rtCores: 0, tensorCores: 0, videoRAM: 0, memoryType: "", memoryBusWidth: 0,
        memoryBandwidth: 0, memoryFrequency: 0, videoConnectors: [], HDMIVersion: "", DisplayPortVersion: "",
        maximumMonitors: 0, maximumResolution: "", connectionInterface: "", connectionFormFactor: "",
        PCIExpressLines: 0, powerConnections: "", recommendedPowerSupply: 0, powerConsumption: 0,
        coolingType: "", numberOfFans: "", liquidCoolingRadiator: false, backlight: false, RGBSync: false,
        LCD: false, biosToggler: false, completion: [], additionally: [], LowProfile: false, expansionSlots: 0,
        width: 0, height: 0, thickness: 0, weight: 0
    },
    mb: {
        price: 0, images: [], warranty: 12, model: "", series: "", color: "", releaseYear: new Date().getFullYear(),
        formFactor: [], width: 0, height: 0, socket: "", cheapSet: "", memoryTypes: [], maxMemory: 0,
        memoryFormFactor: [], memorySlots: 0, memoryCanals: 2, maxMemoryFrequency: 0, maxMemoryBoostFrequency: [],
        PCIExpress: "", PCISlots: [], SLI: false, CardsInSLI: 0, PCIEx1Slots: 0, NVMeSupport: false,
        DiskPCIExpress: "", M2Slots: 0, M2ConnectorsPCIeProcessor: [], M2ConnectorsPCIeCheapSet: [],
        SATAPorts: 0, SATARAID: [], NVMeRAID: [], OutUSBTypeA: [], OutUSBTypeC: [], InUSBTypeA: [], InUSBTypeC: [],
        VideoOutputs: [], NetworkPorts: 0, ProcessorCoolingConnectors: [], SZOConnectors: 0, CaseFansConnectors4Pin: 0,
        CaseFansConnectors3Pin: 0, VDGConnectors: 0, VGRBConnectors: 0, M2Wireless: false, RS232: false, LPT: false,
        MainPowerConnector: "", ProcessorPowerConnector: "", PowerPhases: "", PassiveCooling: []
    },
    psu: {
        price: 0, images: [], warranty: 12, model: "", power: 0, formFactor: "", color: "", detachableCables: "",
        cablesColor: "", backlightType: "", mainPowerConnector: [], processorPowerConnectors: [], floppy4PinConnector: false,
        videoCardPowerConnectors: [], sataConnectors: 0, molexConnectors: 0, mainPowerCableLength: 0,
        processorPowerCableLength: 0, pciePowerCableLength: 0, sataPowerCableLength: 0, molexPowerCableLength: 0,
        powerV12Line: 0, voltageV12Line: 0, voltageV3_3Line: 0, voltageV5Line: 0, standbyPowerSupply: 0,
        voltageMinusV12: 0, inputVoltageRange: "", coolingType: "", fanDimensions: "", certificate: "", PFC: "",
        complianceWithStandards: [], protectionTechnologies: [], width: 0, height: 0, thickness: 0
    },
    case: {
        price: 0, images: [], warranty: 12, model: "", manufacturerCode: "", bodySize: "", motherBoardOrientation: "",
        length: 0, width: 0, height: 0, weight: 0, mainColor: "", bodyMaterial: [], sideWallWindow: false,
        windowMaterial: "", frontPanelMaterial: [], backLightType: "", backLightColor: "", backLightSource: "", backLightConnector: "",
        backLightControl: [], compatibleBoards: [], compatiblePowerSupply: [], powerSupplyPlacement: "", powerSupplyLength: 0,
        horizontalExpansionSlots: 0, gPULength: 0, maxCoolerHeight: 0, drives2_5: 0, internalCompartments3_5: 0, externalCompartments3_5: 0,
        drives5_25: 0, includedFans: [], rearFanSupport: [], topFansSupport: [], bottomFansSupport: [], sideFansSupport: [],
        sZOSupport: false, sZOUpperMountingDimension: [], sZORearMountingDimension: [], sZOSideMountingDimension: []
    },
    szo: {
        price: 0, images: [], warranty: 12, model: "", mainColor: "", backLightType: "", backLightSource: "",
        backLightConnector: "", lCD: false, purpose: "", waterBlockMaterial: "", waterBlockSize: "", sockets: [],
        radiatorMountingDimensions: "", tDP: 0, radiatorLength: 0, radiatorWidth: 0, radiatorThickness: 0, radiatorMaterial: "",
        includedFans: 0, fanDimensions: "", fanBearingType: "", minRotationSpeed: 0, maxRotationSpeed: 0,
        fanSpeedAdjustment: "", maxNoiseLevel: 0, maxAirFlow: 0, maxStaticPressure: 0, fanConnectionSocket: "",
        pumpNoiseLevel: 0, pumpRotationSpeed: 0, pumpConnectionSocket: "", tubeLength: 0
    },
    aircooling: {
        price: 0, images: [], warranty: 12, model: "", manufacturerCode: "", sockets: [], tDP: 0, constructionType: "",
        baseMaterial: "", radiatorMaterial: "", heatPipes: 0, heatPipeDiameter: 0, nickelPlatedCoating: "", radiatorColor: "",
        fansIncluded: 0, maxFans: 0, fansSize: "", fanColor: "", fanConnector: "", minRotationSpeed: 0, maxRotationSpeed: 0,
        rotationAdjustment: "", airFlow: 0, maxStaticPressure: 0, maxNoiseLevel: 0, ratedCurrent: 0, ratedVoltage: 0,
        bearingType: "", height: 0, length: 0, width: 0, weight: 0, additionally: []
    },
    memory: {
        price: 0, images: [], warranty: 12, model: "", manufacturerCode: "", memoryType: "", memoryModuleType: "",
        totalMemory: 0, oneModuleMemory: 0, totalModules: 0, registerMemory: false, eCCMemory: false, ranking: "",
        clockFrequency: 0, aMDExpo: [], intelXMP: [], cL: 0, tRCD: 0, tRP: 0, radiator: false, radiatorColor: "",
        boardElementBacklight: "", height: 0, lowProfile: false, voltage: 0, additionally: []
    },
    ssd: {
        price: 0, images: [], warranty: 12, model: "", manufacturerCode: "", diskCapacity: 0, formFactor: "",
        physInterface: "", m2ConnectorKey: "", nVMe: false, memoryStructure: "", dRAM: false, maxReadSpeed: 0,
        maxWriteSpeed: 0, tBW: 0, dWPD: 0, radiator: false, length: 0, width: 0, thickness: 0, weight: 0
    },
    hdd2_5: {
        price: 0, images: [], warranty: 12, model: "", manufacturerCode: "", diskCapacity: 0, bufferSize: 0,
        spindleRotationSpeed: 0, aVGAccessReading: 0, interface: "", interfaceBandwidth: 0, recordingTechnology: "",
        impactResistance: 0, parkingCycles: 0, minWorkingTemp: 0, maxWorkingTemp: 0, width: 0, length: 0,
        standardThickness: 0, weight: 0
    },
    hdd3_5: {
        price: 0, images: [], warranty: 12, model: "", manufacturerCode: "", diskCapacity: 0, cacheSize: 0,
        spindleRotationSpeed: 0, dataTransferRate: 0, interface: "", interfaceBandwidth: 0, rAIDOptimization: false,
        recordingTechnology: "", impactResistance: 0, noiseLevel: 0, noiseLevelIdle: 0, heliumFilled: false,
        parkingCycles: 0, maxPowerConsumption: 0, standbyPowerConsumption: 0, maxWorkingTemp: 0, width: 0,
        length: 0, thickness: 0, weight: 0
    }
};