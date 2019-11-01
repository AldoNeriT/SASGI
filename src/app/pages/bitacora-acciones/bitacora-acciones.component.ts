import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BitacoraService, UsuarioService, InstitucionService } from '../../services/service.index';
import { Bitacora } from '../../models/bitacora.model';
import { Router, ActivatedRoute } from '@angular/router';
import { WebsocketService } from '../../services/websocket/websocket.service';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import Swal from 'sweetalert2';
import * as $ from 'jquery';

// declare function init_plugins();
declare function floating_labels();
declare function inicializando_datePicker();
declare function cerrarModal( nombreModal );

@Component({
  selector: 'app-bitacora-acciones',
  templateUrl: './bitacora-acciones.component.html',
  styles: []
})
export class BitacoraAccionesComponent implements OnInit {

  // @ViewChild('txtNombreV', { static: false }) txtNombreV: ElementRef;
  // @ViewChild('txtDescripcionV', { static: false }) txtDescripcionV: ElementRef;
  // @ViewChild('txtArchV', { static: false }) txtArchV: ElementRef;
  // @ViewChild('txtColorV', { static: false }) txtColorV: ElementRef;

  bitacoras: Bitacora[] = [];
  forma: FormGroup;
  formaEditar: FormGroup;

  idBit: string;

  cargando = true;

  institucionV: string;

  constructor( public _bitacoraService: BitacoraService,
               public _usuarioService: UsuarioService,
               public _institucionService: InstitucionService,
               public router: Router,
               public activatedRoute: ActivatedRoute,
               public _webSocketServive: WebsocketService ) {

  }

  ngOnInit() {
    floating_labels();
    inicializando_datePicker();

    this.forma = new FormGroup({
      fecha: new FormControl( null, Validators.required ),
      salida: new FormControl( null, Validators.required ),
      correccion: new FormControl( null, Validators.required ),
      causa: new FormControl( null, Validators.required ),
      antecedentes: new FormControl( null, Validators.required ),
      accion: new FormControl( null, Validators.required ),
      fecha_cumplimiento: new FormControl( null, Validators.required ),
      responsable: new FormControl( null, Validators.required ),
      fecha_cierre: new FormControl( null, Validators.required )
    });

    this.formaEditar = new FormGroup({
      fecha2: new FormControl( null, Validators.required ),
      salida2: new FormControl( null, Validators.required ),
      correccion2: new FormControl( null, Validators.required ),
      causa2: new FormControl( null, Validators.required ),
      antecedentes2: new FormControl( null, Validators.required ),
      accion2: new FormControl( null, Validators.required ),
      fecha_cumplimiento2: new FormControl( null, Validators.required ),
      responsable2: new FormControl( null, Validators.required ),
      fecha_cierre2: new FormControl( null, Validators.required )
    });

    this.cargarBitacoras();
    this.cargarInstitucion();
    this.escucharSocket();
  }

  escucharSocket() {
    this._webSocketServive.listen('cambio-bitacora')
        .subscribe( ( data: any ) => {
          // console.log('Socket: ', data);

          floating_labels();
          inicializando_datePicker();

          this.cargarBitacoras();
          this.cargarInstitucion();
        });
  }

  cargarInstitucion() {

    this.cargando = true;

    this._institucionService.cargarInstituciones()
        .subscribe( instituciones => {
          // this.institucion = instituciones.instituciones;
          // console.log(instituciones.instituciones[0]);

          this.institucionV = instituciones.instituciones[0].nombreInstitucion;

          this.cargando = false;
          floating_labels();
          inicializando_datePicker();
        });

  }

  cargarBitacoras() {

    this.cargando = true;

    this._bitacoraService.cargarBitacoras()
          .subscribe( bitacoras => {
            this.bitacoras = bitacoras;
            this.cargando = false;

            floating_labels();
            inicializando_datePicker();
          });

  }

  agregarBitacora() {

    // if ( this.forma.invalid ) {
    //   return;
    // }

    let req: string;

    if ( $('#requiereSI').prop('checked') ) {
      req = 'SI';
    }
    if ( $('#requiereNO').prop('checked') ) {
      req = 'NO';
    }

    let bitacora = new Bitacora(
      $('#fecha').val() + '',
      this.forma.value.salida,
      this.forma.value.correccion,
      this.forma.value.causa,
      this.forma.value.antecedentes,
      req,
      this.forma.value.accion,
      $('#fecha_cumplimiento').val() + '',
      this.forma.value.responsable,
      $('#fecha_cierre').val() + ''
    );

    console.log(bitacora);

    this._bitacoraService.crearBitacora( bitacora )
          .subscribe( resp => {
            this.cargarBitacoras();
            cerrarModal('modalBitacoraAgregar');
          });

  }

  // formVer( bitacora: Bitacora ) {

  //   // this.txtNombreV.nativeElement.innerText = norma.nombreNorma;
  //   // this.txtDescripcionV.nativeElement.innerText = norma.descripcion;
  //   // this.txtArchV.nativeElement.innerText = norma.archivoDigital;

  //   // if ( norma.color === 'secondary') {
  //   //   this.txtColorV.nativeElement.innerText = 'Blanco';
  //   // }
  //   // if ( norma.color === 'info') {
  //   //   this.txtColorV.nativeElement.innerText = 'Azul';
  //   // }
  //   // if ( norma.color === 'success') {
  //   //   this.txtColorV.nativeElement.innerText = 'Verde';
  //   // }
  //   // if ( norma.color === 'primary') {
  //   //   this.txtColorV.nativeElement.innerText = 'Morado';
  //   // }
  //   // if ( norma.color === 'danger') {
  //   //   this.txtColorV.nativeElement.innerText = 'Rojo';
  //   // }
  //   // if ( norma.color === 'warning') {
  //   //   this.txtColorV.nativeElement.innerText = 'Amarillo';
  //   // }

  // }

  formEditable( bitacora: Bitacora ) {

    this.formaEditar.setValue({
      fecha2: bitacora.fecha,
      salida2: bitacora.seleccion,
      correccion2: bitacora.correccion,
      causa2: bitacora.causa,
      antecedentes2: bitacora.antecedentes,
      accion2: bitacora.planes,
      fecha_cumplimiento2: bitacora.fechaCumplimiento,
      responsable2: bitacora.responsable,
      fecha_cierre2: bitacora.fechaCierre
    });

    console.log(bitacora.correctiva);

    $('#requiereSI2').removeAttr('checked');
    $('#requiereNO2').removeAttr('checked');


    if (bitacora.correctiva === 'SI') {
      $('#requiereSI2').attr('checked', 'true');
      // $('#requiereNO2').attr('checked', 'false');
    }

    if (bitacora.correctiva === 'NO') {
      // $('#requiereSI2').attr('checked', 'false');
      $('#requiereNO2').attr('checked', 'true');
    }

    this.idBit = bitacora._id;

    $('#modalBitacoraEditar > div > div > div > form > div.m-b-40').addClass('focused');
  }

  editarBitacora() {

    // if ( this.forma.invalid ) {
    //   return;
    // }

    let req2: string;

    if ( $('#requiereSI2').prop('checked') ) {
      req2 = 'SI';
    }
    if ( $('#requiereNO2').prop('checked') ) {
      req2 = 'NO';
    }

    let bitacora = new Bitacora(
      $('#fecha2').val() + '',
      this.formaEditar.value.salida2,
      this.formaEditar.value.correccion2,
      this.formaEditar.value.causa2,
      this.formaEditar.value.antecedentes2,
      req2,
      this.formaEditar.value.accion2,
      $('#fecha_cumplimiento2').val() + '',
      this.formaEditar.value.responsable2,
      $('#fecha_cierre2').val() + '',
      this.idBit
    );

    console.log(bitacora);

    this._bitacoraService.crearBitacora( bitacora )
          .subscribe( resp => {
            this.cargarBitacoras();
            cerrarModal('modalBitacoraEditar');
          });

  }

  eliminarBitacora( bitacora: Bitacora ) {

    Swal.fire({
      title: '¡Advertencia!',
      text: `¿Estás seguro de eliminar esta Bitácora?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      cancelButtonColor: '#e74c3c',
      animation: false,
      customClass: {
        popup: 'animated tada'
      }
    }).then((eliminar) => {
      if (eliminar.value) {
        this._bitacoraService.eliminarBitacora( bitacora._id )
          .subscribe( (resp: any) => {
            this.cargarBitacoras();
          } );
      }
    });

  }

  imprimir( opcion: number) {

    let arrBitacoras = [];
    let i = 1;
    arrBitacoras.push([{text: 'NO', fontSize: 9, alignment: 'center', colSpan: 1, style: 'contenido'}, {text: 'Fecha', fontSize: 9, alignment: 'center', colSpan: 1, style: 'contenido'}, {text: 'Salida No Conforme / No Conformidad / Incidente', fontSize: 9, alignment: 'center', colSpan: 1, style: 'contenido'}, {text: 'Corrección', fontSize: 9, alignment: 'center', colSpan: 1, style: 'contenido'}, {text: 'Causa(s)', fontSize: 9, alignment: 'center', colSpan: 1, style: 'contenido'}, {text: 'Antecedentes', fontSize: 9, alignment: 'center', colSpan: 1, style: 'contenido'}, {text: 'Requiere Acción Correctiva (SI/NO)', fontSize: 9, alignment: 'center', colSpan: 1, style: 'contenido'}, {text: 'Acción Correctiva (Planes de Acción)', fontSize: 9, alignment: 'center', colSpan: 1, style: 'contenido'}, {text: 'Fecha de Cumplimiento', fontSize: 9, alignment: 'center', colSpan: 1, style: 'contenido'}, {text: 'Responsable de Ejecutar las Acciones', fontSize: 9, alignment: 'center', colSpan: 1, style: 'contenido'}, {text: 'Fecha de Cierre de la Acción', fontSize: 9, alignment: 'center', colSpan: 1, style: 'contenido'}]);
    for (let bit of this.bitacoras) {
      arrBitacoras.push([ {text: i, fontSize: 8, colSpan: 1, style: 'contenido2'}, {text: bit.fecha, fontSize: 8, colSpan: 1, style: 'contenido2'}, {text: bit.seleccion, fontSize: 8, colSpan: 1, style: 'contenido2'}, {text: bit.correccion, fontSize: 8, colSpan: 1, style: 'contenido2'}, {text: bit.causa, fontSize: 8, colSpan: 1, style: 'contenido2'}, {text: bit.antecedentes, fontSize: 8, colSpan: 1, style: 'contenido2'}, {text: bit.correctiva, fontSize: 8, colSpan: 1, style: 'contenido2'}, {text: bit.planes, fontSize: 8, colSpan: 1, style: 'contenido2'}, {text: bit.fechaCumplimiento, fontSize: 8, colSpan: 1, style: 'contenido2'}, {text: bit.responsable, fontSize: 8, colSpan: 1, style: 'contenido2'}, {text: bit.fechaCierre, fontSize: 8, colSpan: 1, style: 'contenido2'}]);
      i++;
    }

    let docBitacora = {
      pageOrientation: 'landscape',
      content: [{
        style: 'titulo',
        pageOrientation: 'landscape',
        table: {
            heights: [50],
            widths: [750],
            body: [
                [{ text: 'BITÁCORA DE ACCIONES DEL SGI DEL G3', color: 'gray', margin: [10, 15, 10, 10], alignment: 'center'}]
            ]
          }
        },
        {
          style: 'tableExample',
          pageOrientation: 'landscape',
          color: '#444',
          table: {
            widths: ['auto', 615],
            body: [
              [{text: 'INSTITUCIÓN:', fontSize: 10, colSpan: 1, style: 'contenido'}, {text: this.institucionV.toUpperCase(), pageOrientation: 'landscape', fontSize: 10, colSpan: 1, style: 'contenido2'}],
              [{text: 'SALIDA NO CONFORME:', fontSize: 10, colSpan: 1, style: 'contenido'}, {text: 'FALLA O INCUMPLIMIENTO DEL SERVICIO', fontSize: 10, colSpan: 1, style: 'contenido2'}],
              [{text: 'NO CONFORMIDAD:', fontSize: 10, colSpan: 1, style: 'contenido'}, {text: 'INCUMPLIMIENTO DE UN REQUISITO', fontSize: 10, colSpan: 1, style: 'contenido2'}],
              [{text: 'INCIDENTE:', fontSize: 10, colSpan: 1, style: 'contenido'},{text: 'POSIBLES LESIONES O ENFERMEDADES PRODUCIDAS POR CAUSA DEL TRABAJO', fontSize: 10, colSpan: 1, style: 'contenido2'}]
            ]
          }
        },
        {
          style: 'tableExample',
          pageOrientation: 'landscape',
          color: '#444',
          table: {
            widths: ['auto', 45, 'auto', 'auto', 'auto', 'auto', 70, 'auto', 60, 70, 50],
            body: arrBitacoras
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          bold: true,
          fontSize: 11,
          margin: [10, 5, 0, 15]
        },
        titulo: {
          bold: true,
          fontSize: 20,
          margin: [5, 5, 5, 25]
        },
        firma: {
          margin: [170, 20, 0, 15]
        },
        contenido: {
          bold: true,
          color: 'black'
        },
        contenido2: {
          bold: false,
          color: 'black'
        },
        tableHeader2: {
          bold: true,
          widths: [100, 220, 38, 50],
          color: 'black'
        }
      }
    };

    if ( opcion === 1 ) {
      pdfMake.createPdf(docBitacora).download('bitacora-acciones.pdf');
    }
    if ( opcion === 2 ) {
      pdfMake.createPdf(docBitacora).open();
    }
    if ( opcion === 3 ) {
      pdfMake.createPdf(docBitacora).print();
    }

  }



}
