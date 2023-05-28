import { useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import { IMaskInput } from "react-imask";
import style from './Modal.module.css'
import axios from 'axios';

export default function ModalCadPaciente() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [dadosFormulario, setDadosFormulario] = useState({
        name: '',
        phone_number: '',
        identifier: '',
        classificacao: 'Não atendido'
    });
    function CadPaciente(e: { preventDefault: () => void; }) {
        e.preventDefault()
        axios.post('http://localhost:5566/pacients', dadosFormulario)
            .then(() => {
                setShow(false)
                window.location.reload();
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDadosFormulario(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    };


    return (
        <>
            <button onClick={handleShow} className={style.btnCadPaciente}>
                Cadastrar paciente
            </button>
            <Modal
                className={style.modalBackdrop}
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="lg"

                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastro de Paciente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className={style.formCadPaciente} method="post">
                        <div>
                            <label htmlFor="name" className={style.labelCad}>Nome completo</label>
                            <input
                                type="text" id="name"
                                name="name"
                                className={style.inputModalCad}
                                placeholder="Digite seu nome..."
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="telefone" className={style.labelCad}>Número de celular</label>
                            {/* <input
                                type="text" id="telefone" name="phone_number"
                                className={style.inputModalCad}
                                placeholder="Digite seu telefone..."
                                onChange={handleChange}
                            /> */}
                            <IMaskInput
                                mask="(00) 9 0000-0000"
                                type="text" id="telefone" name="phone_number"
                                className={style.inputModalCad}
                                placeholder="Digite seu telefone..."
                                onChange={handleChange}
                            />
                            
                        </div>

                        <div>
                            <label htmlFor="cpf" className={style.labelCad}>Número do CPF</label>
                            <IMaskInput
                                mask="000.000.000-00"
                                type="text" id="cpf"
                                name="identifier"
                                className={style.inputModalCad}
                                placeholder="Digite seu CPF..."
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="dataNasc" className={style.labelCad}>Data de nascimento</label>
                            <IMaskInput
                                mask="0000-00-00"
                                type="text" id="dataNasc"
                                name="birthdate"
                                className={style.inputModalCad}
                                placeholder="Digite sua data de nascimento..."
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="fotoPac" className={style.labelCad}>Foto do paciente</label>
                            <input
                                type="text" id="fotoPac"
                                name="image"
                                className={style.inputModalCad}
                                placeholder='Foto do paciente'
                                onChange={handleChange}
                            />
                        </div>
                        <button type="button" onClick={CadPaciente} className={style.btnEnviarPac} id="btnEnviarPac">Enviar</button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}

