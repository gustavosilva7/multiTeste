import { useState, useEffect } from 'react'
import style from './Inicial.module.css'
import axios from 'axios'
import ModalCadPaciente from '../layout/Modal'
import { Link } from 'react-router-dom';

interface Patient {
    id: number;
    name: string;
    identifier: string;
    birthdate: string;
    phone_number: string;
    classificacao: string
}
export default function Inicial() {
    const [patients, setPatients] = useState<Patient[]>([])
    useEffect(() => {
        axios.get("http://localhost:5566/pacients")
            .then((response) => {
                setPatients(response.data)
            })
            .catch(() => {
                console.log("erro")
            })
    }, [])    

    return (
        <div className={style.mainInicial}>
            <div className={style.divBtnCadPaciente}>
                <ModalCadPaciente />
            </div>
            <div className={style.listPatients}>
                {patients.map((patient) => {
                    return (
                        <div className={style.uniquePatient} key={patient.id}>
                            <span>{patient.name}</span>
                            <span>{patient.classificacao}</span>
                            <span>{patient.identifier}</span>
                            <span>{patient.birthdate}</span>
                            <Link to={`pages/${patient.id}`}>
                                Atender
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}