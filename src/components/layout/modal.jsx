
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { IMaskInput } from "react-imask";
import style from './Modal.module.css'

function Example() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Cadastro de Paciente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label htmlFor="">Nome completo</label>
                        <input type="text" placeholder='Digite seu nome aqui' />
                        <div>
                            <div>
                                <label htmlFor="">Data de nascimento</label>
                                <input type="date" placeholder='Digite sua data de nascimento aqui' />
                            </div>
                            <div>
                                <label htmlFor="">CPF</label>

                                <IMaskInput
                                    mask="000.000.000-00"
                                    placeholder="Digite o seu CPF"
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label htmlFor="">Número do telefone</label>
                                <IMaskInput
                                    mask="(00) 90000-0000"
                                    placeholder="Digite o seu número"
                                />
                            </div>
                            <div>
                                <label htmlFor="">Foto do paciente</label>
                                <input type="file" placeholder='Insira sua imagem'/>
                            </div>
                        </div>

                        <button type='button'>Enviar</button>

                    </form>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        closeButton
                    </Button>
                </Modal.Footer> */}
            </Modal>
        </>
    );
}

export default Example;