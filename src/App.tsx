import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import PageTransition from "./animations/PageTransition";
import AuthPage from "./pages/Auth/AuthPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import BuildPage from "./pages/Build/BuildPage.tsx";
import AdminPage from "./pages/Admin/AdminPage.tsx";
import BuildViewPage from "./pages/BuildView/BuildViewPage.tsx";
import {AuthMiddleware} from "./middleware/AuthMiddleware.tsx";
import {TokenMiddleware} from "./middleware/TokenMiddleware.tsx";
import {useDispatch, useSelector} from "react-redux";
import {loadMeThunk, selectUser} from "./store/slices/authSlice.ts";
import {useEffect} from "react";
import type {AppDispatch} from "./store/store.ts";
import {AdminMiddleware} from "./middleware/AdminMiddleware.tsx";
import ComponentPage from "./pages/ComponentPage/ComponentPage.tsx";
import { fetchComponentsThunk } from "./store/slices/componentsSlice.ts";

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const profile = useSelector(selectUser);

    useEffect(() => {
        if (profile) return;
        (async () => {
            try {
              await dispatch(loadMeThunk()).unwrap();
            } catch (e: any) { /* Ignore */ }
        })()
    }, [dispatch])
  
  useEffect(() => {
        if (profile) return;
        (async () => {
            try {
              await dispatch(fetchComponentsThunk({ type: "all", page: 1, pageSize: 50 })).unwrap();
            } catch (e: any) { /* Ignore */ }
        })()
    }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageTransition><MainPage /></PageTransition>} />
        <Route path="/components/:componentID" element={<PageTransition><ComponentPage /></PageTransition>} />

        {/* Defended by Token Middleware */}

        <Route element={<PageTransition><TokenMiddleware /></PageTransition>} >
            <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
        </Route>

        {/* Defended by Auth Middleware */}

        <Route element={<PageTransition><AuthMiddleware /></PageTransition>} >
            <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
            <Route path="/build" element={<PageTransition><BuildPage /></PageTransition>} />
            <Route path="/builds/:id" element={<PageTransition><BuildViewPage /></PageTransition>} />
        </Route>

        {/* Defended by Admin Middleware */}

        <Route element={<PageTransition><AdminMiddleware /></PageTransition>} >
            <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;