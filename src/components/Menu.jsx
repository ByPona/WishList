import React, { useCallback, useContext } from "react";
import '../styles/Menu.css'
import { CardsContext } from "../context/CardsContext";


function Menu() {

    const {ChangeFilter, mostrarInicio} = useContext(CardsContext)
    
    return(
        <>
        <header className="header">
        <a id="inicio" href="" onClick={(e) => {e.preventDefault(), mostrarInicio()}}>Inicio</a>

    <nav className="navbar">
        
        <a id="pc" href="" onClick={(e) => {e.preventDefault(), ChangeFilter('PC')}}>PC</a>
        <a id="xbox" href="" onClick={(e) => {e.preventDefault(),ChangeFilter('Xbox')}}>Xbox</a>
        <a id="play" href="" onClick={(e) => {e.preventDefault(),ChangeFilter('Playstation')}}>Playstation</a>
        <a id="nintendo" href="" onClick={(e) => {e.preventDefault(),ChangeFilter('NintendoSwitch')}}>Nintendo Switch</a>
    </nav>
    </header>
    </>
    )
}

export default Menu