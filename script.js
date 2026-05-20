alert("JS funciona");

let canvas;
let ctx;
let imgOriginal = null;

let historial = [];

// ======================
// INICIALIZACIÓN SEGURA
// ======================

document.addEventListener("DOMContentLoaded", function () {

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    document.getElementById("upload").addEventListener("change", function (e) {

        let file = e.target.files[0];
        if (!file) return;

        let reader = new FileReader();

        reader.onload = function (event) {

            let img = new Image();

            img.onload = function () {

                imgOriginal = img;

                // ajustar canvas a imagen
                canvas.width = img.width;
                canvas.height = img.height;

                draw();
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });
});

// ======================
// DIBUJAR IMAGEN ORIGINAL
// ======================

function draw() {

    if (!imgOriginal) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(imgOriginal, 0, 0, canvas.width, canvas.height);
}

// ======================
// DECORATOR (FILTROS)
// ======================

class Filtro {
    aplicar(data, i) {}
}

class Gris extends Filtro {
    aplicar(data, i) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        let v = (r + g + b) / 3;

        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
    }
}

class Sepia extends Filtro {
    aplicar(data, i) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        data[i]     = r * 0.393 + g * 0.769 + b * 0.189;
        data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
        data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
    }
}

class Brillo extends Filtro {
    aplicar(data, i) {
        data[i] += 40;
        data[i + 1] += 40;
        data[i + 2] += 40;
    }
}

// ======================
// APLICAR FILTRO (DECORATOR)
// ======================

function aplicarFiltro(filtro) {

    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        filtro.aplicar(data, i);
    }

    ctx.putImageData(imgData, 0, 0);
}

// ======================
// COMMAND
// ======================

class ComandoFiltro {

    constructor(filtro) {
        this.filtro = filtro;
        this.estadoAnterior = null;
    }

    ejecutar() {

        this.estadoAnterior = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );

        aplicarFiltro(this.filtro);

        historial.push(this);
    }

    deshacer() {
        if (this.estadoAnterior) {
            ctx.putImageData(this.estadoAnterior, 0, 0);
        }
    }
}

// ======================
// BOTÓN FILTROS
// ======================

function ejecutarFiltro(tipo) {

    if (!imgOriginal) return;

    let filtro = null;

    if (tipo === "gris") filtro = new Gris();
    if (tipo === "sepia") filtro = new Sepia();
    if (tipo === "brillo") filtro = new Brillo();

    let comando = new ComandoFiltro(filtro);
    comando.ejecutar();
}

// ======================
// DESHACER
// ======================

function deshacer() {

    let comando = historial.pop();

    if (comando) {
        comando.deshacer();
    }
}

// ======================
// RESET
// ======================

function reset() {

    draw();
    historial = [];
}
