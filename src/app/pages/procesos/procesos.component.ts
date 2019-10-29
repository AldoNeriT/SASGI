import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProcesoService, UsuarioService } from '../../services/service.index';
import { SubprocesoService } from '../../services/subproceso/subproceso.service';
import { Proceso } from '../../models/proceso.model';
import { Subproceso } from '../../models/subproceso.model';
import { WebsocketService } from '../../services/websocket/websocket.service';

import Swal from 'sweetalert2';
import * as $ from 'jquery';

// declare function init_plugins();
declare function floating_labels();

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styles: []
})
export class ProcesosComponent implements OnInit {

  procesos: Proceso[] = [];
  subprocesos: Subproceso[] = [];

  forma: FormGroup;
  formaEditar: FormGroup;

  formaSub: FormGroup;
  formaEditarSub: FormGroup;

  idPro: string;
  idSub: string;

  cargando = true;
  cargando2 = false;

  constructor( public _procesoService: ProcesoService,
               public _subprocesoService: SubprocesoService,
               public _usuarioService: UsuarioService,
               public _webSocketServive: WebsocketService ) { }

  ngOnInit() {
    // init_plugins();
    floating_labels();

    this.forma = new FormGroup({
      nombre: new FormControl( null, Validators.required )
    });

    this.formaEditar = new FormGroup({
      nombre: new FormControl( null, Validators.required )
    });

    this.formaSub = new FormGroup({
      nombre: new FormControl( null, Validators.required ),
      // proceso: new FormControl( null, Validators.required ),
      archivo: new FormControl( null, Validators.required )
    });

    this.formaEditarSub = new FormGroup({
      nombre: new FormControl( null, Validators.required ),
      // proceso: new FormControl( null, Validators.required ),
      archivo: new FormControl( null, Validators.required )
    });

    this.cargarProcesos();
    this.escucharSocket();
  }

  escucharSocket() {
    this._webSocketServive.listen('cambio-proceso')
        .subscribe( ( data: any ) => {
          // console.log('Socket: ', data);

          floating_labels();
          this.cargarProcesos();
        });
  }

  // ************************************************
  // *** PROCESOS ***
  // ************************************************

  cargarProcesos() {

    this.cargando = true;

    this._procesoService.cargarProcesos()
          .subscribe( procesos => {
            this.procesos = procesos;
            this.cargando = false;
          });
  }

  // cargarSubprocesos() {

  //   // this.cargando = true;

  //   this._subprocesoService.cargarSubprocesos()
  //         .subscribe( subprocesos => {
  //           this.subprocesos = subprocesos;
  //           // this.cargando = false;
  //         });

  // }

  cargarSubprocesosProceso( id: string ) {

    this.cargando2 = true;

    this._subprocesoService.cargarSubprocesosProceso( id )
          .subscribe( subprocesos => {
            this.subprocesos = subprocesos;
            this.cargando2 = false;
          });

    this.idPro = id;

  }

  agregarProceso() {

    if ( this.forma.invalid ) {
      return;
    }

    let proceso = new Proceso(
      this.forma.value.nombre
    );

    this._procesoService.crearProceso( proceso )
          .subscribe( resp => {
            this.cargarProcesos();
          });

  }

  formEditable( proceso: Proceso ) {

    this.formaEditar.setValue({
      nombre: proceso.nombreProceso,
    });

    this.idPro = proceso._id;

    $('#modalProcesoEditar > div > div > div > form > div.m-b-40').addClass('focused');
  }

  editarProceso() {

    let proceso = new Proceso(
      this.formaEditar.value.nombre,
      this.idPro
    );

    this._procesoService.crearProceso( proceso )
            .subscribe( resp => {
              this.cargarProcesos();
            });

  }

  eliminarProceso( proceso: Proceso ) {

    Swal.fire({
      title: '¡Advertencia!',
      text: `¿Estás seguro de eliminar el Proceso "${proceso.nombreProceso}"?`,
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
        this._procesoService.eliminarSubprocesosProceso( proceso._id )
          .subscribe( (resp: any) => {
            // this.cargarProcesos();
          } );
        this._procesoService.eliminarProceso( proceso._id )
          .subscribe( (resp: any) => {
            this.cargarProcesos();
          } );
      }
    });

  }

  // ************************************************
  // *** SUBPROCESOS ***
  // ************************************************

  agregarSubproceso() {

    if ( this.formaSub.invalid ) {
      return;
    }

    let subproceso = new Subproceso(
      this.formaSub.value.nombre,
      this.idPro,
      this.formaSub.value.archivo
    );

    this._subprocesoService.crearSubproceso( subproceso )
          .subscribe( resp => {
            this.cargarSubprocesosProceso( this.idPro ) ;
          });

  }

  formEditableSub( subproceso: Subproceso ) {

    this.formaEditarSub.setValue({
      nombre: subproceso.nombreSubproceso,
      archivo: subproceso.archivoDigital
    });

    this.idSub = subproceso._id;

    $('#modalSubprocesoEditar > div > div > div > form > div.m-b-40').addClass('focused');
  }

  editarSubproceso() {

    let subproceso = new Subproceso(
      this.formaEditarSub.value.nombre,
      this.idPro,
      this.formaEditarSub.value.archivo,
      this.idSub
    );

    this._subprocesoService.crearSubproceso( subproceso )
            .subscribe( resp => {
              // this.cargarProcesos();
              this.cargarSubprocesosProceso( this.idPro ) ;
            });

  }

  eliminarSubproceso( subproceso: Subproceso ) {

    Swal.fire({
      title: '¡Advertencia!',
      text: `¿Estás seguro de eliminar el Subproceso "${subproceso.nombreSubproceso}"?`,
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
        this._subprocesoService.eliminarSubproceso( subproceso._id )
          .subscribe( (resp: any) => {
            this.cargarSubprocesosProceso( this.idPro ) ;
          } );
      }
    });

  }

}
