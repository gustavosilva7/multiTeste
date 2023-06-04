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

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            setSintomasSelecionados((prevSelecionados) => [...prevSelecionados, value]);
        } else {
            setSintomasSelecionados((prevSelecionados) =>
                prevSelecionados.filter((sintoma) => sintoma !== value)
            );
        }
    };

    return (
        <div>
            <button className={style.btnAtenderPaciente} onClick={handleShow}>
                Atender Paciente
            </button>
            {show && (
                <div className={style.divmodalAtenderPaciente}>
                    <dialog open={show} className={style.modalAtenderPaciente}>
                        <header className={style.headerModalAtenderPaciente}>
                            <button onClick={handleClose}>x</button>
                        </header>
                        <main className={style.mainModalAtenderPaciente}>
                            <form className={style.formModalAtenderPaciente}>
                                <h3>brabo</h3>
                                {pacienteEmAtendimento.map((pa) => (
                                    <div key={pa.id}>
                                        {pa.symptoms.map((symptom) => (
                                            <div key={symptom.name}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        value={symptom.name}
                                                        checked={sintomasSelecionados.includes(symptom.name)}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    {symptom.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </form>
                        </main>
                    </dialog>
                </div>
            )}
        </div>
    );
}
