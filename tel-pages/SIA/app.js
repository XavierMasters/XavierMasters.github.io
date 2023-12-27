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
                    data[x[0].id] = x[0].checked;
                    break;
                case 'number':
                    data[x[0].id] = x[0].value;
                    break;
                default:
                    data[x[0].id] = x[0].value;
                    break;
            }
        });
        
	data.cbxVigenciaPlaca = document.getElementById("cbxVigenciaPlaca").value;
    data.cbxEstadoVestidura = document.getElementById("cbxEstadoVestidura").value;
    data.cbxEstatusOperativo = document.getElementById("cbxEstatusOperativo").value;
    data.cbxImagenCorp = document.getElementById("cbxImagenCorp").value;
    data.txtTarjetaPase = document.getElementById("txtTarjetaPase").textContent;
    data.txtUsuario = document.getElementById("txtUsuario").textContent;
    let cbxEstadoVehiculo = document.getElementById("cbxEstadoVehiculo");
 
	var selectedOptions = [];
	for (const option of cbxEstadoVehiculo.options) {
		if (option.selected) {
		  selectedOptions.push(option.value);
		}
	}
	
    data.cbxEstadoVehiculo = selectedOptions;

    let jsonString = JSON.stringify(data);
    return jsonString;
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
                    document.getElementById(key).checked = value.toLowerCase() == 'true'
                    break;
                case 'number':
                    txt = document.getElementById(key, value)
                    if (value){
                        txt.value = value
                        txt.style.display = 'block'; // Muestra el campo de entrada
                        txt.setAttribute('required', 'required'); // Hace que el campo de entrada sea requerido
                        txt.removeAttribute('disabled'); // Habilita el campo de entrada
                    }
                    break;
                case 'select-multiple':
                    let valuesArray = (value.split('|'));

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

            if(key =='txtVigenciaPlacas'){
                txt = document.getElementById('cbxVigenciaPlaca');
                document.getElementById('chkPlacas').checked = true;
                let divVigenciaPlacas = document.getElementById('divVigenciaPlacas');
                let divVigPlacas = document.getElementById('divVigPlacas');
                txt.value = 1;
                divVigenciaPlacas.style.display = 'block'; // Muestra el campo de entrada
                divVigenciaPlacas.setAttribute('required', 'required'); // Hace que el campo de entrada sea requerido
                divVigPlacas.style.display = 'block'; // Muestra el campo de entrada
                divVigPlacas.setAttribute('required', 'required'); // Hace que el campo de entrada sea requerido
            }else if(key =='cbxVigenciaPlaca'){
                document.getElementById('chkPlacas').checked = true;
                txt = document.getElementById('cbxVigenciaPlaca');
                let divVigPlacas = document.getElementById('divVigPlacas');
                divVigPlacas.style.display = 'block'; // Muestra el campo de entrada
                divVigPlacas.setAttribute('required', 'required'); // Hace que el campo de entrada sea requerido

            }
        }
    }
}

let ocultarElemento_change = (me, idElementToToogle) => {
    var el = document.getElementById(idElementToToogle);

   switch(el.tagName){
	case 'INPUT':
	case 'SELECT':
		if (me.checked) {
			el.style.display = 'block';
			el.setAttribute('required', 'required'); // Hace que el campo de entrada sea requerido
			el.removeAttribute('disabled'); // Habilita el campo de entrada
		} else {
			el.style.display = 'none';
			el.removeAttribute('required'); // Elimina el atributo requerido del campo de entrada
			el.setAttribute('disabled', 'disabled'); // Deshabilita el campo de entrada
			el.value = '';
		}
		break;
	default:
		if (me.checked) {
			el.style.display = 'block';
		} else {
			el.style.display = 'none';
		}
		
		if(me.id == 'chkPlacas')
			chkPlacas_change(me);
		break;
   }
}

let chkPlacas_change = (me) => {
	let divVigPlacas = document.getElementById('divVigPlacas');
	let divVigenciaPlacas = document.getElementById('divVigenciaPlacas');
	let cbxVigenciaPlaca = document.getElementById('cbxVigenciaPlaca');
	let txtVigenciaPlacas = document.getElementById('txtVigenciaPlacas');

	if (me.checked) {
        divVigPlacas.style.display = 'block';
        cbxVigenciaPlaca.setAttribute('required', 'required'); // Hace que el campo de entrada sea requerido
        cbxVigenciaPlaca.removeAttribute('disabled'); // Habilita el campo de entrada
    } else {
        divVigPlacas.style.display = 'none';  // Oculta el campo de entrada
		divVigenciaPlacas.style.display = 'none';
        cbxVigenciaPlaca.removeAttribute('required'); // Elimina el atributo requerido del campo de entrada
        cbxVigenciaPlaca.setAttribute('disabled', 'disabled'); // Deshabilita el campo de entrada
		cbxVigenciaPlaca.value = '';
		txtVigenciaPlacas.removeAttribute('required'); // Elimina el atributo requerido del campo de entrada
        txtVigenciaPlacas.setAttribute('disabled', 'disabled'); // Deshabilita el campo de entrada
		txtVigenciaPlacas.value = '';
    }
}

let cbxVigenciaPlaca_change = (me) => {
    let divVigenciaPlacas = document.getElementById('divVigenciaPlacas');
	let txtVigenciaPlacas = document.getElementById('txtVigenciaPlacas');
	
    if (me.value == '1') {
        divVigenciaPlacas.style.display = 'block';
        txtVigenciaPlacas.setAttribute('required', 'required'); // Hace que el campo de entrada sea requerido
        txtVigenciaPlacas.removeAttribute('disabled'); // Habilita el campo de entrada
    } else {
        divVigenciaPlacas.style.display = 'none';  // Oculta el campo de entrada
        txtVigenciaPlacas.removeAttribute('required'); // Elimina el atributo requerido del campo de entrada
        txtVigenciaPlacas.setAttribute('disabled', 'disabled'); // Deshabilita el campo de entrada
		txtVigenciaPlacas.value = '';
    }
}
