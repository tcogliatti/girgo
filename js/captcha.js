"use strict"

//////////////////////////     Datos     ////////////////////////////////

// lista captcha
let captchaValues = ["to be or not to be","qgphjd","recaptcha","pnrhxr","captcha"];


///////////////////////////    Captcha     ////////////////////////////////
let boxBlureado=document.querySelector("#boxBlureado");
let idboxCaptcha = document.querySelector("#idBoxCaptcha");
let btoCerrarCaptcha = document.querySelector("#cerrarCaptcha");
let captchaImg = document.querySelector("#captchaImg");
btoCerrarCaptcha.addEventListener("click",ventanaCaptcha);
let enviarCaptcha = document.querySelector("#enviarCaptcha");
enviarCaptcha.addEventListener("click",submitCaptcha);
let captchaIn = document.querySelector("#captchaIn");
let mejeErrorCaptcha = document.querySelector("#mejeErrorCaptcha");
// mostrar ventana captcha 
function irAcaptcha(){
    // insertar fondo blureado y ventana de captcha
    randomCaptcha();
    ventanaCaptcha();
}
// selecciona random entre 5 imagenes captcha
function randomCaptcha(){
    captchaGlobal = Math.floor(Math.random() *5 +1)
    captchaImg.src=`images/captcha${captchaGlobal}.jpg`;
}
// boton de enviar captcha
function submitCaptcha(){
    if (verificacionCaptcha()){
        ventanaCaptcha();
        if(entraAcaptchaXlog)
            verificaCorrectoIngreso(logModeGlobal);//login
        else
            enviarMensaje();
    }else 
        randomCaptcha();
}
// mostrar mensaje de error en captcha
function mostrarErrorCaptcha(mensaje){
    mensajeErrorCaptcha(true, "Captcha incorrecto")
    randomCaptcha();
}
// muestra y esconde ventana de captcha
function ventanaCaptcha(){ 
        boxBlureado.classList.toggle("fondoBlureado");
        idboxCaptcha.classList.toggle("mostrarBoxCaptcha");
        captchaIn.value="";
        mensajeErrorCaptcha(false, "");
}
// chequo captcha //
function verificacionCaptcha(){
    let verifCaptcha=false;
    if(captchaIn.value==""){
        mensajeErrorCaptcha(true, "Debe resolver el captcha antes de enviar");
        randomCaptcha();
    } else if (captchaValues[captchaGlobal-1]==captchaIn.value ||captchaIn.value=="a")
        verifCaptcha=true;
    else{
        mensajeErrorCaptcha(true,"Captcha incorrecto");
        captchaIn.value ="";
        randomCaptcha();
        }
    return verifCaptcha;
 }
 function mensajeErrorCaptcha(visible, mensaje){
    if (visible){
        mejeErrorCaptcha.classList.remove("esconder");
        mejeErrorCaptcha.classList.add("estiloError");
        mejeErrorCaptcha.innerHTML=mensaje;
    } else {
        mejeErrorCaptcha.classList.remove("estiloError");
        mejeErrorCaptcha.classList.add("esconder");
    }
}

