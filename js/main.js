"use strict"

let boxBody = document.querySelector("#idBody");

let captchaGlobal = 1;
let nombreCliente = "";
let precioPesoTemp = 0;
let precioSubtotTemp = 0;
let esValidoSubtot = false;
let item = 0;
let pesoFinal = 0;
let costoFinal = 0;
let logModeGlobal = 0;
let verifLog = false;
let entraAcaptchaXlog = true;
let usuarioLogueado = 0; //valor relacionado al orde de arreglo de usuarios
let entroPorCompras = false;

//////////////////////////     Datos     ////////////////////////////////

// Datos de clientes
let usuarios = [
    {   cliente: "El De prueba",
        localidad: "Santos Lugares",
        contacto: "Otro tipo",
        persJuridica: true,
        usuario: "a",
        pass: "a",
        mail: "el_de_prueba@probando.com.ar",
        ventas: [ 
            {   producto: "Girgola Blanca",
                kilos: 2.5,
                venta: 1600,
            }
        ]
    },
    {   cliente: "Juan Juanetes",
        localidad: "Olavarria",
        contacto: "Juan Perez",
        persJuridica: false,
        usuario: "jperez",
        pass: "jperez",
        mail: "juan_perinola77@gmail.com",
        ventas: [ 
            {   producto: "Girgola Blanca",
                kilos: 2.5,
                venta: 1600,
            }
        ]
    },
    {   cliente: "Pedro & Pablo SA",
        localidad: "Saldungaray",
        contacto: "Pedro Palurdo",
        persJuridica: true,
        usuario: "pypsa",
        pass: "pypsa",
        mail: "compras@pedroypablosa.com.ar",
        ventas: [ 
            {   producto: "Girgola Parda",
                kilos: 2.0,
                venta: 600,
            },
            {   producto: "Girgola Amarilla",
                kilos: 3.5,
                venta: 1800,
            },
            {   producto: "Girgola Rosada",
                kilos: 5.5,
                venta: 2800,
            }
        ]
    },
    {   cliente: "Pablo Pelotudo",
        localidad: "Chilecito",
        contacto: "Pablo Pelotudo",
        persJuridica: false,
        usuario: "ppelo",
        pass: "ppelo",
        mail: "el_dolobu@sarlanga.com.ar",
        ventas: [ 
            {   producto: "Girgola Parda",
                kilos: 0.5,
                venta: 300,
            },
            {   producto: "Girgola Rosada",
                kilos: 3.5,
                venta: 800,
            }
        ]
    }
];





//////////////////////////     Menu     ////////////////////////////////

let boxLoginMovil = document.querySelector("#boxLoginMovil"); // selector login ventana

let menuBtn = document.querySelector("#menu");
menuBtn.addEventListener("click",mostrarMenuDesplegable);
let barraNavRespon = document.querySelector("#barraNavRespon");

function mostrarMenuDesplegable(){  // Movil
    if (boxLoginMovil.classList.contains("mostrarLogin")){
        boxLoginMovil.classList.add("esconder");
        boxLoginMovil.classList.remove("mostrarLogin");
    }
    barraNavRespon.classList.toggle("mostrarNavegador");
}



///////////////////////////    Login     ////////////////////////////////

let btnLogin = document.querySelectorAll(".login");
btnLogin[0].addEventListener("click", function(){logModeGlobal=0; mostrarLogin()});
btnLogin[1].addEventListener("click", function(){logModeGlobal=1; mostrarLogin()});

let inputUsuario = document.querySelector("#inputUsuario");
let inputPass = document.querySelector("#inputPass");
let mejeError = document.querySelectorAll("#mejeError");
let enviarLogin = document.querySelector("#enviarLoginID");
enviarLogin.addEventListener("click", logueo);

// mostrar login
function mostrarLogin(){
    if (barraNavRespon.classList.contains("mostrarNavegador")) // muestra y esconde la ventana de logueo
            barraNavRespon.classList.toggle("mostrarNavegador");
    if (verifLog){ // verifica si hay que abrir o cerrar sesion
        cambiarBotonLogin(false); // el valor TRUE significa que ya existe un usuario logueado
    } else if (boxLoginMovil.classList.contains("esconder")) {
            boxLoginMovil.classList.remove("esconder");
            boxLoginMovil.classList.add("mostrarLogin");
            manipularMejeError(0,false,"");
            inputPass.value="";
            inputUsuario.value="";
        } else {
            boxLoginMovil.classList.remove("mostrarLogin");
            boxLoginMovil.classList.add("esconder");
        }
}
// envio de login
function logueo(){
    // verifica que el login no este vacio
    if (inputUsuario.value=="" || inputPass.value=="")
        manipularMejeError(0,true, "Complete los datos antes de enviar");
    else{
        entraAcaptchaXlog=true;
        irAcaptcha()// verifica captcha
    }
        
}
// Verifica correcto usuario y contraseña
function verificaCorrectoIngreso(){
    let encontrado=false; 
    let nroCliente=0;
    // verifica el usuario
    while (nroCliente<usuarios.length && !encontrado){
        if (inputUsuario.value==usuarios[nroCliente].usuario)
            encontrado=true;
        nroCliente++;
    }
    usuarioLogueado=nroCliente-1;
    if (encontrado==false){
        manipularMejeError(0,true, "El usuario no existe");
        // verifica contraseña
    } else if (inputPass.value==usuarios[usuarioLogueado].pass){ // acciones caundo se completa el proceso de login
        mostrarLogin();
        cambiarBotonLogin(true);
        if(entroPorCompras)
            mostrarDatosDeCliente(); // para pag compras 
    } else 
        manipularMejeError(0,true, "Contraseña incorrecta");
}
// cambiar el boton del login con el nombre de usuario y logout
function cambiarBotonLogin(inicioSesion){
    if (inicioSesion){
        verifLog = true;
        btnLogin[0].innerHTML=`${usuarios[usuarioLogueado].usuario} / Logout`;
        btnLogin[1].innerHTML=`${usuarios[usuarioLogueado].usuario} / Logout`;
    }else{
        if(entroPorCompras)
            mostrarDatosDeCliente(); // para pag compras
        alert("Sesión cerrada con éxito");
        verifLog = false;
        usuarioLogueado=0;
        btnLogin[0].innerHTML=`Login`;
        btnLogin[1].innerHTML=`Login`;
    }
}
// mostrar y ocultar mensaje error login
function manipularMejeError(pos,visible, mensaje){
    if (visible){
        mejeError[pos].classList.remove("esconder");
        mejeError[pos].classList.add("estiloError");
        mejeError[pos].innerHTML=mensaje;
    } else {
        mejeError[pos].classList.remove("estiloError");
        mejeError[pos].classList.add("esconder");
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////
///////                  Partial Render secciones de pagina general                    ///////////
//////////////////////////////////////////////////////////////////////////////////////////////////

let tituloPagina = document.querySelector("#tituloPagina")

let ulr_secciones = ["productos.html",
                     "compras.html",
                     "nosotros.html",
                     "contactenos.html",
                     "administrador.html"];
/*let ulr_secciones = ["http://127.0.0.1:5500/productos.html",
                     "http://127.0.0.1:5500/compras.html",
                     "http://127.0.0.1:5500/nosotros.html",
                     "http://127.0.0.1:5500/contactenos.html",
                     "http://127.0.0.1:5500/administrador.html"];
*/
let cuerpo = document.querySelector(".cuerpo");
let botonesNav = document.querySelectorAll("#btn-nav");

for(let i=0;i<botonesNav.length;i++){ // se crea un evento de escucha para cada boton de menu
    botonesNav[i].addEventListener("click", function(){cargarSeccionPagina(i)});
}


function cargarSeccionPagina(btn){
    // cambio estilo botones de navegación
    cambioEstiloBotonesNav(btn);
    // llamada partial-render AJAX
    cuerpo.innerHTM=`<p>Cargando...</p>`;
    fetch(ulr_secciones[btn]).then(promesa => {
        if(promesa.ok)
            promesa.text().then(html =>{
                mostrarMenuDesplegable()
                cuerpo.innerHTML=html;
                switch (btn){
                    case 0: incializarProductos();
                            break;
                    case 1: incializarCompras();
                            break;
                    case 2: tituloPagina.innerHTML="NOSOTROS";
                            break;
                    case 3: incializarContactenos();
                            break;
                    case 4: inicializarAdministrador();
                            break;
                }
            });
        else 
            trow("error");
    }).catch( error =>{
        cuerpo.innerHTML=`<p>No se pudo cargar la pagina ${ulr_secciones[btn]}</p>`;
    });
}

function cambioEstiloBotonesNav(btn){
    for (let i=0; i<botonesNav.length; i++){
        botonesNav[i].classList.remove("liNavSelSeleccionado");
        botonesNav[i].classList.add("liNavSel");
    }
    botonesNav[btn].classList.remove("liNavSel");
    botonesNav[btn].classList.add("liNavSelSeleccionado");
}

function dynamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL

    document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}


cargarSeccionPagina(0);
mostrarMenuDesplegable()


//////////////////////////////////     PRODUCTOS     /////////////////////////////////////////////////////////////////







let btCompraProductos;

function incializarProductos(){
    tituloPagina.innerHTML="PRODUCTOS";
    btCompraProductos = document.querySelectorAll(".comparHome");
    for (let i=0;i<btCompraProductos.length;i++)
        btCompraProductos[i].addEventListener("click",function(){
            mostrarMenuDesplegable()
            cargarSeccionPagina(1)
        });
    }








//////////////////////////////////      COMPRAS     /////////////////////////////////////////////////////////////////

let precioUnitario_temp;
let subTotal_temp;
let pesoSubtotal_temp;
let descuento_temp;
let descuento;
let listaDeCompra;
let nombreComra;
let localCompra;
let contactoCompra;
let mailCompra;
let perFis;
let perJur;
let datosDeCompra;
let selectorProducto;
let valorPrecioUnitario;
let boxPeso;
let precioSubtotal;
let btnAgregarAcarrito;
let btnAgregarAcarritoX3;
let btnBorrarUlt;
let btnVaciarCarrito;
let tablaItemsCarrito;
let boxPesoFinal;
let boxCostoFinal;
let finalizarCompra;
let botonesControlPeso;
let mejeError1;


//lista de productos
let productos = [
    {
        producto: "Girgola Rosada",
        precio: 890,
    },{
        producto: "Girgola Blanca",
        precio: 800,
    },{
        producto: "Girgola Parda",
        precio: 750,
    },{
        producto: "Girgola Amarilla",
        precio: 960,
    }
];

function incializarCompras(){
    tituloPagina.innerHTML="COMPRAS";
    precioUnitario_temp = 0;
    subTotal_temp = 0;
    pesoSubtotal_temp = 0;
    descuento_temp = false;
    entroPorCompras = true;
    descuento = 0.6;
    listaDeCompra = [];
    nombreComra = document.querySelector("#nombreComra");
    localCompra = document.querySelector("#localCompra");
    contactoCompra = document.querySelector("#contactoCompra");
    mailCompra = document.querySelector("#mailCompra");
    perFis = document.querySelector("#perFis");
    perJur = document.querySelector("#perJur");
    datosDeCompra = document.querySelector("#datosDeCompra");
    // esta porcion de codigo es para mostrar los valores de cliente si es que esta logeado //
    nombreComra = document.querySelector("#nombreComra");
    localCompra = document.querySelector("#localCompra");
    contactoCompra = document.querySelector("#contactoCompra");
    mailCompra = document.querySelector("#mailCompra");
    perFis = document.querySelector("#perFis");
    perJur = document.querySelector("#perJur");
    datosDeCompra = document.querySelector("#datosDeCompra");
    selectorProducto = document.querySelector("#selectorProducto");
    valorPrecioUnitario = document.querySelector("#valorPrecioUnitario");
    // muestra precio unitario del articulo seleccionado con una funsion anonima
    selectorProducto.addEventListener("change",function(){
        precioUnitario_temp = productos[selectorProducto.value].precio;
        valorPrecioUnitario.innerHTML= `$ ${precioUnitario_temp}`;
    });
    boxPeso = document.querySelector("#boxPeso");
    precioSubtotal = document.querySelector("#precioSubtotal");
    // calcula el precio subtotal del articulo seleccionado segun el precio y peso
    boxPeso.addEventListener("keyup",modificarSubtotal);
    boxPeso.addEventListener("change",modificarSubtotal);
    btnAgregarAcarrito = document.querySelector("#btnAgregarAcarrito");
    btnAgregarAcarrito.addEventListener("click",function(){agregarProducto(1)});
    btnAgregarAcarritoX3 = document.querySelector("#btnAgregarAcarritoX3");
    btnAgregarAcarritoX3.addEventListener("click",function(){agregarProducto(3)});
    btnBorrarUlt = document.querySelector("#btnBorrarUlt");
    btnBorrarUlt.addEventListener("click",borrarUltimoCarrito);
    /*    Borrar toda la lista (responde a boton eliminar lista)   */
    btnVaciarCarrito = document.querySelector("#btnVaciarCarrito");
    btnVaciarCarrito.addEventListener("click",vaciarCarrito);
    /* Mostrar los productos en tabla de carrito de compras web */
    tablaItemsCarrito = document.querySelector("#tablaItemsCarrito");
    boxPesoFinal = document.querySelector("#boxPesoFinal");
    boxCostoFinal = document.querySelector("#boxCostoFinal");
    finalizarCompra = document.querySelector("#finalizarCompra");
    finalizarCompra.addEventListener("click",finalizarCompraFuncion);
    /*******   funsion para seleccionar peso  *******/
    botonesControlPeso = document.querySelectorAll(".cambioPeso");
    botonesControlPeso[0].addEventListener("click",function(){seleccionarPesoProducto(0)});
    botonesControlPeso[1].addEventListener("click",function(){seleccionarPesoProducto(1)});
    mejeError1 = document.querySelector("#mejeError1")
    mejeError1.addEventListener("click", manipularMejeError1)
}
function manipularMejeError1(visible, mensaje){
    if (visible){
        mejeError1.classList.remove("esconder");
        mejeError1.classList.add("estiloError");
        mejeError1.innerHTML=mensaje;
    } else {
        mejeError1.classList.remove("estiloError");
        mejeError1.classList.add("esconder");
    }
}
// Botones de Compra desde el home///
function compraHome(opcion){
    if (!verifLog)
        logueo();
    else
        verificacionCaptcha();
}

function mostrarDatosDeCliente(){
    if (verifLog){
        datosDeCompra.classList.add("boxDatosDeCompra");
        datosDeCompra.classList.remove("esconder");
        nombreComra.value = usuarios[usuarioLogueado].cliente
        localCompra.value = usuarios[usuarioLogueado].localidad
        contactoCompra.value = usuarios[usuarioLogueado].contacto
        mailCompra.value = usuarios[usuarioLogueado].mail
        if(usuarios[usuarioLogueado].persJuridica){
            perFis.checked = false;
            perJur.checked = true;
        } else{
            perFis.checked = true;
            perJur.checked = false; 
        }
    }else{
        console.log("esconder")
        datosDeCompra.classList.add("esconder");
        datosDeCompra.classList.remove("boxDatosDeCompra");
    }
}

function modificarSubtotal(){
    subTotal_temp = boxPeso.value * precioUnitario_temp;
    if (boxPeso.value>=10){
        subTotal_temp=subTotal_temp*descuento;
        descuento_temp=true;
    }else{
        descuento_temp=false;
    }
    precioSubtotal.innerHTML = `$ ${subTotal_temp}`;
}

// agregar productos a carrito de compra (responde a btnAgregarAcarrito)
function agregarProducto(cantidad){
    if(selectorProducto.value!="producto" && !(boxPeso.value=="" || boxPeso.value==0)){
        for (let i=0;i<cantidad;i++){
            listaDeCompra.push({
                producto: productos[selectorProducto.value].producto,
                precioUnit: precioUnitario_temp,
                peso: boxPeso.value,
                subtotal: subTotal_temp,
                descuento: descuento_temp,
            })  
        }
        blanquearDatosProductos();
        tablaCarrito();
    }
    
}

function blanquearDatosProductos(){
    selectorProducto.value="producto";
    boxPeso.value="";
    precioSubtotal.innerHTML="$ -.-";
    valorPrecioUnitario.innerHTML="$ -.-";
}

function borrarUltimoCarrito(){
    if (listaDeCompra.length!=0){
        listaDeCompra.pop();
    tablaCarrito();
    }
}

function vaciarCarrito(){
    listaDeCompra = [];
    tablaCarrito();
}

/*     borrar un producto individual del carrito (responde a boton individual de cara producto)    */
function borrarArticuloCarrito(posicion){
    for (let i=(posicion+1); i<listaDeCompra.length;i++)
        listaDeCompra[i-1]=listaDeCompra[i];
    borrarUltimoCarrito()
    
}

function tablaCarrito(){
    boxPesoFinal.innerHTML=``;
    boxCostoFinal.innerHTML=``;
    tablaItemsCarrito.innerHTML=``;
    let peso_total=0;
    let costo_total=0;
    for (let i=0; i<listaDeCompra.length; i++ ){
        let descuento= ``;
        if (listaDeCompra[i].descuento)
            descuento = `itemDescuento`;
        tablaItemsCarrito.innerHTML+=`
        <tr class="fila ${descuento}">
            <td class="columna">${i+1}</td>
            <td class="columna">${listaDeCompra[i].producto}</td>
            <td class="columna">${listaDeCompra[i].peso}kg</td>
            <td class="columnaL">$${listaDeCompra[i].precioUnit}</td>
            <td class="columna">$${listaDeCompra[i].subtotal}</td>
            <td class="columnaS"> <img src="images/delProducto.png" alt="" class="iconEliminarPod" onclick="borrarArticuloCarrito(${i})" ></td> 
        </tr>`;
        peso_total+=parseInt(listaDeCompra[i].peso);
        costo_total+=listaDeCompra[i].subtotal;
    }
    boxPesoFinal.innerHTML=`${peso_total}kg`;
    boxCostoFinal.innerHTML=`$${costo_total}`;
}

function finalizarCompraFuncion(){
    if (!verifLog){
        manipularMejeError1(true, "Debe estar logeado para realizar una compra");
    }else if(listaDeCompra.length==0){
        manipularMejeError1(true, "Debe ingresar un producto para finalizar compra");
     } else {
        alert(`Compra finalizada con exito`);
        /* vaciar lista de compras */
        listaDeCompra=[];
        selectorProducto.value="producto";
        boxPeso.value="";
        vaciarCarrito()
        boxPesoFinal.innerHTML=`0.0kg`;
        boxCostoFinal.innerHTML=`$ -.-`;
        valorPrecioUnitario.innerHTML=`$ -.-`;
        precioSubtotal.innerHTML=`$ -.-`;
        manipularMejeError1(false, "");
     }   
}

function seleccionarPesoProducto(opcion){
    if (opcion==0){
        if (boxPeso.value>0.5 && boxPeso.value!=""){
            
            boxPeso.value= parseFloat(boxPeso.value) - 0.5;
            modificarSubtotal();
        }
    } else
        if (boxPeso.value==""){
            boxPeso.value = 0.5;
            modificarSubtotal();
        }
        else{
            boxPeso.value = parseFloat(boxPeso.value) + 0.5;
            modificarSubtotal();
        }       
}/*
function cancelarCompra(){
    let boxBlureado=document.querySelector("#boxBlureado");      
}
*/
function compraRealizada(){
    if (verificacionCaptcha()){
    //cancelarCompra();
    alert("¡Felicitaciones! su compra fue realizada con éxito.")
    }
}
function verificaLogin(){
    if (verifLog){
        let selProducto = document.querySelector("#selectorProducto");
        onchange=selecionarProducto(selProducto.value);
    } else 
        alert("No es posible realizar la compra sin esta logueado")
        
}
function verificaCompra(){
    let nombreCompra = document.querySelector("#nombreComra");
    let localCompra = document.querySelector("#localCompra");
    let contactoCompra = document.querySelector("#contactoCompra");
    let mailCompra = document.querySelector("#mailCompra");
    let perFis = document.querySelector("#perFis")
    if (nombreCompra.value==""||nombreCliente.value==""||mailCompra.value==""||perFis.value=="")
        return false;
    else
        return true;
}

//////////////////////////////////      CONTACTENOS     /////////////////////////////////////////////////////////////////


let btnMensaje;
let btnEnviarMensaje;
let mejeErrorEnviarMensaje;
let nombre_local;
let mail_local;
let mensaje_local;
let mejeEnviadoCorrectamente ;
let idBoxMensaje;




function incializarContactenos(){
    tituloPagina.innerHTML="CONTACTENOS";
    btnMensaje = document.querySelector("#btnMensaje");
    btnMensaje.addEventListener("click",abrirVentanaVensaje)
    btnEnviarMensaje = document.querySelector("#btnEnviarMensaje");
    btnEnviarMensaje.addEventListener("click",submitMensaje);
    mejeErrorEnviarMensaje = document.querySelector("#mejeErrorEnviarMensaje");
    nombre_local=document.querySelector("#nombreMensaje");
    mail_local=document.querySelector("#emailMensaje");
    mensaje_local=document.querySelector("#textoMensaje");
    mejeEnviadoCorrectamente = document.querySelector("#mejeEnviadoCorrectamente");
    idBoxMensaje = document.querySelector("#idBoxMensaje");
}

function abrirVentanaVensaje(){
    mejeErrorEnviarMensaje.classList.remove("promo");
    mejeErrorEnviarMensaje.classList.add("esconder");
    mejeEnviadoCorrectamente.classList.add("esconder");
    mejeEnviadoCorrectamente.classList.remove("promo");
    nombre_local.value="";
    mail_local.value="";
    mensaje_local.value="";
    idBoxMensaje.classList.toggle("BoxMensaje");
}
/**** boton enviar mensaje */
function submitMensaje(){
    if (nombre_local.value==""||mail_local.value==""||mensaje_local.value==""){
        mejeErrorEnviarMensaje.classList.remove("esconder");
        mejeErrorEnviarMensaje.classList.add("estiloError");
    } else {
        entraAcaptchaXlog=false;
        irAcaptcha();
        //irAcaptcha() 
    }
}

// funsion a al que llama el captcha cuando es resuelto correctamente
function enviarMensaje(){
    abrirVentanaVensaje();
    mejeEnviadoCorrectamente.classList.remove("esconder");
    mejeEnviadoCorrectamente.classList.add("promo");
}






//////////////////////////////////      ADMINISTRADOR     /////////////////////////////////////////////////////////////////




let busquedaXnombre;
let precioMin;
let precioMax;
let ulrAPI_productos;
let mejeErrorAdmin;
let boxRespuesta;
let btn_refrescarLista;
let btn_agregarProducto;
let jsonAPI;

function inicializarAdministrador(){
    busquedaXnombre = document.querySelector("#busquedaXnombre")
    precioMin = document.querySelector("#precioMin")
    precioMax = document.querySelector("#precioMax")
    tituloPagina.innerHTML="ADMINISTRADOR";
    ulrAPI_productos = "https://60c4b786ec8ef800175e060e.mockapi.io/productos_";
    mejeErrorAdmin = document.querySelector("#mejeErrorAdmin");
    boxRespuesta = document.querySelector("#respuesta");
    btn_refrescarLista = document.querySelector("#refrescarLista");
    btn_agregarProducto = document.querySelector("#agregarProducto");
    btn_agregarProducto.addEventListener("click", abrirAgregarProducto)
    btn_refrescarLista.addEventListener("click",()=>{
        busquedaXnombre.value="";
        precioMin.value="";
        precioMax.value="";
        buscarInfoJson(ulrAPI_productos)});
    buscarInfoJson(ulrAPI_productos);
    busquedaXnombre.addEventListener("keyup", ()=>{mostrarItemsNombre(jsonAPI)});
    precioMin.addEventListener("keyup", ()=>{mostrarItemsNombre(jsonAPI)});
    precioMax.addEventListener("keyup", ()=>{mostrarItemsNombre(jsonAPI)});

}

// traer arreglo json desde la API /////////////////////
function buscarInfoJson(url){
    boxRespuesta.innerHTML=`<p class="cargando">Cargando...</p>`;
    fetch (url).then(r => {
        return r.json();
    }).then(items => {
        jsonAPI=JSON.parse(JSON.stringify(items));
        mostrarItemsNombre(items);
        enviarMensaje("",false);
    }).catch(items => {
        enviarMensaje("Error: no se completo la operación", true);
    })
}

// filtrar y mostrar los items  ////////////////////////
function mostrarItemsNombre(items){
    let json_temp = JSON.parse(JSON.stringify(items)); // copia del arreglo original
    boxRespuesta.innerHTML="";
    console.log(json_temp);
    // verifica criterios y elimina los elementos que no coinciden con todos los criterios
    if (busquedaXnombre.value!=""){
        let i = 0;
        while (i<json_temp.length){
        if(!(json_temp[i].producto.toLowerCase().includes(busquedaXnombre.value.toLowerCase())))
            json_temp.splice(i,1);
        else
            i++;
        }
    }
    if (precioMin.value!=""){
        let i=0;
        while (i<json_temp.length){
            if(parseInt(json_temp[i].precio)<parseInt(precioMin.value))
                json_temp.splice(i,1);
            else
                i++;
        }
    }
    if (precioMax.value!=""){
        let i=0;
        while (i<json_temp.length){
            if(json_temp[i].precio>parseInt(precioMax.value))
                json_temp.splice(i,1);
            else
                i++;
        }
    }
    for(let i=0;i<json_temp.length;i++){
        // crear elementos de tabla
        let tr = document.createElement('tr');
        let td_nombre = document.createElement('td');
        let td_precio = document.createElement('td');
        let td_accion = document.createElement('td');
        // creacion de botones de accion
        let btn_borrar = document.createElement('img');
        let btn_editar = document.createElement('img');
        let btn_ver = document.createElement('img');
        btn_editar.src="images/editProducto.png";
        btn_borrar.src="images/delProducto.png";
        btn_ver.src="images/verProducto.png";
        btn_editar.classList="accionesAdmin";
        btn_borrar.classList="accionesAdmin";
        btn_ver.classList="accionesAdmin";
        // agregar contenido a los elementos
        td_nombre.innerHTML=`${json_temp[i].producto}`;
        td_precio.innerHTML=`$ ${json_temp[i].precio}`;
        td_accion.appendChild(btn_borrar);
        td_accion.appendChild(btn_editar);
        td_accion.appendChild(btn_ver);
        // crear fila
        tr.appendChild(td_nombre);
        tr.appendChild(td_precio);
        tr.appendChild(td_accion);
        // agregar a la tabla
        boxRespuesta.appendChild(tr);
        // crear eventos
        btn_borrar.addEventListener("click",()=>{crearVentanaBorrar(json_temp[i].id)});
        btn_editar.addEventListener("click",()=>{crearEditarProducto(json_temp[i])});
        btn_ver.addEventListener("click",()=>{crearVerProducto(json_temp[i])});
    }
}

// borrar producto ////////////////////
function crearVentanaBorrar(item){
    crearVentanaAdministrador("mostrarBoxMensajeCorto");
    let ventanaMensaje = document.querySelector("#ventanaFlotAdmin");
    let mensaje = document.createElement("p");
    mensaje.classList="estiloError";
    mensaje.innerHTML="¿Esta realmente seguro de eliminar el producto?"
    let btn_OK = document.createElement("img");
    btn_OK.src="images/aceptar.png";
    btn_OK.width="30";
    let btn_Cancel = document.createElement("img");
    btn_Cancel.src="images/delProducto.png"
    btn_Cancel.width="30";
    let div = document.createElement("div");
    div.classList="botonesMensajeAdmin";
    let span1= document.createElement("span");
    let span2= document.createElement("span");
    span1.appendChild(btn_Cancel);
    span2.appendChild(btn_OK);
    div.appendChild(span1);
    div.appendChild(span2);
    btn_OK.addEventListener("click", ()=>{ borrarProducto(item)});
    btn_Cancel.addEventListener("click",cerrarVentanaAdministrador);
    ventanaMensaje.appendChild(mensaje);
    ventanaMensaje.appendChild(div);
}

async function borrarProducto(item) {
    console.log(item)
    try {
        let resp = await fetch(`${ulrAPI_productos}/${item}`, {
            "method": "DELETE"
        });
        if (resp.ok) {
            cerrarVentanaAdministrador();
            buscarInfoJson(ulrAPI_productos);
            console.log("ELIMINADO CON EXITO");
        }else{
            console.log("Error al eliminar producto");
        }
    } catch (error) {
        console.log("Error de ULR");
    }
}

// editar producto ////////////////////
function crearEditarProducto(item){
    crearVentanaAdministrador("mostrarBoxMensajeLargo");
    let ventanaMensaje = document.querySelector("#ventanaFlotAdmin");
    let mensaje = document.createElement("p");
    mensaje.classList="divCentrado";
    mensaje.innerHTML="EDITAR PRODUCTO";
    ventanaMensaje.appendChild(mensaje);
    
    let btn_OK = document.createElement("img");
    btn_OK.src="images/aceptar.png";
    btn_OK.width="30";
    let btn_Cancel = document.createElement("img");
    btn_Cancel.src="images/delProducto.png"
    btn_Cancel.width="30";
    let div = document.createElement("div");
    div.classList="divBotoneraAdmin";
    let span1= document.createElement("span");
    let span2= document.createElement("span");
    span1.appendChild(btn_Cancel);
    span2.appendChild(btn_OK);
    div.appendChild(span1);
    div.appendChild(span2);
    btn_Cancel.addEventListener("click",cerrarVentanaAdministrador);
    
    
    let boxId = document.createElement("p");
    let boxProducto = document.createElement("p");
    let boxPrecio = document.createElement("p");
    let boxTitulo = document.createElement("p");
    let boxLatin = document.createElement("p");
    let boxDescrpcn = document.createElement("p");
    let boxImg = document.createElement("p");
    
    let spanProducto = document.createElement("span");
    let spanPrecio = document.createElement("span");
    let spanTitulo = document.createElement("span");
    let spanLatin = document.createElement("span");
    let spanDescrpcn = document.createElement("span");
    let spanImg = document.createElement("span");

    let inputProducto = document.createElement("input");
    let inputPrecio = document.createElement("input");
    let inputTitulo = document.createElement("input");
    let inputLatin = document.createElement("input");
    let inputDescrpcn = document.createElement("textarea");
    inputDescrpcn.name="boxTexto";
    inputDescrpcn.classList="boxTextAreaDescr";
    let inputImg = document.createElement("input");

    inputProducto.value=item.producto;
    inputProducto.placeholder="Campo Obligatorio";
    inputPrecio.value=item.precio;
    inputPrecio.placeholder="Campo Obligatorio";
    inputTitulo.value=item.titulo;
    inputTitulo.placeholder="Campo Obligatorio";
    inputLatin.value=item.latin;
    inputLatin.placeholder="Campo Obligatorio";
    inputDescrpcn.innerHTML=item.descripcion;
    inputDescrpcn.placeholder="Campo Obligatorio";
    inputImg.value=item.imagen;
    inputImg.placeholder="Campo Obligatorio";

    spanProducto.appendChild(inputProducto);
    spanPrecio.appendChild(inputPrecio);
    spanTitulo.appendChild(inputTitulo);
    spanLatin.appendChild(inputLatin);
    spanDescrpcn.appendChild(inputDescrpcn);
    spanImg.appendChild(inputImg);

    boxId.innerHTML="ID: "+item.id;
    boxProducto.innerHTML="Producto ";
    boxProducto.appendChild(spanProducto);
    boxPrecio.innerHTML="Precio ";
    boxPrecio.appendChild(spanPrecio);
    boxTitulo.innerHTML="Titulo ";
    boxTitulo.appendChild(spanTitulo);
    boxLatin.innerHTML="Latin ";
    boxLatin.appendChild(spanLatin);
    boxDescrpcn.innerHTML="Descripcion ";
    boxDescrpcn.appendChild(spanDescrpcn);
    boxImg.innerHTML="Imagen ";
    boxImg.appendChild(spanImg);

    let mensajeError = document.createElement("p");
    mensajeError.classList="esconder";
    mensajeError.innerHTML="Complete los campos antes de enviar";

    ventanaMensaje.appendChild(boxId);
    ventanaMensaje.appendChild(boxProducto);
    ventanaMensaje.appendChild(boxPrecio);
    ventanaMensaje.appendChild(boxTitulo);
    ventanaMensaje.appendChild(boxLatin);
    ventanaMensaje.appendChild(boxDescrpcn);
    ventanaMensaje.appendChild(boxImg);
    ventanaMensaje.appendChild(div);
    ventanaMensaje.appendChild(mensajeError);

    btn_OK.addEventListener("click",()=>{
        if(inputProducto.value=="" || inputPrecio.value=="" || inputTitulo.value=="" || inputLatin.value=="" || inputDescrpcn.value=="" || inputImg.value==""){
            mensajeError.classList.remove("esconder");
            mensajeError.classList.add("estiloError");
        } else
            editarProducto(item.id,
            inputProducto.value,
            inputPrecio.value,
            inputTitulo.value,
            inputLatin.value,
            inputDescrpcn.value,
            inputImg.value)
        }
    );

}

async function editarProducto(id,prod,prec,tit,lat,desc,img){
    let datosAModificar = { id : id,
                            producto : prod,
                            precio : prec,
                            titulo : tit,
                            latin : lat,
                            descripcion : desc,
                            imagen : img
                         };
    try {
        let resp = await fetch(`${ulrAPI_productos}/${id}`, {
            "method": "PUT",
            "headers": { "Content-type": "application/json" },
            "body": JSON.stringify(datosAModificar)
        });
        if (resp.ok) {
            cerrarVentanaAdministrador();
            buscarInfoJson(ulrAPI_productos);
            console.log("Editado con exito");
        }else{
            console.log("error al modificar")
        }
    } catch (error) {
        console.log("error al modificar")
    }
}

// agregar producto ///////////////////
function abrirAgregarProducto(){
    crearVentanaAdministrador("mostrarBoxMensajeLargo");
    let ventanaMensaje = document.querySelector("#ventanaFlotAdmin");
    let mensaje = document.createElement("p");
    mensaje.classList="divCentrado";
    mensaje.innerHTML="AGREGAR PRODUCTO";
    
    let btn_OK = document.createElement("img");
    btn_OK.src="images/aceptar.png";
    btn_OK.width="30";
    let btn_Cancel = document.createElement("img");
    btn_Cancel.src="images/delProducto.png"
    btn_Cancel.width="30";
    let div = document.createElement("div");
    div.classList="divBotoneraAdmin";
    let span1= document.createElement("span");
    let span2= document.createElement("span");
    span1.appendChild(btn_Cancel);
    span2.appendChild(btn_OK);
    div.appendChild(span1);
    div.appendChild(span2);
    btn_Cancel.addEventListener("click",cerrarVentanaAdministrador);
    ventanaMensaje.appendChild(mensaje);
    
    let boxProducto = document.createElement("p");
    let boxPrecio = document.createElement("p");
    let boxTitulo = document.createElement("p");
    let boxLatin = document.createElement("p");
    let boxDescrpcn = document.createElement("p");
    let boxImg = document.createElement("p");
    
    let spanProducto = document.createElement("span");
    let spanPrecio = document.createElement("span");
    let spanTitulo = document.createElement("span");
    let spanLatin = document.createElement("span");
    let spanDescrpcn = document.createElement("span");
    let spanImg = document.createElement("span");

    let inputProducto = document.createElement("input");
    let inputPrecio = document.createElement("input");
    let inputTitulo = document.createElement("input");
    let inputLatin = document.createElement("input");
    let inputDescrpcn = document.createElement("textarea");
    inputDescrpcn.name="boxTexto";
    inputDescrpcn.classList="boxTextAreaDescr";
    let inputImg = document.createElement("input");


    inputProducto.placeholder="Campo Obligatorio";
    inputPrecio.placeholder="Campo Obligatorio";
    inputTitulo.placeholder="Campo Obligatorio";
    inputLatin.placeholder="Campo Obligatorio";
    inputDescrpcn.placeholder="Campo Obligatorio";
    inputImg.placeholder="Campo Obligatorio";

    spanProducto.appendChild(inputProducto);
    spanPrecio.appendChild(inputPrecio);
    spanTitulo.appendChild(inputTitulo);
    spanLatin.appendChild(inputLatin);
    spanDescrpcn.appendChild(inputDescrpcn);
    spanImg.appendChild(inputImg);

    boxProducto.innerHTML="Producto ";
    boxProducto.appendChild(spanProducto);
    boxPrecio.innerHTML="Precio ";
    boxPrecio.appendChild(spanPrecio);
    boxTitulo.innerHTML="Titulo ";
    boxTitulo.appendChild(spanTitulo);
    boxLatin.innerHTML="Latin ";
    boxLatin.appendChild(spanLatin);
    boxDescrpcn.innerHTML="Descripcion ";
    boxDescrpcn.appendChild(spanDescrpcn);
    boxImg.innerHTML="Imagen ";
    boxImg.appendChild(spanImg);

    ventanaMensaje.appendChild(boxProducto);
    ventanaMensaje.appendChild(boxPrecio);
    ventanaMensaje.appendChild(boxTitulo);
    ventanaMensaje.appendChild(boxLatin);
    ventanaMensaje.appendChild(boxDescrpcn);
    ventanaMensaje.appendChild(boxImg);
    ventanaMensaje.appendChild(div);

    btn_OK.addEventListener("click",()=>{   if(inputProducto.value=="" || inputPrecio.value=="" || inputTitulo.value=="" || inputLatin.value=="" || inputDescrpcn.value=="" || inputImg.value==""){
                                                mensajeError.classList.remove("esconder");
                                                mensajeError.classList.add("estiloError");
                                            } else
                                            agregarProductoJson(
                                                inputProducto.value,
                                                inputPrecio.value,
                                                inputTitulo.value,
                                                inputLatin.value,
                                                inputDescrpcn.value,
                                                inputImg.value)
                                            }
                                        );
}

async function agregarProductoJson(prod,prec,tit,lat,desc,img){
    let data = {
                producto : prod,
                precio : prec,
                titulo : tit,
                latin : lat,
                descripcion : desc,
                imagen : img
                };
    try{
        let respuesta = await fetch(ulrAPI_productos, {
            "method" : "POST",
            "headers": {"Content-Type":"application/json"},
            "body": JSON.stringify(data)
        });
        if(respuesta.ok){
            cerrarVentanaAdministrador();
            buscarInfoJson(ulrAPI_productos);
            console.log("subido correctamente");
            
        }else{
            console.log("error al subir");
        }
    }catch{
        console.log("error al subir");
    }
}


// ver detalle de producto ////////////
function crearVerProducto(item){
    crearVentanaAdministrador("mostrarBoxMensajeVER");
    let ventanaMensaje = document.querySelector("#ventanaFlotAdmin");
    let id = document.createElement("p");
    let producto = document.createElement("p");
    let precio = document.createElement("p");
    let titulo = document.createElement("p");
    let latin = document.createElement("p");
    let descripcion = document.createElement("p");
    let imagen = document.createElement("p");
    id.innerHTML=`ID: ${item.id}`;
    producto.innerHTML=`Producto: ${item.producto}`;
    precio.innerHTML=`Precio: $ ${item.precio}`;
    titulo.innerHTML=`Titulo: ${item.titulo}`;
    latin.innerHTML=`Latin: ${item.latin}`;
    descripcion.innerHTML=`Descripcion: ${item.descripcion}`;
    imagen.innerHTML=`Ruta Imagen: ${item.imagen}`; 
    let btn_OK = document.createElement("img");
    btn_OK.src="images/aceptar.png";
    btn_OK.width="30";
    let div = document.createElement("div");
    div.classList="divCentrado"
    div.appendChild(btn_OK);
    btn_OK.addEventListener("click", cerrarVentanaAdministrador);
    ventanaMensaje.appendChild(id);
    ventanaMensaje.appendChild(producto);
    ventanaMensaje.appendChild(precio);
    ventanaMensaje.appendChild(titulo);
    ventanaMensaje.appendChild(latin);
    ventanaMensaje.appendChild(descripcion);
    ventanaMensaje.appendChild(imagen);
    ventanaMensaje.appendChild(div);
}


// funciones adicionales para botones de acciones
function crearVentanaAdministrador(claseMensaje){
    let ventana = document.createElement('div');
    ventana.id ="ventanaFlotAdmin";
    ventana.classList = claseMensaje;
    boxBody.appendChild(ventana);
    let boxBlureado=document.querySelector("#boxBlureado");
    boxBlureado.classList.remove("esconder");
    boxBlureado.classList.add("fondoBlureado");
}

function cerrarVentanaAdministrador(){
    let ventana = document.querySelector('#ventanaFlotAdmin');
    let boxBlureado=document.querySelector("#boxBlureado");
    boxBlureado.classList.add("esconder");
    boxBlureado.classList.remove("fondoBlureado");
    boxBody.removeChild(ventana);
}





function enviarMensaje(mensaje, visible){
    if (visible){
        mejeErrorAdmin.classList.remove("esconder");
        mejeErrorAdmin.classList.add("estiloError");
        mejeErrorAdmin.innerHTMl=mensaje;
    }else{
        mejeErrorAdmin.classList.add("esconder");
        mejeErrorAdmin.classList.remove("estiloError");
    }
}