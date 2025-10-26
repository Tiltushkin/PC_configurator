import { type ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import s from './Layout.module.scss'

interface Props { children: ReactNode; }

function MainLayout({ children }: Props) {
  return (
    <div className={s.layout}>
      <Header />
      <main className={s.content}>{children}</main>
      <Footer />
    </div>
  );
}
export default MainLayout;