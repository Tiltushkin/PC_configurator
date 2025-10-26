import { useState } from "react";
import s from "./AuthPage.module.scss";
import MainLayout from "../../layouts/MainLayout";
import AnimatedBackground from "../../components/animations/AnimatedBackground.tsx";
import RightOverlayShowcase from "./RightOverlayShowcase";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import {hydrateFromStorage, loginThunk, registerThunk} from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login"|"register">("login");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
          await dispatch(loginThunk({ login, password })).unwrap();
      } else {
          await dispatch(registerThunk({ login, password, userName: userName || login })).unwrap();
      }
      dispatch(hydrateFromStorage());
      navigate("/");
    } catch (e: any) {
      setError(e?.message ?? "Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <AnimatedBackground />
      <div className={s.wrapper}>
        <div className={s.card}>
          <form className={s.left} onSubmit={submit}>
            <div className={s.tabs}>
              <button type="button" className={s.tab} data-active={mode === "login"} onClick={() => setMode("login")}>Вход</button>
              <button type="button" className={s.tab} data-active={mode === "register"} onClick={() => setMode("register")}>Регистрация</button>
            </div>

            <h2 style={{margin:0}}>{mode === "login" ? "Добро пожаловать" : "Создать аккаунт"}</h2>
            <p className="hint">Доступ к избранным сборкам, быстрый поиск и синхронизация профиля.</p>

            {mode === "register" && (
              <div className={s.field}>
                <label>Отображаемое имя</label>
                <input className="input" value={userName} onChange={e=>setUserName(e.target.value)} placeholder="Геймер#1337" />
              </div>
            )}

            <div className={s.field}>
              <label>Логин</label>
              <input className="input" value={login} onChange={e=>setLogin(e.target.value)} placeholder="user@example.com" />
            </div>
            <div className={s.field}>
              <label>Пароль</label>
              <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {error && <div style={{color:'#ff7a7a'}}>{error}</div>}

            <div className={s.row}>
              <button className="btn" disabled={loading} type="submit">
                {loading ? "Загрузка..." : (mode === "login" ? "Войти" : "Зарегистрироваться")}
              </button>
              <button className="btn btn--ghost" type="button" onClick={()=>setMode(mode==='login'?'register':'login')}>
                {mode==='login' ? "Нет аккаунта? Регистрация" : "Есть аккаунт? Войти"}
              </button>
            </div>
          </form>

          <div className={s.right}>
            <div className={s.rightOverlay}>
                <RightOverlayShowcase />
              </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
