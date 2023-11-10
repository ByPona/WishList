import React, { useContext, useEffect, useState } from "react";
import "../styles/Buscador.css";
import TextField from "@mui/material/TextField";
import { alpha, styled } from '@mui/material/styles';
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CardsContext } from "../context/CardsContext";

function Buscador() {


  const {buscarGame} = useContext(CardsContext)
  const BuscarJuego = (e) => {
    //console.log(e.target.value)
    buscarGame(e.target.value)
    
  }

  return (
    <div
      style={{
        width: "100%",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", justifyContent: 'flex-end', marginRight:'5%'}}>
        <TextField
          id="standar"
          label="Buscar"
          variant="standard"
          sx={{ marginLeft:'7%', color:'white', fontSize: ''}}
          onChange={BuscarJuego}
        />
      </div>
    </div>
  );
}

export default Buscador;
