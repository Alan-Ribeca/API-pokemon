import { spinner, } from "./spinner.js";
export { mostrarPokemon, botonesHeader }

const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const main = document.querySelector(".main");
let url = "https://pokeapi.co/api/v2/pokemon/";
let cardAbierta = false;
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
                });
            } else {
                card.classList.add('fade');
            }
        });
    }
    // } else if (cardAbierta && document.getElementById(id).classList.contains('enlarge')) {
    //     cards.forEach((card) => {
    //         card.classList.remove('enlarge');
    //         card.classList.remove('fade');
    //     });
    //     cardAbierta = false;
    //     let card = document.getElementById(id);
    //     card.innerHTML = contenidoOriginal[id];
    //     // agrego el cursor pointer
    //     document.querySelectorAll('.pokemon').forEach((elemento) => {
    //         elemento.style.cursor = 'pointer';
    //     });
    // }
}

function nuevoDatos(id) {
    let card = document.getElementById(id);
    contenidoOriginal[id] = card.innerHTML;
    while (card.firstChild) {
        card.removeChild(card.firstChild);
    }

    let numeroPokemon = Number(id.split('-')[1]);

    // Haz una nueva solicitud a la API de Pokémon para obtener los datos del Pokémon seleccionado
    fetch(url + numeroPokemon)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let stats = data.stats.map((item) => `<p class="stat">${item.stat.name}: ${item.base_stat}</p>`).join("");
            let tipos = data.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
            tipos = tipos.join("");
            // Ahora puedes usar los datos del Pokémon para agregar nuevos elementos a la tarjeta
            const cardVuelta = document.createElement("div");
            cardVuelta.classList.add("card-click");
            cardVuelta.innerHTML = `
            <div class = "vuelta-img">
                <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}" class="img-poke-vuelta">
            </div>

            <div class="pokemon-info">
                <div class="vuelta-nombre">
                    <h2 class="pokemon-nombre">${data.name}</h2>
                    ${tipos}
                </div>
                <div class="btnInfo"> 
                    <button class="about">About</button>
                    <button class="baseStats">Base Stats</button>
                    <button class="moves">Moves</button>
                </div>

                <div class="uno"> 1
                    1
                </div>
                <div class="dos"> 
                    <div class="vuelta-stats">
                        <p class="p-stats">Estadisticas</p>
                        <p class="statVuelta">${data.height}m</p>
                        <p class="statVuelta">${data.weight}kg</p>
                        ${stats}
                    </div>
                </div>
                <div class="tres"> 3 </div>
            </div>
            `;
            card.appendChild(cardVuelta);
            clickBoton()
        })
        .catch(error => console.error('Error:', error));

}



function clickBoton() {
    const botones = ["about", "baseStats", "moves"];
    const divs = ["uno", "dos", "tres"];

    botones.forEach((boton, index) => {
        document.querySelector(`.${boton}`).addEventListener("click", () => {
            console.log(`click en boton ${index + 1}`);
            divs.forEach((div, divIndex) => {
                document.querySelector(`.${div}`).style.display = divIndex === index ? "block" : "none";
            });
        });
    });
}


