$(document).ready(function () {
    returnToUp();

    $("#btnMenu").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    // Prevenir la tecla ENTER para envio de submit form en los input
    $(document).on("keypress", 'input', function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            return false;
        }
    });
});

function showInfo(option) {
    var body = '';
    switch (option) {
        case 1:
            body = '<strong>Dudas o aclaraciones</strong>'
                + '<p>Juárez Gómez Rocío <b>[Administrador Centro]</b><br />RJGOMEZ@telmexomsasi.com</p>'
                + '<p>Pineda Camarillo Cynthia Milagros <b>[Administrador Noreste]</b><br />CPCAMARI@telmexomsasi.com</p>'
                + '<p>González Rodríguez Orlando Anthelmo <b>[Administrador Occidente]</b><br />OGRODRIG@telmex.com</p>';
            //+ '<strong>Errores en la herramienta</strong>'
            //+ '<p>Ferrusca Hernández Luis Javier<br />LFERRUSC@rednacional.com</p>';
           
            showGenericModal('Contacto', body);
            break;
        case 2:
            body = '<h4>SEPRODE 2020</h4><p>'
               + '<strong>Seguimiento Proyectos Demanda</strong><br />Control Gest | Contraloria DDN</p>';
            showGenericModal('Acerca de..', body);
            break;
    }
}

function messageToast(titulo, mensaje, tipo) {
    switch (tipo) {
        case 'info':
            $("#alertToast").removeClass().addClass('toast alert alert-primary position-fixed');
            $("#toastHeader").removeClass().addClass('toast-header toast-header-primary');
            break;
        case 'success':
            $("#alertToast").removeClass().addClass('toast alert alert-success position-fixed');
            $("#toastHeader").removeClass().addClass('toast-header toast-header-success');
            break;
        case 'warning':
            $("#alertToast").removeClass().addClass('toast alert alert-warning position-fixed');
            $("#toastHeader").removeClass().addClass('toast-header toast-header-warning');
            break;
        case 'danger':
            $("#alertToast").removeClass().addClass('toast alert alert-danger position-fixed');
            $("#toastHeader").removeClass().addClass('toast-header toast-header-danger');
            break;
        default:
            $("#alertToast").removeClass().addClass('toast alert position-fixed');
            $("#toastHeader").removeClass().addClass('toast-header');
            break;

    }

    if (titulo != undefined && titulo != null && titulo != '')
        $("#toastHeader").show();
    else
        $("#toastHeader").hide();
    $("#toastTitulo").html(titulo);
    $("#toastMensaje").html(mensaje);
    $("#alertToast").toast('show');

    $("#alertToast").on('hidden.bs.toast', function () {
        //console.log('hola');
    })
}

function loadingMask(show) {
    if (show == 'True' || show == 'true')
        $("#loader").modal({
            backdrop: 'static',
            keyboard: false
        });
    else
        $("#loader").modal('hide');
}

function returnToUp(elemento) {
    var offset = 150;
    var duration = 600;
    $(this).scroll(function () {
        if ($(this).scrollTop() > offset) {
            $('.back-to-top').fadeIn(duration);
        } else {
            $('.back-to-top').fadeOut(duration);
        }
    });

    $('.back-to-top').click(function (event) {
        event.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, duration);
        return false;
    });
}

function showMessageBox(title, message, msgType, modalType, func, withTextArea, textRequired) {
    var imgPop = $('#imgIcon_Popup');
    imgPop.removeClass();
    switch (msgType) {
        case "danger":
            imgPop.addClass('fa fa-times-circle fs-4x color-red');
            break;
        case "info":
            imgPop.addClass('fa fa-info-circle fs-4x color-blue');
            break;
        case "success":
            imgPop.addClass('fa fa-check-circle fs-4x color-green');
            break;
        case "warning":
            imgPop.addClass('fa fa-exclamation-triangle fs-4x color-yellow');
            break;
        case "question":
            imgPop.addClass('fa fa-question-circle fs-4x color-blue');
            break;
    }

    $("#txtTexto_Popup").val("");
    $("#txtTexto_Popup").prop("hidden", withTextArea == true ? false : true);
    $("#lblValidateTexto_Popup").prop("hidden", true);

    if (func == undefined || func == null) func = '';
    $('#lblMessage_Popup').html(message);;
    popupMessage(title, modalType, func, withTextArea, textRequired);
}

function popupMessage(headerTitle, modalType, func, withTextArea, textRequired) {
    var css = 'popupMessage-titlebar';
    if (headerTitle == undefined || headerTitle == null || headerTitle == '') {
        css = 'popupMessage-no-titlebar';
    }

    var popup = $('#popMessage'),
        txtTexto_Popup = $("#txtTexto_Popup"),
        lblValidateTexto_Popup = $('#lblValidateTexto_Popup');

    popup.dialog({
        title: headerTitle,
        modal: true,
        autoOpen: false,
        draggable: false,
        resizable: false,
        closeOnEscape: false,
        width: 'auto',
        show: {
            effect: "blind",
            duration: 500
        },
        dialogClass: css,
        hide: {
            effect: "explode",
            duration: 500
        },
        open: function () {
            if (func != '')
                $(".ui-dialog-titlebar-close").hide();
            else {
                $(".ui-dialog-titlebar-close").addClass("btn btn-primary");
                $(".ui-dialog-titlebar-close").show();
            }
        },
        close: function () {
        }
    });

    if (modalType == 'YesNo') {
        popup.dialog({
            buttons: {
                "No": {
                    'text': 'No',
                    'class': 'btn btn-secondary',
                    'click': function () {
                        $(this).dialog("close");
                    }
                },
                "Si": {
                    'text': 'Si',
                    'class': 'btn btn-success',
                    'click': function () {
                        if (withTextArea == true && textRequired == true && txtTexto_Popup.val() == "") {
                            lblValidateTexto_Popup.prop("hidden", false);
                            return;
                        }

                        if (func != '') eval(func);
                        $(this).dialog("close");
                    }
                }
            }
        });
    }
    else if (modalType == 'Ok') {
        popup.dialog({
            buttons: {
                "Aceptar": {
                    'text': 'Aceptar',
                    'class': 'btn btn-success',
                    'click': function () {
                        if (func != '') eval(func);
                        $(this).dialog("close");
                    }
                }
            }
        });
    }
    else { // NoButtons
        popup.dialog({
            buttons: {}
        });
    }
    popup.dialog('open');

    //var buttonset = document.getElementsByClassName('ui-dialog-buttonset');
    //var buttons = buttonset[0].getElementsByTagName('button');
    //buttons[0].innerHTML = "Si"

}

/*
    data = parametros que deben venir en json, ej. JSON.stringify({id: 1})
    showMsg = true si se desea mostran en popup la respuesta del servidor.
    func = funcion javascript a ejecutar despues la respuesta del servidor
*/
function executeGenericAjax(url, data, showMsg, func) {
    if (showMsg !== true) showMsg = false;
    loadingMask('True');
    $.ajax({
        type: "POST",
        url: url,  //"<%= ResolveUrl("~/")%>"
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data,
        traditional: true,
        success: function (response) {
        loadingMask('False');
        var value = JSON.parse(response.d);
            if (value.success) {
                if (showMsg)
                    showMessageBox('', value.msg, 'success', 'Ok', func);
            }
            else {
                if (showMsg)
                    showMessageBox('', value.msg, 'danger', 'Ok');
            }
        },
        error: function (response) {
            loadingMask('False');
            showMessageBox('', 'Error ' + response.statusText, 'danger', 'Ok');
        }
    });
}

/*
    data = parametros que deben venir en json, ej. JSON.stringify({id: 1})
    callback = funcion javascript a ejecutar despues la respuesta del servidor
    callback2 = funcion javascript a ejecutar despues la respuesta del servidor
    showMask = muestra la mascara de procesando
*/
function executeCallBackAjax(url, data, callback, callback2, showMask) {
    if (showMask == true)
        loadingMask('True');
    $.ajax({
        type: "POST",
        url: url, //"<%= ResolveUrl("~/")%>" + url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data,
        traditional: true,
        success: function (response) {
            loadingMask('False');
            var value = JSON.parse(response.d);
            callback(value, callback2);
        },
        error: function (response) {
            loadingMask('False');
            showMessageBox('', 'Error ' + response.statusText, 'danger', 'Ok');
        }
    });
}

/*
    controlClientID = id del control file upload
    allowedSize = tamaño maximo permitido en MB
    func = funcion javascript a ejecutar despues la respuesta del servidor
*/
function uploadFileToServer(url, controlClientID, allowedSize, func) {
    var ctrl = $(controlClientID),
        files = ctrl[0].files,
        data = new FormData();
                
    if (files === undefined || files == null || files.length == 0) {
        showMessageBox('', 'Ningún archivo adjunto.<br />Adjunte un archivo e intente nuevamente.', 'warning', 'Ok');
        return;
    }

    if (!validSize(files, (allowedSize * 1024))) {
        showMessageBox('', 'Tamaño no permitido.<br />El tamaño máximo permitido del archivo es de ' + allowedSize + 'MB.', 'warning', 'Ok');
        return;
    }

    loadingMask('True');

    for (var i = 0; i < files.length; i++) {
        data.append(files[i].name, files[i]);
    }

    return $.ajax({
        type: "POST",
        url: url, //"<%= ResolveUrl("~/")%>" + url,
        contentType: false,
        processData: false,
        data: data,
        success: function (response) {
            loadingMask('False');
            if (response.success) {
                showMessageBox('', response.msg, 'success', 'Ok', func);
            }
            else
                showMessageBox('', response.msg, 'danger', 'Ok');
        },
        error: function (response) {
            loadingMask('False');
            showMessageBox('', 'Error ' + response.statusText, 'danger', 'Ok');
        }
    });
}


