import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NormaService, UsuarioService, AuditoriaService, InstitucionService, TablaService, InformeService, ListaVerificacionService, PlaneacionService } from '../../services/service.index';
import { Auditoria } from '../../models/auditoria.model';
import { Usuario } from '../../models/usuario.model';
import { Norma } from '../../models/norma.model';
import { Institucion } from '../../models/institucion.model';
import { ListaVerificacion } from '../../models/lista-verificacion.model';
import { Informe } from '../../models/informe.model';
import { PersonalContactado } from '../../models/personal-contactado.model';
import { NoConformidades } from '../../models/no-conformidades.model';
import { Planeacion } from '../../models/planeacion.model';
import { Tabla } from '../../models/tabla.model';
import { Matriz } from '../../models/matriz.model';
import { Router, ActivatedRoute } from '@angular/router';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import Swal from 'sweetalert2';
import * as $ from 'jquery';

declare function floating_labels();
declare function inicializando_datePicker();
declare function inicializando_dateRange();
declare function cerrarModal( nombreModal );

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styles: []
})
export class InformeComponent implements OnInit {

  mostrarFormTitulo = false;
  mostrarFormCom = false;
  mostrarFormConc = false;
  mostrarFormFechas = false;
  mostrarFormFechaEmision = false;

  normas: Norma[] = [];
  tablas: any[] = [];
  personal: PersonalContactado[] = [];
  hallazgos: NoConformidades[] = [];
  matriz: any[] = [];
  informe: Informe;

  listasNC: ListaVerificacion[] = [];
  listasODM: ListaVerificacion[] = [];

  planeaciones: Planeacion[] = [];

  // Form
  formaTitulo: FormGroup;
  formaComentarios: FormGroup;
  formaConclusiones: FormGroup;
  formaFechas: FormGroup;
  formaFechaEmision: FormGroup;
  formaOM: FormGroup;
  formaPersonal: FormGroup;
  formaHallazgo: FormGroup;

  totalNormas = 0;

  idA: string;
  idInforme: string;

  cargando = true;

  // Variables para Ver
  institucionV: string;
  auditoriaNombreV: string;
  noAuditoriaV: string;
  auditorLiderV: string;
  grupoAuditorV: string;
  objetivoV: string;
  alcanceV: string;
  directorV: string;
  procesoV: string;
  fechaV: string;
  comentariosV: string;
  conclusionesV: string;
  fechasV: string;
  fechaEmisionV: string;
  oportunidadesMejoraV: any[];
  normasV: string;

  totalNC: number;
  totalODM: number;


  constructor( public _normaService: NormaService,
               public _auditoriaService: AuditoriaService,
               public _usuarioService: UsuarioService,
               public _institucionService: InstitucionService,
               public _tablaService: TablaService,
               public _informeService: InformeService,
               public _planeacionService: PlaneacionService,
               public _listaVerificacionService: ListaVerificacionService,
               public router: Router,
               public activatedRoute: ActivatedRoute) { 
    activatedRoute.params.subscribe( params => {
    this.idA = params['idA'];
  });
}

  ngOnInit() {
    floating_labels();
    inicializando_datePicker();
    inicializando_dateRange();

    this.cargarListasNC( this.idA );
    this.cargarListasODM( this.idA );
    this.cargarPlaneacionesAudi( this.idA );
    this.cargarAuditoria( this.idA );
    this.cargarNormas();
    // this.cargarTablas();
    this.cargarInforme( this.idA );

    this.formaTitulo = new FormGroup({
      proceso: new FormControl( null, Validators.required ),
      fecha: new FormControl( null, Validators.required )
    });

    this.formaComentarios = new FormGroup({
      comentarios: new FormControl( null, Validators.required )
    });

    this.formaConclusiones = new FormGroup({
      conclusiones: new FormControl( null, Validators.required )
    });

    this.formaFechas = new FormGroup({
      fechas: new FormControl( null, Validators.required )
    });

    this.formaFechaEmision = new FormGroup({
      fechaEmision: new FormControl( null, Validators.required )
    });

    this.formaOM = new FormGroup({
      oportunidad: new FormControl( null, Validators.required )
    });

    this.formaPersonal = new FormGroup({
      nombre: new FormControl( null, Validators.required ),
      puesto: new FormControl( null, Validators.required )
    });

    this.formaHallazgo = new FormGroup({
      hallazgo: new FormControl( null, Validators.required ),
      requisito: new FormControl( null, Validators.required )
    });
  }

  cargarListasNC( idAuditoria: string) {

    this.cargando = true;

    this._listaVerificacionService.cargarListasPlaneacionNC( idAuditoria )
        .subscribe( listas => {
          this.listasNC = listas;
          this.totalNC = this.listasNC.length;

          this.cargando = false;
          floating_labels();
          inicializando_datePicker();
          inicializando_dateRange();
        });
  }

  cargarListasODM( idAuditoria: string) {

    this.cargando = true;

    this._listaVerificacionService.cargarListasPlaneacionODM( idAuditoria )
        .subscribe( listas => {
          this.listasODM = listas;
          this.totalODM = this.listasODM.length;

          this.cargando = false;
          floating_labels();
          inicializando_datePicker();
          inicializando_dateRange();
        });
  }

  cargarPlaneacionesAudi( id: string ) {

    this.cargando = true;

    this._planeacionService.cargarPlaneacionesAudi( id )
        .subscribe( planeaciones => {
          this.planeaciones = planeaciones;
          // console.log('Planeaciones: ', this.planeaciones);

          this.cargando = false;

        });

  }

  cargarAuditoria( id: string ) {

    this.cargando = true;

    this._auditoriaService.cargarAuditoria( id )
          .subscribe( auditoria => {
            // this.auditoria = auditoria;
            // console.log('Auditoria: ', auditoria);

            this.auditoriaNombreV = auditoria.nombre;
            this.noAuditoriaV = auditoria.nombreAuditoria;

            let arrGrupoAuditorV: any[] = [];
            for ( let gp of  auditoria.grupoAuditor) {
              arrGrupoAuditorV.push(gp.nombre + ' ' + gp.primer_Apellido + ' ' + (gp.segundo_Apellido || ''));
            }

            this.grupoAuditorV = arrGrupoAuditorV.join(', ');

            this.objetivoV = auditoria.objetivos;
            this.alcanceV = auditoria.alcance;

            this._institucionService.cargarInstituciones()
                .subscribe( instituciones => {
                  // this.institucion = instituciones.instituciones;
                  // console.log(instituciones.instituciones[0]);

                  this.institucionV = instituciones.instituciones[0].nombreInstitucion;

                  this.cargando = false;
                  floating_labels();
                  inicializando_datePicker();
                  inicializando_dateRange();
                });


            this.cargando = false;
            floating_labels();
            inicializando_datePicker();
            inicializando_dateRange();
          });

  }

  cargarNormas() {

    this.cargando = true;

    this._normaService.cargarNormas()
          .subscribe( normas => {
            this.normas = normas;
            this.totalNormas = normas.length;
            // console.log(normas);
            this.cargando = false;
            floating_labels();
            inicializando_datePicker();
            inicializando_dateRange();
          });

  }

  cargarTablas() {

    this.cargando = true;

    this._tablaService.cargarTabla()
          .subscribe( tablas => {
            this.tablas = tablas;
            // console.log('Tablas: ', tablas);



            this._informeService.cargarMatrizInforme( this.idInforme )
                .subscribe( matriz => {
                  this.matriz = matriz;
                  // console.log('Matriz: ', matriz);


                  this.matrizValores();


                  this.cargando = false;
                  floating_labels();
                  inicializando_datePicker();
                  inicializando_dateRange();
                });



            this.cargando = false;
            floating_labels();
            inicializando_datePicker();
            inicializando_dateRange();
          });

  }

  cargarInforme( idAudi: string ) {

    this.cargando = true;

    this._informeService.cargarInforme( idAudi )
          .subscribe( informe => {
            this.informe = informe;
            // console.log('Informe: ', this.informe);

            this.auditorLiderV = informe.auditorLider.nombre + ' ' + informe.auditorLider.primer_Apellido + ' ' + (informe.auditorLider.segundo_Apellido || '');
            this.directorV = informe.director.nombre + ' ' + informe.director.primer_Apellido + ' ' + (informe.director.segundo_Apellido || '');

            this.procesoV = informe.proceso;
            this.fechaV = informe.fecha;

            this.comentariosV = informe.comentarios;
            this.conclusionesV = informe.conclusiones;

            this.fechasV = informe.fechaAuditorias;
            this.fechaEmisionV = informe.fechaEmision;

            this.oportunidadesMejoraV = informe.oportunidadesMejora;

            // console.log('OPOPOP', this.oportunidadesMejoraV);
            // this.totalOM = this.oportunidadesMejoraV.length;

            this.idInforme = informe._id;

            // this.cargarPersonal( informe._id );
            // this.cargarNoConf( informe._id );
            this.cargarTablas();

            this._auditoriaService.cargarAuditoria( informe.auditoria._id )
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
                  inicializando_dateRange();
                });

            this.cargando = false;
            floating_labels();
            inicializando_datePicker();
            inicializando_dateRange();
          });

  }

  // cargarPersonal( id: string) {

  //   this.cargando = true;

  //   this._informeService.cargarPersonal( id )
  //         .subscribe( personal => {
  //           this.personal = personal;
  //           // console.log('Personal: ', personal);
  //           this.cargando = false;
  //           floating_labels();
  //           inicializando_datePicker();
  //           inicializando_dateRange();
  //         });

  // }

  // cargarNoConf( id: string) {

  //   this.cargando = true;

  //   this._informeService.cargarNoConformidades( id )
  //         .subscribe( hallazgos => {
  //           this.hallazgos = hallazgos;
  //           // console.log('Hallazgos: ', hallazgos);
  //           this.totalNC = hallazgos.length;
  //           this.cargando = false;
  //           floating_labels();
  //           inicializando_datePicker();
  //           inicializando_dateRange();
  //         });

  // }




  // ************************************************
  // *** FORMS DE LOS EDITABLES ***
  // ************************************************

  editarTitulo() {
    this.mostrarFormTitulo = !this.mostrarFormTitulo;

    floating_labels();
    inicializando_datePicker();
    inicializando_dateRange();

    if ( !this.mostrarFormTitulo ) {
      return;
    }

    // console.log('Titulo');

    this.formaTitulo.setValue({
      proceso: this.informe.proceso,
      fecha: this.informe.fecha
    });
  }

  editarComentarios() {
    this.mostrarFormCom = !this.mostrarFormCom;

    floating_labels();
    inicializando_datePicker();
    inicializando_dateRange();

    if ( !this.mostrarFormCom ) {
      return;
    }

    // console.log('Comentarios');

    this.formaComentarios.setValue({
      comentarios: this.informe.comentarios
    });
  }

  editarConclusiones() {
    this.mostrarFormConc = !this.mostrarFormConc;

    floating_labels();
    inicializando_datePicker();
    inicializando_dateRange();

    if ( !this.mostrarFormConc ) {
      return;
    }

    // console.log('Conclusiones');

    this.formaConclusiones.setValue({
      conclusiones: this.informe.conclusiones,
    });
  }

  editarFechas() {
    this.mostrarFormFechas = !this.mostrarFormFechas;

    floating_labels();
    inicializando_datePicker();
    inicializando_dateRange();

    if ( !this.mostrarFormFechas ) {
      return;
    }

    // console.log('Fechas');

    this.formaFechas.setValue({
      fechas: this.informe.fechaAuditorias
    });
  }

  editarFechaEmision() {
    this.mostrarFormFechaEmision = !this.mostrarFormFechaEmision;

    floating_labels();
    inicializando_datePicker();
    inicializando_dateRange();

    if ( !this.mostrarFormFechaEmision ) {
      return;
    }

    // console.log('Fecha de Emisión');

    this.formaFechaEmision.setValue({
      fechaEmision: this.informe.fechaEmision
    });
  }

  // ************************************************
  // *** EDITAR ***
  // ************************************************

  editarTituloS() {

    // if ( this.formaTitulo.invalid ) {
    //   console.log('Invalido');
    //   return;
    // }

    let fech = $('#fecha').val() + '';

    this.mostrarFormTitulo = false;

    let informe = new Informe(
      this.idA,
      this.formaTitulo.value.proceso,
      fech,
      [],
      '',
      '',
      '',
      '',
      '',
      '',
      this.idInforme
    );

    // console.log('Informe Titulo: ', informe);

    this._informeService.modificarTitulo( informe )
            .subscribe( resp => {
              floating_labels();
              inicializando_datePicker();
              inicializando_dateRange();

              this.cargarListasNC( this.idA );
              this.cargarListasODM( this.idA );
              this.cargarPlaneacionesAudi( this.idA );
              this.cargarAuditoria( this.idA );
              this.cargarNormas();
              // this.cargarTablas();
              this.cargarInforme( this.idA );
            });

  }

  editarComentariosS() {

    if ( this.formaComentarios.invalid ) {
      // console.log('Invalido');
      return;
    }

    this.mostrarFormCom = false;

    let informe = new Informe(
      this.idA,
      '',
      '',
      [],
      this.formaComentarios.value.comentarios,
      '',
      '',
      '',
      '',
      '',
      this.idInforme
    );

    // console.log('Informe Comentarios: ', informe);

    this._informeService.modificarComentarios( informe )
            .subscribe( resp => {
              floating_labels();
              inicializando_datePicker();
              inicializando_dateRange();

              this.cargarListasNC( this.idA );
              this.cargarListasODM( this.idA );
              this.cargarPlaneacionesAudi( this.idA );
              this.cargarAuditoria( this.idA );
              this.cargarNormas();
              // this.cargarTablas();
              this.cargarInforme( this.idA );
            });

  }

  editarConclusionesS() {

    if ( this.formaConclusiones.invalid ) {
      // console.log('Invalido');
      return;
    }

    this.mostrarFormConc = false;

    let informe = new Informe(
      this.idA,
      '',
      '',
      [],
      '',
      this.formaConclusiones.value.conclusiones,
      '',
      '',
      '',
      '',
      this.idInforme
    );

    // console.log('Informe Conclusiones: ', informe);

    this._informeService.modificarConclusiones( informe )
            .subscribe( resp => {
              floating_labels();
              inicializando_datePicker();
              inicializando_dateRange();

              this.cargarListasNC( this.idA );
              this.cargarListasODM( this.idA );
              this.cargarPlaneacionesAudi( this.idA );
              this.cargarAuditoria( this.idA );
              this.cargarNormas();
              // this.cargarTablas();
              this.cargarInforme( this.idA );
            });

  }

  editarFechasS() {

    // if ( this.formaTitulo.invalid ) {
    //   console.log('Invalido');
    //   return;
    // }

    let fech = $('#fechas').val() + '';

    this.mostrarFormFechas = false;

    let informe = new Informe(
      this.idA,
      this.formaTitulo.value.proceso,
      '',
      [],
      '',
      '',
      '',
      '',
      fech,
      '',
      this.idInforme
    );

    // console.log('Informe Fecha Auditorias: ', informe);

    this._informeService.modificarFechas( informe )
            .subscribe( resp => {
              floating_labels();
              inicializando_datePicker();
              inicializando_dateRange();

              this.cargarListasNC( this.idA );
              this.cargarListasODM( this.idA );
              this.cargarPlaneacionesAudi( this.idA );
              this.cargarAuditoria( this.idA );
              this.cargarNormas();
              // this.cargarTablas();
              this.cargarInforme( this.idA );
            });

  }

  editarFechaEmisionS() {

    // if ( this.formaTitulo.invalid ) {
    //   console.log('Invalido');
    //   return;
    // }

    let fech = $('#fechaEmision').val() + '';

    this.mostrarFormFechaEmision = false;

    let informe = new Informe(
      this.idA,
      this.formaTitulo.value.proceso,
      '',
      [],
      '',
      '',
      '',
      '',
      '',
      fech,
      this.idInforme
    );

    // console.log('Informe Fecha Emision: ', informe);

    this._informeService.modificarFechaEmision( informe )
            .subscribe( resp => {
              floating_labels();
              inicializando_datePicker();
              inicializando_dateRange();

              this.cargarListasNC( this.idA );
              this.cargarListasODM( this.idA );
              this.cargarPlaneacionesAudi( this.idA );
              this.cargarAuditoria( this.idA );
              this.cargarNormas();
              // this.cargarTablas();
              this.cargarInforme( this.idA );
            });

  }

  terminado() {

    Swal.fire({
      title: '¿Terminar Auditoría?',
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      cancelButtonColor: '#e74c3c',
      animation: false,
      customClass: {
        popup: 'animated tada'
      }
    }).then((respuesta) => {
      if (respuesta.value) {
        this._auditoriaService.cambiarTerminado( this.idA )
            .subscribe( resp => {

              this.router.navigate(['/planes']);

            });
      }
    });

  }

  // ************************************************
  // *** OPORTUNIDADES DE MEJORA ***
  // ************************************************

  editarOMS() {

    if ( this.formaOM.invalid ) {
      // console.log('Invalido');
      return;
    }

    this.mostrarFormCom = false;

    this.oportunidadesMejoraV.push(this.formaOM.value.oportunidad);

    let informe = new Informe(
      this.idA,
      '',
      '',
      this.oportunidadesMejoraV,
      '',
      '',
      '',
      '',
      '',
      '',
      this.idInforme
    );

    // console.log('Informe OM: ', informe);

    this._informeService.modificarOM( informe )
            .subscribe( resp => {
              floating_labels();
              inicializando_datePicker();
              inicializando_dateRange();

              this.cargarListasNC( this.idA );
              this.cargarListasODM( this.idA );
              this.cargarPlaneacionesAudi( this.idA );
              this.cargarAuditoria( this.idA );
              this.cargarNormas();
              // this.cargarTablas();
              this.cargarInforme( this.idA );
              cerrarModal('modalAgregar2');
            });

  }

  eliminarOM( ind: number ) {

    Swal.fire({
      title: '¡Advertencia!',
      text: `¿Estás seguro de eliminar esta Oportunidad de Mejora?`,
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

        // console.log('index: ', ind);
        this.oportunidadesMejoraV.splice(ind, 1);
        // console.log('OOPOPPPPPPPPPP: ',this.oportunidadesMejoraV);

        let informe = new Informe(
          this.idA,
          '',
          '',
          this.oportunidadesMejoraV,
          '',
          '',
          '',
          '',
          '',
          '',
          this.idInforme
        );

        // console.log('Informe OM: ', informe);

        this._informeService.eliminarOM( informe )
                .subscribe( resp => {
                  floating_labels();
                  inicializando_datePicker();
                  inicializando_dateRange();

                  this.cargarListasNC( this.idA );
                  this.cargarListasODM( this.idA );
                  this.cargarPlaneacionesAudi( this.idA );
                  this.cargarAuditoria( this.idA );
                  this.cargarNormas();
                  // this.cargarTablas();
                  this.cargarInforme( this.idA );
                });


      }
    });

  }

  // ************************************************
  // *** PERSONAL CONTACTADO ***
  // ************************************************

  editarPersonalS() {

    if ( this.formaPersonal.invalid ) {
      // console.log('Invalido');
      return;
    }

    let personal = new PersonalContactado(
      this.idInforme,
      this.formaPersonal.value.nombre,
      this.formaPersonal.value.puesto,
    );

    // console.log('Personal: ', personal);

    this._informeService.crearPersonal( personal )
            .subscribe( resp => {
              floating_labels();
              inicializando_datePicker();
              inicializando_dateRange();

              this.cargarListasNC( this.idA );
              this.cargarListasODM( this.idA );
              this.cargarPlaneacionesAudi( this.idA );
              this.cargarAuditoria( this.idA );
              this.cargarNormas();
              // this.cargarTablas();
              this.cargarInforme( this.idA );
              cerrarModal('modalAgregar1');
            });

  }

  eliminarPersonal( personal: PersonalContactado ) {

    Swal.fire({
      title: '¡Advertencia!',
      text: `¿Estás seguro de eliminar a "${personal.nombre}"?`,
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
        this._informeService.eliminarPersonal( personal._id )
          .subscribe( (resp: any) => {
              floating_labels();
              inicializando_datePicker();
              inicializando_dateRange();

              this.cargarListasNC( this.idA );
              this.cargarListasODM( this.idA );
              this.cargarPlaneacionesAudi( this.idA );
              this.cargarAuditoria( this.idA );
              this.cargarNormas();
              // this.cargarTablas();
              this.cargarInforme( this.idA );
          } );
      }
    });

  }

  // ************************************************
  // *** HALLAZGOS ***
  // ************************************************

  editarHallazgoS() {

    if ( this.formaHallazgo.invalid ) {
      // console.log('Invalido');
      return;
    }

    let hallazgo = new NoConformidades(
      this.idInforme,
      this.formaHallazgo.value.hallazgo,
      this.formaHallazgo.value.requisito,
    );

    // console.log('Hallazgo: ', hallazgo);

    this._informeService.crearNoConformidades( hallazgo )
            .subscribe( resp => {
              floating_labels();
              inicializando_datePicker();
              inicializando_dateRange();

              this.cargarListasNC( this.idA );
              this.cargarListasODM( this.idA );
              this.cargarPlaneacionesAudi( this.idA );
              this.cargarAuditoria( this.idA );
              this.cargarNormas();
              // this.cargarTablas();
              this.cargarInforme( this.idA );
              cerrarModal('modalAgregar3');
            });

  }

  eliminarHallazgo( hallazgo: NoConformidades ) {

    Swal.fire({
      title: '¡Advertencia!',
      text: `¿Estás seguro de eliminar "${hallazgo.hallazgo}"?`,
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
        this._informeService.eliminarNoConformidades( hallazgo._id )
          .subscribe( (resp: any) => {
              floating_labels();
              inicializando_datePicker();
              inicializando_dateRange();

              this.cargarListasNC( this.idA );
              this.cargarListasODM( this.idA );
              this.cargarPlaneacionesAudi( this.idA );
              this.cargarAuditoria( this.idA );
              this.cargarNormas();
              // this.cargarTablas();
              this.cargarInforme( this.idA );
          } );
      }
    });

  }

  // ************************************************
  // *** MATRIZ ***
  // ************************************************

  matrizValores() {

    for ( let t of this.tablas) {
      for ( let m of this.matriz) {
        if ( t._id === m.tabla._id) {
          if ( m.revision === 'A' ) {
            // console.log('A');
            $('#r11_' + t._id).attr('checked', 'true');
          }
          if ( m.revision === 'NA' ) {
            // console.log('NA');
            $('#r12_' + t._id).attr('checked', 'true');
          }
          if ( m.revision === 'EP' ) {
            // console.log('EP');
            $('#r13_' + t._id).attr('checked', 'true');
          }

          if ( m.resultado === 'AD' ) {
            // console.log('AD');
            $('#r21_' + t._id).attr('checked', 'true');
          }
          if ( m.resultado === 'NC' ) {
            // console.log('NC');
            $('#r22_' + t._id).attr('checked', 'true');
          }
          if ( m.resultado === 'NR' ) {
            // console.log('NR');
            $('#r23_' + t._id).attr('checked', 'true');
          }
          if ( m.resultado === 'EP' ) {
            // console.log('EP');
            $('#r24_' + t._id).attr('checked', 'true');
          }
          if ( m.resultado === 'NA' ) {
            // console.log('NA');
            $('#r25_' + t._id).attr('checked', 'true');
          }
        }
      }
    }
  }

  matrizGuardar() {

    this._informeService.eliminarMatriz( this.idInforme )
          .subscribe( resp => {

            for (let t of this.tablas) {
              let rev = '';
              let res = '';

              if ( $('#r11_' + t._id).prop('checked') ) {
                rev = 'A';
              }
              if ( $('#r12_' + t._id).prop('checked') ) {
                rev = 'NA';
              }
              if ( $('#r13_' + t._id).prop('checked') ) {
                rev = 'EP';
              }

              if ( $('#r21_' + t._id).prop('checked') ) {
                res = 'AD';
              }
              if ( $('#r22_' + t._id).prop('checked') ) {
                res = 'NC';
              }
              if ( $('#r23_' + t._id).prop('checked') ) {
                res = 'NR';
              }
              if ( $('#r24_' + t._id).prop('checked') ) {
                res = 'EP';
              }
              if ( $('#r25_' + t._id).prop('checked') ) {
                res = 'NA';
              }

              let matriz = new Matriz(
                this.idInforme,
                t._id,
                rev,
                res
              );

              // console.log('MMM; ', matriz);

              this._informeService.crearMatriz( matriz )
                  .subscribe( resp1 => {
                    // console.log(resp);
                    floating_labels();
                    inicializando_datePicker();
                    inicializando_dateRange();

                    this.cargarListasNC( this.idA );
                    this.cargarListasODM( this.idA );
                    this.cargarPlaneacionesAudi( this.idA );
                    this.cargarAuditoria( this.idA );
                    this.cargarNormas();
                    // this.cargarTablas();
                    this.cargarInforme( this.idA );
                  });

            }

            Swal.fire({
              title: 'Cambios Guardados',
              type: 'success',
              showConfirmButton: false,
              timer: 2000
            });

            floating_labels();
            inicializando_datePicker();
            inicializando_dateRange();

            this.cargarListasNC( this.idA );
            this.cargarListasODM( this.idA );
            this.cargarPlaneacionesAudi( this.idA );
            this.cargarAuditoria( this.idA );
            this.cargarNormas();
            // this.cargarTablas();
            this.cargarInforme( this.idA );
          });

  }

  imprimir( opcion: number) {

    let arrPersonalContactado = [];
    arrPersonalContactado.push([{ text: 'PERSONAL CONTACTADO', fontSize: 10, fillColor: '#dddddd', colSpan: 2, alignment: 'center' }, { text: ' ', fontSize: 10, fillColor: '#dddddd', colSpan: 0, alignment: 'center' }]);
    arrPersonalContactado.push([{ text: 'NOMBRE', fontSize: 10, fillColor: '#dddddd', colSpan: 1, alignment: 'center' }, { text: 'PUESTO', fontSize: 10, fillColor: '#dddddd', colSpan: 1, alignment: 'center' }]);
    for (let pl of this.planeaciones) {
      arrPersonalContactado.push([{ text: pl.contacto, fontSize: 10, colSpan: 1, alignment: 'center' }, { text: pl.area, fontSize: 10, colSpan: 1, alignment: 'center' }]);
    }

    let n = 0;
    let arrOportunidadesMejor = [];
    arrOportunidadesMejor.push([{ text: 'OPORTUNIDADES DE MEJORA', fontSize: 10, fillColor: '#dddddd', colSpan: 1, alignment: 'center' }]);
    for (let listODM of this.listasODM) {
      n++;
      arrOportunidadesMejor.push([{ text: n + '. ' + listODM.evidencia, fontSize: 10, colSpan: 1, alignment: 'center' }]);
    }

    let nn = 0;
    let arrHallazgos = [];
    arrHallazgos.push([{ text: 'NO CONFORMIDADES', fontSize: 10, fillColor: '#dddddd', alignment: 'center', colSpan: 3 }, { text: '', fontSize: 10, fillColor: '#dddddd', alignment: 'center', colSpan: 0 }, { text: '', fontSize: 10, fillColor: '#dddddd', alignment: 'center', colSpan: 0 }]);
    arrHallazgos.push([{ text: 'NO', fontSize: 10, colSpan: 1, fillColor: '#dddddd', alignment: 'center' }, { text: 'DESCRIPCIÓN DEL HALLAZGO', fontSize: 10, colSpan: 1, fillColor: '#dddddd', alignment: 'center' }, { text: 'REQUISITO', fillColor: '#dddddd', alignment: 'center', fontSize: 10, colSpan: 1 }]);
    for (let listNC of this.listasNC) {
      nn++;
      arrHallazgos.push([{ text: nn, fontSize: 10, colSpan: 1, alignment: 'center'}, { text: listNC.evidencia, fontSize: 10, colSpan: 1, alignment: 'center' }, { text: listNC.puntoNorma, fontSize: 10, colSpan: 1, alignment: 'center'}]);
    }

    // ************************************************
    // *** MATRIZ IMPRIMIR ***
    // ************************************************

    let arrMatriz = [];
    let arrT1 = [];
    let arrT2 = [];
    let arrC = [];
    for (let tab of this.tablas) {
      let arrTemp = [];

      for ( let i = 0; i < ( 4 + this.normas.length ); i++) {
        arrTemp.push('');
        // console.log(( 4 + this.normas.length ));
      }

      arrC.push(arrTemp);
    }

    // Primera Fila
    arrT1.push({ text: 'Núm', rowSpan: 2, fontSize: 10, colSpan: 1 });
    arrT1.push({ text: 'Requisito de la Norma', rowSpan: 2, alignment: 'center', fontSize: 10, colSpan: 1});
    arrT1.push({ text: ' NORMA',  fontSize: 10, alignment: 'center', colSpan: this.normas.length, style: 'tableHeader' });
    for (let i = 0; i < (this.normas.length - 1 ); i++) {
      arrT1.push({ text: ' ',  fontSize: 10, alignment: 'center', colSpan: 0, style: 'tableHeader' });
    }
    arrT1.push({ text: 'DOCUMENTO DE REFERENCIA',  alignment: 'center', fontSize: 10, colSpan: 2 });
    arrT1.push({ text: ' ',  fontSize: 10, alignment: 'center', colSpan: 0, style: 'tableHeader' });
    // FIN Primera Fila

    // Segunda Fila
    arrT2.push('');
    arrT2.push('');
    for (let norm of this.normas) {
      //arrT2.push(norm.nombreNorma + '');
      arrT2.push({ text: norm.nombreNorma,  fontSize: 10, alignment: 'center', colSpan: 0, style: 'tableHeader' });
    }
    arrT2.push('REVISIÓN');
    arrT2.push('RESULTADO');

    arrMatriz.push(arrT1);
    arrMatriz.push(arrT2);
    // FIN Segunda Fila

    // MATRIZ EN OBJETO
    let i1 = 0;
    for (let tab of this.tablas) {

      arrC[i1][0] = (tab.numero);
      arrC[i1][1] = (tab.requisito);

      let j1 = 2;
      for (let norm of this.normas) {
        for ( let normTab of tab.normas ) {
          if ( norm._id === normTab._id ) {
            arrC[i1][j1] = 'X';
          }
        }
        j1++;
      }

      for (let mat of this.matriz) {
        if ( tab._id === mat.tabla._id ) {
          arrC[i1][ arrC[i1].length - 2 ] = mat.revision;
          // console.log(arrC.length - 2);
          arrC[i1][ arrC[i1].length - 1 ] = mat.resultado;
          // console.log(arrC.length - 1);
        }
      }

      i1++;
    }
    // console.log(arrC);
    // FIN MATRIZ EN OBJETO

     // FUNCIONA
    for (let i = 0; i < this.tablas.length; i++ ) {

      let arrTemporal = [];

      for ( let j = 0; j < ( 4 + this.normas.length ); j++ ) {

        arrTemporal.push({ text: arrC[i][j], fontSize: 10, alignment: 'center', colSpan: 1 });

      }

      arrMatriz.push(arrTemporal);

    }


    let docInforme = {
      content: [{
        style: 'titulo',
        table: {
          heights: [50],
          widths: [500],
          body: [
            [{ text: 'Informe de Auditoria del SGI del G3', color: 'gray', margin: [10, 15, 10, 10], alignment: 'center' }]
          ]
        }
      },
      // En estas tablas se coloca la primer seccion del documento despuès de la cabecera
      {
        style: 'primerSeccion',
        table: {
          widths: [80, 260, 70, 80],
          body: [
            [{ text: 'INSTITUCIÓN', fontSize: 10, colSpan: 1}, { text: this.institucionV, fontSize: 10, colSpan: 1, style:'sinN'}, { text: 'NO. AUDITORIA',  alignment: 'center', fontSize: 10, colSpan: 1 }, { text: this.noAuditoriaV,  fontSize: 10, alignment: 'center', colSpan: 1, style: 'sinN' }],
            [{ text: 'PROCESO', fontSize: 10, colSpan: 1}, { text: this.procesoV, fontSize: 10, colSpan: 1, style:'sinN'}, { text: 'FECHA',  alignment: 'center', fontSize: 10, colSpan: 1}, { text: this.fechaV,  fontSize: 10, alignment: 'center', colSpan: 1, style: 'sinN' }],
            [{ text: 'AUDITOR LIDER', fontSize: 10, colSpan: 1}, { text: this.auditorLiderV, fontSize: 10, colSpan: 3, style:'sinN'}, { text: '',  alignment: 'center', fontSize: 10, colSpan: 0}, { text: ' ',  fontSize: 10, alignment: 'center', colSpan: 0, style: 'tableHeader' }],
            [{ text: 'GRUPO AUDITOR', fontSize: 10, colSpan: 1}, { text: this.grupoAuditorV, fontSize: 10, colSpan: 3, style:'sinN'}, { text: '',  alignment: 'center', fontSize: 10, colSpan: 0}, { text: ' ',  fontSize: 10, alignment: 'center', colSpan: 0, style: 'tableHeader' }],
          ]
        },
        // layout: 'noBorders'
      },
      // segunda seccion del documento, norma de referencia
      {
        style: 'segundaSeccion',
        color: '#444',
        table: {
          widths: [120, 377],
          body: [
            [{ text: 'NORMA DE REFERENCIA:', fontSize: 10, fillColor: '#dddddd', colSpan: 1 }, { text: this.normasV, fontSize: 10, colSpan: 1 }],
          ]
        }
      },
      // tercer seccion del documento, objetivo y alcance
      {
        style: 'segundaSeccion',
        color: '#444',
        table: {
          widths: [505],
          body: [
            [{ text: 'OBJETIVO:', fontSize: 10, fillColor: '#dddddd', colSpan: 1, alignment: 'center' }],
            [{ text: this.objetivoV, fontSize: 10, colSpan: 1, alignment: 'center' }],
            [{ text: 'ALCANCE:', fontSize: 10, fillColor: '#dddddd', colSpan: 1, alignment: 'center' }],
            [{ text: this.alcanceV, fontSize: 10, colSpan: 1, alignment: 'center' }],
          ]
        }
      },
      // cuarta seccion del documento, objetivo y alcance
      {
        style: 'tercerSeccion',
        color: '#444',
        table: {
          widths: [247, 247],
          body: arrPersonalContactado,
        }
      },
      // quinta seccion del documento, no conformidades
      {
        style: 'segundaSeccion',
        color: '#444',
        table: {
          widths: [505],
          body: [
            [{ text: 'NO CONFORMIDADES', fontSize: 10, fillColor: '#dddddd', colSpan: 1, alignment: 'center' }],
            [{ text: 'En la revisión al Sistema de Gestión Integral se encontraron un total de ' + this.totalNC + ' No Conformidades y ' + this.totalODM + ' Oportunidades de Mejora', fontSize: 10, colSpan: 1, alignment: 'center' }],
          ]
        }
      },
      // sexta seccion del documento, 
      {
        style: 'primerSeccion',
        table: {
          // widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: arrMatriz,
        },
        // layout: 'noBorders'
      },
      // septima seccion del documento, oportunidades de mejora
      {
        style: 'segundaSeccion',
        color: '#444',
        table: {
          widths: [505],
          body: arrOportunidadesMejor,
        }
      },
      // octava seccion del documento, comentarios
      {
        style: 'segundaSeccion',
        color: '#444',
        table: {
          widths: [505],
          body: [
            [{ text: 'COMENTARIOS', fontSize: 10, fillColor: '#dddddd', colSpan: 1, alignment: 'center' }],
            [ { text: this.comentariosV, fontSize: 10, colSpan: 1, alignment: 'center' }],
          ]
        }
      },
      // novenaa seccion del documento, NO conformidades, hallazgo
      {
        style: 'segundaSeccion',
        color: '#444',
        table: {
          widths: [20, 410, 60],
          body: arrHallazgos,
        }
      },
      // decima seccion del documento, conclusiones
      {
        style: 'segundaSeccion',
        color: '#444',
        table: {
          widths: [505],
          body: [
            [{ text: 'CONCLUSIONES DE AUDITORÍA', fontSize: 10, fillColor: '#dddddd', colSpan: 1, alignment: 'center' }],
            [ { text: this.conclusionesV, fontSize: 10, colSpan: 1, alignment: 'center' }],
          ]
        }
      },
      // onceava seccion del documento, auditor lider-fechas
      {
        style: 'segundaSeccion',
        color: '#444',
        table: {
          widths: [165, 165, 165],
          body: [
            [{ text: 'AUDITOR LÍDER', fontSize: 10, fillColor: '#dddddd', colSpan: 1, alignment: 'center'}, { text: 'RECIBÍ DE CONFORMIDAD', fontSize: 10, fillColor: '#dddddd', colSpan: 1, alignment: 'center'}, { text: 'FECHAS DE AUDITORÍA', fontSize: 10, fillColor: '#dddddd', colSpan: 1, alignment: 'center'}],
            [{ text: this.auditorLiderV, fontSize: 10, colSpan: 1, alignment: 'center'}, { text: this.directorV, fontSize: 10, colSpan: 1, alignment: 'center'}, { text: this.fechasV, fontSize: 10, colSpan: 1, alignment: 'center'}]
          ]
        }
      },
      // doceava seccion del documento, fecha de emision
      {
        style: 'tercerSeccion',
        color: '#444',
        table: {
          widths: [180, 320],
          body: [
            [{ text: 'FECHA DE EMISIÓN DEL INFORME:', fontSize: 10, fillColor: '#dddddd', colSpan: 1 }, { text: this.fechaEmisionV, fontSize: 10, colSpan: 1 }],
          ]
        }
      }],
      // disenio de las tablas
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
        primerSeccion: {
          bold: true,
          fontSize: 11,
          color: 'black',
          margin: [0, 25, 0, 0]
        },
        segundaSeccion: {
          bold: true,
          fontSize: 11,
          color: 'black',
          margin: [0, 25, 0, 0]
        },
        tercerSeccion: {
          bold: true,
          fontSize: 11,
          color: 'black',
          margin: [0, 25, 0, 0]
        },
        titulo: {
          bold: true,
          fontSize: 20,
          margin: [5, 5, 5, 25]
        },
        firma: {
          margin: [170, 20, 0, 15]
        },
        tableHeader2: {
          bold: true,
          widths: [100, 220, 38, 50],
          color: 'black'
        },
        tableHeader: {
          bold: true,
          color: 'black'
        },
        sinN: {
          bold: false,
          color: 'black'
        }
      }
    };

    if ( opcion === 1 ) {
      pdfMake.createPdf(docInforme).download('informe.pdf');
    }
    if ( opcion === 2 ) {
      pdfMake.createPdf(docInforme).open();
    }
    if ( opcion === 3 ) {
      pdfMake.createPdf(docInforme).print();
    }

  }

}
