import { Link } from "react-router-dom";
import style from './header.module.css'

export default function Header() {
    return (
        <div className={style.header}>
            <div>
                <h2>Teste Multintegrada</h2>
            </div>
            <div>
                <ul>
                    <li>
                        <Link to="/">Inicio</Link>
                    </li>
                    <li>
                        <Link to="/paciente">Página de atendemento</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}