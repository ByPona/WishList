import React from "react";
import { createContext, useState } from "react";

export const CardsContext = createContext()

export function CardsContextProvider(props) {
  const [filtro, setFiltro] = useState('')
  const [pagina, setPagina] = useState(true)
  const [buscar, setBuscar] = useState('');
  const [reload, setReload] = useState(false)

  const ChangeFilter = (filtro) => {
    setFiltro(filtro)
    setPagina(false)
    console.log(filtro)
  }

  const mostrarInicio = () =>{
    setPagina(true)
    // if pagina == true -> mostrar inicio
  }

  const buscarGame = (game) =>{
    setBuscar(game)
  }
  return (
    <>
      <CardsContext.Provider value={{ filtro: filtro, ChangeFilter:ChangeFilter, pagina:pagina, mostrarInicio:mostrarInicio, buscarGame:buscarGame, buscar:buscar, reload:reload, setReload:setReload}}>
      {props.children}
      </CardsContext.Provider>
    </>
  );
}
