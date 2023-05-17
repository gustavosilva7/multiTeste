import { useState, useEffect } from 'react'
import style from './Inicial.module.css'
import ModalCadPac from '../layout/Modal'
import axios from 'axios'

export default function Inicial() {

    const [patients, setPatients] = useState([])

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
            <ModalCadPac />

            <div className={style.listPatients}>
                {patients.map((patient) => {
                    let nome: string = patient.name
                    let codicao: string = "Não atendido"
                    let cpf: string = patient.identifier
                    let idade: string = patient.birthdate
                    return (
                        <div className={style.uniquePatient}>
                            <p>{nome}</p>
                            <p>{codicao}</p>
                            <p>{cpf}</p>
                            <p>{idade}</p>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}