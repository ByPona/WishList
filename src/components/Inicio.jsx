import React, { useState } from "react";
import "../styles/Inicio.css";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const styleExito = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "green",
  color: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  textAlign: "center",
  flexDirection: "column",
};

const styleFalla = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "red",
  color: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  textAlign: "center",
  flexDirection: "column",
};

function Inicio() {
  //ModalAgregarJuegoEstados
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    cleanAddGame();
  };

  const [nombre, setNombre] = useState("");
  const [platform, setPlatform] = useState("");
  const [type, setType] = useState("");
  const [fecha, setFecha] = useState("");
  const [ruta, setRuta] = useState("");

  const cleanAddGame = () => {
    setNombre("");
    setPlatform("");
    setType("");
    setFecha("");
    setRuta("");
    setButtonDisable(false);
    setFieldModify("");
    setJuegoModificar("");
  };
  const handleChangePlatform = (e) => {
    setPlatform(e.target.value);
    console.log(e.target.value);
  };

  const handleChangeType = (e) => {
    setType(e.target.value);
    console.log(e.target.value);
  };

  const getPhoto = (e) => {
    let localPath = e.target.files[0].path;
    setRuta(localPath);
    console.log(localPath);
  };

  const buildDate = (e) => {
    let dia = e.$D;
    let mes = parseInt(e.$M, 10) + 1;
    mes = mes.toString();
    let anio = e.$y;
    let fechaCompleta = `${dia}/${mes}/${anio}`;
    //console.log(fechaCompleta)
    setFecha(fechaCompleta);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(buttonDisable == false && ruta == ''){
      var imgChecker = ''
    }
    if(nombre=='' || platform == '' ||type==''|| fecha =='' || imgChecker == ''){
      console.log('datos vacios, revise')
      handleOpenFalla();
    }else{
    var rutaPrev = "";
    if (buttonDisable == true) {
      console.log("defaultelegida");
      //Iba a cambiar pos switch pero pss asi ya jala
      if (platform == "PC") {
        rutaPrev = "\\PC.jpeg";
        console.log("pc");
      } else if (platform == "Xbox") {
        rutaPrev = "\\xbox.jpg";
        console.log("xbox");
      } else if (platform == "Playstation") {
        rutaPrev = "\\playstation.jpg";
        console.log("play");
      } else {
        rutaPrev = "\\nintendoswitch.jpg";
        console.log("ninsw");
      }
    } else {
      rutaPrev = ruta;
    }
    console.log(rutaPrev);
    try {
      const respuesta = await fetch("http://localhost:4000/addGames", {
        method: "POST", // O el método HTTP que necesites (GET, POST, PUT, DELETE, etc.)
        headers: {
          "Content-Type": "application/json", // O el tipo de contenido que necesites
        },
        body: JSON.stringify({
          // Puedes pasar datos en el cuerpo de la solicitud si es necesario
          nombre: nombre,
          plataforma: platform,
          tipo: type,
          img_url: rutaPrev,
          fecha_salida: fecha,
        }),
      });

      if (respuesta.status == 500) {
        console.log("algo salio mal");
        handleOpenFalla();
      } else {
        console.log(respuesta);
        handleClose();
        cleanAddGame();
        handleOpenExito();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  };

  const [buttonDisable, setButtonDisable] = useState(false);

  //ModalModificarJuegoEstados
  const [openModifcar, setOpenModificar] = useState(false);

  const [juegosModificarMostrar, setJuegosModificarMostrar] = useState([]);
  const handleOpenModificar = async () => {
    setOpenModificar(true);
    const resp = await fetch(`http://localhost:4000/games`);
    const juegosPeticion = await resp.json();
    console.log(juegosPeticion);
    console.log(juegosPeticion.length);
    let tempArray = [];
    juegosPeticion.forEach(function (jueg) {
      tempArray.push(jueg.nombre);
    });
    console.log(tempArray);
    setJuegosModificarMostrar(tempArray);
    //setJuegosModificarMostrar(juegosPeticion)
  };

  const handleCloseModificar = () => {
    setOpenModificar(false);
    cleanAddGame();
  };

  const [juegoModificar, setJuegoModificar] = useState("");
  const [fieldModify, setFieldModify] = useState("");

  const handleChangeModify = (e) => {
    console.log(e.target.value);
    setFieldModify(e.target.value);
  };

  const handleSubmitChange = async (e) => {
    e.preventDefault();
    //console.log("submitchange");
    //console.log(fieldModify)
    console.log(juegoModificar)
    switch(fieldModify){
      case 'nombre': console.log(nombre);var valueToChange = nombre;break;
      case 'fecha_salida': console.log(fecha);var valueToChange = fecha;break;
      case 'plataforma': console.log(platform);var valueToChange = platform;break;
      case 'foto': console.log(ruta);var valueToChange = ruta;break;
    }
    console.log(fieldModify, valueToChange, juegoModificar)
    const respuesta = await fetch("http://localhost:4000/updateGames", {
      method: "PUT", // O el método HTTP que necesites (GET, POST, PUT, DELETE, etc.)
      headers: {
        "Content-Type": "application/json", // O el tipo de contenido que necesites
      },
      body: JSON.stringify({
        // Puedes pasar datos en el cuerpo de la solicitud si es necesario
        fieldToChange: fieldModify,
        valueToChange: valueToChange,
        valueToSearch: juegoModificar,
      }),
    });
    if(respuesta.status == 200){
      handleCloseModificar();
      handleOpenExito();
    }else{
      console.log('hubo un error')
      handleOpenFalla();
    }
    
  };

  ///////Modales Exito
  const [openExito, setOpenExito] = useState(false);
  const handleOpenExito = () => setOpenExito(true);
  const handleCloseExito = () => {
    setOpenExito(false);
  };

  const [openFalla, setOpenFalla] = useState(false);
  const handleOpenFalla = () => setOpenFalla(true);
  const handleCloseFalla = () => {
    setOpenFalla(false);
  };

  return (
    <>
      <div
        style={{
          width: "90%",
          height: "600px",
          display: "flex",
          flexDirection: "column",
          marginTop: "10%",
        }}
      >
        <h1 style={{ color: "white" }}>Elije una opción: </h1>
        <center>
          <Button
            onClick={handleOpen}
            variant="contained"
            sx={{
              fontSize: "30px",
              marginTop: "10%",
              backgroundColor: "green",
              width: "40%",
            }}
          >
            Agregar Juego
          </Button>
        </center>
        <center>
          <Button
            onClick={handleOpenModificar}
            variant="contained"
            sx={{
              fontSize: "30px",
              marginTop: "5%",
              backgroundColor: "green",
              width: "40%",
            }}
          >
            Modificar Juego
          </Button>
        </center>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <center>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Rellene los campos
              </Typography>
            </center>
            <TextField
              id="outlined-basic"
              label="Nombre"
              variant="outlined"
              required
              sx={{ width: "100%", marginTop: "8%" }}
              onChange={(e) => {
                setNombre(e.target.value);
              }}
            />

            <FormControl fullWidth sx={{ marginTop: "10%" }} required>
              <InputLabel id="demo-simple-select-label">Plataforma</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={platform}
                label="Plataforma"
                onChange={handleChangePlatform}
              >
                <MenuItem value={"PC"}>PC</MenuItem>
                <MenuItem value={"Xbox"}>Xbox</MenuItem>
                <MenuItem value={"Playstation"}>Playstation</MenuItem>
                <MenuItem value={"NintendoSwitch"}>NintendoSwitch</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ marginTop: "10%" }} required>
              <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="Plataforma"
                onChange={handleChangeType}
              >
                <MenuItem value={"Juego"}>Juego</MenuItem>

                <MenuItem value={"DLC"}>DLC</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs} required>
              <DemoContainer
                components={["DatePicker"]}
                sx={{ marginTop: "8%" }}
                required
              >
                <DatePicker
                  label="Fecha de Salida"
                  sx={{ width: "100%" }}
                  required
                  onChange={(e) => {
                    buildDate(e);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>

            {buttonDisable == false ? (
              <center>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ marginTop: "5%" }}
                >
                  Subir Foto
                  <input
                    type="file"
                    hidden
                    accept=".png, .jpg, .jpeg, .svg, .webp"
                    onChange={getPhoto}
                  />
                </Button>
              </center>
            ) : (
              <center>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ marginTop: "5%" }}
                  disabled
                >
                  Subir Foto
                  <input
                    type="file"
                    hidden
                    accept=".png, .jpg, .jpeg, .svg, .webp"
                    onChange={getPhoto}
                  />
                </Button>
              </center>
            )}

            <center>
              <FormControlLabel
                sx={{ marginTop: "2%" }}
                control={
                  <Checkbox
                    onClick={(e) => {
                      console.log(e.target.checked);
                      if (e.target.checked == true) {
                        setButtonDisable(true);
                      } else {
                        setButtonDisable(false);
                      }
                    }}
                  />
                }
                label="Usar default de la plataforma"
              />
            </center>
            {ruta != "" || buttonDisable == true ? (
              <center>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ marginTop: "2%", color: "green" }}
                >
                  Imagen Subida
                </Typography>
              </center>
            ) : (
              <center>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ marginTop: "2%", color: "red" }}
                >
                  Imagen No Subida
                </Typography>
              </center>
            )}

            <center>
              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{ marginTop: "8%", fontSize: "20px", width: "90%" }}
              >
                Subir Juego
              </Button>
            </center>
          </Box>
        </Modal>

        <Modal
          open={openModifcar}
          onClose={handleCloseModificar}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <center>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Escriba el nombre del juego a modificar
              </Typography>
            </center>
            {fieldModify == "" ? (
              <Autocomplete
                onChange={(event, value) => {
                  //console.log(value)
                  setJuegoModificar(value);
                }}
                disablePortal
                id="combo-box-demo"
                options={juegosModificarMostrar}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Juego" />
                )}
                required
              />
            ) : (
              <Autocomplete
                onChange={(event, value) => {
                  setJuegoModificar(value.label);
                }}
                disablePortal
                disabled
                id="combo-box-demo"
                options={juegosModificarMostrar}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Juego" />
                )}
                required
              />
            )}

            {juegoModificar != "" ? (
              <FormControl fullWidth sx={{ marginTop: "10%" }} required>
                <InputLabel id="demo-simple-select-label">
                  Campo a cambiar
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={fieldModify}
                  label="campo"
                  onChange={handleChangeModify}
                  required
                >
                  <MenuItem value={"nombre"}>Nombre</MenuItem>
                  <MenuItem value={"fecha_salida"}>Fecha de Salida</MenuItem>
                  <MenuItem value={"plataforma"}>Plataforma</MenuItem>
                  <MenuItem value={"foto"}>Foto</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <h1></h1>
            )}

            {fieldModify === "nombre" && (
              <TextField
                id="outlined-basic"
                label="Nombre"
                variant="outlined"
                required
                sx={{ width: "100%", marginTop: "8%" }}
                onChange={(e) => {
                  setNombre(e.target.value);
                }}
              />
            )}
            {fieldModify === "fecha_salida" && (
              <LocalizationProvider dateAdapter={AdapterDayjs} required>
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{ marginTop: "8%" }}
                  required
                >
                  <DatePicker
                    label="Fecha de Salida"
                    sx={{ width: "100%" }}
                    required
                    onChange={(e) => {
                      buildDate(e);
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            )}
            {fieldModify === "plataforma" && (
              <FormControl fullWidth sx={{ marginTop: "10%" }} required>
                <InputLabel id="demo-simple-select-label">
                  Plataforma
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={platform}
                  label="Plataforma"
                  onChange={handleChangePlatform}
                >
                  <MenuItem value={"PC"}>PC</MenuItem>
                  <MenuItem value={"Xbox"}>Xbox</MenuItem>
                  <MenuItem value={"Playstation"}>Playstation</MenuItem>
                  <MenuItem value={"NintendoSwitch"}>Nintendo Switch</MenuItem>
                </Select>
              </FormControl>
            )}
            {fieldModify === "foto" && (
              <center>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ marginTop: "5%" }}
                >
                  Subir Foto
                  <input
                    type="file"
                    hidden
                    accept=".png, .jpg, .jpeg, .svg, .webp"
                    onChange={getPhoto}
                  />
                </Button>
              </center>
            )}

            {fieldModify === "foto" && ruta != "" && (
              <center>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ marginTop: "2%", color: "green" }}
                >
                  Imagen Subida
                </Typography>
              </center>
            )}

            {fieldModify === "foto" && ruta == "" && (
              <center>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ marginTop: "2%", color: "red" }}
                >
                  Imagen No Subida
                </Typography>
              </center>
            )}

            {fieldModify != "" && (
              <center>
                <Button
                  onClick={handleSubmitChange}
                  variant="contained"
                  sx={{ marginTop: "8%", fontSize: "20px", width: "90%" }}
                >
                  Modificar Juego
                </Button>
              </center>
            )}
          </Box>
        </Modal>

        <Modal
          open={openExito}
          onClose={handleCloseExito}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleExito}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            ¡Juego subido o actualizado con éxito!
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            El proceso se ha realizado con éxito, puede revisarlo en su respectiva
              pestaña
            </Typography>
          </Box>
        </Modal>

        <Modal
          open={openFalla}
          onClose={handleCloseFalla}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleFalla}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            Ha ocurrido un error
              
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            El proceso ha fallado, revise los datos ingresados e intente de nuevo

            </Typography>
          </Box>
        </Modal>
      </div>
    </>
  );
}

const games = [
  {
    label: "Spiderman 2",
  },
  {
    label: "Call of Duty Modern Warfare 2",
  },
  {
    label: "Destiny 2: La reina bruja",
  },
];
export default Inicio;
