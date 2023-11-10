const path = require('path');
const { app, BrowserWindow } = require('electron');
const isDev = process.env.IS_DEV == "true" ? true : false;
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 1100,
    autoHideMenuBar: true,
    resizable: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
  });
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );
}
app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


const express = require('express');
const cors = require('cors'); // Importa el paquete cors
const {Pool, Client} = require('pg')
const bodyParser = require('body-parser');
const fs = require('fs');
const path2 = require('path');

const appExpress = express();
appExpress.use(cors());
appExpress.use(bodyParser.urlencoded({ extended: false }));
appExpress.use(bodyParser.json());

const port = 4000; // Puerto en el que se ejecutará el servidor

const credenciales = {
  user:'postgres',
  host:'localhost',
  database:'GamesWishList',
  password:'219748227'
}

appExpress.get('/games', async(req, res) => {
  const db = new Client(credenciales)
  try {
    await db.connect();
    const juegos = await db.query('SELECT nombre FROM Games'); // Ejemplo de consulta SQL
    //console.log(juegos)
    res.status(200).json(juegos.rows)
  } catch (error) {
    //console.error(error);
    res.status(500).json({ error: 'Error al recuperar los juegos' });
  }finally{
    await db.end()
  }
});

appExpress.get('/gamesFiltro', async(req, res) => {
  const db = new Client(credenciales)
  const filtro = req.query.filtro;
  try {
    await db.connect();
    const juegos = await db.query("SELECT * FROM Games where plataforma = $1 order by nombre asc", [filtro]); // Ejemplo de consulta SQL
    //console.log(juegos.rows)
    res.status(200).json(juegos.rows)
  } catch (error) {
    //console.error(error);
    res.status(500).json({ error: 'Error al recuperar los juegos' });
  }finally{
    await db.end()
  }
});

appExpress.post('/addGames', async(req, res) => {
  const db = new Client(credenciales)
  console.log(req.body)
  let {nombre, fecha_salida, plataforma, img_url, tipo} = req.body
  console.log(img_url)

  let nameImg_url = img_url.slice(img_url.lastIndexOf('.'), img_url.length)
  console.log(nameImg_url)
  nameImg_url = `${nombre.replace(/\s/g,'').toLowerCase()}${nameImg_url}`
  nameImg_url = nameImg_url.replace(/:/g,'')
  console.log('nombrefinal: ',nameImg_url)

  
  let img_url_destination = `src\\assets\\${nameImg_url}` //Esto meteremos a la base de datos
  //img_url es desde donde lo copiamos
  let img_url_local_dest = path2.join(__dirname,'..','src','assets',nameImg_url) //Aqui es a donde lo copiamos

  console.log(img_url)
  try {

    if(img_url.includes('nintendoswitch.jpg')==true||img_url.includes('PC.jpeg')==true||
    img_url.includes('playstation.jpg')==true||img_url.includes('xbox.jpg')==true){
      console.log('Imagenes Default, no se borran')
      console.log(img_url)
      console.log(img_url_destination)
      img_url_destination = img_url.slice(img_url.lastIndexOf('\\')+1,img_url.length)
      console.log(img_url_destination)
      img_url_destination = `src\\assets\\${img_url_destination}`
      console.log(img_url_destination)
    }else{
  fs.rename(img_url, img_url_local_dest, (err) => {
    if (err) {
      console.error('Error al mover el archivo:', err);
    } else {
      console.log('Archivo movido con éxito.');
    }
  });}

    await db.connect();
    const juegos = await db.query("INSERT INTO Games(nombre,fecha_salida, plataforma, img_url, tipo) VALUES($1,$2,$3,$4,$5)", [nombre, fecha_salida,plataforma,img_url_destination,tipo]); // Ejemplo de consulta SQL
    //console.log(juegos)
    if(juegos.rowCount == 1){
      res.status(200).json({msg: 'Insertado con exito!'})
    }else{
      res.status(500).json({error: 'No se pudo insertar, error en la base de datos'})
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar los juegos' });
  }finally{
    await db.end()
  }

});


appExpress.delete('/deleteGames', async(req, res) => {
  const db = new Client(credenciales)
  //console.log(req)
  console.log('entro')
  const id = req.body.id;
  
  try{
    await db.connect();
    const img_route = await db.query("SELECT img_url FROM Games where id = $1", [id]);

    console.log(img_route.rows[0].img_url)

    let nameImg_url = img_route.rows[0].img_url.slice(img_route.rows[0].img_url.lastIndexOf('\\')+1, img_route.rows[0].img_url.length)
    console.log(nameImg_url)
    let img_url_local_dest = path2.join(__dirname,'..','src','assets',nameImg_url) //Aqui es a donde lo copiamos

    console.log(img_url_local_dest)
    if(img_url_local_dest.includes('nintendoswitch.jpg')==true||img_url_local_dest.includes('PC.jpeg')==true||
    img_url_local_dest.includes('playstation.jpg')==true||img_url_local_dest.includes('xbox.jpg')==true){
      console.log('Imagenes Default, no se borran')
    }else{

    fs.unlink(img_url_local_dest, (err) => {
      if (err) {
        console.error('Error al borrar el archivo:', err);
      } else {
        console.log('Archivo borrado con éxito.');
      }

    });}
    const juegos = await db.query("DELETE FROM Games where id = $1", [id]); // Ejemplo de consulta SQL
    console.log(juegos.rows)
    res.status(200).json(juegos.rows)

  }catch(error){
    console.error(error)
    res.status(500).json({ error: 'Error al borrar el juego' });
  }finally{
    await db.end()
  }

});

appExpress.put('/updateGames', async(req, res) => {
  const db = new Client(credenciales)
  //console.log(req)
  console.log('entro update')
  var fieldToChange = req.body.fieldToChange
  var valueToChange = req.body.valueToChange //De donde la copiamos
  const valueToSearch = req.body.valueToSearch
  //console.log(fieldToChange)
  //console.log(typeof(fieldToChange), typeof(valueToChange))
  console.log(fieldToChange)
  if(fieldToChange=='foto'){
    //fieldToChange = 'img_url'
    //Debemos buscar foto para borrarla 
    try{
    await db.connect();
    const img_route = await db.query("SELECT img_url FROM Games where nombre = $1", [valueToSearch]);
    console.log(img_route.rows[0].img_url)
    let nameImagenBorrar = img_route.rows[0].img_url
    nombreAnteriorImagen = nameImagenBorrar.slice(nameImagenBorrar.lastIndexOf('\\')+1,nameImagenBorrar.lastIndexOf('.'))//nombreImagenSinExtension
    let extensionNuevaParaImagen = valueToChange.slice(valueToChange.lastIndexOf('.'), valueToChange.length)//ExtensionImagenNueva
    console.log('NombreImagenBorrarJuego',nombreAnteriorImagen)//
    console.log('Extension Nueva',extensionNuevaParaImagen)//ExtensionImagen
    let nuevoNombreImagen = nombreAnteriorImagen + extensionNuevaParaImagen
    console.log(nuevoNombreImagen)

    let rutaImagenBorrar = path2.join(__dirname,'..','src','assets',nameImagenBorrar.slice(nameImagenBorrar.lastIndexOf('\\')+1, nameImagenBorrar.length)) //Ruta lista para borrar
    console.log(rutaImagenBorrar)
    //Borramos foto
    fs.unlink(rutaImagenBorrar, (err) => {
      if (err) {
        console.error('Error al borrar el archivo:', err);
      } else {
        console.log('Archivo borrado con éxito.');
      }

    })
    let nuevoNombreImagenRutaCompleta = path2.join(__dirname,'..','src','assets',nuevoNombreImagen)
  console.log(valueToChange, nuevoNombreImagenRutaCompleta)
    //Movemos foto nueva
    fs.rename(valueToChange, nuevoNombreImagenRutaCompleta, (err) => {
      if (err) {
        console.error('Error al mover el archivo:', err);
      } else {
        console.log('Archivo movido con éxito.');
      }
    });
    //Actualizar la url en la base de datos con la nueva extension
    let img_url_destination = `src\\assets\\${nuevoNombreImagen}` //Esto meteremos a la base de datos
    console.log(img_url_destination)
    const juegos = await db.query(`UPDATE Games SET img_url = $1 WHERE nombre = $2`, [img_url_destination, valueToSearch]); // Ejemplo de consulta SQL
    console.log(juegos)
    res.status(200).json({msg: 'Actualizado correctamente'})
  }catch(error){
    //console.err('error: ',error)
    res.status(500).json({error: 'Error'})
  }finally{
    db.end()
  }

    //No se ocupa hacer el update en la database ya que es la misma ruta por que se usa el mismo nombre


  }else{
    try{
      await db.connect();
      const juegos = await db.query(`UPDATE Games SET ${fieldToChange} = $1 WHERE nombre = $2`, [valueToChange, valueToSearch]); // Ejemplo de consulta SQL
      console.log(juegos)
      res.status(200).json(juegos.rows)
    }catch(error){
      console.error(error)
      res.status(500).json({ error: 'Error al actualizar el juego' });
    }finally{
      await db.end()
    }
  }


});
// Iniciar el servidor
appExpress.listen(port, () => {
  console.log(`El servidor Express está escuchando en el puerto ${port}`);
});
