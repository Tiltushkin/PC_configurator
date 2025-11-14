import MainLayout from "../../layouts/MainLayout";
import AnimatedBackground from "../../components/animations/AnimatedBackground.tsx";
import s from "./AdminPage.module.scss";
import useAdmin from "../../shared/hooks/useAdmin.ts";

export default function AdminPage() {
    const {
        title, tab, onSwitch, imgInput, setImgInput, addImage, onPickLocal, form, removeImageAt,
        localFiles, sections, applyFieldValue, bind, busy, submit, result, err
    } = useAdmin();

    return (
        <MainLayout>
            <AnimatedBackground />

            <div className={s.wrap}>
                <div className={s.header}>
                    <h1 className="glow">{title}</h1>
                    <div className={s.tabs}>
                        <button className={tab==="cpu"?s.active:""} onClick={()=>onSwitch("cpu")}>CPU</button>
                        <button className={tab==="gpu"?s.active:""} onClick={()=>onSwitch("gpu")}>GPU</button>
                        <button className={tab==="mb"?s.active:""}  onClick={()=>onSwitch("mb")}>MB</button>
                        <button className={tab==="psu"?s.active:""} onClick={()=>onSwitch("psu")}>PSU</button>
                        <button className={tab==="case"?s.active:""} onClick={()=>onSwitch("case")}>CASE</button>
                        <button className={tab==="szo"?s.active:""} onClick={()=>onSwitch("szo")}>SZO</button>
                        <button className={tab==="aircooling"?s.active:""} onClick={()=>onSwitch("aircooling")}>AirCooling</button>
                        <button className={tab==="memory"?s.active:""} onClick={()=>onSwitch("memory")}>Memory</button>
                        <button className={tab==="ssd"?s.active:""} onClick={()=>onSwitch("ssd")}>SSD</button>
                        <button className={tab==="hdd2_5"?s.active:""} onClick={()=>onSwitch("hdd2_5")}>HDD 2.5"</button>
                        <button className={tab==="hdd3_5"?s.active:""} onClick={()=>onSwitch("hdd3_5")}>HDD 3.5"</button>
                    </div>
                </div>

                <div className={s.layout}>
                    <div className={s.left}>
                        <div className={s.card}>
                            <h3>Изображения</h3>
                            <div className={s.imgRow}>
                                <input
                                    placeholder="https://... или /img/asset.png"
                                    type="text"
                                    value={imgInput}
                                    onChange={(e)=>setImgInput(e.target.value)}
                                />
                                <button className="btn" onClick={addImage}>Добавить URL</button>
                                <label className={s.fileBtn}>
                                    <input type="file" accept="image/*" multiple onChange={onPickLocal} />
                                    Выбрать файлы
                                </label>
                            </div>

                            <div className={s.previewGrid}>
                                {(form.images ?? []).map((src: string, idx: number) => (
                                    <div key={"url_"+idx} className={s.thumb}>
                                        <img src={src} alt={`img-${idx}`} loading="lazy" decoding="async" />
                                        <button className={s.del} onClick={()=>removeImageAt(idx,false)}>×</button>
                                    </div>
                                ))}
                                {localFiles.map((src, idx) => (
                                    <div key={"local_"+idx} className={s.thumb} title="Локальный предпросмотр (не отправляется)">
                                        <img src={src} alt={`local-${idx}`} loading="lazy" decoding="async" />
                                        <span className={s.badge}>local</span>
                                        <button className={s.del} onClick={()=>removeImageAt(idx,true)}>×</button>
                                    </div>
                                ))}
                            </div>

                            <p className={s.hint}>
                                <b>Важно:</b> локальные файлы показываются только для предпросмотра и <u>не отправляются</u> на сервер.
                                Для сохранения укажи их URL или путь из <code>/public</code>.
                            </p>
                        </div>

                        {sections.map((sec, si) => (
                            <div className={s.card} key={si}>
                                <h3>{sec.title}</h3>
                                <div className={s.grid}>
                                    {sec.fields.map((f) => (
                                        <label key={f.name} className={s.field}>
                                            <span>{f.label}</span>
                                            {f.type === "bool" ? (
                                                <div className={s.switch}>
                                                    <input type="checkbox" checked={!!form[f.name]} onChange={bind(f.name, "bool")} />
                                                </div>
                                            ) : f.type === "json" ? (
                                                <textarea
                                                    className={s.textarea}
                                                    placeholder={f.placeholder}
                                                    value={applyFieldValue(f)}
                                                    onChange={bind(f.name)}
                                                />
                                            ) : (
                                                <input
                                                    type={f.type === "number" ? "number" : "text"}
                                                    step={f.step ?? (f.type === "number" ? 1 : undefined)}
                                                    placeholder={f.placeholder}
                                                    value={applyFieldValue(f)}
                                                    onChange={bind(f.name, f.type)}
                                                />
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={s.right}>
                        <div className={s.cardSticky}>
                            <div className={s.actions}>
                                <button
                                    className={s.saveBtn}
                                    disabled={busy}
                                    onClick={submit}
                                >
                                    {busy ? "Сохраняю..." : "Сохранить"}
                                </button>
                                {result && <div className={s.ok}>{result}</div>}
                                {err && <div className={s.err}>{err}</div>}
                            </div>

                            <details className={s.adv}>
                                <summary>Payload (JSON)</summary>
                                <pre>{JSON.stringify(form, null, 2)}</pre>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}