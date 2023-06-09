import { useState, useEffect } from 'react';
import style from './Inicial.module.css';
import axios from 'axios';
import ModalCadPaciente from '../layout/Modal';
import { Link } from 'react-router-dom';
import { differenceInYears } from 'date-fns';
import { AiOutlineArrowRight } from 'react-icons/ai';

interface Patient {
    image: string | undefined;
    id: number;
    name: string;
    identifier: string;
    birthdate: string;
    phone_number: string;
    classificacao: string;
}

export default function Inicial() {
    const [patients, setPatients] = useState<Patient[]>([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get('http://covid-checker.sintegrada.com.br/api/patients');
                const fetchedPatients: Patient[] = response.data.data;
                const updatedPatients = await Promise.all(fetchedPatients.map(async (patient) => {
                    try {
                        const attendanceResponse = await axios.get(`http://covid-checker.sintegrada.com.br/api/patients/${patient.id}/attendances`);
                        const attendances = attendanceResponse.data.data;
                        const lastAttendance = attendances[attendances.length - 1];

                        if (lastAttendance) {
                            const symptomPercentage = calculateSymptomPercentage(lastAttendance);
                            const condition = getCondition(symptomPercentage);
                            return { ...patient, classificacao: condition };
                        } else {
                            return { ...patient, classificacao: 'Não atendido' };
                        }
                    } catch (error) {
                        console.log('Erro ao obter as informações de atendimento do paciente:', error);
                        return patient;
                    }
                }));
                setPatients(updatedPatients);
            } catch (error) {
                console.log('Erro ao obter os pacientes:', error);
            }
        };

        fetchPatients();
    }, []);

    function calculateSymptomPercentage(attendance: any): number {
        const symptoms = attendance.symptoms?.length || 0;
        const totalSymptoms: number = 5;

        if (symptoms === 0 || totalSymptoms === 0) {
            return 0;
        }

        return (symptoms / totalSymptoms) * 100;
    }

    function getCondition(percentage: number): string {
        // console.log('Percentage:', percentage);

        if (percentage >= 0 && percentage < 40) {
            // console.log('Sintomas insuficientes');
            return 'Sintomas insuficientes';
        } else if (percentage >= 40 && percentage < 60) {
            // console.log('Potencialmente infectado');
            return 'Potencialmente infectado';
        } else {
            // console.log('Possível infectado');
            return 'Possível infectado';
        }
    }

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
                            <span className="condição">{patient.classificacao}</span>
                            <span>{formatarCPF(patient?.identifier)}</span>
                            <span>{idadeCal} anos</span>
                            <Link to={`pages/${patient.id}`}>
                                <AiOutlineArrowRight />
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
