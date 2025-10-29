export interface BASE {
    Id: string;
    Price: number;
    Images: string[];
    Warranty: number;
    Model: string;
}

export interface CPU extends BASE {
    Socket: string;
    ManufacturerCode: string;
    ReleaseYear: number;
    CoolingSystem: boolean;
    ThermalInterface: boolean;
    TotalCores: number;
    ProductiveCores: number;
    EnergyEfficientCores: number;
    Threads: number;
    CacheL1: number;
    CacheL2: number;
    CacheL3: number;
    TechnicalProcess: string;
    Core: string;
    BasicFrequency: number;
    TurboFrequency: number;
    EnergyEfficientBasicFrequency: number;
    EnergyEfficientTurboFrequency: number;
    FreeMultiplier: boolean;
    MemoryTypes: string[];
    MaxMemory: number;
    Canals: number;
    MemoryFrequency: string[];
    ECCMode: boolean;
    TDP: number;
    BasicHeatProduction: number;
    MaxTemp: number;
    GraphicalCore: boolean;
    PCIExpress: string;
    PCIExpressLines: number;
    Virtualization: boolean;
    Additionally: string[];
}

export interface GPU extends BASE {
    Type: 'GPU';
    ManufacturerCode: string;
    Color: string;
    CanMining: boolean;
    LHR: boolean;
    GraphicalProcessor: string;
    MicroArch: string;
    TechProcess: number;
    BasicFrequency: number;
    TurboFrequency: number;
    ALU: number;
    TextureBlocks: number;
    RasterizationBlocks: number;
    RayTracing: boolean;
    RtCores: number;
    TensorCores: number;
    VideoRAM: number;
    MemoryType: string;
    MemoryBusWidth: number;
    MemoryBandwidth: number;
    MemoryFrequency: number;
    VideoConnectors: string[];
    HDMIVersion: string;
    DisplayPortVersion: string;
    MaximumMonitors: number;
    MaximumResolution: string;
    ConnectionInterface: string;
    ConnectionFormFactor: string;
    PCIExpressLines: number;
    PowerConnections: string;
    RecommendedPowerSupply: number;
    PowerConsumption: number;
    CoolingType: string;
    NumberOfFans: string;
    LiquidCoolingRadiator: boolean;
    Backlight: boolean;
    RGBSync: boolean;
    LCD: boolean;
    BiosToggler: boolean;
    Completion: string[];
    Additionally: string[];
    LowProfile: boolean;
    ExpansionSlots: number;
    Width: number;
    Height: number;
    Thickness: number;
    Weight: number;
}

export interface MB extends BASE {
    Series: string;
    Color: string;
    ReleaseYear: number;
    FormFactor: string[];
    Width: number;
    Height: number;
    Socket: string;
    CheapSet: string;
    MemoryTypes: string[];
    MaxMemory: number;
    MemoryFormFactor: string[];
    MemorySlots: number;
    MemoryCanals: number;
    MaxMemoryFrequency: number;
    MaxMemoryBoostFrequency: number[];
    PCIExpress: string;
    PCISlots: string[];
    SLI: boolean;
    CardsInSLI: number;
    PCIEx1Slots: number;
    NVMeSupport: boolean;
    DiskPCIExpress: string;
    M2Slots: number;
    M2ConnectorsPCIeProcessor: string[];
    M2ConnectorsPCIeCheapSet: string[];
    SATAPorts: number;
    SATARAID: string[];
    NVMeRAID: string[];
    OutUSBTypeA: string[];
    OutUSBTypeC: string[];
    InUSBTypeA: string[];
    InUSBTypeC: string[];
    VideoOutputs: string[];
    NetworkPorts: number;
    ProcessorCoolingConnectors: string[];
    SZOConnectors: number;
    CaseFansConnectors4Pin: number;
    CaseFansConnectors3Pin: number;
    VDGConnectors: number;
    VGRBConnectors: number;
    M2Wireless: boolean;
    RS232: boolean;
    LPT: boolean;
    MainPowerConnector: string;
    ProcessorPowerConnector: string;
    PowerPhases: string;
    PassiveCooling: string[];
}

export interface PSU extends BASE {
    Power: number;
    FormFactor: string;
    Color: string;
    DetachableCables: string;
    CablesColor: string;
    BacklightType: string;
    MainPowerConnector: string[];
    ProcessorPowerConnectors: string[];
    Floppy4PinConnector: boolean;
    VideoCardPowerConnectors: string[];
    SATAConnectors: number;
    MolexConnectors: number;
    MainPowerCableLength: number;
    ProcessorPowerCableLength: number;
    PCIEPowerCableLength: number;
    SATAPowerCableLength: number;
    MolexPowerCableLength: number;
    PowerV12Line: number;
    VoltageV12Line: number;
    VoltageV3_3Line: number;
    VoltageV5Line: number;
    StandbyPowerSupply: number;
    VoltageMinusV12: number;
    InputVoltageRange: string;
    CoolingType: string;
    FanDimensions: string;
    Certificate: string;
    PFC: string;
    ComplianceWithStandards: string[];
    ProtectionTechnologies: string[];
    Width: number;
    Height: number;
    Thickness: number;
}

export interface CASE extends BASE {
    ManufacturerCode: string;
    BodySize: string;
    MotherBoardOrientation: string;
    Length: number;
    Width: number;
    Height: number;
    Weight: number;
    MainColor: string;
    BodyMaterial: string[];
    SideWallWindow: boolean;
    WindowMaterial: string;
    FrontPanelMaterial: string[];
    BackLightType: string;
    BackLightColor: string;
    BackLightSource: string;
    BackLightConnector: string;
    BackLightControl: string[];
    CompatibleBoards: string[];
    CompatiblePowerSupply: string[];
    PowerSupplyPlacement: string;
    PowerSupplyLength: number;
    HorizontalExpansionSlots: number;
    GPULength: number;
    MaxCoolerHeight: number;
    Drives2_5: number;
    InternalCompartments3_5: number;
    ExternalCompartments3_5: number;
    Drives5_25: number;
    IncludedFans: string[];
    RearFanSupport: string[];
    TopFansSupport: string[];
    BottomFansSupport: string[];
    SideFansSupport: string[];
    SZOSupport: boolean;
    SZOUpperMountingDimension: string[];
    SZORearMountingDimension: string[];
    SZOSideMountingDimension: string[];
}

export interface SZO extends BASE {
    MainColor: string;
    BackLightType: string;
    BackLightSource: string;
    BackLightConnector: string;
    LCD: boolean;
    Purpose: string;
    WaterBlockMaterial: string;
    WaterBlockSize: string;
    Sockets: string[];
    RadiatorMountingDimensions: string;
    TDP: number;
    RadiatorLength: number;
    RadiatorWidth: number;
    RadiatorThickness: number;
    RadiatorMaterial: string;
    IncludedFans: number;
    FanDimensions: string;
    FanBearingType: string;
    MinRotationSpeed: number;
    MaxRotationSpeed: number;
    FanSpeedAdjustment: string;
    MaxNoiseLevel: number;
    MaxAirFlow: number;
    MaxStaticPressure: number;
    FanConnectionSocket: string;
    PumpNoiseLevel: number;
    PumpRotationSpeed: number;
    PumpConnectionSocket: string;
    TubeLength: number;
}

export interface AirCooling extends BASE {
    ManufacturerCode: string;
    Sockets: string[];
    TDP: number;
    ConstructionType: string;
    BaseMaterial: string;
    RadiatorMaterial: string;
    HeatPipes: number;
    HeatPipeDiameter: number;
    NickelPlatedCoating: string;
    RadiatorColor: string;
    FansIncluded: number;
    MaxFans: number;
    FansSize: string;
    FanColor: string;
    FanConnector: string;
    MinRotationSpeed: number;
    MaxRotationSpeed: number;
    RotationAdjustment: string;
    AirFlow: number;
    MaxStaticPressure: number;
    MaxNoiseLevel: number;
    RatedCurrent: number;
    RatedVoltage: number;
    BearingType: string;
    Height: number;
    Length: number;
    Width: number;
    Weight: number;
    Additionally: string[];
}

export interface Memory extends BASE {
    ManufacturerCode: string;
    MemoryType: string;
    MemoryModuleType: string;
    TotalMemory: number;
    OneModuleMemory: number;
    TotalModules: number;
    RegisterMemory: boolean;
    ECCMemory: boolean;
    Ranking: string;
    ClockFrequency: number;
    AMDExpo: string[];
    IntelXMP: string[];
    CL: number;
    TRCD: number;
    TRP: number;
    Radiator: boolean;
    RadiatorColor: string;
    BoardElementBacklight: string;
    Height: number;
    LowProfile: boolean;
    Voltage: number;
    Additionally: string[];
}

export interface SSD extends BASE {
    ManufacturerCode: string;
    DiskCapacity: number;
    FormFactor: string;
    PhysInterface: string;
    M2ConnectorKey: string;
    NVMe: boolean;
    MemoryStructure: string;
    DRAM: boolean;
    MaxReadSpeed: number;
    MaxWriteSpeed: number;
    TBW: number;
    DWPD: number;
    Radiator: boolean;
    Length: number;
    Width: number;
    Thickness: number;
    Weight: number;
}

export interface HDD2_5 extends BASE {
    ManufacturerCode: string;
    DiskCapacity: number;
    BufferSize: number;
    SpindleRotationSpeed: number;
    AVGAccessReading: number;
    Interface: string;
    InterfaceBandwidth: number;
    RecordingTechnology: string;
    ImpactResistance: number;
    ParkingCycles: number;
    MinWorkingTemp: number;
    MaxWorkingTemp: number;
    Width: number;
    Length: number;
    StandardThickness: number;
    Weight: number;
}

export interface HDD3_5 extends BASE {
    ManufacturerCode: string;
    DiskCapacity: number;
    CacheSize: number;
    SpindleRotationSpeed: number;
    DataTransferRate: number;
    Interface: string;
    InterfaceBandwidth: number;
    RAIDOptimization: boolean;
    RecordingTechnology: string;
    ImpactResistance: number;
    NoiseLevel: number;
    NoiseLevelIdle: number;
    HeliumFilled: boolean;
    ParkingCycles: number;
    MaxPowerConsumption: number;
    StandbyPowerConsumption: number;
    MaxWorkingTemp: number;
    Width: number;
    Length: number;
    Thickness: number;
    Weight: number;
}

export interface build {
    name: string;
    description?: string;
    cpuId?: string;
    gpuId?: string;
    mbId?: string;
    psuId?: string;
    caseId?: string;
    coolingId?: string;
    memoryId?: string;
    ssdIds?: string[];
    hddIds?: string[];
    isPublic: boolean;
}

export type Tab = "cpu" | "gpu" | "mb" | "psu" | "case" | "szo" | "aircooling" | "memory" | "ssd" | "hdd2_5" | "hdd3_5";
export type FieldType = "text" | "number" | "bool" | "string[]" | "number[]" | "json";

export type Field = {
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    step?: number;
};

export type Section = { title: string; fields: Field[] };
export type WithMaybeId<T> = T & { Id?: string; ManufacturerCode?: string };
export type SlotType = | "cpu" | "gpu" | "mb" | "psu" | "case" | "cooling" | "memory" | "storage-ssd" | "storage-hdd2_5" | "storage-hdd3_5";

export type allComponents = CPU | GPU | MB | PSU | CASE | SZO | AirCooling | Memory | SSD | HDD2_5 | HDD3_5;
export type HDD = HDD2_5 | HDD3_5;
export type COOLING = SZO | AirCooling;

export type StorageKind = "ssd" | "hdd2_5" | "hdd3_5";
export type StorageItem = { kind: StorageKind; id: string; qty: number };
export type BuildEx = build & { storages?: StorageItem[] };

export type CompMaps = {
    cpu: Map<string, CPU>;
    gpu: Map<string, GPU>;
    mb: Map<string, MB>;
    psu: Map<string, PSU>;
    case: Map<string, CASE>;
    cooling: Map<string, COOLING>;
    memory: Map<string, Memory>;
    ssd: Map<string, SSD>;
    hdd2_5: Map<string, HDD2_5>;
    hdd3_5: Map<string, HDD3_5>;
};

export interface UserSummary {
    id: string;
    login: string;
    userName: string;
    isAdmin: boolean;
    avatarUrl?: string | null;
    createdAt: string;
}

export type ProfileResponse = UserSummary;
export interface AuthResponse { token: string; user: UserSummary; }

export interface PagedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

export interface ComponentsAllResponse {
    cpus?: PagedResult<CPU>;
    gpus?: PagedResult<GPU>;
    mbs?: PagedResult<MB>;
    psus?: PagedResult<PSU>;
    cases?: PagedResult<CASE>;
    szos?: PagedResult<SZO>;
    airCoolings?: PagedResult<AirCooling>;
    memories?: PagedResult<Memory>;
    ssds?: PagedResult<SSD>;
    hdd2_5?: PagedResult<HDD2_5>;
    hdd3_5?: PagedResult<HDD3_5>;
}

export interface BuildResponse {
    id: string;
    ownerId: string;
    ownerDisplayName: string;
    name: string;
    description?: string | null;
    cpuId?: string | null;
    gpuId?: string | null;
    mbId?: string | null;
    psuId?: string | null;
    caseId?: string | null;
    coolingId?: string | null;
    memoryId?: string | null;
    ssdIds?: string[] | null;
    hddIds?: string[] | null;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ShareResponse {
    token: string;
    url: string;
    expiresAt?: string | null;
    expiresAtUtc?: string | null;
}

export type BuildSavePayload = {
  name?: string;
  description?: string | null;
  cpuId?: string | null;
  gpuId?: string | null;
  mbId?: string | null;
  psuId?: string | null;
  caseId?: string | null;
  coolingId?: string | null;
  memoryId?: string | null;
  ssdIds?: string[] | null;
  hddIds?: string[] | null;
};

export interface CompatibilityComponents {
    CPU?: WithMaybeId<CPU> | null;
    GPU?: WithMaybeId<GPU> | null;
    MB?: WithMaybeId<MB> | null;
    PSU?: WithMaybeId<PSU> | null;
    CASE?: WithMaybeId<CASE> | null;
    cooling?: WithMaybeId<COOLING> | null;
    memory?: WithMaybeId<Memory> | null;
}

export interface altInfoProp {
    alt: string;
    altImage: string;
}