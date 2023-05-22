import style from './Pacientes.module.css'
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { differenceInYears } from 'date-fns';
import axios from "axios";

interface Paciente {
    name: string;
    identifier: string
    birthdate: string
    phone_number: string
    id: number
    classificacao: string
    image: string
}

export default function Paciente() {

    const { id } = useParams();
    const [paciente, setPaciente] = useState<Paciente | null>(null);


    useEffect(() => {
        axios
            .get(`http://localhost:5566/pacients/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((resp) => {
                setPaciente(resp.data);
            })
            .catch(() => {
                console.log("erro");
            });
    }, [id]);

    const [temperatura, setTemperatura] = useState("");
    const [pressaoSistolica, setPressaoSistolica] = useState("");
    const [pressaoDiastolica, setPressaoDiastolica] = useState("");
    const [frequenciaRespiratoria, setFrequenciaRespiratoria] = useState("");

    const [modalMaisInforPac, setmodalMaisInforPac] = useState(true);
    const enviarInforsAdd = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setmodalMaisInforPac(false);
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
            {
                modalMaisInforPac && (
                    <div className={style.mainAtendimento}>
                        <div id='modalBackDrop' className={style.modalBackDrop}>
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
                                            placeholder="Digite a frequência do paciente"
                                            value={frequenciaRespiratoria}
                                            onChange={(event) => setFrequenciaRespiratoria(event.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <button type="submit">Enviar</button>
                                    </div>
                                </form>

                            </dialog>
                        </div>
                    </div>
                )
            }
            {
                !modalMaisInforPac && (

                    <div className={style.mainAtendimento}>
                        <div className={style.topAtendimento}>
                            <div>
                                    <img width="100%" height="100%" src={paciente?.image} alt="Foto do paciente" />
                            </div>
                            <div>
                                <h4>{paciente?.name}</h4>
                                <span>{formatarCPF(paciente?.identifier)}</span>
                                {idadeCal &&
                                    <p>Idade: {idadeCal} anos</p>
                                }
                            </div>
                            <div>
                                <button onClick={() => {
                                    alert(formatarCPF(paciente?.identifier))
                                }}>
                                    Atender Paciente
                                </button>
                            </div>
                        </div>
                        <div className={style.footerAtendimento}>
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
                        </div>
                    </div>

                )
            }
        </div>
    );
}

