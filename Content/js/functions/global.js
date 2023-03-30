$(document).ready(function () {
});

/**
    Descripcion: Obtiene configuracion inicial para que este dispible en javascript.
    user: [Objecto] Datos del usuario.
    callback: [Objeto] Metod a ejecutar despyes de la respuesta del servidor.
**/
function setDataConfig(user, callback) {
    var url = window.location.href;
    url = url.substr(url, url.indexOf("Seprode")) + "Seprode/GeneralHandler.ashx?cfg=cfg"
    SEPRODE = {};

    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        traditional: true,
        success: function (response) {
            if (response.success) {
                SEPRODE.Config = response.config;
                SEPRODE.User = user;
                if (callback != undefined)
                    callback();
            }
        },
        error: function (response) { }
    });
}

$(function () {
    //$(".date-form").datepicker();
    $(".number").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
});

//function getClockTime() {
//    $('.time').clockTimePicker({
//    });
//}

//$(function () {
//    $('[data-toggle="tooltip"]').tooltip();
//});

/**
    Descripcion: Para los combobox o dropdownlist que se le agregue la clase "select2" se agregará la funcionalidad de busqueda adicional.
**/
function getSelect2() {
    $('.select2').select2({
        theme: 'bootstrap4',
        width: 'style',
        placeholder: $(this).attr('placeholder'),
        allowClear: Boolean($(this).data('allow-clear')),
    });
}

/**
    Descripcion: Para el funcionamiento del tooltip.
**/
function getTooltip() {
    $('[data-toggle="tooltip"]').tooltip();
}

/**
    Descripcion: Si este método es llamado se desplegará el calendario siempre y cuando el control tenga la clase "calendar".
    ctrl: [Control] Es el control que tiene la clase "calendar".
**/
function showCalendar(ctrl) {
    $(ctrl).select();
}

/**
    Descripcion: Para el funcionamiendo del calendario en aquellos controles que contengan la clase "calendar".
**/
function getDateCalendar() {
    $(".calendar").attr('readonly', true);
    $(".calendar").datepicker({
        onSelect: function (dateText, obj) {
            this.fireEvent && this.fireEvent('onchange') || $(this).change();
        },
        numberOfMonths: 1,
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        //minDate: 0 = fecha actual
        dateFormat: 'yy-mm-dd',
        //showOn: "button",
        //buttonImage: "../Content/images/plus16x16.png", //fa fa-calendar
        //buttonImageOnly: true,
        buttonText: "Seleccione una fecha"
    });
}

/**
    Descripcion: Funcion para refrescar la página.
    time: [Int] Tiempo en milisegundos.
**/
function refreshPage(time) {
    setTimeout(function () {
        location.reload();
    }, time);
}

/**
    Descripcion: Muestra u oculta un control.
    id: [Texto] Id del control.
    show:  [Boleano] Mostrar u ocultar el control.
**/
function showControl(id, show) {
    $(id).prop("hidden", !show);
}


/**
    Descripcion: Muestra u oculta una alerta temporal.
    id: [Texto] Id del control.
    msgType: [Texto] Tipo de mensaje.
    msg: [Texto] Mensaje a mostrar en la alerta.
**/
function showAlertMessage(id, msgType, msg) {
    var alert = $(id);
    if (alert[0] == undefined) return;
    alert.removeClass();
    switch (msgType) {
        case "danger":
            alert.addClass('alert alert-danger');
            break;
        case "info":
            alert.addClass('alert alert-primary');
            break;
        case "success":
            alert.addClass('alert alert-success');
            break;
        case "warning":
            alert.addClass('alert alert-warning');
            break;
        default:
            alert.addClass('alert alert-secondary');
            break;
    }

    alert[0].innerText = msg;
    alert.fadeIn('slow');
    alert.css("display", "block");

    setTimeout(function () { alert.fadeOut('slow'); }, 4000);
}

/**
    Descripcion: Evalua si un objecto se encuentra en el arreglo.
    array: [Objeto] Arreglo a evaluar.
    obj: [Objeto] Objeto a buscar en el arreglo.
**/
function contains(array, obj) {
    for (var i = 0; i < array.length; i++)
        if (array[i] === obj)
            return true;
    return false;
}

/**
    Descripcion:  Evalua el tamaño permitido en los archivos seleccionados en un control file upload.
    files: [Objeto] Archivo(s) a evaluar.
    size: [Int] Tamaño a comparar en lo(s) archivos.
**/
function validSize(files, size) {
    for (var i = 0; i < files.length; i++) {
        var fsize = files.item(i).size;
        fsize = Math.round((fsize / 1024));
        if (fsize > size)
            return false;
    }
    return true;
}

/**
    Descripcion: Convierte a moneda.
    me: [Control] Control del cual se obtendrá su valor a convertir.
**/
function convertirMoneda(me, numberDecimals) {
    var valor = objToCurrency(me.value, numberDecimals);
    me.value = valor != "" ? ("$ " + valor) : "";
}
/**
    Descripcion: Convierte a moneda.
    obj: [Objeto] Valor a convertir.
    decimals: [Int] Cantidad de decimales que contendrá el valor.
**/
function objToCurrency(obj, decimals) {
    decimals = decimals > 0 ? decimals : 2;
    // replace(/,/g, '') eliminar comas
    // replace(/\s/g,'') eliminar espacios
    obj = obj.toString().replace(/[^\d\.]*/g, '');
    var num = parseFloat(obj);
    if (isNaN(num)) return "";
    //if (decimals != undefined && decimals >= 0)
    num = num.toFixed(decimals);
    num = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    return num;
}

/**
    Descripcion: Convierte a fecha en un formato especifico.
    obj: [Objeto] Valor a convertir.
    format: [Texto] Formato para su conversion.
**/
function objToDate(obj, format) {
    var value = Date.parse(obj);
    if (!isNaN(value)) {
        return format != undefined && format != null ? new Date(value).format(format) : new Date(value).format('yyyy-MM-dd HH:mm')
    }
    return '';
}

/**
    Descripcion: Valida la cantidad de elementos en el ListBox.
    sender: [Objeto] Control a validar.
    args: [Objecto] Argumento del control.
**/
function validateListBox(sender, args)
{
    var ctrl = document.getElementById(sender.controltovalidate);
    args.IsValid = ctrl.options.length > 0;
}

/**
    Descripcion: Crea un "datatable" con parametros por defecto.
    tableId: [Texto] Id de la tabla a convertir.
    scrollX: [Boleano] Muestra u oculta el scroll horizontal.
    scrollY: [Boleano] Muestra u oculta el scroll vertical.
    callback: [Objecto] Metodo a ejecutar despues de la conversion a datatable.
**/
function simpleDataTable(tableId, scrollX, scrollY, callback) {
    var table = $(tableId).DataTable({
        "language": datatableSpanish(),
        "processing": true,
        "searching": false,
        "paging": false,
        "ordering": false,
        "info": false,
        "scrollX": scrollX != true ? false : true,
        "scrollY": scrollY != true ? false : true
    });

    $(tableId + ' .dataTables_wrapper table').addClass("table table-hover table-bordered");
    callback(table);
}

/**
    Descripcion: Devuelve el idioma español para "datatable".
**/
function datatableSpanish() {
    return {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ registros",
        "sZeroRecords": "No se encontraron resultados",
        "sEmptyTable": "Ningún dato disponible en esta tabla",
        "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix": "",
        "sSearch": "Buscar:",
        "sUrl": "",
        "sInfoThousands": ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    }
}

/**
    Descripcion: Modal o poppup generico vacío. Para su funcionamiento tiene que existir en la pagina donde sea llamado el div con la clase "modal-generic".
    title: [Texto] Título en el encabezado.
    body: [Texto] Contenido a mostrar en el cuerpo.
    showCloseButton: [Boleano] Mostrar u ocultar el footer con el boton "OK" que cierra el modal.
    size: [Texto] Tamaños para el modal.
    scrollable: [Boleano] para determinar si va a contener scroll el modal.
**/
function showGenericModal(title, body, showCloseButton, size, scrollable) {
    var dialog = $('.modal-generic .modal-dialog');
    switch (size) {
        case 'small':
            if (scrollable == true)
                dialog.removeClass().addClass('modal-dialog modal-dialog-scrollable modal-sm');
            else
                dialog.removeClass().addClass('modal-dialog modal-sm');
            break;
        case 'large':
            if (scrollable == true)
                dialog.removeClass().addClass('modal-dialog modal-dialog-scrollable modal-lg');
            else
                dialog.removeClass().addClass('modal-dialog modal-lg');
            break;
        case 'xlarge':
            if (scrollable == true)
                dialog.removeClass().addClass('modal-dialog modal-dialog-scrollable modal-xl');
            else
                dialog.removeClass().addClass('modal-dialog modal-xl');
            break;
        case 'medium':
        default:
            if (scrollable == true)
                dialog.removeClass().addClass('modal-dialog modal-dialog-scrollable');
            else
                dialog.removeClass().addClass('modal-dialog');
            break;
    }
    $('.modal-generic .modal-title')[0].innerHTML = (title != undefined && title != null ? title : '');
    $('.modal-generic .modal-body')[0].innerHTML = (body != undefined && body != null ? body : '');

    var footer = $('.modal-generic .modal-footer');
    if (showCloseButton == true)
        footer.show(); // $('.modal-generic .modal-foote').prop("hidden", false);
    else
        footer.hide(); // $('.modal-generic .modal-foote').prop("hidden", true);
    
    footer.empty(); // Se vacían todos los elementos del footer por si se agregó manualmente otro elemento y se agrega el boton cerrar nuevamente.
    footer.append('<button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>');

    $('.modal-generic').modal();
}

/**
    Descripcion: Crea una tabla generica a partir de los records.
    tableID: [Texto] Nombre para el "id" de la tabla.
    dateFields: [Array] Indica las posiciones de cada fila que corresponden a fechas para su conversion.
**/
function getGenericTable(records, tableID, dateFields) {
    if (records == undefined || records == null || records == 0) 
        return 'No hay registros disponibles.';

    var keys = Object.keys(records[0]);

    var thead = '<thead><tr class="bg-dark">'; //Se agrega la clase para que lo pinte la exportación
    for (var i = 0; i < keys.length; i++) {
        thead += '<th align="left">' + keys[i] + '</th>';
    }
    thead += '</tr></thead>';

    var tbody = '';
    for (var i = 0; i < records.length; i++) {
        tbody += '<tr>';
        for (var j = 0; j < keys.length; j++) {
            var value = records[i][keys[j]];
            if (Array.isArray(dateFields) && contains(dateFields, keys[j])) {
                value = objToDate(value, 'yyyy-MM-dd');
            }
            tbody += '<td><span>' + (value != null ? value : '') + '</span></td >'
        }
        tbody += '</tr>'
    }

    var table = '<table id="' + tableID + '" class="table table-hover table-bordered table-default">' + thead + tbody + '</table>';
    return table;
}

/**
    Descripcion: Descarga en formato excel una tabla, usa la libreria table2excel, no sirve para tablas con controles como texbox.
    tableIdOrClass: [String] Id de la tabla o clase de la tabla, ej. #table1 o .Tablax
    fileName [String] Nombre para el archivo.

    NOTA: si de desea omitir columnas al momento de la exportacion, se debe poner la clase .skipToExport a los th y td, para un asp:GridView seria por ej.
        <asp:BoundField HeaderStyle-CssClass="skipToExport" ItemStyle-CssClass="skipToExport"/>
**/
function exportTableToExcel(tableIdOrClass, fileName) {
    fileName = fileName + new Date().format("yyyyMMdd_HHmmss");
    $(tableIdOrClass).table2excel({
        name: "Worksheet Name",
        filename: fileName,
        fileext: ".xls",
        preserveColors: true,
        exclude: ".skipToExport"
    });
}


$.datepicker.regional['es'] = {
    closeText: 'Cerrar',
    prevText: 'Ant',
    nextText: 'Sig',
    currentText: 'Hoy',
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
    dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
    weekHeader: 'Sm',
    dateFormat: 'yy-mm-dd',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
}

$.datepicker.setDefaults($.datepicker.regional['es']);

