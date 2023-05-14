import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Inicio from './components/pages/Inicio';
import Atendimemto from "./components/pages/Atendimento"
import Header from "./components/layout/header"
import 'bootstrap/dist/css/bootstrap.min.css';

import style from './App.module.css'

export default function App() {
    return (
        <div className={style.container}>
            <Router>
                <Header />
                <Routes>
                    <Route exact path="/" element={<Inicio />}></Route>
                    <Route path="/paciente" element={<Atendimemto />}></Route>
                </Routes>
            </Router>
        </div>
    );
}