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

$('input[type="checkbox"]').on('change', function() {
    $('input[name="' + this.name + '"]').not(this).prop('checked', false);
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
    Telegram.WebApp.sendData(json);
    XAVApp.close();
}

let getJsonData = () => {
    
    var data = {};
    var formInventario = document.getElementById("formInventario");
    $(formInventario).find('input')
        .each(function () {
            let x = $(this);
            switch (x[0].type) {
                case 'checkbox':
                    data[x[0].id] = x[0].checked
                    break;
                case 'number':
                    data[x[0].id] = x[0].value
                    break;
                default:
                    data[x[0].id] = x[0].value
                    break;
            }
        });
        
    data.cbxEstadoVestidura = document.getElementById("cbxEstadoVestidura").value
    data.cbxEstatusOperativo = document.getElementById("cbxEstatusOperativo").value
    data.txtTarjetaPase = document.getElementById("txtTarjetaPase").textContent
    data.txtUsuario = document.getElementById("txtUsuario").textContent
    let slcEstadoVehiculo = document.getElementById("slcEstadoVehiculo")
 
	var selectedOptions = [];
	for (const option of slcEstadoVehiculo.options) {
		if (option.selected) {
		  selectedOptions.push(option.value);
		}
	}
	
    data.slcEstadoVehiculo = selectedOptions;

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
    document.getElementById("txtNoEco").textContent = params.get("txtNoEco");
    document.getElementById("txtUsuario").textContent = params.get("txtUsuario");
    document.getElementById("txtTarjetaPase").textContent = params.get("txtTarjetaPase");
    let empresa = params.get('imgEmpresa');
    let logo = document.getElementById('imgLogo')
    switch (empresa) {
        case 'RNUM':
            logo.src = "../../Content/images/RNUM_LOGO.svg"
            break;
        case 'TELMEX':
            logo.src = "../../Content/images/TELMEX_LOGO.svg"
            break;
        default:
            logo.src = "../../Content/images/RNUM_LOGO.svg"
            break;

    }

    for (const [key, value] of params.entries()) {
        let element = document.getElementById(key)
        let txt
        if (element) {
            switch (element.type) {
                case 'checkbox':
                    document.getElementById(key).checked = value
                    break;
                case 'number':
                    txt = document.getElementById(key)
                    txt.value = value
                    txt.style.display = 'block'; // Muestra el campo de entrada
                    txt.setAttribute('required', 'required'); // Hace que el campo de entrada sea requerido
                    txt.removeAttribute('disabled'); // Habilita el campo de entrada
                    break;
                case 'select-multiple':
                    let valuesArray = JSON.parse(value);

                    // Restablecer todas las opciones a no seleccionadas
                    for (let option of element.options) {
                        option.selected = false;
                    }

                    // Establecer como seleccionadas las opciones correspondientes
                    for (let optionValue of valuesArray) {
                        let option = element.querySelector(`option[value="${optionValue}"]`);
                        if (option) {
                            option.selected = true;
                        }
                    }
                    break;
                default:
                    document.getElementById(key).value = value
                    break
            }
        }
    }
}
