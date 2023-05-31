import { useState, useEffect } from 'react'
import style from './Inicial.module.css'
import axios from 'axios'
import ModalCadPaciente from '../layout/Modal'
import { Link } from 'react-router-dom';
import { differenceInYears } from 'date-fns';
import { AiOutlineArrowRight } from "react-icons/ai";


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
        axios.get("http://covid-checker.sintegrada.com.br/api/patients")
            .then((response) => {
                // console.log("certo")
                setPatients(response.data.data)
            })
            .catch(() => {
                console.log("erro")
            })
    }, [])

    function formatarCPF(cpf: string | undefined): string {
        const CPFformatado = cpf?.replace(/\D/g, '');
        return `
        ${CPFformatado?.substr(0, 3)}.${CPFformatado?.substr(3, 3)}.${CPFformatado?.substr(6, 3)}-${CPFformatado?.substr(9, 2)}`;
    }

    return (
        <div className={style.mainInicial}>
            <div className={style.divBtnCadPaciente}>
                <ModalCadPaciente />
            </div>
           
            <div className={style.listPatients}>
                {patients.map((patient) => {
                    const pacienteIdade = patient.birthdate;
                    let idadeCal;
                    if (pacienteIdade) {
                        const [dia, mes, ano] = pacienteIdade.split('/');
                        const dataFormatada = `${ano}-${mes}-${dia}`;
                        idadeCal = differenceInYears(new Date(), new Date(dataFormatada));
                    }

                    return (
                        <div className={style.uniquePatient} key={patient.id}>
                            <span>{patient.name}</span>
                            <span>Não atendido</span>
                            <span>{formatarCPF(patient?.identifier)}</span>
                            <span>{idadeCal} anos</span>
                            <Link to={`pages/${patient.id}`}>
                                <AiOutlineArrowRight />
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}