import { verificarVoto, 
         recuperarVotaciones,
         votar,
         iniciarSesionGoogle,
         recuperarVotacion,
         recuperarVotos
} from "./firebase-connect.js";

let dialogIniciarSesion = document.getElementById('dialogIniciarSesion');

let idUsuario = "";
let votacionLocal = {}
let usuarioYaHaVotado = false
let urlFoto = "";

const btnVotarOpcion1 = document.getElementById('btn-votar-opcion-1')
const btnVotarOpcion2 = document.getElementById('btn-votar-opcion-2')


//Esto se va a ejecutar cada vez que se abra el documento.
document.addEventListener("DOMContentLoaded", function(){
    dialogIniciarSesion.showModal();
  })

  
document.getElementById('btnIniciarSesion').onclick = async function(event){
    event.preventDefault();
    let usuario = await iniciarSesionGoogle();
    if (usuario.email){
        //La autenticacion fue correcta
        sessionStorage.setItem('usuario', usuario.email);
        dialogIniciarSesion.close();
    }
}

function mostrarVotos(datos){
    let divVotosOp1 =document.getElementById('div-votos-opcion-1');
    let divVotosOp2 =document.getElementById('div-votos-opcion-2');
    divVotosOp1.innerHTML = '';
    divVotosOp2.innerHTML = '';
    if (!datos) { 
        return;

    }
    const votosOpcion1 = datos.hasOwnProperty(votacionLocal.opcion1) ? datos[votacionLocal.opcion1] : {};
    const votosOpcion2 = datos.hasOwnProperty(votacionLocal.opcion2) ? datos[votacionLocal.opcion2] : {};

    document.getElementById('total-1').innerText = Object.keys(votosOpcion1).length;
    document.getElementById('total-2').innerText = Object.keys(votosOpcion2).length;
    for (const key in votosOpcion1) {
        console.log(key)
        const voto = votosOpcion1[key];
        const img = document.createElement('img');
        console.log(voto)
        img.src = voto.foto;
        img.referrerPolicy = 'no-referrer';
        img.classList = "profile-picture";
        img.async = true;
        divVotosOp1.appendChild(img);
    }
    for (const key in votosOpcion2) {
        console.log(key)
        const voto = votosOpcion2[key];
        const img = document.createElement('img');
        console.log(voto)
        img.src = voto.foto;
        img.referrerPolicy = 'no-referrer';
        img.classList = "profile-picture";
        img.async = true;
        divVotosOp2.appendChild(img);
    }
}

document.getElementById('btnIniciarSesion').onclick = async function(event){
    event.preventDefault();
    const resultado = await iniciarSesionGoogle();
    if (!resultado.email) {
        alert("No se ha podido iniciar sesion");
        return 
    }
    sessionStorage.setItem('usuario', resultado.email);
    idUsuario = resultado.uid;
    urlFoto = resultado.photoURL;
    dialogIniciarSesion.close();

    //Obtener el id de la votacion desde la URL
    const searchParams = new URLSearchParams(window.location.search);
    const idVotacion = searchParams.get('id');
    
    //Obtener la votacion
    recuperarVotacion(idVotacion, function (votacion) {
        if (votacion) {
            votacionLocal = votacion;
            votacionLocal.id = idVotacion;
            document.getElementById('nombre-votacion').textContent = votacion.nombre;
            document.getElementById('h2-opcion-1').textContent = votacion.opcion1;
            document.getElementById('h2-opcion-2').textContent = votacion.opcion2;

        }
    })

    //Verificamos si ya ha votado.
    verificarVoto (idVotacion, resultado.uid,(voto) => {
        if (voto){
            usuarioYaHaVotado = true;
            btnVotarOpcion1.style.display = "none";
            btnVotarOpcion2.style.display = "none";

        }
    })
        //Recuperar votos
        recuperarVotos(idVotacion,mostrarVotos);
}

btnVotarOpcion1.onclick = (e) => {
    e.preventDefault();
    console.log(votacionLocal)
    votar(votacionLocal.id, votacionLocal.opcion1, idUsuario, {
        idUsuario: idUsuario,
        fecha: new Date().toISOString(),
        foto: urlFoto
    });
    btnVotarOpcion1.style.display = "none";
    btnVotarOpcion2.style.display = "none";
}
btnVotarOpcion2.onclick = (e) => {
    e.preventDefault();
    console.log(votacionLocal)
    votar(votacionLocal.id, votacionLocal.opcion2, idUsuario, {
        idUsuario: idUsuario,
        fecha: new Date().toISOString(),
        foto: urlFoto
    });
    btnVotarOpcion1.style.display = "none";
    btnVotarOpcion2.style.display = "none";
}
