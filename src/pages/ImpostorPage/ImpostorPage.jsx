import React, { useState } from "react";

// --- LISTA DE 100 PALABRAS ---
const PALABRAS = [
  "Aeropuerto",
  "Hospital",
  "Escuela",
  "Playa",
  "Cine",
  "Supermercado",
  "Banco",
  "Biblioteca",
  "Restaurante",
  "Gimnasio",
  "Parque",
  "Zoológico",
  "Museo",
  "Comisaría",
  "Estación de Bomberos",
  "Iglesia",
  "Cementerio",
  "Granja",
  "Hotel",
  "Casino",
  "Estadio",
  "Circo",
  "Castillo",
  "Laboratorio",
  "Universidad",
  "Oficina",
  "Cárcel",
  "Centro Comercial",
  "Gasolinera",
  "Farmacia",
  "Peluquería",
  "Panadería",
  "Discoteca",
  "Teatro",
  "Piscina",
  "Bosque",
  "Desierto",
  "Montaña",
  "Selva",
  "Isla",
  "Cueva",
  "Volcán",
  "Polo Norte",
  "Espacio Exterior",
  "Submarino",
  "Avión",
  "Barco Pirata",
  "Tren",
  "Autobús",
  "Helicóptero",
  "Cohete",
  "Ambulancia",
  "Bicicleta",
  "Coche de carreras",
  "Tractor",
  "Pizza",
  "Hamburguesa",
  "Sushi",
  "Helado",
  "Tacos",
  "Chocolate",
  "Café",
  "Pastel de cumpleaños",
  "Manzana",
  "Huevo",
  "Guitarra",
  "Piano",
  "Batería",
  "Micrófono",
  "Televisión",
  "Computadora",
  "Teléfono",
  "Cámara",
  "Reloj",
  "Espejo",
  "Zapato",
  "Sombrero",
  "Gafas de sol",
  "Mochila",
  "Maleta",
  "Perro",
  "Gato",
  "León",
  "Elefante",
  "Tiburón",
  "Dinosaurio",
  "Dragón",
  "Fantasma",
  "Zombi",
  "Vampiro",
  "Payaso",
  "Astronauta",
  "Doctor",
  "Profesor",
  "Bombero",
  "Policía",
  "Chef",
  "Futbolista",
  "Pintor",
  "Rey",
  "Mago",
  "Detective",
  "Jardinero",
  "Mecánico",
  "Presidente",
  "Boda",
  "Navidad",
  "Halloween",
  "Examen",
  "Concierto",
];

function App() {
  // --- ESTADOS DEL JUEGO ---
  const [etapa, setEtapa] = useState("inicio");
  const [numJugadores, setNumJugadores] = useState(0);
  const [jugadores, setJugadores] = useState([]);
  const [palabraSecreta, setPalabraSecreta] = useState("");
  const [turnoRegistro, setTurnoRegistro] = useState(1);
  const [nombreTemporal, setNombreTemporal] = useState("");
  const [nombreVoto, setNombreVoto] = useState("");
  const [mensajeRevelacion, setMensajeRevelacion] = useState(null);

  // --- LÓGICA ---
  const iniciarPartida = n => {
    const numero = parseInt(n);
    if (isNaN(numero) || numero < 3) {
      alert("Se necesitan al menos 3 jugadores.");
      return;
    }
    const palabraRandom = PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
    const indiceImpostor = Math.floor(Math.random() * numero);

    setNumJugadores(numero);
    setPalabraSecreta(palabraRandom);
    setEtapa("registro");
    setJugadores([]);
    setTurnoRegistro(1);
    setMensajeRevelacion(null);
    sessionStorage.setItem("indiceImpostor", indiceImpostor);
  };

  const manejarRegistro = e => {
    e.preventDefault();
    if (!nombreTemporal.trim()) return;

    if (
      jugadores.some(
        j => j.nombre.toLowerCase() === nombreTemporal.toLowerCase()
      )
    ) {
      alert("Ese nombre ya existe");
      return;
    }

    const indiceImpostor = parseInt(sessionStorage.getItem("indiceImpostor"));
    const esElImpostor = turnoRegistro - 1 === indiceImpostor;

    const nuevoJugador = {
      nombre: nombreTemporal,
      esImpostor: esElImpostor,
      eliminado: false,
    };

    setJugadores([...jugadores, nuevoJugador]);

    if (esElImpostor) {
      setMensajeRevelacion("🤫 ERES EL IMPOSTOR. (No conoces la palabra)");
    } else {
      setMensajeRevelacion(`La palabra secreta es: ${palabraSecreta}`);
    }

    setEtapa("revelacion");
    setNombreTemporal("");
  };

  const siguienteTurno = () => {
    setMensajeRevelacion(null);
    if (turnoRegistro < numJugadores) {
      setTurnoRegistro(turnoRegistro + 1);
      setEtapa("registro");
    } else {
      setEtapa("juego");
    }
  };

  const manejarVoto = e => {
    e.preventDefault();
    const nombreVotado = nombreVoto.trim();

    const jugadorEncontrado = jugadores.find(
      j => j.nombre.toLowerCase() === nombreVotado.toLowerCase()
    );

    if (!jugadorEncontrado) {
      alert("Jugador no encontrado. Revisa el nombre.");
      return;
    }

    if (jugadorEncontrado.eliminado) {
      alert("Este jugador ya está eliminado.");
      return;
    }

    if (jugadorEncontrado.esImpostor) {
      setEtapa("victoria");
    } else {
      const listaActualizada = jugadores.map(j => {
        if (j.nombre.toLowerCase() === nombreVotado.toLowerCase()) {
          return { ...j, eliminado: true };
        }
        return j;
      });
      setJugadores(listaActualizada);
      setNombreVoto("");
      alert(`Fallaste. ${jugadorEncontrado.nombre} NO era el impostor.`);
    }
  };

  const reiniciarJuego = () => {
    setEtapa("inicio");
    setJugadores([]);
    setNumJugadores(0);
    setNombreVoto("");
    setNombreTemporal("");
  };

  // --- RENDERIZADO CON TAILWIND ---
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans p-4 w-full">
      <div className="w-full max-w-md relative">
        {/* Título */}
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          🕵️ El Impostor
        </h1>

        {/* Contador Arriba a la Derecha */}
        {(etapa === "registro" || etapa === "revelacion") && (
          <div className="absolute -top-16 right-0 bg-cyan-500 text-slate-900 px-3 py-1 rounded-full font-bold text-sm shadow-lg animate-bounce">
            Jugador: {turnoRegistro} / {numJugadores}
          </div>
        )}

        {/* --- ETAPA 1: INICIO --- */}
        {etapa === "inicio" && (
          <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 flex flex-col gap-6">
            <label className="text-xl font-medium text-center">
              ¿Cuántos jugadores habrá?
            </label>
            <input
              type="number"
              min="3"
              placeholder="Ej: 4"
              className="border border-white text-white w-full p-4 rounded-xl text-slate-900 text-center text-2xl outline-none focus:ring-4 focus:ring-purple-500 transition"
              onKeyDown={e =>
                e.key === "Enter" && iniciarPartida(e.target.value)
              }
            />
            <p className="text-center text-slate-400 text-sm">
              Presiona Enter para comenzar
            </p>
          </div>
        )}

        {/* --- ETAPA 2: REGISTRO --- */}
        {etapa === "registro" && (
          <form
            className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 flex flex-col gap-6"
            onSubmit={manejarRegistro}
          >
            <h2 className="text-2xl font-bold text-center text-cyan-400">
              Jugador {turnoRegistro}
            </h2>
            <p className="text-center text-slate-300">
              Ingresa tu nombre para ver tu rol:
            </p>
            <input
              type="text"
              value={nombreTemporal}
              onChange={e => setNombreTemporal(e.target.value)}
              placeholder="Tu nombre..."
              autoFocus
              className="w-full p-3 rounded-xl text-white text-center text-xl outline-none focus:ring-4 focus:ring-cyan-500 transition"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 rounded-xl transition transform active:scale-95"
            >
              Ver Rol
            </button>
          </form>
        )}

        {/* --- ETAPA 3: REVELACIÓN --- */}
        {etapa === "revelacion" && (
          <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 flex flex-col gap-6 text-center">
            <h3 className="text-2xl font-semibold">
              Hola,{" "}
              <span className="text-cyan-400">
                {jugadores[turnoRegistro - 1].nombre}
              </span>
            </h3>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-600">
              <p
                className={`text-2xl font-bold ${
                  mensajeRevelacion.includes("IMPOSTOR")
                    ? "text-red-500"
                    : "text-yellow-400"
                }`}
              >
                {mensajeRevelacion}
              </p>
            </div>

            <button
              onClick={siguienteTurno}
              className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 rounded-xl transition"
            >
              {turnoRegistro === numJugadores
                ? "Ir a la votación"
                : "Ocultar y Siguiente"}
            </button>
          </div>
        )}

        {/* --- ETAPA 4: JUEGO (VOTACIÓN) --- */}
        {etapa === "juego" && (
          <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700 flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-center text-white mb-2">
              ¡A debatir!
            </h2>

            {/* Lista de jugadores */}
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {jugadores.map((j, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-2 rounded-lg font-medium text-lg transition-all duration-300
                    ${
                      j.eliminado
                        ? "bg-slate-900 text-slate-600 line-through border border-red-900"
                        : "bg-slate-600 text-white shadow-md"
                    }`}
                >
                  {j.nombre}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-600 pt-6">
              <p className="text-center mb-3 text-slate-300">
                Escribe el nombre del sospechoso:
              </p>
              <form onSubmit={manejarVoto} className="flex flex-col gap-3">
                <input
                  type="text"
                  value={nombreVoto}
                  onChange={e => setNombreVoto(e.target.value)}
                  placeholder="Nombre del jugador"
                  className="border border-white text-white w-full p-3 rounded-xl text-center text-lg outline-none focus:ring-4 focus:ring-red-500 transition"
                />
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg transition transform active:scale-95"
                >
                  Votar 🔪
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- ETAPA 5: VICTORIA --- */}
        {etapa === "victoria" && (
          <div className="bg-green-500 p-8 rounded-2xl shadow-2xl text-center flex flex-col gap-6 animate-pulse">
            <h1 className="text-5xl font-black text-white">🏆 ¡VICTORIA! 🏆</h1>
            <p className="text-xl text-green-100">
              ¡Han descubierto al impostor!
            </p>
            <div className="bg-white/20 p-4 rounded-xl">
              <p className="text-lg">
                Era:{" "}
                <strong className="text-2xl block uppercase">
                  {jugadores.find(j => j.esImpostor).nombre}
                </strong>
              </p>
            </div>
            <button
              onClick={reiniciarJuego}
              className="w-full bg-white text-green-600 hover:bg-green-50 font-bold py-3 rounded-xl shadow-lg transition transform hover:scale-105"
            >
              Jugar otra vez
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
