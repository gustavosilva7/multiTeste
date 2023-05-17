// import React from "react"
import {Routes, Route, BrowserRouter as Router} from "react-router-dom"

import Inicial from "./components/pages/Inicial"
import Paciente from "./components/pages/Pacientes.tsx"
import Header from "./components/layout/Header.tsx"

import style from './App.module.css'

export default function App() {
    return (
        <div className={style.container}>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Inicial />}></Route>
                    {/* <Route path="/paciente" element={<Paciente />}></Route> */}
                </Routes>
            </Router> 
        </div>
    );
}