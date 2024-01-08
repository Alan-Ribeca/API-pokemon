import { spinner, } from "./spinner.js";
export { mostrarPokemon, botonesHeader }

const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const main = document.querySelector(".main");
let url = "https://pokeapi.co/api/v2/pokemon/";
let cardAbierta = null;
let contenidoOriginal = {};

document.addEventListener("DOMContentLoaded", () => {
    for (let i = 1; i <= 151; i++) {
        fetch(url + i)
            .then((respuesta) => respuesta.json())
            .then(data => {
                mostrarPokemon(data);
            });
    }
})

function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join("");

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId
    }

    const divOculto = document.createElement("div");
    divOculto.classList.add("ver-mas");
    divOculto.innerHTML = `<p class="mensajeVerMas">Mas datos...</p>`
    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.id = `pokemon-${pokeId}`
    div.innerHTML = `
    <p class="pokemon-id-back">#${pokeId}</p>
    <div class="pokemon-imagen">
        <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
    </div>
    <div class="pokemon-info">
        <div class="nombre-contenedor">
            <p class="pokemon-id">#${pokeId}</p>
            <h2 class="pokemon-nombre">${poke.name}</h2>
        </div>
        <div class="pokemon-tipos">
            ${tipos}
        </div>
        <div class="pokemon-stats">
            <p class="stat">${poke.height}m</p>
            <p class="stat">${poke.weight}kg</p>
        </div>
    </div>
    `;

    div.addEventListener("click", () => {
        clickCard(div.id)
    })

    listaPokemon.append(div)
    div.append(divOculto)
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    const mensajeExistente = document.querySelector(".mensaje");
    if (mensajeExistente) {
        mensajeExistente.remove()
    }

    listaPokemon.innerHTML = "";
    spinner.style.display = "block"

    let contadorPokemon = 0;
    for (let i = 1; i <= 151; i++) {
        fetch(url + i)
            .then((respuesta) => respuesta.json())
            .then(data => {
                setTimeout(() => {
                    if (botonId === "ver-todos") {
                        mostrarPokemon(data)
                        contadorPokemon++;
                    } else {
                        const tipos = data.types.map(type => type.type.name);
                        if (tipos.some(tipo => tipo.includes(botonId))) {
                            mostrarPokemon(data);
                            contadorPokemon++;
                        }
                    }
                    spinner.style.display = "none";

                    if (i === 151 && contadorPokemon === 0) {
                        mensajeSinPokemones(botonId)
                    }
                }, 1500);
            });
    }
}))

function mensajeSinPokemones(tipos) {
    const mensaje = document.createElement("h2");
    mensaje.classList.add("mensaje")
    mensaje.textContent = `No hay pokemones de tipo ${tipos}`

    main.appendChild(mensaje)
}

function clickCard(id) {
    let cards = document.querySelectorAll('.pokemon');

    if (!cardAbierta) {
        cards.forEach((card) => {
            if (card.getAttribute('id') === id) {
                card.classList.add('enlarge');
                cardAbierta = true;
                nuevoDatos(id)
                // saco el cursor pointer
                document.querySelectorAll('.pokemon').forEach((elemento) => {
                    elemento.style.cursor = 'auto';
                    elemento.style.paddingBlock = 0;
                });
            } else {
                card.classList.add('fade');
            }
        });
    }
}


function nuevoDatos(id) {
    let card = document.getElementById(id);
    contenidoOriginal[id] = card.innerHTML;
    while (card.firstChild) {
        card.removeChild(card.firstChild);
    }

    let numeroPokemon = Number(id.split('-')[1]);

    fetch(url + numeroPokemon)
        .then(response => response.json())
        .then(data => {
            let stats = data.stats.map((item) => `
            <div class="vuelta-stats">
                <p class="p-stats">${item.stat.name}</p>
                <div class="progress-bar">
                    <div class="progress-value" style="width: ${item.base_stat}%">
                    <span class="porcentaje">${item.base_stat}%</span>
                    </div>
                </div>
            </div>`
            ).join("");
            let tipos = data.types.map((type) => `<p class="${type.type.name} tipoVuelta">${type.type.name}</p>`);
            let habilidades = data.abilities.map((habilidad) => habilidad.ability.name).join(", ");
            let movimientos = data.moves.map((movimiento) => movimiento.move.name).join(" - ");

            tipos = tipos.join("");
            const cardVuelta = document.createElement("div");
            cardVuelta.classList.add("card-click");
            cardVuelta.innerHTML = `
            <div class="vuelta-img">
                <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}" class="img-poke-vuelta">
                <button class="button">
                <div class="button-box">
                <span class="button-elem">
                <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                <path
                d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"
                ></path>
                </svg>
                </span>
                <span class="button-elem">
                <svg viewBox="0 0 46 40">
                <path
                d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"
                ></path>
                </svg>
                </span>
                </div>
                </button>
            </div>
            <h2 class="pokemon-nombre">${data.name}</h2>
            <div class="tipos-vuelta">
                ${tipos}
            </div>

            <div class="vuelta-info">
                <div class="btnInfo"> 
                    <button class="btn about">About<hr class="linea"></button>
                    <button class="btn baseStats">Base Stats<hr class="linea"></button>
                    <button class="btn moves">Moves<hr class="linea"></button>
                </div>
            
                <div class="uno"> 
                    <p class="estadisticasGenerales">Estadisticas Generales:</p>
                    <ul>
                        <li>Heigth  ${data.height}m</li>
                        <li>Weigth  ${data.weight}kg</li>
                        <li>Abilities ${habilidades}</li>
                    </ul>
                </div>
                <div class="dos"> 
                    ${stats}
                </div>
                <div class="tres"> 
                    <p class="movimientos">Movimientos</p>
                    <p class="fullMovimientos"> ${movimientos}</p>
                </div>
            </div>
        `;

            card.appendChild(cardVuelta);
            clickBoton();

            const btnCerrar = document.querySelector(".button");
            btnCerrar.addEventListener("click", (event) => {
                event.stopPropagation();

                let cards = document.getElementById(id);
                cards.classList.remove("enlarge");

                let pokemons = document.querySelectorAll('div.pokemon.fade');
                pokemons.forEach((pokemon) => {
                    pokemon.classList.remove('fade');
                });

                const ocultarDiv = document.querySelector(".card-click");
                ocultarDiv.style.display = "none"

                if (contenidoOriginal[id]) {
                    cards.innerHTML = contenidoOriginal[id];
                }

                document.querySelectorAll('.pokemon').forEach((elemento) => {
                    elemento.style.cursor = 'pointer';
                    elemento.style.paddingBlock = "1rem";
                });
                cardAbierta = false;
            })
        })
        .catch(error => console.error('Error:', error));
}

function clickBoton() {
    const botones = ["about", "baseStats", "moves"];
    const divs = ["uno", "dos", "tres"];

    botones.forEach((boton, index) => {
        const btnElement = document.querySelector(`.${boton}`);
        btnElement.addEventListener("click", () => {
            divs.forEach((div, divIndex) => {
                document.querySelector(`.${div}`).style.display = divIndex === index ? "block" : "none";
            });

            botones.forEach((boton) => {
                document.querySelector(`.${boton}`).classList.remove('btn-selected');
            });

            btnElement.classList.add('btn-selected');
        });
    });
    document.querySelector('.btn.baseStats').click();
}
