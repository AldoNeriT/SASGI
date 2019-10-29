import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InstitucionService } from '../../services/institucion/institucion.service';
import { Institucion } from '../../models/institucion.model';
import { UsuarioService } from '../../services/service.index';
import { WebsocketService } from '../../services/websocket/websocket.service';

// declare function init_plugins();

import Swal from 'sweetalert2';

@Component({
  selector: 'app-institucion',
  templateUrl: './institucion.component.html',
  styles: []
})
export class InstitucionComponent implements OnInit {

  instituciones: Institucion[] = [];

  formaInstitucion: FormGroup;
  mostrarEditable = false;

  mostrarBtnAgregar: boolean;

  idIns: string;

  cargando = true;

  constructor( public _institucionService: InstitucionService,
               public _usuarioService: UsuarioService,
               public _webSocketServive: WebsocketService ) { }

  ngOnInit() {
    // init_plugins();

    this.formaInstitucion = new FormGroup({
      nombre: new FormControl( null, Validators.required ),
      domicilio: new FormControl( null, Validators.required ),
      telefono: new FormControl( null, Validators.required ),
      imagen: new FormControl( null, Validators.required )
    });

    this.cargarInstituciones();
    this.escucharSocket();
  }

  escucharSocket() {
    this._webSocketServive.listen('cambio-institucion')
        .subscribe( ( data: any ) => {
          console.log('Socket: ', data);

          this.cargarInstituciones();
        });
  }

  cargarInstituciones() {

    this.cargando = true;

    this._institucionService.cargarInstituciones()
          .subscribe( instituciones => {
            this.instituciones = instituciones.instituciones;
            if ( instituciones.cuantos === 0) {
              this.mostrarBtnAgregar = true;
            } else {
              this.mostrarBtnAgregar = false;
            }
            this.cargando = false;
          });

  }

  agregarInstitucion() {

    if ( this.formaInstitucion.invalid ) {
      return;
    }

    if ( this.idIns === null) {
      let institucion = new Institucion(
        this.formaInstitucion.value.nombre,
        this.formaInstitucion.value.domicilio,
        this.formaInstitucion.value.telefono,
        this.formaInstitucion.value.imagen
      );

      this._institucionService.crearInstitucion( institucion )
            .subscribe( resp => {
              this.mostrarEditable = false;
              this.cargarInstituciones();
            });
    } else {
      let institucion = new Institucion(
        this.formaInstitucion.value.nombre,
        this.formaInstitucion.value.domicilio,
        this.formaInstitucion.value.telefono,
        this.formaInstitucion.value.imagen,
        this.idIns
      );

      this._institucionService.crearInstitucion( institucion )
            .subscribe( resp => {
              this.mostrarEditable = false;
              this.cargarInstituciones();
            });
    }

  }

  pasarDatos( institucion: Institucion ) {

    this.mostrarEditable = true;

    this.formaInstitucion.setValue({
      nombre: institucion.nombreInstitucion,
      domicilio: institucion.domicilio,
      telefono: institucion.telefono,
      imagen: institucion.img
    });

    this.idIns = institucion._id;

  }

  // ************************************************
  // *** ESTE METODO ES DE EMERGENCIA PARA BORRAR ***
  // ************************************************
  eliminarInstitucion( ) {

    Swal.fire({
      title: '¡Advertencia!',
      text: '¿Estás seguro de eliminar la Institución?',
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
        this._institucionService.eliminarInstitucion( this.idIns )
          .subscribe( (resp: any) => {
            this.cargarInstituciones();
          } );
      }
    });

    this.mostrarEditable = false;

  }

}
