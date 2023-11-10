import React, {useContext, useState} from "react";
import Button from '@mui/material/Button';
import { CardsContext } from "../context/CardsContext";

function Card(props) {
  //Mandamos llamar la función de cambiar filtro y el filtro para poder alterar el campo de filtro cuando se elimine y esto 
  //desencadena un useEffect para recargar los datos
  const {setReload, reload} = useContext(CardsContext)
  const [size, setSize] = useState('32px');
  const Comprado = async()=>{
    //console.log(props.id)
    try{
      const respuesta = await fetch('http://localhost:4000/deleteGames', {
        method: 'DELETE', // O el método HTTP que necesites (GET, POST, PUT, DELETE, etc.)
        headers: {
          'Content-Type': 'application/json', // O el tipo de contenido que necesites
        },
        body: JSON.stringify({ // Puedes pasar datos en el cuerpo de la solicitud si es necesario
          id: props.id
        }),
      });

      if(respuesta.status == 500){
        console.log('algo salio mal')
      }else{
        console.log(respuesta)
      }
      setReload(!reload)
    }catch(error){
      console.error('Error:', error);
    }

    
  }
  //console.log(props.titulo.length)

  return (
    <>
      <div style={{ backgroundColor: "rgba(65, 105, 225, 0.8)", width: '100%', height: '360px', borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.3)'}}>
        <img src={props.imgurl} alt="MiImagen" style={{width:'300px',height:'150px', marginTop:'3%', borderRadius: '5px'}}/>
        {props.titulo.length >30 ? <h1 style={{fontSize: '28px' ,marginTop:'7%', height: '20%', display: 'flex',justifyContent:'center',alignItems:'center',padding: '0% 1%', width:'80%'}}>{props.titulo}</h1>:<h1 style={{fontSize: '32px' ,marginTop:'7%', height: '20%', display: 'flex',justifyContent:'center',alignItems:'center',padding: '0% 1%', width:'80%'}}>{props.titulo}</h1>}
        
        <div style={{display:'flex', justifyContent: 'space-between', alignItems:'center', margin:'9% 7%'}}>
            {props.estado == 1?<h2 style={{color:'green'}}>Lanzado</h2>:<h2 style={{color:'red'}}>Desarrollo</h2>}
            <h2>{props.tipo}</h2>
            <Button onClick={Comprado} variant="contained">Comprado</Button>
        </div>
      </div>
    </>
  );
}

export default Card;
