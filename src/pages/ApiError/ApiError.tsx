import AnimatedBackground from "../../components/animations/AnimatedBackground"
import MainLayout from "../../layouts/MainLayout"
import s from "./ApiError.module.scss"

function ApiError() {
  return (
    <MainLayout>
      <AnimatedBackground />
      <div className={s.NotFoundContainer}>
        <div className={s.errorContainer}>
          <span className={s.errorDescription}>Ошибка сервера</span>
          <span className={`${s.errorTitle} glow`}>503</span>
          <span className={s.subDescription}>Извиняемся за временные неудобства</span>
        </div>
      </div>
    </MainLayout>
  )
}

export default ApiError