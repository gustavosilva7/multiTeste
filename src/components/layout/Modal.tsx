import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { IMaskInput } from "react-imask";
import style from './Modal.module.css';
import axios from 'axios';

export default function ModalCadPaciente() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    interface FormData {
        name: string;
        identifier: string;
        phone_number: string;
        birthdate: string;
        image: File | null;
    }

    const [dadosFormulario, setDadosFormulario] = useState<FormData>({
        name: '',
        identifier: '',
        birthdate: '',
        phone_number: '',
        image: null
    });

    function CadPaciente(e: React.FormEvent) {
        e.preventDefault();

        function formatarCPF(cpf: string | undefined): string {
            const numerosCPF = cpf?.replace(/\D/g, '');
            return `${numerosCPF?.substr(0, 3)}${numerosCPF?.substr(3, 3)}${numerosCPF?.substr(6, 3)}${numerosCPF?.substr(9, 2)}`;
        }
        function formatarCell(cell: string | undefined): string {
            const numerosCell = cell?.replace(/\D/g, '');
            return `${numerosCell?.substr(0, 3)}${numerosCell?.substr(3, 3)}${numerosCell?.substr(6, 3)}${numerosCell?.substr(9, 2)}`;
        }

        const CPFformulario = formatarCPF(dadosFormulario.identifier)
        const Cellformulario = formatarCell(dadosFormulario.phone_number)

        const formData = new FormData();
        formData.append('name', dadosFormulario.name);
        formData.append('identifier', CPFformulario);
        formData.append('phone_number', Cellformulario);
        formData.append('birthdate', dadosFormulario.birthdate);
        if (dadosFormulario.image) {
            formData.append('image', dadosFormulario.image);
        }

        console.log(dadosFormulario)
        formData.forEach((value, key) => {
            console.log(key + ': ' + value);
        });



        axios.post("http://covid-checker.sintegrada.com.br/api/patients", formData)
            .then(response => {
                setShow(false);
                window.location.reload();
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === 'image' && files && files.length > 0) {
            setDadosFormulario(values => ({
                ...values,
                [name]: files[0]
            }));
        } else {
            setDadosFormulario(values => ({
                ...values,
                [name]: value
            }));
        }
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
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Cadastro de Paciente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className={style.formCadPaciente} encType="multipart/form-data" onSubmit={CadPaciente}>
                        <div>
                            <label htmlFor="name" className={style.labelCad}>Nome completo</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={style.inputModalCad}
                                placeholder="Digite seu nome..."
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="cpf" className={style.labelCad}>Número do CPF</label>
                            <IMaskInput
                                mask="000.000.000-00"
                                type="text"
                                id="cpf"
                                name="identifier"
                                className={style.inputModalCad}
                                placeholder="Digite seu CPF..."
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="telefone" className={style.labelCad}>Número de celular</label>
                            <IMaskInput
                                mask="(00) 9 0000-0000"
                                type="text"
                                id="telefone"
                                name="phone_number"
                                className={style.inputModalCad}
                                placeholder="Digite seu telefone..."
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="dataNasc" className={style.labelCad}>Data de nascimento</label>
                            <IMaskInput
                                mask="0000-00-00"
                                type="text"
                                id="dataNasc"
                                name="birthdate"
                                className={style.inputModalCad}
                                placeholder="Digite sua data de nascimento..."
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="fotoPac" className={style.labelCad}>Foto do paciente</label>
                            <input
                                type="file"
                                id="fotoPac"
                                name="image"
                                className={style.inputModalCad}
                                placeholder='Foto do paciente'
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className={style.btnEnviarPac} id="btnEnviarPac">Enviar</button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}

