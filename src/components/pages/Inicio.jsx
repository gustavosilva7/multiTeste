import React, { useEffect, useState } from 'react';

import style from './inicio.module.css'
import axios from 'axios';
import Example from '../layout/modal';


export default function Inicio() {

    useEffect(() => {
        axios.get("https://documenter.getpostman.com/view/10407570/2s83tJGAjg")
            .then(() => {
                console.log("certo")
            })
            .catch(() => {
                console.log("erro")
            })
    }, [])

    return (
        <div className={style.mainInicial}>
            <Example />
        </div>
    )
}
