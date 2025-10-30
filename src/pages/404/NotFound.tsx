import { useNavigate } from "react-router-dom"
import MainLayout from "../../layouts/MainLayout"
import s from "./NotFound.module.scss"
import AnimatedBackground from "../../components/animations/AnimatedBackground";

function NotFound() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <AnimatedBackground />
      <div className={s.NotFoundContainer}>
        <div className={s.errorContainer}>
          <span className={s.errorDescription}>Такой страницы не существует</span>
          <span className={`${s.errorTitle} glow`}>404</span>
        </div>
        <button className={s.backButton} type="button" onClick={() => navigate("/")}>← На главную</button>
      </div>
    </MainLayout>
  )
}

export default NotFound