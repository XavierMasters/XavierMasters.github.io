const XAVApp = {
    initData: Telegram.WebApp.initData || '',
    initDataUnsafe: Telegram.WebApp.initDataUnsafe || {},
    MainButton: Telegram.WebApp.MainButton,

    init(options) {
        document.body.style.visibility = '';
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        Telegram.WebApp.MainButton.isProgressVisible = "true";
        Telegram.WebApp.MainButton.setParams({
            text: 'ENVIAR DATOS',
            is_visible: true,
            is_active: true
        });
    },

    close() {
        Telegram.WebApp.close();
    }
}

XAVApp.init();

$(document).ready(function () {
    const params = new URLSearchParams(document.location.search);
    if (params.size > 0) {
        cargarDatos(params);
    }

});


XAVApp.MainButton.onClick(() => {
    var form = document.getElementById("myForm");
    if (form.checkValidity() == false) {
        form.reportValidity();
        return;
    }
    else {
        XAVApp.MainButton.showProgress();
        sendDataToBot();
    }
});

let sendDataToBot = () => {
    var form = document.getElementById("myForm");
    if (form.checkValidity() == false) return;

    let json = getJsonData();
    console.log(json);
    Telegram.WebApp.sendData(json);
    XAVApp.close();
}

let getJsonData = () => {

    //obtener json con el id de los inputs con su valor de myform
    var data = {};
    var formInventario = document.getElementById("formInventario");
    $(formInventario).find('input')
        .each(function () {
            let el = $(this);

            switch (el[0].type) {
                case 'checkbox':
                    data[el[0].id] = el[0].checked
                    break;
                case 'number':
                    data[el[0].id] = el[0].value
                    break;
            }
        });
    console.log(data);

    let jsonString = JSON.stringify(data);
    return jsonString;
}

let cantidadesInput = (idCheck, idInput) => {
    var txt = document.getElementById(idInput);
    var chk = document.getElementById(idCheck);

    if (chk.checked) {
        txt.style.display = 'block'; // Muestra el campo de entrada
        txt.setAttribute('required', 'required'); // Hace que el campo de entrada sea requerido
        txt.removeAttribute('disabled'); // Habilita el campo de entrada
    } else {
        txt.style.display = 'none';  // Oculta el campo de entrada
        txt.removeAttribute('required'); // Elimina el atributo requerido del campo de entrada
        txt.setAttribute('disabled', 'disabled'); // Deshabilita el campo de entrada
        txt.value = '';
    }
}

let cargarDatos = (params) => {
    // url prueba = ?cantidad=12&txtLimpiadores=2&chkLimpiadores=true&chkHerramienta=true
    for (const [key, value] of params.entries()) {
        let element = document.getElementById(key)
        if (element) {
            switch (element.type) {
                case 'checkbox':
                    document.getElementById(key).checked = value
                    break;
                case 'number':
                    let txt = document.getElementById(key)
                        txt.value = value
                    txt.style.display = 'block'; // Muestra el campo de entrada
                    txt.setAttribute('required', 'required'); // Hace que el campo de entrada sea requerido
                    txt.removeAttribute('disabled'); // Habilita el campo de entrada
                    break;
            }
        }
    }
}
