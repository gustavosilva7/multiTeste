import { useEffect, useState } from 'react';
import style from './ModalAtenderPac.module.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Symptom {
    name: string;
}

interface Paciente {
    id: number;
    patient_id: number;
    symptoms: Symptom[];
}

export default function ModalAtenderPac() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { id } = useParams();
    const [pacienteEmAtendimento, setPacienteEmAtendimento] = useState<Paciente[]>([]);
    const [sintomasSelecionados, setSintomasSelecionados] = useState<string[]>([]);

    useEffect(() => {
        axios
            .get(`http://covid-checker.sintegrada.com.br/api/patients/${id}/attendances`, {
                headers: {
                    "Access-Control-Allow-Headers": "*",
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            })
            .then((resp) => {
                const data = resp.data.data;
                if (Array.isArray(data)) {
                    setPacienteEmAtendimento(data);
                }
            })
            .catch(() => {
                console.log("erro");
            });
    }, [id]);


    const handleFinalizar = () => {
        const form = document.getElementById('modalForm');
        if (form) {
            const checkboxes = form.getElementsByTagName('input');
            const totalInputs = checkboxes.length;
            let marcados = 0;
            const selectedSintomas = [];

            for (let i = 0; i < checkboxes.length; i++) {
                const checkbox = checkboxes[i];

                if (checkbox.checked) {
                    marcados++;
                    selectedSintomas.push(parseInt(checkbox.id));
                }
            }

            const porcentagem = (marcados / totalInputs) * 100;
            console.log(`Porcentagem marcada: ${porcentagem}%`);

            if (porcentagem <= 39) {
                console.log("Condição: Sintomas insuficientes");
            } else if (porcentagem <= 59) {
                console.log("Condição: Potencial Infectado");
            } else if (porcentagem >= 60) {
                console.log("Condição: Possível Infectado");
            } else {
                console.log("ta bom");
            }

            setSintomasSelecionados(selectedSintomas.map(String));

            const LocalInforsPaciente = localStorage.getItem('inforsPaciente');

            if (LocalInforsPaciente) {
                const inforsPaciente = JSON.parse(LocalInforsPaciente);
                inforsPaciente.symptoms = selectedSintomas

                axios
                .post(`http://covid-checker.sintegrada.com.br/api/attendance`, inforsPaciente)
                .then(() => {
                        setTimeout(()=>{
                            setShow(false)
                        }, 1000)
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }

            console.log(selectedSintomas);
        }
    };


    return (
        <div>
            <button className={style.btnAtenderPaciente} onClick={handleShow}>Atender Paciente</button>
            {show && (
                <div className={style.divmodalAtenderPaciente}>
                    <dialog open={show} className={style.modalAtenderPaciente}>
                        <header className={style.headerModalAtenderPaciente}>
                            <button onClick={handleClose}>x</button>
                        </header>
                        <main className={style.mainModalAtenderPaciente}>
                            <form className={style.formModalAtenderPaciente} id="modalForm">
                                <div>
                                    <label htmlFor="5">
                                        <input type="checkbox" name="tosse" id="5" />Tosse
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="10">
                                        <input type="checkbox" name="Dificuldade_de_respirar" id="10" />Dificuldade de respirar
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="12">
                                        <input type="checkbox" name="Falta_de_olfato" id="12" />Falta de olfato
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="2">
                                        <input type="checkbox" name="Coriza" id="2" />Coriza
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="3">
                                        <input type="checkbox" name="Nariz_entupido" id="3" />Nariz entupido
                                    </label>
                                </div>

                                <div>
                                    <button type="button" onClick={handleFinalizar}>Finalizar</button>
                                </div>
                            </form>
                        </main>
                    </dialog>
                </div>
            )}
        </div>
    );
}
