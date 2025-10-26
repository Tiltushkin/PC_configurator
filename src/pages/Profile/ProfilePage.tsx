import s from "./ProfilePage.module.scss";
import MainLayout from "../../layouts/MainLayout";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchBuildsThunk } from "../../store/slices/buildsSlice";
import { Link, useNavigate } from "react-router-dom";
import { loadMeThunk } from "../../store/slices/authSlice";
import AnimatedBackground from "../../components/animations/AnimatedBackground.tsx";
import utils from "../../shared/utils/utils";
import {
    componentsApi
} from "../../api/api";
import type {
    CPU, GPU, MB, PSU, CASE, COOLING, Memory, SSD, HDD2_5, HDD3_5, SZO, AirCooling, CompMaps, PagedResult,
    ComponentsAllResponse,
} from "../../shared/types/types";

const toMap = <T extends { Id: string }>(paged?: PagedResult<T>) =>
    new Map((paged?.items ?? []).map(i => [i.Id, i]));

const imgOf = (arr?: string[] | null, fallback = "") =>
    utils.resolveImageUrl(arr?.[0]) ?? (fallback || undefined);

export default function ProfilePage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { token, user } = useSelector((st: RootState) => st.auth);
    const { list, status } = useSelector((st: RootState) => st.builds);

    const [maps, setMaps] = useState<CompMaps | null>(null);
    const [cmpLoading, setCmpLoading] = useState(true);

    useEffect(() => {
        (async () => {
            if (!token) { navigate("/auth", { replace: true }); return; }
            try {
                await dispatch(loadMeThunk()).unwrap();
                await dispatch(fetchBuildsThunk({ page: 1, pageSize: 20 })).unwrap();
            } catch { /* Ignore */ }
            try {
                const all = await componentsApi.get({ type: "all", pageSize: 500 }) as ComponentsAllResponse;
                const szo = toMap<SZO>(all.szos);
                const air = toMap<AirCooling>(all.airCoolings);
                const cooling = new Map<string, COOLING>([...Array.from(szo), ...Array.from(air)]);
                setMaps({
                    cpu: toMap<CPU>(all.cpus),
                    gpu: toMap<GPU>(all.gpus),
                    mb: toMap<MB>(all.mbs),
                    psu: toMap<PSU>(all.psus),
                    case: toMap<CASE>(all.cases),
                    cooling,
                    memory: toMap<Memory>(all.memories),
                    ssd: toMap<SSD>(all.ssds),
                    hdd2_5: toMap<HDD2_5>(all.hdd2_5),
                    hdd3_5: toMap<HDD3_5>(all.hdd3_5),
                });
            } finally { setCmpLoading(false); }
        })();
    }, [token, dispatch, navigate]);

    const enriched = useMemo(() => {
        if (!maps || !list?.items?.length) return [];
        return list.items.map(b => {
            const cpu = b.cpuId ? maps.cpu.get(b.cpuId) ?? null : null;
            const gpu = b.gpuId ? maps.gpu.get(b.gpuId) ?? null : null;
            const mb  = b.mbId  ? maps.mb.get(b.mbId) ?? null : null;
            const psu = b.psuId ? maps.psu.get(b.psuId) ?? null : null;
            const cs  = b.caseId? maps.case.get(b.caseId) ?? null : null;
            const cool= b.coolingId ? maps.cooling.get(b.coolingId) ?? null : null;
            const mem = b.memoryId ? maps.memory.get(b.memoryId) ?? null : null;

            let total = 0;
            const add = (c:any) => { if (c && typeof c.Price === "number") total += c.Price; };
            add(cpu); add(gpu); add(mb); add(psu); add(cs); add(cool); add(mem);

            (b.ssdIds ?? []).forEach(id => { const s = maps.ssd.get(id); if (s?.Price) total += s.Price; });
            (b.hddIds ?? []).forEach(id => {
                const h = maps.hdd2_5.get(id) ?? maps.hdd3_5.get(id);
                if (h?.Price) total += h.Price as any;
            });

            const thumbs: string[] = [];
            [cpu, gpu, mb, mem, cool, psu, cs].forEach(c => {
                const u = imgOf(c?.Images);
                if (u) thumbs.push(u);
            });

            return {
                ...b,
                cpu, gpu, mb, psu, cs, cool, mem,
                total,
                thumbs: thumbs.slice(0, 5),
            };
        });
    }, [maps, list?.items]);

    return (
        <MainLayout>
            <AnimatedBackground />
            <div className={s.wrap}>
                <section className="container-xl">
                    <div className={s.header}>
                        <div className={s.avatar} onClick={()=>navigate("/")}>
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user?.userName || user?.login} />
                            ) : (
                                <div className={s.avatarStub}>{(user?.userName || user?.login || "?").slice(0,1).toUpperCase()}</div>
                            )}
                        </div>
                        <div className={s.info}>
                            <h1>{user?.userName || "Без имени"}</h1>
                            <div className={s.meta}>
                                <span>Логин: <b>{user?.login}</b></span>
                                <span>UID: <code>{user?.id}</code></span>
                            </div>
                        </div>
                    </div>

                    <div className={s.sectionTitle}>
                        <h2>Мои сборки</h2>
                        <Link to="/build" className="btn btn--ghost">+ Новая сборка</Link>
                    </div>

                    {(status === "loading" || cmpLoading) && <div className={s.empty}>Загружаю сборки…</div>}

                    {enriched.length > 0 ? (
                        <div className={s.grid}>
                            {enriched.map(b => (
                                <div key={b.id} className={"card " + s.build}>
                                    <div className={s.buildHead}>
                                        <div className={s.buildTitle}>
                                            <div className={s.name}>{b.name || "Без названия"}</div>
                                            <div className={s.muted}>#{b.id.slice(0,8)} • {new Date(b.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div className={s.total}>{b.total ? `${Math.floor(b.total).toLocaleString()}₸` : ""}</div>
                                    </div>

                                    <div className={s.thumbs}>
                                        {b.thumbs.map((src, i) => (
                                            <img key={i} src={src} alt="" loading="lazy" decoding="async"
                                                 onError={e => { (e.currentTarget as HTMLImageElement).style.display="none"; }} />
                                        ))}
                                    </div>

                                    <div className={s.compList}>
                                        <CompLine label="CPU"  title={b.cpu?.Model}  price={b.cpu?.Price}/>
                                        <CompLine label="GPU"  title={b.gpu?.Model}  price={b.gpu?.Price}/>
                                        <CompLine label="MB"   title={b.mb?.Model}   price={b.mb?.Price}/>
                                        <CompLine label="RAM"  title={b.mem?.Model}  price={b.mem?.Price}/>
                                        <CompLine label="Cooling" title={b.cool?.Model} price={b.cool?.Price}/>
                                        <CompLine label="PSU"  title={b.psu?.Model}  price={b.psu?.Price}/>
                                        <CompLine label="Case" title={b.cs?.Model}    price={b.cs?.Price}/>
                                    </div>

                                    <div className={s.actions}>
                                        <Link to={`/builds/${b.id}`} className="btn btn--ghost">Открыть</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (status !== "loading" && !cmpLoading) && (
                        <div className={s.empty}>
                            <div className={s.emptyCard + " card"}>
                                <h3>Пока пусто</h3>
                                <p>Создай свою первую сборку — начни с подбора процессора и видеокарты.</p>
                                <Link to="/build" className="btn">Начать сборку</Link>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </MainLayout>
    );
}

function CompLine({ label, title, price }: { label: string; title?: string; price?: number }) {
    if (!title) return null;
    return (
        <div className={s.compLine}>
            <span className={s.compLabel}>{label}</span>
            <span className={s.compTitle}>{title}</span>
            {typeof price === "number" && <span className={s.compPrice}>{price.toLocaleString()}₸</span>}
        </div>
    );
}