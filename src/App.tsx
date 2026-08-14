import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router'
import { TabBar } from './components/TabBar'
import { Hoy } from './screens/Hoy'
import { Explorar } from './screens/Explorar'
import { FichaEspecie } from './screens/FichaEspecie'
import { Calendario } from './screens/Calendario'
import { MiHuerta } from './screens/MiHuerta'
import { Glosario } from './screens/Glosario'
import { Ajustes } from './screens/Ajustes'
import './screens/screens.css'

function ConTabs() {
  return (
    <>
      <Outlet />
      <TabBar />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<ConTabs />}>
          <Route path="/" element={<Navigate to="/hoy" replace />} />
          <Route path="/hoy" element={<Hoy />} />
          <Route path="/explorar" element={<Explorar />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/huerta" element={<MiHuerta />} />
        </Route>
        <Route path="/explorar/:slug" element={<FichaEspecie />} />
        <Route path="/glosario" element={<Glosario />} />
        <Route path="/ajustes" element={<Ajustes />} />
        <Route path="*" element={<Navigate to="/hoy" replace />} />
      </Routes>
    </HashRouter>
  )
}
