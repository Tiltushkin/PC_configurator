import { useEffect, useMemo, useRef, useState } from "react";
import s from "./Layout.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { allComponents, CPU, GPU } from "../shared/types/types";
import utils from "../shared/utils/utils";

function Header() {
    const navigate = useNavigate();
    const { user } = useSelector((st: RootState) => st.auth);
    const componentsState = useSelector((st: RootState) => st.components);

    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const blurTimer = useRef<number | null>(null);

    const items: (allComponents)[] = useMemo(() => {
        const c = componentsState.cpus?.items ?? [];
        const g = componentsState.gpus?.items ?? [];
        const m = componentsState.mbs?.items ?? [];
        const p = componentsState.psus?.items ?? [];
        const ca = componentsState.cases?.items ?? [];
        const s = componentsState.szos?.items ?? [];
        const a = componentsState.airCoolings?.items ?? [];
        const mem = componentsState.memories?.items ?? [];
        const ssd = componentsState.ssds?.items ?? [];
        const hdd2 = componentsState.hdd2_5?.items ?? [];
        const hdd3 = componentsState.hdd3_5?.items ?? [];
        return [...c, ...g, ...m, ...p, ...ca, ...s, ...a, ...mem, ...ssd, ...hdd2, ...hdd3];
    }, [componentsState.cpus, componentsState.gpus, componentsState.mbs, componentsState.psus, componentsState.cases, componentsState.szos, componentsState.airCoolings, componentsState.memories, componentsState.ssds, componentsState.hdd2_5, componentsState.hdd3_5]);

    const [debounced, setDebounced] = useState(query);

    useEffect(() => {
        const t = window.setTimeout(() => setDebounced(query.trim()), 200);
        return () => clearTimeout(t);
    }, [query]);

    const filtered = useMemo(() => {
        const q = debounced.toLowerCase();
        if (!q) return [];
        return items.filter((x: allComponents) => (x?.Model ?? "").toLowerCase().includes(q)).slice(0, 10);
    }, [debounced, items]);

    const handleFocus = () => {
        if (blurTimer.current) {
            window.clearTimeout(blurTimer.current);
            blurTimer.current = null;
        }
        setOpen(true);
    };
    const handleBlur = () => {
        blurTimer.current = window.setTimeout(() => setOpen(false), 120);
    };
    const handleMouseDownItem = (comp: allComponents) => {
        setOpen(false);
        navigate(`/components/${comp.Id}`)
    };

    return (
        <header className={s.header}>
            <div className={s.header__inner}>
                <div className={s.brand}>
                    <div className={s.brand__logo}>🛠️</div>
                    <Link to="/" className="glow" style={{ textDecoration: "none", color: "white" }}>
                        Potato PC
                    </Link>
                </div>

                <nav className={s.nav}>
                    <Link to="/build">Конфигуратор</Link>
                    <a href="https://example.com" target="_blank" rel="noreferrer">О проекте</a>
                </nav>

                <div className={s.search}>
                    <span className={s.search__icon}>🔎</span>
                    <input
                        className="input"
                        type="text"
                        placeholder="Поиск компонентов…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />

                    {user ? (
                        user?.avatarUrl ? (
                            <button
                                className={s.profileButton}
                                onClick={() => navigate("/profile")}
                                title={user.userName || user.login}
                            >
                                <img
                                    src={user.avatarUrl}
                                    alt={user.userName || user.login}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                />
                            </button>
                        ) : (
                            <button className="btn btn--ghost" onClick={() => navigate("/profile")} style={{ marginLeft: 8 }}>
                                {user?.userName ?? "Аккаунт"}
                            </button>
                        )
                    ) : (
                        <button className="btn" onClick={() => navigate("/auth")} style={{ marginLeft: 8 }}>
                            Войти
                        </button>
                    )}

                    {open && (
                        <div className={s.underInput}>
                            {filtered.map((item, i) => (
                                <div
                                    key={`${(item as any).Model}-${i}`}
                                    className={s.underInput__itemContainer}
                                    onMouseDown={() => handleMouseDownItem(item)}
                                >
                                    <img
                                        src={(item as any).Images?.[0]}
                                        alt="item_image"
                                        loading="lazy"
                                        decoding="async"
                                        width={40}
                                        height={40}
                                    />
                                    <p>{(item as any).Model}</p>
                                    <span className={s.badge}>{utils.getBadgeName(item)}</span>
                                </div>
                            ))}
                            {debounced && filtered.length === 0 && (
                                <div className={s.underInput__empty}>Ничего не найдено</div>
                            )}
                            {status === "failed" && <div className={s.underInput__empty}>Ошибка: {error}</div>}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;