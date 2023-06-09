import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { differenceInYears } from 'date-fns';
import axios from "axios";
import ModalAtenderPac from '../layout/ModalAtenderPaciente';
import { useTransition, animated } from 'react-spring';

import style from './Pacientes.module.css';

import { AiOutlineArrowLeft } from "react-icons/ai";

interface Paciente {
    name: string;
    identifier: string;
    birthdate: string;
    phone_number: string;
    id: number;
    classificacao: string;
    image: string;
}

interface FormData {
    patient_id?: string,
    temperature: string,
    systolic_pressure: string,
    diastolic_pressure: string,
    respiratory_rate: string,
    pulse: string
    symptoms: number[]
}

export default function Paciente() {
    const { id } = useParams();
    const [paciente, setPaciente] = useState<Paciente | null>(null);

    useEffect(() => {
        axios
            .get(`http://covid-checker.sintegrada.com.br/api/patients/${id}`, {
                headers: {
                    "Access-Control-Allow-Headers": "*",
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            })
            .then((resp) => {
                setPaciente(resp.data.data);
                console.log(resp.data.data)
            })
            .catch(() => {
                console.log("erro");
            });
    }, [id]);

    const [inforsPaciente, setinforsPaciente] = useState<FormData>({
        patient_id: id,
        temperature: "",
        systolic_pressure: "",
        diastolic_pressure: "",
        respiratory_rate: "",
        pulse: "",
        symptoms: [],
    });
    const [temperatura, setTemperatura] = useState("");
    const [pressaoSistolica, setPressaoSistolica] = useState("");
    const [pressaoDiastolica, setPressaoDiastolica] = useState("");
    const [frequenciaRespiratoria, setFrequenciaRespiratoria] = useState("");
    const [frequenciaCardiaca, setFrequenciaCardiaca] = useState("");

    const [modalMaisInforPac, setmodalMaisInforPac] = useState(true);

    const enviarInforsAdd = (event: React.FormEvent) => {
        event.preventDefault();
        const formData: FormData = {
            patient_id: id,
            temperature: temperatura,
            systolic_pressure: pressaoSistolica,
            diastolic_pressure: pressaoDiastolica,
            respiratory_rate: frequenciaRespiratoria,
            pulse: frequenciaCardiaca,
            symptoms: []
        };
        setinforsPaciente(formData);
        setmodalMaisInforPac(false)

        localStorage.setItem('inforsPaciente', JSON.stringify(formData));
    };

    const pacienteIdade = paciente?.birthdate;
    let idadeCal;
    if (pacienteIdade) {
        const [dia, mes, ano] = pacienteIdade.split('/');
        const dataFormatada = `${ano}-${mes}-${dia}`;
        idadeCal = differenceInYears(new Date(), new Date(dataFormatada));
    }

    function formatarCPF(cpf: string | undefined): string {
        const numerosCPF = cpf?.replace(/\D/g, '');
        return `
      ${numerosCPF?.substr(0, 3)}.${numerosCPF?.substr(3, 3)}.${numerosCPF?.substr(6, 3)}-${numerosCPF?.substr(9, 2)}`;
    }

    const transitions = useTransition(!modalMaisInforPac, {
        from: { opacity: 0, transform: 'translateX(-50%)' },
        enter: { opacity: 1, transform: 'translateX(0)' },
        leave: { opacity: 0, transform: 'translateX(50%)' },
    });

    return (
        <div>
            {transitions(
                (styles: any, item: any) => item && (
                    <animated.div style={styles} className={style.mainAtendimento}>
                        <div id='modalBackDrop' className={style.modalBackDrop}>
                            <Link to='/'>
                                <AiOutlineArrowLeft />
                            </Link>
                            <dialog id='modalInfors' className={style.modalInforPaciente} open>
                                <div className={style.titleModalInfors}>
                                    <h4>Informações sobre o paciente:</h4>
                                    <span><i>{paciente?.name}</i></span>
                                </div>
                                <form className={style.formInfors} onSubmit={enviarInforsAdd}>
                                    <div>
                                        <label htmlFor="infoTemperatura">Informe a temperatura do paciente</label>
                                        <input
                                            type="number"
                                            id="infoTemperatura"
                                            name="infoTemperatura"
                                            placeholder="Digite a temperatura do paciente"
                                            value={temperatura}
                                            onChange={(event) => setTemperatura(event.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="infoPAS">Informe a pressão arterial sistólica</label>
                                        <input
                                            type="number"
                                            id="infoPAS"
                                            name="infoPAs"
                                            placeholder="Digite a PAS do paciente"
                                            value={pressaoSistolica}
                                            onChange={(event) => setPressaoSistolica(event.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="infoPAD">Informe a pressão arterial diastólica</label>
                                        <input
                                            type="number"
                                            id="infoPAD"
                                            name="infoPAD"
                                            placeholder="Digite a PAD do paciente"
                                            value={pressaoDiastolica}
                                            onChange={(event) => setPressaoDiastolica(event.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="infoFrequencia">Informe a frequência respiratória</label>
                                        <input
                                            type="number"
                                            id="infoFrequencia"
                                            name="infoFrequencia"
                                            placeholder="Digite a frequência respiratória do paciente"
                                            value={frequenciaRespiratoria}
                                            onChange={(event) => setFrequenciaRespiratoria(event.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="infoFrequenciaCa">Informe a frequência Cardíaca</label>
                                        <input
                                            type="number"
                                            id="infoFrequenciaCa"
                                            name="infoFrequenciaCa"
                                            placeholder="Digite a frequência cardíaca do paciente"
                                            value={frequenciaCardiaca}
                                            onChange={(event) => setFrequenciaCardiaca(event.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <button type="submit">Enviar</button>
                                    </div>
                                </form>
                            </dialog>
                        </div>
                    </animated.div>
                )
            )}
            {!modalMaisInforPac && (
                <div className={style.mainAtendimento}>
                    <Link to='/' id="backPag">
                        <AiOutlineArrowLeft />
                    </Link>
                    <div className={style.topAtendimento}>
                        <div className={style.ladoOneTop}>
                            {paciente && (
                                <>
                                    <h4>Nome do paciente: <span><i>{paciente.name}</i></span></h4>
                                    <h5>CPF do paciente: <span><i>{formatarCPF(paciente.identifier)}</i></span></h5>
                                    {idadeCal && <h5>Idade: <span><i>{idadeCal}</i></span> anos</h5>}
                                </>
                            )}
                        </div>
                        <div className={style.ladoTwoTop}>
                            <ModalAtenderPac />
                        </div>
                    </div>
                    <div className={style.footerAtendimento}>
                        <div className={style.swiperContainer}>
                            {transitions(
                                (styles: any, item: any) => item && (
                                    <animated.div style={styles} className={style.swiper}>
                                        <div>
                                            <p>Temperatura: {temperatura}</p>
                                        </div>
                                        <div>
                                            <p>Pressão Arterial Sistólica: {pressaoSistolica}</p>
                                        </div>
                                        <div>
                                            <p>Pressão Arterial Diastólica: {pressaoDiastolica}</p>
                                        </div>
                                        <div>
                                            <p>Frequência Respiratória: {frequenciaRespiratoria}</p>
                                        </div>
                                        <div>
                                            <p>Frequência Cardíaca: {frequenciaCardiaca}</p>
                                        </div>
                                    </animated.div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
