import bp from "../Build/BuildPage.module.scss";
import s from "./BuildViewPage.module.scss";
import MainLayout from "../../layouts/MainLayout";
import AnimatedBackground from "../../components/animations/AnimatedBackground.tsx";
import { Link, useNavigate } from "react-router-dom";
import utils from "../../shared/utils/utils";
import ChooseComponentOverlay from "../../components/ChooseComponentOverlay/ChooseComponentOverlay.tsx";
import useBuildView from "../../shared/hooks/useBuildView.ts";
import { checkCompatibility } from "../../shared/utils/compatibility.ts";

export default function BuildViewPage() {
    const navigate = useNavigate();

    const {
        isOwner, onDeleteBuild, buildState, loading, error, saving, totalPrice, maps, selected,
        openOverlay, clearSlot, resolvedStorages, decStorageQty, incStorageQty, removeStorageAt,
        addStorageRef, storagePickerOpen, setStoragePickerOpen, overlayOpen, overlaySlot,
        listBySlot, query, setQuery, onPick, closeOverlay, buildRaw
    } = useBuildView();

    const compatibility = checkCompatibility({
        CPU: selected.cpu, GPU: selected.gpu, MB: selected.mb, CASE: selected.case,
        PSU: selected.psu, cooling: selected.cooling, memory: selected.memory
    }, resolvedStorages);

    if (!buildRaw) return (
        <MainLayout>
            <AnimatedBackground />
            <div className={s.container}>
                <div className={s.notPublicContainer}>
                    <span className={s.notPublic}>Извините, но такой сборки не существует.</span>
                </div>
                <button className={s.backButton} type="button" onClick={() => navigate("/")}>← На главную</button>
            </div>
        </MainLayout>
    )

    if (!buildRaw?.isPublic && !isOwner) return (
        <MainLayout>
            <AnimatedBackground />
            <div className={s.container}>
                <div className={s.notPublicContainer}>
                    <span className={s.notPublic}>Извините, но эта сборка не является публичной.</span>
                </div>
                <button className={s.backButton} type="button" onClick={() => navigate("/")}>← На главную</button>
            </div>
        </MainLayout>
    )

    return (
        <MainLayout>
            <AnimatedBackground />

            <div className={s.wrap}>
                <div className={bp.actionsBar}>
                    {isOwner && <button className={bp.dangerBtn} onClick={onDeleteBuild} disabled={saving}>{saving ? "..." : "Удалить сборку"}</button>}
                    <Link to="/build" className={bp.ghostBtn}>Создать новую</Link>
                    <Link to="/profile" className={bp.ghostBtn}>Профиль</Link>
                    <div style={{marginLeft:"auto"}} className={bp.totalPrice}>Общая стоимость сборки: {totalPrice}₸</div>
                </div>

                <div className="card" style={{position:"relative", width:"fit-content", padding:15, left:"50%", transform:"translateX(-50%)", display:"flex", gap:15, alignItems:"center", justifyContent:"center", marginBottom: 20}}>
                    <h2 className="glow">{buildState?.name || "Название сборки"}</h2>
                </div>

                <span className={s.buildOwner}>Автор сборки: { buildRaw?.ownerDisplayName }</span>

                {loading && <div className="card" style={{marginTop:20, padding:20}}>Загрузка…</div>}
                {error && <div className={bp.error}>{error}</div>}

                {!loading && !error && buildState && maps && (
                    <div className={bp.configContainer}>
                        <div className={bp.buildContainer}>
                            <div className={bp.buildContainer__item} onClick={() => openOverlay("cpu")}>
                                <img
                                    src={utils.imgOf(selected.cpu?.Images, "/build/cpu.svg")}
                                    alt="CPU"
                                    style={selected.cpu?.Images ? { width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' } : { width: '48px', height: '48px' }}
                                />
                                <p className={bp.itemTitle}>
                                    {selected.cpu ? (
                                        <> {selected.cpu.Model} <br/><span>• {selected.cpu.Socket}, {selected.cpu.TotalCores} x {selected.cpu.BasicFrequency} ГГц, L2 - {selected.cpu.CacheL2} МБ, L3 - {selected.cpu.CacheL3} МБ, 2 x {selected.cpu.MemoryFrequency}</span></>
                                    ) : "Процессор"}
                                </p>
                                {buildState.cpuId && isOwner && (
                                    <div className={bp.subInfoContainer}>
                                        <button className={bp.clearBtn} onClick={(e)=>{e.stopPropagation(); clearSlot("cpu");}}><span>×</span></button>
                                        <span className={bp.itemPrice}>{selected.cpu?.Price?.toLocaleString?.()}₸</span>
                                    </div>
                                )}
                                {buildState.cpuId && !isOwner && <div className={bp.subInfoContainer}><span className={bp.itemPrice}>{selected.cpu?.Price?.toLocaleString?.()}₸</span></div>}
                            </div>

                            <div className={bp.buildContainer__item} onClick={() => openOverlay("mb")}>
                                <img src={utils.imgOf(selected.mb?.Images, "/build/motherboard.svg")} alt="MB" />
                                <p className={bp.itemTitle}>
                                    {selected.mb ? (
                                        <> {selected.mb.Model} <br/><span>• {selected.mb.Socket}, {selected.mb.CheapSet}, {selected.mb.MemorySlots}x{selected.mb.MemoryTypes}-{selected.mb.MaxMemoryFrequency}МГц, {selected.mb.PCISlots.join(", ")}, {selected.mb.FormFactor}</span></>
                                    ) : "Материнская плата"}
                                </p>
                                {buildState.mbId && isOwner && (
                                    <div className={bp.subInfoContainer}>
                                        <button className={bp.clearBtn} onClick={(e)=>{e.stopPropagation(); clearSlot("mb");}}><span>×</span></button>
                                        <span className={bp.itemPrice}>{selected.mb?.Price?.toLocaleString?.()}₸</span>
                                    </div>
                                )}
                                {buildState.mbId && !isOwner && <div className={bp.subInfoContainer}><span className={bp.itemPrice}>{selected.mb?.Price?.toLocaleString?.()}₸</span></div>}
                            </div>

                            <div className={bp.buildContainer__item} onClick={() => openOverlay("psu")}>
                                <img src={utils.imgOf(selected.psu?.Images, "/build/power_supply.svg")} alt="PSU" />
                                <p className={bp.itemTitle}>
                                    {selected.psu ? (
                                        <> {selected.psu.Model} <br/><span>• {selected.psu.Power}Вт, {selected.psu.Certificate ? `80+ ${selected.psu.Certificate}` : null}, {selected.psu.MainPowerConnector}, {selected.psu.ProcessorPowerConnectors} CPU</span></>
                                    ) : "Блок питания"}
                                </p>
                                {buildState.psuId && isOwner && (
                                    <div className={bp.subInfoContainer}>
                                        <button className={bp.clearBtn} onClick={(e)=>{e.stopPropagation(); clearSlot("psu");}}><span>×</span></button>
                                        <span className={bp.itemPrice}>{selected.psu?.Price?.toLocaleString?.()}₸</span>
                                    </div>
                                )}
                                {buildState.psuId && !isOwner && <div className={bp.subInfoContainer}><span className={bp.itemPrice}>{selected.psu?.Price?.toLocaleString?.()}₸</span></div>}
                            </div>

                            <div className={bp.buildContainer__item} onClick={() => openOverlay("case")}>
                                <img src={utils.imgOf(selected.case?.Images, "/build/pc_case.svg")} alt="CASE" />
                                <p className={bp.itemTitle}>
                                    {selected.case ? (
                                        <> {selected.case.Model} <br/><span>• {selected.case.BodySize}, {selected.case.CompatibleBoards.join(", ")}</span></>
                                    ) : "Корпус"}
                                </p>
                                {buildState.caseId && isOwner && (
                                    <div className={bp.subInfoContainer}>
                                        <button className={bp.clearBtn} onClick={(e)=>{e.stopPropagation(); clearSlot("case");}}><span>×</span></button>
                                        <span className={bp.itemPrice}>{selected.case?.Price?.toLocaleString?.()}₸</span>
                                    </div>
                                )}
                                {buildState.caseId && !isOwner && <div className={bp.subInfoContainer}><span className={bp.itemPrice}>{selected.case?.Price?.toLocaleString?.()}₸</span></div>}
                            </div>

                            <div className={bp.buildContainer__item} onClick={() => openOverlay("gpu")}>
                                <img src={utils.imgOf(selected.gpu?.Images, "/build/gpu.svg")} alt="GPU" />
                                <p className={bp.itemTitle}>
                                    {selected.gpu ? (
                                        <> {selected.gpu.Model} <br/><span>• {selected.gpu.ConnectionInterface}, {selected.gpu.VideoRAM} ГБ {selected.gpu.MemoryType}, {selected.gpu.MemoryBusWidth} бит, {selected.gpu.VideoConnectors.join(", ")}</span></>
                                    ) : "Видеокарта"}
                                </p>
                                {buildState.gpuId && isOwner && (
                                    <div className={bp.subInfoContainer}>
                                        <button className={bp.clearBtn} onClick={(e)=>{e.stopPropagation(); clearSlot("gpu");}}><span>×</span></button>
                                        <span className={bp.itemPrice}>{selected.gpu?.Price?.toLocaleString?.()}₸</span>
                                    </div>
                                )}
                                {buildState.gpuId && !isOwner && <div className={bp.subInfoContainer}><span className={bp.itemPrice}>{selected.gpu?.Price?.toLocaleString?.()}₸</span></div>}
                            </div>

                            <div className={bp.buildContainer__item} onClick={() => openOverlay("cooling")}>
                                <img src={utils.imgOf(selected.cooling?.Images, "/build/cooling.svg")} alt="Cooling" />
                                <p className={bp.itemTitle}>
                                    {selected.cooling ? (
                                        <>
                                            {utils.isSZO(selected.cooling) && (<>
                                                {selected.cooling.Model} <br/><span>• {selected.cooling.RadiatorMountingDimensions}, разъем помпы - {selected.cooling.PumpConnectionSocket}, радиатор - {selected.cooling.RadiatorMaterial}, TDP - {selected.cooling.TDP} Вт</span>
                                            </>)}
                                            {utils.isAirCooling(selected.cooling) && (<>
                                                {selected.cooling.Model} <br/><span>• основание - {selected.cooling.BaseMaterial}, {selected.cooling.MaxRotationSpeed} об/мин, {selected.cooling.MaxNoiseLevel} дБ, {selected.cooling.FanConnector}, {selected.cooling.TDP} Вт</span>
                                            </>)}
                                        </>
                                    ) : "Система охлаждения"}
                                </p>
                                {buildState.coolingId && isOwner && (
                                    <div className={bp.subInfoContainer}>
                                        <button className={bp.clearBtn} onClick={(e)=>{e.stopPropagation(); clearSlot("cooling");}}><span>×</span></button>
                                        <span className={bp.itemPrice}>{selected.cooling?.Price?.toLocaleString?.()}₸</span>
                                    </div>
                                )}
                                {buildState.coolingId && !isOwner && <div className={bp.subInfoContainer}><span className={bp.itemPrice}>{selected.cooling?.Price?.toLocaleString?.()}₸</span></div>}
                            </div>

                            <div className={bp.buildContainer__item} onClick={() => openOverlay("memory")}>
                                <img src={utils.imgOf(selected.memory?.Images, "/build/ram.svg")} alt="Memory" />
                                <p className={bp.itemTitle}>
                                    {selected.memory ? (
                                        <> {selected.memory.Model} <br/><span>• {selected.memory.MemoryType}, {selected.memory.OneModuleMemory} ГБ x {selected.memory.TotalModules} шт, {selected.memory.ClockFrequency} МГц, {selected.memory.CL}(CL)-{selected.memory.TRCD}-{selected.memory.TRP}</span></>
                                    ) : "Оперативная память"}
                                </p>
                                {buildState.memoryId && isOwner && (
                                    <div className={bp.subInfoContainer}>
                                        <button className={bp.clearBtn} onClick={(e)=>{e.stopPropagation(); clearSlot("memory");}}><span>×</span></button>
                                        <span className={bp.itemPrice}>{selected.memory?.Price?.toLocaleString?.()}₸</span>
                                    </div>
                                )}
                                {buildState.memoryId && !isOwner && <div className={bp.subInfoContainer}><span className={bp.itemPrice}>{selected.memory?.Price?.toLocaleString?.()}₸</span></div>}
                            </div>

                            {resolvedStorages.map((st, idx) => {
                                const comp: any = st.item;
                                const img = utils.imgOf(comp?.Images, "/build/disk_drive.svg");
                                const title = comp?.Model ?? "Накопитель";
                                const priceNum = Number(comp?.Price ?? 0);
                                const rowTotal = priceNum * (st.qty ?? 1);

                                return (
                                    <div key={`${st.kind}-${st.id}-${idx}`} className={bp.buildContainer__item}>
                                        <img src={img} alt="storage" />
                                        <p className={bp.itemTitle}>
                                            {title}
                                            <br/>
                                            <span>
                                                • {st.kind === "ssd"
                                                ? `${comp?.PhysInterface}, чтение - ${comp?.MaxReadSpeed} Мбайт/сек, запись - ${comp?.MaxWriteSpeed} Мбайт/сек`
                                                : st.kind === "hdd2_5"
                                                    ? `${comp?.Interface}, ${comp?.SpindleRotationSpeed} об/мин, кэш-память ${comp?.BufferSize} МБ`
                                                    : `${comp?.Interface}, ${comp?.InterfaceBandwidth / 1000} Гбит/с, ${comp?.SpindleRotationSpeed} об/мин, кэш-память ${comp?.CacheSize} МБ`}
                                            </span>
                                        </p>

                                        <div className={bp.subInfoContainer}>
                                            {isOwner && (
                                                <div className={bp.qtyCtrl} onClick={(e)=> e.stopPropagation()}>
                                                    <button className={bp.qtyBtn} onClick={() => decStorageQty(idx)}>-</button>
                                                    <span className={bp.qtyVal}>{st.qty}</span>
                                                    <button className={bp.qtyBtn} onClick={() => incStorageQty(idx)}>+</button>
                                                </div>
                                            )}
                                            {isOwner && (
                                                <button className={bp.clearBtn} onClick={(e)=>{ e.stopPropagation(); removeStorageAt(idx); }}>
                                                    <span>×</span>
                                                </button>
                                            )}
                                            <span className={bp.itemPrice}>{Number.isFinite(rowTotal) ? rowTotal.toLocaleString() : comp?.Price?.toLocaleString?.()}₸</span>
                                        </div>
                                    </div>
                                );
                            })}

                            {isOwner && (
                                <div className={bp.buildContainer__item} ref={addStorageRef} onClick={() => setStoragePickerOpen(v => !v)}>
                                    <img src="/build/disk_drive.svg" alt="add storage" />
                                    <p className={bp.itemTitle}>Накопители <br/><span>• Добавить диск (SSD / HDD)</span></p>

                                    {storagePickerOpen && (
                                        <div className={bp.storagePicker} onClick={(e)=> e.stopPropagation()}>
                                            <button onClick={() => openOverlay("storage-ssd")}>M.2 (SSD)</button>
                                            <button onClick={() => openOverlay("storage-hdd2_5")}>HDD 2.5"</button>
                                            <button onClick={() => openOverlay("storage-hdd3_5")}>HDD 3.5"</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {(compatibility.conflicts.length > 0 || compatibility.warnings.length > 0) && (
                            <div className={bp.conflictsContainer}>
                                {compatibility.conflicts.length > 0 && (
                                    <>
                                        <h3>Конфликты</h3>
                                        <div className={bp.conflicts}>
                                            {compatibility.conflicts.map(conflict => (
                                                <>
                                                    <span>{conflict.message}</span>
                                                    <br />
                                                </>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {compatibility.warnings.length > 0 && (
                                    <>
                                        <h3>Предупреждения</h3>
                                        <div className={bp.warnings}>
                                            {compatibility.warnings.map(warn => (
                                                <>
                                                    <span>{warn}</span>
                                                    <br />
                                                </>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {isOwner && (
                            <ChooseComponentOverlay
                                open={overlayOpen}
                                slot={overlaySlot}
                                baseList={overlaySlot ? (listBySlot[overlaySlot] || []) : []}
                                query={query}
                                setQuery={setQuery}
                                onPick={onPick}
                                onClose={closeOverlay}
                            />
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}