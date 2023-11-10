import React, { useContext } from "react";
import Menu from "./components/Menu";
import Inicio from "./components/Inicio";
import Cards from "./components/Cards";
import { CardsContext } from "./context/CardsContext";
function App() {

  const {pagina} = useContext(CardsContext)
  //console.log(pagina)
  return (
    <div>

      <div>
        <Menu />
      </div>

      <center><div style={{ paddingTop: "60px"}}>
      {//<Inicio />
      }
      {pagina == true ? <Inicio/>: <Cards/>}
      
      </div></center>
    </div>
  );
}

export default App;
