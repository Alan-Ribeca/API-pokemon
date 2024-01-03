import { spinner } from "./spinner.js";
export { mostrarPokemon, botonesHeader }

const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const main = document.querySelector(".main");
let url = "https://pokeapi.co/api/v2/pokemon/";

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
    divOculto.innerHTML = `<p class="mensajeVerMas">Ver mas...</p>`
    const div = document.createElement("div");
    div.classList.add("pokemon");
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
    listaPokemon.append(div)
    div.append(divOculto)
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    const mensajeExistente = document.querySelector(".mensaje");
    if(mensajeExistente) {
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

                    if(i === 151 && contadorPokemon === 0) {
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
