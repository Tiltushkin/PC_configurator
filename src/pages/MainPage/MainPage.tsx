import MainLayout from "../../layouts/MainLayout";
import AnimatedBackground from "../../components/animations/AnimatedBackground.tsx";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUser} from "../../store/slices/authSlice.ts";

const MainPage = () => {
    const profile = useSelector(selectUser);

    return (
    <MainLayout>
      <AnimatedBackground />
      <section className="container-xl" style={{marginTop: 24}}>
        <div className="card" style={{padding: '28px', display:'grid', gap: 18}}>
          <h1 className="glow" style={{margin: 0, fontSize: 36, fontWeight: 900, letterSpacing: .5}}>Собери свою картошку уже сейчас</h1>
          <p style={{opacity:.8, lineHeight:1.6, maxWidth: 820}}>
            Игровой конфигуратор с умными подсказками и тёмной эстетикой. Выбирай компоненты, следи за совместимостью и ценой сборки — всё в одном месте.
          </p>
          <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
            <Link to="/build" className="btn">Начать сборку</Link>
            {!profile && (
                <Link to="/auth" className="btn btn--ghost">Войти / Регистрация</Link>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
    );
};

export default MainPage;