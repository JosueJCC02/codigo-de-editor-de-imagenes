let canvas;
let ctx;
let imgOriginal = null;

window.onload = function () {

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
                draw();
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });
};

function draw() {
    if (!imgOriginal) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgOriginal, 0, 0, canvas.width, canvas.height);
}

function filtro(tipo) {
    if (!imgOriginal) return;

    draw();

    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {

        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        if (tipo === "gris") {
            let v = (r + g + b) / 3;
            data[i] = data[i + 1] = data[i + 2] = v;
        }

        if (tipo === "sepia") {
            data[i]     = r * 0.393 + g * 0.769 + b * 0.189;
            data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
            data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
        }

        if (tipo === "brillo") {
            data[i] += 40;
            data[i + 1] += 40;
            data[i + 2] += 40;
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

function reset() {
    draw();
}