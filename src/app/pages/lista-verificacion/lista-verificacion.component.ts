import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlaneacionService, UsuarioService, AuditoriaService, NormaService, ListaVerificacionService, TablaService } from '../../services/service.index';
import { Planeacion } from '../../models/planeacion.model';
import { Institucion } from '../../models/institucion.model';
import { Tabla } from '../../models/tabla.model';
import { ListaVerificacion } from '../../models/lista-verificacion.model';
import { Usuario } from '../../models/usuario.model';
import { Norma } from 'src/app/models/norma.model';
import { Router, ActivatedRoute } from '@angular/router';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import Swal from 'sweetalert2';
import * as $ from 'jquery';

declare function floating_labels();
declare function inicializando_datePicker();
declare function cerrarModal( nombreModal );

@Component({
  selector: 'app-lista-verificacion',
  templateUrl: './lista-verificacion.component.html',
  styles: []
})
export class ListaVerificacionComponent implements OnInit {

  idP: string;
  idU: string;

  idAu: string;

  idLista: string;
    
  planeacion: any[] = [];
  normas: Norma[] = [];
  listas: ListaVerificacion[] = [];
  tablas: Tabla[] = [];

  arrProActCriV: any[] = [];

  cargando = true;

  procesoV: string;
  auditoriaV: string;
  normasV: string;
  auditorV: string;

  personalV: string;
  fechaV: string;

  forma: FormGroup;
  formaEditar1: FormGroup;
  formaEditar2: FormGroup;
  formaEntrevistado: FormGroup;

  btnValidar: boolean;

  constructor( public _planeacionService: PlaneacionService,
               public _usuarioService: UsuarioService,
               public _auditoriaService: AuditoriaService,
               public _normaService: NormaService,
               public _tablaService: TablaService,
               public _listaVerificacionService: ListaVerificacionService,
               public router: Router,
               public activatedRoute: ActivatedRoute ) {
    activatedRoute.params.subscribe( params => {
      this.idP = params['idP'];
      this.idU = params['idU'];
    });
  }

  ngOnInit() {
    floating_labels();
    inicializando_datePicker();
    this.cargarTablas();
    this.cargarPlaneacion( this.idP );
    this.cargarNormas();
    this.cargarUsuario( this.idU );
    this.cargarListas( this.idP, this.idU);

    this.forma = new FormGroup({
      norma: new FormControl( null, Validators.required ),
      pregunta: new FormControl( null, Validators.required )
    });

    this.formaEditar1 = new FormGroup({
      normaE: new FormControl( null, Validators.required ),
      preguntaE: new FormControl( null, Validators.required )
    });

    this.formaEditar2 = new FormGroup({
      documentoE: new FormControl( null, Validators.required ),
      evidenciaE: new FormControl( null, Validators.required ),
      hallazgosE: new FormControl( null, Validators.required )
    });

    this.formaEntrevistado = new FormGroup({
      personal: new FormControl( null, Validators.required ),
      fecha: new FormControl( null, Validators.required )
    });
  }

  regresar() {
    this.router.navigate(['/listas/' + this.idAu]);
  }

  cargarTablas() {

    this.cargando = true;

    this._tablaService.cargarTabla()
          .subscribe( tablas => {
            this.tablas = tablas;
            // console.log('Tablas: ', tablas);
            this.cargando = false;
          });

  }

  cargarUsuario( id: string) {

    this.cargando = true;

    this._usuarioService.cargarUsuario( id )
          .subscribe( usuario => {
            this.auditorV = usuario.nombre + ' ' + usuario.primer_Apellido + ' ' + (usuario.segundo_Apellido || '');
            this.cargando = false;
            floating_labels();
            inicializando_datePicker();
          });

  }

  cargarNormas() {

    this.cargando = true;

    this._normaService.cargarNormas()
          .subscribe( normas => {
            this.normas = normas;
            // console.log('Normas: ', this.normas);
            this.cargando = false;
            floating_labels();
            inicializando_datePicker();
          });

  }

  cargarPlaneacion( id: string ) {
    this.cargando = true;

    this._planeacionService.cargarPlaneacion( id )
          .subscribe( planeaciones => {
            this.planeacion = planeaciones;
            // console.log('Planeacion: ', this.planeacion);

            this.auditoriaV = planeaciones.auditoria.nombreAuditoria;
            this.idAu = planeaciones.auditoria._id;

            let array: any[] = [];
            if ( planeaciones.proceso.nombreProceso ) {
              array.push(planeaciones.proceso.nombreProceso);
            }
            if ( planeaciones.actividad ) {
              array.push(planeaciones.actividad);
            }
            if ( planeaciones.criterio ) {
              array.push(planeaciones.criterio);
            }
            if ( planeaciones.area ) {
              array.push(planeaciones.area);
            }

            this.arrProActCriV.push(array.join(', '));


            this._auditoriaService.cargarAuditoria( planeaciones.auditoria._id )
                .subscribe( auditoria => {
                  // this.institucion = instituciones.instituciones;
                  // console.log('Auditoria: ', auditoria);


                  let arrNormasV: any[] = [];
                  for ( let nor of  auditoria.normas) {
                    arrNormasV.push(nor.nombreNorma);
                  }

                  this.normasV = arrNormasV.join(', ');


                  this.cargando = false;
                  floating_labels();
                  inicializando_datePicker();
                });


            this.cargando = false;
            floating_labels();
            inicializando_datePicker();
          });
  }

  cargarListas( idP: string, idU: string) {

    this.cargando = true;

    if ( this._usuarioService.usuario.tipo_Usuario === 'AUDITOR_LIDER') {
      this._listaVerificacionService.cargarListasPlaneacionUsuarioEnviar( idP, idU)
          .subscribe( listas => {
            this.listas = listas;
            // console.log(this.listas);

            let i = 0;
            let long = listas.length;
            // console.log(i, long);

            for (let val of listas) {
              if ( val.valido === true ) {
                i++;
              }
            }

            if ( i === long ) {
              this.btnValidar = false;
              // console.log('todas estan validadas');
            } else {
              this.btnValidar = true;
              // console.log('alguna esta invalidada');
            }

            if ( listas[0] ) {
              this.personalV = (listas[0].entrevistado || '');
              this.fechaV = (listas[0].fecha || '');
            }

            this.cargando = false;
            floating_labels();
            inicializando_datePicker();
          });
    } else {
      this._listaVerificacionService.cargarListasPlaneacionUsuario( idP, idU)
          .subscribe( listas => {
            this.listas = listas;
            // console.log(this.listas);
            if ( listas[0] ) {
              this.personalV = (listas[0].entrevistado || '');
              this.fechaV = (listas[0].fecha || '');
            }
            this.cargando = false;
            floating_labels();
            inicializando_datePicker();
          });
    }
  }

  agregarLista() {

    if ( this.forma.invalid ) {
      return;
    }

    // console.log($('#personal').val());
    // console.log($('#fecha').val());

    let entr = $('#personal').val() + '';
    let fech = $('#fecha').val() + '';

    let listaVerificacion = new ListaVerificacion(
      this.idU,
      this.idP,
      this.forma.value.norma,
      this.forma.value.pregunta,
      '',
      '',
      '',
      entr,
      fech
    );

    console.log(listaVerificacion);

    this._listaVerificacionService.crearListaVerificacion( listaVerificacion )
        .subscribe( resp => {
          floating_labels();
          inicializando_datePicker();
          this.cargarTablas();
          this.cargarPlaneacion( this.idP );
          this.cargarNormas();
          this.cargarUsuario( this.idU );
          this.cargarListas( this.idP, this.idU);
          cerrarModal('modalListaAgregar');
        });
  }

  formEditable1( listaVerificacion: ListaVerificacion ) {

    this.formaEditar1.setValue({
      normaE: listaVerificacion.puntoNorma,
      preguntaE: listaVerificacion.pregunta
    });

    this.idLista = listaVerificacion._id;

    $('#modalListaEditar1 > div > div > div > form > div.m-b-40').addClass('focused');
  }

  formEditable2( listaVerificacion: ListaVerificacion ) {

    // console.log(listaVerificacion);

    this.formaEditar2.setValue({
      documentoE: listaVerificacion.documento,
      evidenciaE: listaVerificacion.evidencia,
      hallazgosE: listaVerificacion.hallazgos
    });

    this.idLista = listaVerificacion._id;

    if ( (listaVerificacion.documento !== '') || (listaVerificacion.evidencia !== '') || (listaVerificacion.hallazgos !== '') ) {
      $('#modalListaEditar2 > div > div > div > form > div.m-b-40').addClass('focused');
    }
  }

  editarEntrevistado() {

    let entr = $('#personal').val() + '';
    let fech = $('#fecha').val() + '';

    let listaVerificacion = new ListaVerificacion(
      this.idU,
      this.idP,
      '',
      '',
      '',
      '',
      '',
      entr,
      fech,
      this.idLista
    );

    console.log(listaVerificacion);


    this._listaVerificacionService.cambioMasivoEntrevistado( listaVerificacion, this.idP )
            .subscribe( resp => {
              floating_labels();
              inicializando_datePicker();
              this.cargarTablas();
              this.cargarPlaneacion( this.idP );
              this.cargarNormas();
              this.cargarUsuario( this.idU );
              this.cargarListas( this.idP, this.idU);
            });

  }

  editarLista() {

    let listaVerificacion = new ListaVerificacion(
      this.idU,
      this.idP,
      this.formaEditar1.value.normaE,
      this.formaEditar1.value.preguntaE,
      '',
      '',
      '',
      '',
      '',
      this.idLista
    );

    // console.log(listaVerificacion);


    this._listaVerificacionService.editarListaVerificacion( listaVerificacion )
            .subscribe( resp => {
              floating_labels();
              inicializando_datePicker();
              this.cargarTablas();
              this.cargarPlaneacion( this.idP );
              this.cargarNormas();
              this.cargarUsuario( this.idU );
              this.cargarListas( this.idP, this.idU);
              cerrarModal('modalListaEditar1');
            });

  }

  completarLista() {

    let listaVerificacion = new ListaVerificacion(
      this.idU,
      this.idP,
      '',
      '',
      this.formaEditar2.value.documentoE,
      this.formaEditar2.value.evidenciaE,
      this.formaEditar2.value.hallazgosE,
      '',
      '',
      this.idLista
    );

    // console.log(listaVerificacion);


    this._listaVerificacionService.completarListaVerificacion( listaVerificacion )
            .subscribe( resp => {
              floating_labels();
              inicializando_datePicker();
              this.cargarTablas();
              this.cargarPlaneacion( this.idP );
              this.cargarNormas();
              this.cargarUsuario( this.idU );
              this.cargarListas( this.idP, this.idU);
              cerrarModal('modalListaEditar2');
            });

  }

  eliminarLista( listaVerificacion: ListaVerificacion ) {

    Swal.fire({
      title: '¡Advertencia!',
      text: `¿Estás seguro de eliminar esta lista?`,
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
        this._listaVerificacionService.eliminarLista( listaVerificacion._id )
          .subscribe( (resp: any) => {
              floating_labels();
              inicializando_datePicker();
              this.cargarTablas();
              this.cargarPlaneacion( this.idP );
              this.cargarNormas();
              this.cargarUsuario( this.idU );
              this.cargarListas( this.idP, this.idU);
          } );
      }
    });

  }

  validarContrasenaLista( usuario2: Usuario ) {

    // auditoria.pasos = 2;

    Swal.fire({
      title: 'Ingrese su contraseña',
      input: 'password',
      showCancelButton: true,
      confirmButtonText: 'Validar',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#e74c3c'
    }).then((result) => {
      if (result.value) {
        let usuario = new Usuario(
          usuario2.numero_Empleado,
          usuario2.nombre_Usuario,
          usuario2.numero_Empleado,
          usuario2.primer_Apellido,
          usuario2.email,
          usuario2.telefono,
          usuario2.puesto,
          result.value,
          usuario2.tipo_Usuario,
          usuario2.segundo_Apellido,
          usuario2._id
        );
        this._usuarioService.validarContrasenaAudiL( usuario )
          .subscribe( resp => {
            // console.log(resp);
            this._listaVerificacionService.cambiarValido( this.idP )
                .subscribe( resp2 => {
                    floating_labels();
                    inicializando_datePicker();
                    this.cargarTablas();
                    this.cargarPlaneacion( this.idP );
                    this.cargarNormas();
                    this.cargarUsuario( this.idU );
                    this.cargarListas( this.idP, this.idU);
          });
          });
      } else {
        if ( result.value === undefined) {
        } else {
          Swal.fire({
            title: '¡Campo Vacío!',
            text: 'No ingresaste ninguna contraseña, inténtalo de nuevo',
            type: 'error',
            animation: false,
            customClass: {
              popup: 'animated tada'
            }
          });
        }
      }
    });

  }

  cambiarEnviar() {

    this._listaVerificacionService.cambiarEnviar( this.idP )
          .subscribe( resp => {
              floating_labels();
              inicializando_datePicker();
              this.cargarTablas();
              this.cargarPlaneacion( this.idP );
              this.cargarNormas();
              this.cargarUsuario( this.idU );
              this.cargarListas( this.idP, this.idU);
          });

  }

  imprimir( opcion: number) {

    let tabla = [];

    tabla.push([{ text: 'Punto de la Norma', fontSize: 10, alignment: 'center', style:'segundaSeccion', fillColor: '#dddddd', colSpan: 1 }, { text: 'Pregunta', fontSize: 10, fillColor: '#dddddd', colSpan: 1, style:'segundaSeccion', alignment: 'center' }, { text: 'Documento Revisado/parrafo', fontSize: 10, fillColor: '#dddddd', style:'segundaSeccion', colSpan: 1, alignment: 'center' }, { text: 'Evidencia Encontrada', fontSize: 10, fillColor: '#dddddd', colSpan: 1, style:'segundaSeccion',alignment: 'center' }, { text: 'Hallazgo  NC - No Conformidad O - Observacion ODM - Oportunidad de Mejora', fontSize: 8, fillColor: '#dddddd',  style:'segundaSeccion',colSpan: 1, alignment: 'center' }]);

    // for (let i = 0; i < 3; i++) {
    //   tabla.push([' ', ' ', ' ', ' ', ' ']);
    // }

    for (let lista of this.listas) {
      //tabla.push([lista.puntoNorma, lista.pregunta, lista.documento, lista.evidencia, lista.hallazgos]);
      tabla.push([{ text: lista.puntoNorma, fontSize: 10, alignment: 'center', style:'negris',  colSpan: 1 }, { text: lista.pregunta, fontSize: 10, style:'negrit',  colSpan: 1 }, { text: lista.documento, fontSize: 10, alignment: 'center', style:'negrit',  colSpan: 1 }, { text: lista.evidencia, fontSize: 10, alignment: 'center', style:'negrit', colSpan: 1 },{ text: lista.hallazgos, fontSize: 10, alignment: 'center', style:'negrit',  colSpan: 1 }]);
    }

    var docVerificacion = {
      content: [{
          style: 'titulo',
          table: {
              heights: [50],
              widths: [500],
              body: [
                  [{ text: 'Lista de Verificacion para Auditorias del SGI del G3', color: 'gray', margin: [10, 15, 10, 10], alignment: 'center' }]
              ]
          }
        },
        //En estas tablas se coloca la primer seccion del documento - proceso, auditoria, personal, norma
        {
          style: 'primerSeccion',
          table: {
              widths: ['auto'],
              body: [
                ['Nombre del Proceso / Procedimiento / Área / Actividad:'],
                [{ text: this.arrProActCriV[0], fontSize: 10, colSpan: 1, style:'negris' }]
              ]
          },
          layout: 'noBorders'
        },
        {
          style: 'primerSeccion',
          table: {
            widths: ['auto', 'auto'],
            body: [
              ['No. de Auditoría:', { text: this.auditoriaV, fontSize: 10, colSpan: 1, style:'negris' }]
            ]
          },
          layout: 'noBorders'
        },
        {
          style: 'primerSeccion',
          table: {
            widths: ['auto', 'auto'],
            body: [
              ['Personal Entrevistado:', { text: this.personalV, fontSize: 10, colSpan: 1, style:'negris' }]
            ]
          },
          layout: 'noBorders'
        },
        {
          style: 'primerSeccion',
          table: {
            widths: ['auto', 'auto'],
            body: [
              ['Norma:', { text: this.normasV, fontSize: 10, colSpan: 1, style:'negris' }]
            ]
          },
          layout: 'noBorders'
        },
        //aqui termina

        //segunda seccion del documento, punto de la norma, pregunta, etc
        {
          style: 'segundaSeccion2',
          color: '#444',
          table: {
            widths: [60, 200, 80, 60, 75],
            body: tabla
          }
        },

        //Tercer seccion del documento - auditor y fecha
        {
          style: 'tercerSeccion',
          table: {
            widths: ['auto', 140, 200, 'auto', 80],
            body: [
              ['Auditor(a): ', { text: this.auditorV, fontSize: 10, colSpan: 1, style:'negris' }, ' ', 'Fecha:', { text: this.fechaV, fontSize: 10, colSpan: 1, style:'negris' }]
            ]
          },
          layout: 'noBorders'
          //decoration:'underline',
        },
      ],
      //disenio de las tablas
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        negris:{
          bold:false
        },
        negrit:{
        bold: true
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        primerSeccion: {
          bold: true,
          fontSize: 11,
          color: 'black',
          margin: [0, 5, 0, 0]
        },
        segundaSeccion: {
          bold: true,
          fontSize: 11,
          color: 'black',
          //margin: [0, 25, 0, 0]
        },
        segundaSeccion2: {
          bold: true,
          fontSize: 11,
          color: 'black',
          margin: [0, 25, 0, 0]
        },
        tercerSeccion: {
          bold: true,
          fontSize: 11,
          color: 'black',
          margin: [0, 15, 0, 0]
        },
        titulo: {
          bold: true,
          fontSize: 20,
          margin: [0, 5, 5, 25]
        },
        firma: {
          margin: [170, 20, 0, 15]
        },
        tableHeader2: {
          bold: true,
          widths: [100, 220, 38, 50],
          color: 'black'
        },
      }
    };

    if ( opcion === 1 ) {
      pdfMake.createPdf(docVerificacion).download('lista-verificacion.pdf');
    }
    if ( opcion === 2 ) {
      pdfMake.createPdf(docVerificacion).open();
    }
    if ( opcion === 3 ) {
      pdfMake.createPdf(docVerificacion).print();
    }

  }

}
