import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import s from "./ComponentPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../store/store";

import type {
  AirCooling,
  CASE,
  CPU,
  GPU,
  HDD2_5,
  HDD3_5,
  MB,
  Memory,
  PSU,
  SSD,
  WithMaybeId,
  allComponents,
} from "../../shared/types/types";
import utils from "../../shared/utils/utils";

function Row({ label, value }: { label: string; value: unknown }) {
  if (
    value === undefined ||
    value === null ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return null;
  }
  return (
    <div className={s.specRow}>
      <div className={s.label}>{label}</div>
      <div className={s.value}>
        {typeof value === "boolean" ? (value ? "Да" : "Нет") : String(value)}
      </div>
    </div>
  );
}

function renderBase(comp: allComponents) {
  return (
    <>
      <Row label="Модель" value={comp.Model} />
      <Row label="ID" value={comp.Id ?? (comp as any).Id} />
      <Row
        label="Цена"
        value={comp.Price !== undefined ? `${comp.Price} ₸` : undefined}
      />
      <Row label="Гарантия (мес.)" value={comp.Warranty} />
    </>
  );
}

function renderTypeSpecs(comp: allComponents) {
  if (utils.isCPU(comp)) {
    const c = comp as CPU;
    return (
      <>
        <Row label="Сокет" value={c.Socket} />
        <Row label="Ядер (всего)" value={c.TotalCores} />
        <Row label="Потоки" value={c.Threads} />
        <Row label="Баз. частота (MHz)" value={c.BasicFrequency} />
        <Row label="Turbo (MHz)" value={c.TurboFrequency} />
        <Row label="TDP (W)" value={c.TDP} />
        <Row label="Поддержка памяти" value={c.MemoryTypes?.join(", ")} />
      </>
    );
  }

  if (utils.isGPU(comp)) {
    const g = comp as GPU;
    return (
      <>
        <Row label="ГПУ" value={g.GraphicalProcessor} />
        <Row label="VRAM (MB)" value={g.VideoRAM} />
        <Row label="Шина (bit)" value={g.MemoryBusWidth} />
        <Row
          label="Рекомендуемая мощность (W)"
          value={g.RecommendedPowerSupply}
        />
        <Row label="Энергопотребление (W)" value={g.PowerConsumption} />
        <Row
          label="Размеры (W×H×T mm)"
          value={`${g.Width}×${g.Height}×${g.Thickness}`}
        />
      </>
    );
  }

  if (utils.isMB(comp)) {
    const m = comp as MB;
    return (
      <>
        <Row label="Сокет" value={m.Socket} />
        <Row label="Форм-фактор" value={m.FormFactor?.join(", ")} />
        <Row label="Слоты памяти" value={m.MemorySlots} />
        <Row label="Макс память (MB)" value={m.MaxMemory} />
        <Row label="M.2 слотов" value={m.M2Slots} />
        <Row label="NVMe support" value={m.NVMeSupport} />
      </>
    );
  }

  if (utils.isPSU(comp)) {
    const p = comp as PSU;
    return (
      <>
        <Row label="Мощность (W)" value={p.Power} />
        <Row label="Форм-фактор" value={p.FormFactor} />
        <Row label="Модулярность" value={p.DetachableCables} />
        <Row label="12V линия (A)" value={p.PowerV12Line} />
        <Row label="Сертификат" value={p.Certificate} />
      </>
    );
  }

  if (utils.isCASE(comp)) {
    const c = comp as CASE;
    return (
      <>
        <Row label="Поддержка плат" value={c.CompatibleBoards?.join(", ")} />
        <Row label="Макс длина GPU (mm)" value={c.GPULength} />
        <Row label="Макс высота кулера (mm)" value={c.MaxCoolerHeight} />
        <Row label="Отсеки 2.5" value={c.Drives2_5} />
        <Row
          label="Питание PSU (совместимость)"
          value={c.CompatiblePowerSupply?.join(", ")}
        />
      </>
    );
  }

  if (utils.isSZO(comp)) {
    const szo = comp as unknown as any;
    return (
      <>
        <Row label="TDP (W)" value={szo.TDP} />
        <Row label="Длина радиатора (mm)" value={szo.RadiatorLength} />
        <Row label="Включено вентиляторов" value={szo.IncludedFans} />
        <Row label="LCD" value={szo.LCD} />
      </>
    );
  }

  if (utils.isAirCooling(comp)) {
    const ac = comp as AirCooling;
    return (
      <>
        <Row label="Поддержка сокетов" value={ac.Sockets?.join(", ")} />
        <Row label="TDP (W)" value={ac.TDP} />
        <Row label="Heat pipes" value={ac.HeatPipes} />
        <Row label="Высота (mm)" value={ac.Height} />
      </>
    );
  }

  if (utils.isMemory(comp)) {
    const mem = comp as Memory;
    return (
      <>
        <Row label="Тип памяти" value={mem.MemoryType} />
        <Row label="Общий объём (MB)" value={mem.TotalMemory} />
        <Row label="Модулей" value={mem.TotalModules} />
        <Row label="Частота (MHz)" value={mem.ClockFrequency} />
        <Row label="CL" value={mem.CL} />
      </>
    );
  }

  if (utils.isSSD(comp)) {
    const ssd = comp as SSD;
    return (
      <>
        <Row label="Ёмкость (GB)" value={ssd.DiskCapacity} />
        <Row label="NVMe" value={ssd.NVMe} />
        <Row label="Физ. интерфейс" value={ssd.PhysInterface} />
        <Row label="Max чтение (MB/s)" value={ssd.MaxReadSpeed} />
        <Row label="Max запись (MB/s)" value={ssd.MaxWriteSpeed} />
      </>
    );
  }

  if (utils.isHDD2_5(comp)) {
    const h = comp as HDD2_5;
    return (
      <>
        <Row label="Ёмкость (GB)" value={h.DiskCapacity} />
        <Row label="Скорость шпинделя" value={h.SpindleRotationSpeed} />
        <Row label="Avg access (ms)" value={h.AVGAccessReading} />
      </>
    );
  }

  if (utils.isHDD3_5(comp)) {
    const h = comp as HDD3_5;
    return (
      <>
        <Row label="Ёмкость (GB)" value={h.DiskCapacity} />
        <Row label="Cache (MB)" value={h.CacheSize} />
        <Row label="Скорость шпинделя" value={h.SpindleRotationSpeed} />
      </>
    );
  }

  const extra = Object.entries(comp as any)
    .filter(
      ([k]) => !["Id", "Price", "Images", "Warranty", "Model"].includes(k)
    )
    .slice(0, 12)
    .map(([k, v]) => (
      <Row key={k} label={k} value={Array.isArray(v) ? v.join(", ") : v} />
    ));

  return <>{extra}</>;
}

function ComponentPage() {
  const { componentID } = useParams();
  const navigate = useNavigate();

  const componentsState = useSelector((st: RootState) => st.components);

  const cpus = useMemo(
    () =>
      (componentsState?.cpus?.items as WithMaybeId<CPU>[] | undefined) ?? [],
    [componentsState?.cpus?.items]
  );
  const gpus = useMemo(
    () =>
      (componentsState?.gpus?.items as WithMaybeId<GPU>[] | undefined) ?? [],
    [componentsState?.gpus?.items]
  );
  const mbs = useMemo(
    () => (componentsState?.mbs?.items as WithMaybeId<MB>[] | undefined) ?? [],
    [componentsState?.mbs?.items]
  );
  const psus = useMemo(
    () =>
      (componentsState?.psus?.items as WithMaybeId<PSU>[] | undefined) ?? [],
    [componentsState?.psus?.items]
  );
  const cases = useMemo(
    () =>
      (componentsState?.cases?.items as WithMaybeId<CASE>[] | undefined) ?? [],
    [componentsState?.cases?.items]
  );
  const szos = useMemo(
    () =>
      (componentsState?.szos?.items as WithMaybeId<any>[] | undefined) ?? [],
    [componentsState?.szos?.items]
  );
  const airCoolings = useMemo(
    () =>
      (componentsState?.airCoolings?.items as
        | WithMaybeId<AirCooling>[]
        | undefined) ?? [],
    [componentsState?.airCoolings?.items]
  );
  const memories = useMemo(
    () =>
      (componentsState?.memories?.items as WithMaybeId<Memory>[] | undefined) ??
      [],
    [componentsState?.memories?.items]
  );
  const ssds = useMemo(
    () =>
      (componentsState?.ssds?.items as WithMaybeId<SSD>[] | undefined) ?? [],
    [componentsState?.ssds?.items]
  );
  const hdd2_5 = useMemo(
    () =>
      (componentsState?.hdd2_5?.items as WithMaybeId<HDD2_5>[] | undefined) ??
      [],
    [componentsState?.hdd2_5?.items]
  );
  const hdd3_5 = useMemo(
    () =>
      (componentsState?.hdd3_5?.items as WithMaybeId<HDD3_5>[] | undefined) ??
      [],
    [componentsState?.hdd3_5?.items]
  );

  const allComponents = useMemo(
    () => [
      ...cpus,
      ...gpus,
      ...mbs,
      ...psus,
      ...cases,
      ...szos,
      ...airCoolings,
      ...memories,
      ...ssds,
      ...hdd2_5,
      ...hdd3_5,
    ],
    [
      cpus,
      gpus,
      mbs,
      psus,
      cases,
      szos,
      airCoolings,
      memories,
      ssds,
      hdd2_5,
      hdd3_5,
    ]
  );

  const comp: allComponents = allComponents.find(
    (x) => (x.Id ?? (x as any).Id) == componentID
  );

  if (!comp) {
    return (
      <div className={s.componentContainer}>
        <button className={s.backBtn} onClick={() => navigate("/")}>
          ← На главную
        </button>
        <span className={`${s.notFound} glow`}>
          404 — Такой компонент не найден
        </span>
      </div>
    );
  }

  const img = comp?.Images?.[0] ?? undefined;

  return (
    <div className={s.componentContainer}>
      <button className={s.backBtn} onClick={() => navigate("/")}>
        ← На главную
      </button>

      <div className={s.component}>
        <div className={s.left}>
          <div className={s.imageWrap}>
            {img ? (
              <img
                src={img}
                alt={comp.Model}
                className={s.image}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className={s.noImage}>Нет изображения</div>
            )}
          </div>
          <div className={s.badges}>
            <div className={s.model}>{comp.Model}</div>
            <div className={s.price}>
              {comp.Price ? `${comp.Price} ₸` : "Цена не указана"}
            </div>
          </div>
        </div>

        <div className={s.right}>
          <div className={s.card}>
            <h3 className={s.sectionTitle}>Общее</h3>
            <div className={s.specsGrid}>{renderBase(comp)}</div>
          </div>

          <div className={s.card}>
            <h3 className={s.sectionTitle}>Спецификации</h3>
            <div className={s.specsGrid}>{renderTypeSpecs(comp)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComponentPage;
