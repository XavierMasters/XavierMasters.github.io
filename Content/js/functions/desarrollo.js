$(document).ready(function () {
    //onTabClick('tabDatosGenerales');
});

function onTabClick(tab) {
    $("#body_btnGuardar_DatosGenerales").prop("hidden", (tab == 'tabDatosGenerales' ? false : true));
    $("#body_btnGuardar_Ubicacion").prop("hidden", (tab == 'tabUbicacion' ? false : true));
    $("#body_btnGuardar_Constructor").prop("hidden", (tab == 'tabConstructor' ? false : true));
    $("#body_btnGuardar_Convenio").prop("hidden", (tab == 'tabConvenio' ? false : true));
    $("#body_btnGuardar_Siceth").prop("hidden", (tab == 'tabSiceth' ? false : true));

    $("#body_btnGuardar_Ubicacion").removeClass('d-none');
    $("#body_btnGuardar_Constructor").removeClass('d-none');
    $("#body_btnGuardar_Convenio").removeClass('d-none');
    $("#body_btnGuardar_Siceth").removeClass('d-none');
}

function enableTabs(id, enableTabUbicacion, enableTabConstructor, enableTabConvenio, enableTabSiceth) {
    SEPRODE.Desarrollo.Id = id;
    if (enableTabUbicacion == "True")
        $('#tabUbicacion').removeClass("disabled");
    else
        $('#tabUbicacion').addClass("disabled");

    if (enableTabConstructor == "True")
        $('#tabConstructor').removeClass("disabled");
    else
        $('#tabConstructor').addClass("disabled");

    if (enableTabConvenio == "True")
        $('#tabConvenio').removeClass("disabled");
    else
        $('#tabConvenio').addClass("disabled");

    if (enableTabSiceth == "True")
        $('#tabSiceth').removeClass("disabled");
    else
        $('#tabSiceth').addClass("disabled");
}

function validateTabs(idDesarrollo) {
    $.ajax({
        type: "POST",
        url: SEPRODE.Config.ProjectPath + "Views/Captura/Desarrollo.aspx/ValidateTabs",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ idDesarrollo: idDesarrollo }),
        traditional: true,
        success: function (response) {
            var value = JSON.parse(response.d);
            if (value.success) {
                enableTabs(value.id, value.tabUbicacion, value.tabConstructor, value.tabConvenio, value.tabSiceth);
            }
        },
        error: function (response) {
            showMessageBox('', 'Error ' + response.statusText, 'danger', 'Ok');
        }
    });
}

function actualizarTotalViviendas(me) {
    var total = 0;
    $("#tblEtapas tbody tr").each(function () {
        var txt = $(this).find('input[type="text"]');
        var valor = parseInt(txt.val());
        valor = valor > 0 ? valor : 0;
        total = total + valor;
    });
    $("#body_txtViviendaTotales_Avance").val(total);
}

function onChangeFile(fileType) {
    //se agrega return para permitir hacer su carga inicial, removerlo posteriormente
    return;
    var control,
        fecha = new Date();

    switch (fileType) {
        case 'KMZ':
            control = $("#body_fupKMZ_Ubicacion")[0];
            var ext = control.value.match(/\.([^\.]+)$/)[1];
            var array = control.accept.replace(/\./g, '').split(',');
            if (!contains(array, ext)) {
                control.value = '';
                showMessageBox('Archivo no permitido', 'Unicamente se aceptan las siguientes extensiones:<br />' + control.accept, 'warning', 'Ok');
            }

            var file = control.files[0];
            fecha = fecha.setDate(fecha.getDate() - 60); // 60 días
            fecha = new Date(fecha);
            if (file.lastModifiedDate < fecha) {
                control.value = '';
                showMessageBox('Archivo no permitido', 'Debe seleccionar un archivo reciente.<br />Fecha del archivo: ' + file.lastModifiedDate.format('yyyy-MM-dd'), 'warning', 'Ok');
            }
            break;
        case 'CONVENIO':
            control = $("#body_fupConvenioFirmado_Convenio")[0];

            var ext = control.value.match(/\.([^\.]+)$/)[1];
            var array = control.accept.replace(/\./g, '').split(',');
            if (!contains(array, ext)) {
                control.value = '';
                showMessageBox('Archivo no permitido', 'Unicamente se aceptan las siguientes extensiones:<br />' + control.accept, 'warning', 'Ok');
            }

            var file = control.files[0];
            fecha = fecha.setDate(fecha.getDate() - 30); // 60 días
            fecha = new Date(fecha);
            if (file.lastModifiedDate < fecha) {
                control.value = '';
                showMessageBox('Archivo no permitido', 'Debe seleccionar un archivo reciente.<br />Fecha del archivo: ' + file.lastModifiedDate.format('yyyy-MM-dd'), 'warning', 'Ok');
            }
            break;
    }
}

function uploadFile(fileType) {
    if (!Page_ClientValidate(fileType))
        return;

    var observaciones, url,
        expediente = $("#expedienteSess").val();

    switch (fileType) {
        case 'KMZ':
            var ctrl = $("#body_fupKMZ_Ubicacion");

            observaciones = $("#body_txtObservacionKMZ_Ubicacion");
            url = SEPRODE.Config.ProjectPath + "FileHandler.ashx?exp=" + expediente + "&pr=1&id=" + SEPRODE.Desarrollo.Id + "&tipo=" + fileType + "&observaciones=" + observaciones.val();
            uploadFileToServer(url, ctrl, 2, 'showControl("#body_lnkVerKMZ", true)');
            break;
        case 'CONVENIO':
            var ctrl = $("#body_fupConvenioFirmado_Convenio");

            observaciones = $("#body_txtObservacionesConvenioFirmado_Convenio");
            url = SEPRODE.Config.ProjectPath + "FileHandler.ashx?exp=" + expediente + "&pr=1&id=" + SEPRODE.Desarrollo.Id + "&tipo=" + fileType + "&observaciones=" + observaciones.val();
            uploadFileToServer(url, ctrl, 2, 'showControl("#body_lnkVerConvenio", true)');
            break;
    }
}

function getFile(fileType) {
    var expediente = $("#expedienteSess").val(); // Se encuentra en la masterpage
    var url = SEPRODE.Config.ProjectPath + "FileHandler.ashx?exp=" + expediente + "&pr=2&id=" + SEPRODE.Desarrollo.Id + "&tipo=" + fileType;
    window.open(url);
}

function validateGroup(group) {
    // Page_ClientValidate() validacion a nivel pagina
    if (Page_ClientValidate(group)) // validacion a nivel grupo
        loadingMask('True');
}

function bindDataTableVisitas() {
    if ($.fn.DataTable.isDataTable('#body_grdVisitas')) return;
    $("#body_grdVisitas").prepend($("<thead></thead>").append($("#body_grdVisitas").find("tr:first"))).DataTable({
        "language": datatableSpanish(),
        "processing": true,
        "searching": false,
        //"serverSide": true,
        //"ordering": false,
        "order": [[ 0, "desc" ]],
        "columnDefs": [
            { "targets": [4], "orderable": false }
        ],
        "dom": 'Bfrtip',
        "initComplete": function (settings) {
            $("#body_grdVisitas").wrap("<div style='overflow:auto; width:100%; position:relative;'></div>");
        },
        buttons: [
            {
                extend: 'copy',
                className: 'copyButton',
                text: '<span class="fa fa-clone text-warning fs-df">&nbsp;Copiar</span>'
            },
            {
                extend: 'excel',
                className: 'copyButton',
                title: 'descarga',
                text: '<span class="fa fa-file-excel-o text-success fs-df">&nbsp;Excel</span>'
            },
            {
                extend: 'csv',
                className: 'copyButton',
                title: 'descarga',
                text: '<span class="fa fa-clone text-info fs-df">&nbsp;Csv</span>'
            }
        ]
    });

    $('.dataTables_wrapper').unwrap();
    $(".dataTables_wrapper table").addClass("table table-hover table-bordered");
    $(".dataTables_wrapper table thead").addClass("bg-primary-2");
}

function bindDataTableBitacora() {
    if ($.fn.DataTable.isDataTable('#tblBitacora')) return;
    var table = $('#tblBitacora').DataTable({
        "language": datatableSpanish(),
        "processing": true,
        "searching": false,
        //"ordering": false,
        "columnDefs": [
            { "targets": [0], "orderable": false }
        ],
        "initComplete": function (settings) {
            $("#tblBitacora").wrap("<div style='overflow:auto; width:100%; position:relative;'></div>");
        }
    });
    //$('#tblBitacora .dataTables_scrollHeadInner').addClass('full-width');
    $(".dataTables_wrapper table thead").addClass("bg-primary-2");

    $('#tblBitacora tbody').on('click', 'td.details-control', function () {
        var etpEtapaId, etpEtapaIdCat;
        var tr = $(this).closest('tr');
        tr.find("input").each(function () {
            if (this.name == 'etpEtapaId') etpEtapaId = this.value;
            if (this.name == 'etpEtapaIdCat') etpEtapaIdCat = this.value;
        });

        $('#tblBitacora tbody tr').each(function () {
            var _tr = $(this),
                _row = table.row(_tr),
                _iconDetail = _tr.find("#estDetails"),
                _etapaRow = _tr.find("#etpEtapaId").val();

            if (_row.child.isShown() && _etapaRow != undefined && _etapaRow != etpEtapaId) {
                _iconDetail.removeClass("fa fa-minus-square");
                _iconDetail.addClass("fa fa-plus-square");
                _row.child.hide();
            }
        });

        var row = table.row(tr);
        var iconDetail = tr.find("#estDetails");
        if (row.child.isShown()) {
            iconDetail.removeClass("fa fa-minus-square");
            iconDetail.addClass("fa fa-plus-square");
            row.child.hide();
            //$('div.slider', row.child()).slideUp(function () {
            //    row.child.hide();
            //});
        }
        else {
            iconDetail.removeClass("fa fa-plus-square");
            iconDetail.addClass("fa fa-minus-square");
            var url = SEPRODE.Config.ProjectPath + "Views/Captura/Desarrollo.aspx/ObtenerEstatus",
            data = JSON.stringify({ identificador: 'EST1', idDesarrollo: SEPRODE.Desarrollo.Id, etapaId: etpEtapaId, estatusReferencia: '' });
            executeCallBackAjax(url, data, cargarEstatus, row.child);
        }
    });
}

function cargarEstatus(value, callback) {
    if (value.success != true || value.estatus.length == 0) {
        callback($('<span>No se encontraron resultados</span>')).show();
        return;
    }
    var estatus = value.estatus,
        thead = '', tbody = '';
            
    thead = '<thead><tr class="bg-secondary-1">'
        + '<th style="width:20px;"></th>'
        + '<th align="left" style="width:20%">Fecha</th>'
        + '<th align="left" style="width:20%">Estatus</th>'
        + '<th align="left" style="width:60%">Captura</th>'
        + '</tr></thead>';

    for (var i = 0; i < estatus.length; i++) {
        var fecha = new Date(estatus[i].Est_fecha);
        tbody += '<tr>'
            + '<td class="details-control-x" title="Ver el detalle de los Sub Estatus">'
            + '<span id="subDetails" class="fs-0x fa fa-plus-square" style="cursor:pointer;color:#6f6a6a;"></span>'
            + '<input type= "hidden" name= "estId" value= "' + estatus[i].Est_id + '" >'
            + '<input type="hidden" name= "estEtapaId" value= "' + estatus[i].Est_etapa_id + '" >'
            + '<input type="hidden" name= "estEstatusCatId" value= "' + estatus[i].Est_cat_valor + '" ></td >'
            + '<td><span>' + fecha.format('yyyy-MM-dd HH:mm') + '</span></td > '
            + '<td><span>' + estatus[i].Est_cat_descripcion + '</span></td > '
            + '<td><span>' + estatus[i].Est_nombre_captura + '</span></td > '
            + '</tr>';
    }
    callback($('<table id="tblBitacoraEstatus" style="width:100%;" class="table table-hover table-bordered">' + thead + tbody + '</table>')).show();
    //$('div.slider', callback).slideDown();

    if ($.fn.DataTable.isDataTable('#tblBitacoraEstatus')) return;
    var table = $('#tblBitacoraEstatus').DataTable({
        "language": datatableSpanish(),
        "processing": true,
        "searching": false,
        "paging": false,
        "ordering": false,
        "info": false
    });

    $('#tblBitacoraEstatus tbody').on('click', 'td.details-control-x', function () {
        var estEtapaId, estEstatusCatId;
        var tr = $(this).closest('tr');
        tr.find("input").each(function () {
            if (this.name == 'estEtapaId') estEtapaId = this.value;
            if (this.name == 'estEstatusCatId') estEstatusCatId = this.value;
        });

        var row = table.row(tr);
        var iconDetail = tr.find("#subDetails");
        if (row.child.isShown()) {
            iconDetail.removeClass("fa fa-minus-square");
            iconDetail.addClass("fa fa-plus-square");
            row.child.hide();
            //tr.removeClass('shown');
        }
        else {
            iconDetail.removeClass("fa fa-plus-square");
            iconDetail.addClass("fa fa-minus-square");
            var url = SEPRODE.Config.ProjectPath + "Views/Captura/Desarrollo.aspx/ObtenerEstatus",
            data = JSON.stringify({ identificador: 'EST2', idDesarrollo: SEPRODE.Desarrollo.Id, etapaId: estEtapaId, estatusReferencia: estEstatusCatId });
            executeCallBackAjax(url, data, cargarSubEstatus, row.child);
            //tr.addClass('shown');
        }
    });
}

function cargarSubEstatus(value, callback) {
    if (value.success != true || value.estatus.length == 0) {
        callback($('<span>No se encontraron resultados</span>')).show();
        return;
    }
    var estatus = value.estatus,
        thead = '', tbody = '';

    thead = '<thead><tr class="bg-secondary-2">'
        + '<th align="left" style="width:20%">Fecha</th>'
        + '<th align="left" style="width:20%">Sub Estatus</th>'
        + '<th align="left" style="width:60%">Captura</th>'
        + '</tr></thead>';

    for (var i = 0; i < estatus.length; i++) {
        var fecha = new Date(estatus[i].Est_fecha);
        tbody += '<tr>'
            + '<td><span>' + fecha.format('yyyy-MM-dd HH:mm') + '</span></td > '
            + '<td><span>' + estatus[i].Est_cat_descripcion + '</span></td > '
            + '<td><span>' + estatus[i].Est_nombre_captura + '</span></td > '
            + '</tr>';
    }
    callback($('<table id="tblBitacoraSubEstatus" style="width:100%;" class="table table-hover table-bordered">' + thead + tbody + '</table>')).show();
}
