//imports
import '../index.html';
import '../css/app.css';
import '../css/skeleton.css';
import '../css/normalize.css';

//variables
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const monedaSelect = document.querySelector('#moneda');
const criptomonedasSelect = document.querySelector('#criptomonedas');

const objBusqueda = {
    moneda: '',
    criptomoneda: '',
}

//funciones
function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    fetch(url)
        .then(response => response.json())
        .then(data => selectCriptomonedas(data.Data))
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(criptomoneda => {
        const { FullName, Name } = criptomoneda.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function submitFormulario(e){
    e.preventDefault();

    //validar
    const { moneda, criptomoneda } = objBusqueda;
    if(!moneda  || !criptomoneda){
        mostrarAlerta('Ambos Campos son Obligatorios');
        return;
    }

    consultarApi();
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}

function mostrarAlerta(msg){

    const existeError = formulario.querySelector('.error');
    if(!existeError){
        const alerta = document.createElement('p');
        alerta.classList.add('error');
        alerta.textContent = msg;
    
        formulario.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function consultarApi(){
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();
    
    fetch(url)
        .then(response => response.json())
        .then(data => mostrarCotizacionHtml(data.DISPLAY[criptomoneda][moneda]))
}

function mostrarCotizacionHtml(cotizacion){

    limpiarHtml();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `Precio más alto del día: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `Precio más bajo del día: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Variación últimas 24 horas: <span>${CHANGEPCT24HOUR} %</span>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Ultima Actualización: <span>${LASTUPDATE}</span>`;
    
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHtml(){
    while(resultado.firstChild){
        resultado.firstChild.remove();
    }
}

function mostrarSpinner(){
    limpiarHtml();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="spinner">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
    `;

    resultado.appendChild(spinner);
}

//eventos
document.addEventListener('DOMContentLoaded', _ => {
    consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});