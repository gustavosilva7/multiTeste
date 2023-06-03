import { useState } from 'react';
import style from './ModalAtenderPac.module.css';

export default function ModalAtenderPac() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            <button
                className={style.btnAtenderPaciente}
                onClick={handleShow}
            >
                Atender Paciente
            </button>
            {show && (
                <div className={style.divmodalAtenderPaciente}>
                    <dialog open={show} className={style.modalAtenderPaciente}>
                        <header>
                            <button onClick={handleClose}>x</button>
                        </header>
                        <main>
                            <form>
                                <h3>brabo</h3>
                            </form>
                        </main>
                    </dialog>
                </div>
            )}
        </div>
    );
}
