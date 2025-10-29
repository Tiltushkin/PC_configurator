import type { allComponents, altInfoProp, BuildEx } from "../../shared/types/types";
import utils from "../../shared/utils/utils";
import s from "../../pages/Build/BuildPage.module.scss";

interface SlotProps {
    selected: allComponents,
    info: altInfoProp,
    buildState: BuildEx,
    onClickItem: (e?: any) => void,
    onClickBtn: (e?: any) => void,
}

function SlotCard({ selected, info, buildState, onClickItem, onClickBtn }: SlotProps) {
    return (
        <div className={s.buildContainer__item} onClick={onClickItem}>
            <img src={selected ? selected.Images[0] : info.altImage} alt={info.alt} loading="lazy" decoding="async" style={selected?.Images[0] ? { width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' } : { width: '48px', height: '48px' }}/>
            <p className={s.itemTitle}>
                {selected?.Model} <br /> <span>{ utils.getComponentDescription(selected as allComponents) }</span>
            </p>
            {buildState.cpuId && (
                <div className={s.subInfoContainer}>
                    <button className={s.clearBtn} onClick={onClickBtn}><span>×</span></button>
                    <span className={s.itemPrice}>{selected?.Price?.toLocaleString?.()}₸</span>
                </div>
            )}
        </div>
    )
}

export default SlotCard