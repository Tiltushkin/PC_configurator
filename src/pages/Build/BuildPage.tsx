import React, {useEffect, useMemo, useState} from "react";
import s from "./BuildPage.module.scss";
import MainLayout from "../../layouts/MainLayout";
import type {
    CPU, GPU, MB, PSU, SZO, AirCooling, CASE, Memory, SSD,
    allComponents,
    HDD
} from "../../shared/types/types";
import AnimatedBackground from "../../components/animations/AnimatedBackground.tsx";
import utils from "../../shared/utils/utils";
import {checkCompatibility} from "../../shared/utils/compatibility.ts";
import ChooseComponentOverlay from "../../components/ChooseComponentOverlay/ChooseComponentOverlay.tsx";
import SlotCard from "../../components/SlotCard/SlotCard.tsx";
import useBuild from "../../shared/hooks/useBuild.ts";
import useComponents from "../../shared/hooks/useComponents.ts";

const BuildPage: React.FC = () => {
    const {
        buildState, currentId, saving, shareUrl, shareErr, overlaySlot, overlayOpen, query,
        storagePickerOpen, addStorageRef,
        handleSaveBuild, handleShareBuild, openOverlay, closeOverlay, removeStorageAt, incStorageQty,
        decStorageQty, onPick, clearSlot, setBuildState, setStoragePickerOpen, setQuery
    } = useBuild();

    const {
        selectedCpu, selectedGpu, selectedMb, selectedPsu, selectedCase, selectedCooling,
        selectedMemory, resolvedStorages, list, totalPrice
    } = useComponents({buildState, query, overlaySlot});

    const [editMode, setEditMode] = useState(false);

    const compatibility = checkCompatibility({ CPU: selectedCpu, GPU: selectedGpu, MB: selectedMb, CASE: selectedCase, PSU: selectedPsu, cooling: selectedCooling, memory: selectedMemory }, resolvedStorages);
    
    return (
        <MainLayout>
            <AnimatedBackground />
            <div className={s.actionsBar}>
              <button className={s.primaryBtn} onClick={handleSaveBuild} disabled={saving}>{saving ? "Сохранение…" : "Сохранить"}</button>
              <button className={s.ghostBtn} onClick={handleShareBuild} disabled={!currentId && saving}>Поделиться</button>
              
              {shareUrl && (
                <div className={s.shareBox}>
                  <span>Ссылка:</span>
                  <input className={s.shareInput} value={shareUrl} readOnly onFocus={(e)=>e.currentTarget.select()} />
                  <button className={s.copyBtn} onClick={()=>{ navigator.clipboard?.writeText(shareUrl!) }}>Копировать</button>
                </div>
              )}
              
              {shareErr && <div className={s.error}>{shareErr}</div>}
            </div>
            <div className={s.configContainer}>
                <div className="card" style={{position: "relative"}}>
                    {!editMode ? (
                        <>
                            <h2 className="glow">{buildState.name || "Название сборки"}</h2>
                            <img
                                className={s.editBtn}
                                src="/edit.svg"
                                alt="build edit"
                                loading="lazy"
                                decoding="async"
                                onClick={() => setEditMode(true)}
                                style={{cursor: "pointer"}}
                                title="Редактировать сборку"
                            />
                        </>
                    ) : (
                        <div className={s.editWrap}>
                            <div className={s.editRow}>
                                <label>Название</label>
                                <input
                                    className={s.input}
                                    value={buildState.name}
                                    onChange={(e) => setBuildState(prev => ({...prev, name: e.target.value}))}
                                    maxLength={64}
                                    placeholder="Например: Игровая 2025"
                                />
                            </div>
                            <div className={s.editRow}>
                                <label>Описание</label>
                                <textarea
                                    className={s.textarea}
                                    value={buildState.description ?? ""}
                                    onChange={(e) => setBuildState(prev => ({...prev, description: e.target.value}))}
                                    rows={3}
                                    placeholder="Коротко опиши сборку"
                                />
                            </div>
                            <label className={s.switchRow}>
                                <input
                                    type="checkbox"
                                    checked={!!buildState.isPublic}
                                    onChange={(e) => setBuildState(prev => ({...prev, isPublic: e.target.checked}))}
                                />
                                <span>Публичная сборка</span>
                            </label>
                            <div className={s.editActions}>
                                <button className={s.secondaryBtn} onClick={() => setEditMode(false)}>Готово</button>
                            </div>
                        </div>
                    )}
                </div>

                <span className={s.totalPrice}>Общая стоимость сборки: {totalPrice.toLocaleString()}₸</span>

                <div className={s.buildContainer}>
                    <SlotCard
                        selected={selectedCpu as CPU}
                        info={{ alt: "CPU", altImage: "/build/cpu.svg", standardText: "Процессор" }}
                        buildState={buildState}
                        onClickItem={() => openOverlay("cpu")}
                        onClickBtn={(e) => { e.stopPropagation(); clearSlot("cpu"); }}
                    />

                    <SlotCard
                        selected={selectedMb as MB}
                        info={{ alt: "MotherBoard", altImage: "/build/motherboard.svg", standardText: "Материнская плата" }}
                        buildState={buildState}
                        onClickItem={() => openOverlay("mb")}
                        onClickBtn={(e) => { e.stopPropagation(); clearSlot("mb"); }}
                    />

                    <SlotCard
                        selected={selectedPsu as PSU}
                        info={{ alt: "PSU", altImage: "/build/power_supply.svg", standardText: "Блок питания" }}
                        buildState={buildState}
                        onClickItem={() => openOverlay("psu")}
                        onClickBtn={(e) => { e.stopPropagation(); clearSlot("psu"); }}
                    />

                    <SlotCard
                        selected={selectedCase as CASE}
                        info={{ alt: "CASE", altImage: "/build/pc_case.svg", standardText: "Корпус" }}
                        buildState={buildState}
                        onClickItem={() => openOverlay("case")}
                        onClickBtn={(e) => { e.stopPropagation(); clearSlot("case"); }}
                    />

                    <SlotCard
                        selected={selectedGpu as GPU}
                        info={{ alt: "GPU", altImage: "/build/gpu.svg", standardText: "Видеокарта" }}
                        buildState={buildState}
                        onClickItem={() => openOverlay("gpu")}
                        onClickBtn={(e) => { e.stopPropagation(); clearSlot("gpu"); }}
                    />

                    <SlotCard
                        selected={selectedCooling as (AirCooling | SZO)}
                        info={{ alt: "Cooling", altImage: "/build/cooling.svg", standardText: "Система охлаждения" }}
                        buildState={buildState}
                        onClickItem={() => openOverlay("cooling")}
                        onClickBtn={(e) => { e.stopPropagation(); clearSlot("cooling"); }}
                    />

                    <SlotCard
                        selected={selectedMemory as Memory}
                        info={{ alt: "Memory", altImage: "/build/ram.svg", standardText: "Оперативная память" }}
                        buildState={buildState}
                        onClickItem={() => openOverlay("memory")}
                        onClickBtn={(e) => { e.stopPropagation(); clearSlot("memory"); }}
                    />

                    {resolvedStorages.map((st, idx) => {
                        const comp = st.item as allComponents | null;
                        const img = comp?.Images?.[0];
                        const title = comp?.Model ?? "Накопитель";
                        const priceNum = Number(comp?.Price ?? 0);
                        const totalPrice = priceNum * (st.qty ?? 1);

                        return (
                            <div key={`${st.kind}-${st.id}-${idx}`} className={s.buildContainer__item}>
                                <img
                                    src={img || "/build/disk_drive.svg"}
                                    alt="storage"
                                    loading="lazy"
                                    decoding="async"
                                    style={img ? { width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' } : { width: '48px', height: '48px' }}
                                />
                                <p className={s.itemTitle}>
                                    {title}
                                    <br />
                                    <span>{utils.getComponentDescription(comp as (SSD | HDD))}</span>
                                </p>

                                <div className={s.subInfoContainer}>
                                    <div className={s.qtyCtrl} onClick={(e) => e.stopPropagation()}>
                                        <button className={s.qtyBtn} onClick={() => decStorageQty(idx)}>-</button>
                                        <span className={s.qtyVal}>{st.qty}</span>
                                        <button className={s.qtyBtn} onClick={() => incStorageQty(idx)}>+</button>
                                    </div>
                                    <button className={s.clearBtn} onClick={(e) => { e.stopPropagation(); removeStorageAt(idx); }}>
                                        <span>×</span>
                                    </button>
                                    <span className={s.itemPrice}>
                                        {Number.isFinite(totalPrice) ? totalPrice.toLocaleString() : comp?.Price?.toLocaleString?.()}{Number.isFinite(totalPrice) ? "₸" : "₸"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    <div className={s.buildContainer__item} ref={addStorageRef} onClick={() => setStoragePickerOpen(v => !v)}>
                        <img src="/build/disk_drive.svg" alt="add storage" loading="lazy" decoding="async" />
                        <p className={s.itemTitle}>Накопители <br /><span>• Добавить диск (SSD / HDD)</span></p>

                        {storagePickerOpen && (
                            <div className={s.storagePicker} onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => openOverlay("storage-ssd")}>M.2 (SSD)</button>
                                <button onClick={() => openOverlay("storage-hdd2_5")}>HDD 2.5"</button>
                                <button onClick={() => openOverlay("storage-hdd3_5")}>HDD 3.5"</button>
                            </div>
                        )}
                    </div>
                </div>

                {(compatibility.conflicts.length > 0 || compatibility.warnings.length > 0) && (
                    <div className={s.conflictsContainer}>
                        {compatibility.conflicts.length > 0 && (
                            <>
                                <h3>Конфликты</h3>
                                <div className={s.conflicts}>
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
                                <div className={s.warnings}>
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

                <ChooseComponentOverlay
                    open={overlayOpen}
                    slot={overlaySlot}
                    baseList={list}
                    query={query}
                    setQuery={setQuery}
                    onPick={onPick}
                    onClose={closeOverlay}
                />
            </div>
        </MainLayout>
    );
};

export default BuildPage;