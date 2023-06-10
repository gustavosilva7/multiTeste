import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { differenceInYears } from 'date-fns';
import axios from "axios";
import ModalAtenderPac from '../layout/ModalAtenderPaciente';
import style from './Pacientes.module.css';
import { AiOutlineArrowLeft } from "react-icons/ai";
import GetAttendance from "../layout/Attendance";

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
    const [showAttendance, setShowAttendance] = useState(false);


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



    

    return (
        <div>
            {modalMaisInforPac && (
                <div className={style.mainAtendimento}>
                    <div id='modalBackDrop' className={style.modalBackDrop}>

                        <Link to='/' className={style.backpag}>
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
                </div>
            )}
            {!modalMaisInforPac && (
                <div className={style.mainAtendimento}>
                    <Link to='/' className={style.backPagTwo}>
                        <AiOutlineArrowLeft />
                    </Link>
                    <div className={style.topAtendimento}>
                        <div className={style.ladoOneTop}>
                            {paciente && (
                                <>
                                    <h4>Nome do paciente: <span><i>{paciente.name}</i></span>
                                        {!showAttendance && <GetAttendance />}
                                    </h4>
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
                        <div className={style.pressao}>
                            <p>Pressão sistólica: {pressaoSistolica} e Pressão diastólica: {pressaoDiastolica}</p>
                            <section className={style.sectionTable}>
                                <table className={style.table}>
                                    <thead>
                                        <tr>
                                            <th colSpan={6}>Pressão para adultos</th>
                                        </tr>
                                    </thead>
                                    <thead>
                                        <tr>
                                            <th colSpan={3}>Nomeclatura</th>
                                            <th colSpan={2}>Sistólica</th>
                                            <th colSpan={2}>Diastólica</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan={3} style={parseFloat(pressaoSistolica) < 90 ? { color: "rgba(0, 0, 0, 1)" } : {}}>Hipotenso</td>
                                            <td colSpan={2} style={parseFloat(pressaoSistolica) < 90 ? { color: "rgba(0, 0, 0, 1)" } : {}}>Abaixo de 90</td>
                                            <td colSpan={2} style={parseFloat(pressaoDiastolica) < 60 ? { color: "rgba(0, 0, 0, 1)" } : {}}>Abaixo de 60</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} style={parseFloat(pressaoSistolica) >= 90 && parseFloat(pressaoSistolica) <= 130 ? { color: "rgba(0, 0, 0, 1)" } : {}}>Normotenso</td>
                                            <td colSpan={2} style={parseFloat(pressaoSistolica) >= 90 && parseFloat(pressaoSistolica) <= 130 ? { color: "rgba(0, 0, 0, 1)" } : {}}>90 - 130</td>
                                            <td colSpan={2} style={parseFloat(pressaoDiastolica) >= 60 && parseFloat(pressaoDiastolica) <= 84 ? { color: "rgba(0, 0, 0, 1)" } : {}}>60 - 85</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} style={parseFloat(pressaoSistolica) >= 131 && parseFloat(pressaoSistolica) <= 139 ? { color: "rgba(0, 0, 0, 1)" } : {}}>Normotenso Limítrofe</td>
                                            <td colSpan={2} style={parseFloat(pressaoSistolica) >= 131 && parseFloat(pressaoSistolica) <= 139 ? { color: "rgba(0, 0, 0, 1)" } : {}}>130 - 139</td>
                                            <td colSpan={2} style={parseFloat(pressaoDiastolica) >= 85 && parseFloat(pressaoDiastolica) <= 89 ? { color: "rgba(0, 0, 0, 1)" } : {}}>85 - 89</td>
                                        </tr>
                                        <tr>
                                            <td rowSpan={3} colSpan={1} style={parseFloat(pressaoSistolica) >= 140 ? { color: "rgba(0, 0, 0, 1)" } : {}}>Hipertenso</td>
                                            <td colSpan={2} style={parseFloat(pressaoSistolica) >= 140 && parseFloat(pressaoSistolica) <= 159 ? { color: "rgba(0, 0, 0, 1)" } : {}}>Leve</td>
                                            <td colSpan={2} style={parseFloat(pressaoSistolica) >= 140 && parseFloat(pressaoSistolica) <= 159 ? { color: "rgba(0, 0, 0, 1)" } : {}}>140 - 159</td>
                                            <td colSpan={2} style={parseFloat(pressaoDiastolica) >= 90 && parseFloat(pressaoDiastolica) <= 99 ? { color: "rgba(0, 0, 0, 1)" } : {}}>90 - 99</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2} style={parseFloat(pressaoSistolica) >= 160 && parseFloat(pressaoSistolica) <= 179 ? { color: "rgba(0, 0, 0, 1)" } : {}}>Moderado</td>
                                            <td colSpan={2} style={parseFloat(pressaoSistolica) >= 160 && parseFloat(pressaoSistolica) <= 179 ? { color: "rgba(0, 0, 0, 1)" } : {}}>160 - 179</td>
                                            <td colSpan={2} style={parseFloat(pressaoDiastolica) >= 100 && parseFloat(pressaoDiastolica) <= 109 ? { color: "rgba(0, 0, 0, 1)" } : {}}>100 - 109</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2} style={parseFloat(pressaoSistolica) >= 180 ? { color: "rgba(0, 0, 0, 1)" } : {}}>Grave</td>
                                            <td colSpan={2} style={parseFloat(pressaoSistolica) >= 180 ? { color: "rgba(0, 0, 0, 1)" } : {}}>Acima de 180</td>
                                            <td colSpan={2} style={parseFloat(pressaoDiastolica) >= 110 ? { color: "rgba(0, 0, 0, 1)" } : {}}>Acima de 110</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>
                        </div>
                        <div className={style.frequencia}>
                            <p>Frequência Cardíaca: {frequenciaCardiaca}</p>
                            <section className={style.sectionTable}>
                                <table className={style.table}>
                                    <thead>
                                        <tr>
                                            <th colSpan={6}>pulsação - adultos</th>
                                        </tr>
                                    </thead>
                                    <thead>
                                        <tr>
                                            <th colSpan={3}>Valor</th>
                                            <th colSpan={3}>Nomeclatura</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={parseFloat(frequenciaCardiaca) < 60 ? { color: "rgba(0, 0, 0, 1)" } : {}}>
                                            <td colSpan={3}>Abaixo de 60 bpm</td>
                                            <td colSpan={3}>Bradicárdico</td>
                                        </tr>
                                        <tr style={parseFloat(frequenciaCardiaca) >= 60 && parseFloat(frequenciaCardiaca) <= 100 ? { color: "rgba(0, 0, 0, 1)" } : {}}>
                                            <td colSpan={3}>60 - 100 bpm</td>
                                            <td colSpan={3}>Nomocárdico</td>
                                        </tr>
                                        <tr style={parseFloat(frequenciaCardiaca) > 100 ? { color: "rgba(0, 0, 0, 1)" } : {}}>
                                            <td colSpan={3}>Acima de 100 bpm</td>
                                            <td colSpan={3}>Taquicárdico</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>

                            <h6>ADULTOS: 60 - 100 bpm; CRIANÇAS: 80 - 130 bpm; LACTENTES: 120 - 160 bpm;</h6>
                        </div>
                        <div className={style.frequenciaRes}>
                            <p>Frequência Respiratória: {frequenciaRespiratoria}</p>
                            <section className={style.sectionTable}>
                                <table className={style.table}>
                                    <thead>
                                        <tr>
                                            <th colSpan={6}>respiração - adultos</th>
                                        </tr>
                                    </thead>
                                    <thead>
                                        <tr>
                                            <th colSpan={3}>Valor</th>
                                            <th colSpan={3}>Nomeclatura</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={parseFloat(frequenciaRespiratoria) < 14 ? { color: "rgba(0, 0, 0, 1)" } : {}}>
                                            <td colSpan={3}>Abaixo de 14 irpm</td>
                                            <td colSpan={3}>Bradipnéico</td>
                                        </tr>
                                        <tr style={parseFloat(frequenciaRespiratoria) >= 14 && parseFloat(frequenciaRespiratoria) <= 20 ? { color: "rgba(0, 0, 0, 1)" } : {}}>
                                            <td colSpan={3}>14 - 20 irpm</td>
                                            <td colSpan={3}>Eupnéico</td>
                                        </tr>
                                        <tr style={parseFloat(frequenciaRespiratoria) > 20 ? { color: "rgba(0, 0, 0, 1)" } : {}}>
                                            <td colSpan={3}>Acima de 20 irpm</td>
                                            <td colSpan={3}>Taquipnéico</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>

                        </div>
                        <div className={style.temp}>
                            <p>Temperatura: {temperatura}</p>
                            <section className={style.sectionTable}>
                                <table className={style.table}>
                                    <thead>
                                        <tr>
                                            <th colSpan={6}>temperatura</th>
                                        </tr>
                                    </thead>
                                    <thead>
                                        <tr>
                                            <th colSpan={3}>Valor</th>
                                            <th colSpan={3}>Nomeclatura</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={parseFloat(temperatura) <= 36 ? { color: "rgba(0, 0, 0, 1)" } : {}}>
                                            <td colSpan={3}>Abaixo de 36°C</td>
                                            <td colSpan={3}>Hipotermia</td>
                                        </tr>
                                        <tr style={parseFloat(temperatura) > 36.1 && parseFloat(temperatura) < 37.2 ? { color: "rgba(0, 0, 0, 1)" } : {}}>
                                            <td colSpan={3}>36,1°C - 37,2°C</td>
                                            <td colSpan={3}>Normotermia ou Afebril</td>
                                        </tr>
                                        <tr style={parseFloat(temperatura) > 37.3 && parseFloat(temperatura) < 37.7 ? { color: "rgba(0, 0, 0, 1)" } : {}}>
                                            <td colSpan={3}>37,3°C - 37,7°C</td>
                                            <td colSpan={3}>Estado febril/subfebril ou febrícula</td>
                                        </tr>
                                        <tr style={parseFloat(temperatura) >= 37.8 && parseFloat(temperatura) <= 38.9 ? { color: "rgba(0, 0, 0, 1)" } : {}}>
                                            <td colSpan={3}>37,8°C - 38,9°C</td>
                                            <td colSpan={3}>Febre</td>
                                        </tr>
                                        <tr style={parseFloat(temperatura) >= 39 && parseFloat(temperatura) <= 40 ? { color: "rgba(0, 0, 0, 1)" } : {}}>
                                            <td colSpan={3}>39°C - 40°C</td>
                                            <td colSpan={3}>Pirexia</td>
                                        </tr>
                                        <tr style={parseFloat(temperatura) > 40 ? { color: "rgba(0, 0, 0, 1)" } : {}}>
                                            <td colSpan={3}>Acima de 40°C</td>
                                            <td colSpan={3}>Hiperpirexia</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}