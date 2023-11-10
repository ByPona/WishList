import React, { useContext, useEffect, useState } from "react";
import "../styles/Inicio.css";
import Buscador from "./Buscador";
import Card from "./Card";
import { CardsContext } from "../context/CardsContext";

function Cards() {
  const {filtro, buscar, reload} = useContext(CardsContext)
  const [juegos, setJuegos] = useState([])
  const [juegosFilter, setJuegosFilter] = useState([])

  useEffect(() => {
    console.log(filtro,'cards.jsx') 
    fetchdata();

  },[filtro, reload])

  useEffect(() =>{
    //console.log(buscar)
    let newJuegos = juegos.filter(juego =>{
      let nombreMinusculas = juego.nombre.toLowerCase();
      return nombreMinusculas.includes(buscar.toLowerCase())
    })
    console.log(newJuegos)
    setJuegosFilter(newJuegos)
  },[buscar])

  const fetchdata = async() =>{
    const resp = await fetch(`http://localhost:4000/gamesFiltro?filtro=${filtro}`);
    const juegosPeticion = await resp.json()
    //console.log(juegosPeticion)

    const fechaActual = new Date();
    //console.log(fechaActual);

    const cadenaFechaActual = `${fechaActual.getFullYear()}-${fechaActual.getMonth() + 1}-${fechaActual.getDate()}`
    //console.log(cadenaFechaActual)

    for (const elemento of juegosPeticion) {
      let indice = elemento.fecha_salida.indexOf("T");
      let subcadena = elemento.fecha_salida.slice(0,indice)
      
      //elemento.fecha_salida = subcadena
      let fecha1 = new Date(subcadena)
      let fecha2 = new Date(cadenaFechaActual)
      //console.log(fecha1)
      //console.log(fecha2)

      if (fecha1 <= fecha2) {
        //console.log('fecha1 es anterior a fecha2');
        elemento.fecha_salida = 1
      } else{
        //console.log('fecha1 es posterior a fecha2');
        elemento.fecha_salida = 0
      } 
    }
    setJuegos(juegosPeticion)
    setJuegosFilter(juegosPeticion)
  }
  //console.log(filtro)
  //console.log(buscar)
  if(juegos.length == 0){
    console.log('no hay juegos')
    return(<h1 style={{marginTop: '20%', color:'white', fontSize:'50px'}}>No hay juegos en la WishList de {filtro}</h1>)
  }else{
    return (
      <>
      <div style={{}}><Buscador />
        <h1 style={{color: 'white'}}>{filtro}</h1>
        </div>
        
        <div style={{  width: "90%", display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridGap:'40px', marginTop:'1%'}}>
          
          
        {juegosFilter.map((juego, index) => (
          <Card key={index} id={juego.id} imgurl={juego.img_url} titulo={juego.nombre} tipo={juego.tipo} estado={juego.fecha_salida}/>
        ))}
        </div>
        <div style={{marginBottom: '4%'}}></div>
      </>
    );
  }

}

export default Cards;
