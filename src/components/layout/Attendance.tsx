import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import style from './Attendance.module.css'

interface Attendance {
    id: number;
    symptoms: [];
}

export default function GetAttendance() {
    const [attendances, setAttendances] = useState<Attendance[]>([])
    const { id } = useParams();
    const [showAttendance, setShowAttendance] = useState(false);

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
                // console.log(resp.data.data);
                setAttendances(resp.data.data);
            })
            .catch(() => {
                console.log("erro");
            });
    })

    function calculateSymptomPercentage(attendance: any): number {
        const symptoms = attendance.symptoms?.length || 0;
        const totalSymptoms: number = 5;

        if (symptoms === 0 || totalSymptoms === 0) {
            return 0;
        }

        return (symptoms / totalSymptoms) * 100;
    }

    function getCondition(percentage: number): string {
        if (percentage >= 0 && percentage < 40) {
            return 'Sintomas insuficientes';
        } else if (percentage >= 40 && percentage < 60) {
            return 'Potencialmente infectado';
        } else {
            return 'Possível infectado';
        }
    }

    // Exemplo de uso:
    attendances.forEach((attendance) => {
        const percentage = calculateSymptomPercentage(attendance);
        const condition = getCondition(percentage);

        console.log(`Porcentagem de sintomas: ${percentage}%`);
        console.log(`Condição: ${condition}`);
    });


    return (
        <div className={style.modal}>
            <dialog className={style.dialog} open>
                <h3>Condições dos últimos atendimento</h3>
                <button onClick={() => setShowAttendance(false)}>Close</button>
                {attendances.map((attendance) => {
                    const percentage = calculateSymptomPercentage(attendance);
                    const condition = getCondition(percentage);
                    return (
                        <div className={style.attendances}>
                            <p>{condition}</p>
                            <hr />
                        </div>
                    )
                })}
                <h3>Total de atendimentos: { attendances.length}</h3>
            </dialog>
            </div>
    )
}