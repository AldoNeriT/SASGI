import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NormaService, UsuarioService } from '../../services/service.index';
import { Norma } from '../../models/norma.model';
import { Router, ActivatedRoute } from '@angular/router';
import { WebsocketService } from '../../services/websocket/websocket.service';

import Swal from 'sweetalert2';
import * as $ from 'jquery';

// declare function init_plugins();
declare function floating_labels();

@Component({
  selector: 'app-normas',
  templateUrl: './normas.component.html',
  styles: []
})
export class NormasComponent implements OnInit {

  @ViewChild('txtNombreV', { static: false }) txtNombreV: ElementRef;
  @ViewChild('txtDescripcionV', { static: false }) txtDescripcionV: ElementRef;
  @ViewChild('txtArchV', { static: false }) txtArchV: ElementRef;
  @ViewChild('txtColorV', { static: false }) txtColorV: ElementRef;

  normas: Norma[] = [];
  forma: FormGroup;
  formaEditar: FormGroup;

  idNor: string;

  cargando = true;

  constructor( public _normaService: NormaService,
               public _usuarioService: UsuarioService,
               public router: Router,
               public activatedRoute: ActivatedRoute,
               public _webSocketServive: WebsocketService ) {

  }

  ngOnInit() {
    // init_plugins();
    floating_labels();
    this.forma = new FormGroup({
      nombre: new FormControl( null, Validators.required ),
      descripcion: new FormControl( null, Validators.required ),
      archivo: new FormControl( null, Validators.required ),
      color: new FormControl( null, Validators.required )
    });

    this.formaEditar = new FormGroup({
      nombre: new FormControl( null, Validators.required ),
      descripcion: new FormControl( null, Validators.required ),
      archivo: new FormControl( null, Validators.required ),
      color: new FormControl( null, Validators.required )
    });

    this.cargarNormas();
    this.escucharSocket();
  }

  escucharSocket() {
    this._webSocketServive.listen('cambio-norma')
        .subscribe( ( data: any ) => {
          // console.log('Socket: ', data);

          floating_labels();
          this.cargarNormas();
        });
  }

  cargarNormas() {

    this.cargando = true;

    this._normaService.cargarNormas()
          .subscribe( normas => {
            this.normas = normas;
            this.cargando = false;
          });

  }

  agregarNorma() {

    if ( this.forma.invalid ) {
      return;
    }

    let norma = new Norma(
      this.forma.value.nombre,
      this.forma.value.descripcion,
      this.forma.value.archivo,
      this.forma.value.color
    );

    this._normaService.crearNorma( norma )
          .subscribe( resp => {
            this.cargarNormas();
          });

    // $('#modalNormaAgregar').modal('hide');

    // $('.show').hide();
    // $('body').removeClass('modal-open');
    // this.router.navigateByUrl('#/normas', {skipLocationChange: true}).then(() =>
    // this.router.navigate(['/normas']));

  }

  formVer( norma: Norma ) {

    this.txtNombreV.nativeElement.innerText = norma.nombreNorma;
    this.txtDescripcionV.nativeElement.innerText = norma.descripcion;
    this.txtArchV.nativeElement.innerText = norma.archivoDigital;

    $('#archDigital').attr('href', norma.archivoDigital + '');

    if ( norma.color === 'secondary') {
      this.txtColorV.nativeElement.innerText = 'Blanco';
    }
    if ( norma.color === 'info') {
      this.txtColorV.nativeElement.innerText = 'Azul';
    }
    if ( norma.color === 'success') {
      this.txtColorV.nativeElement.innerText = 'Verde';
    }
    if ( norma.color === 'primary') {
      this.txtColorV.nativeElement.innerText = 'Morado';
    }
    if ( norma.color === 'danger') {
      this.txtColorV.nativeElement.innerText = 'Rojo';
    }
    if ( norma.color === 'warning') {
      this.txtColorV.nativeElement.innerText = 'Amarillo';
    }

  }

  formEditable( norma: Norma ) {

    this.formaEditar.setValue({
      nombre: norma.nombreNorma,
      descripcion: norma.descripcion,
      archivo: norma.archivoDigital,
      color: norma.color
    });

    this.idNor = norma._id;

    $('#modalNormaEditar > div > div > div > form > div.m-b-40').addClass('focused');
  }

  editarNorma() {

    let norma = new Norma(
      this.formaEditar.value.nombre,
      this.formaEditar.value.descripcion,
      this.formaEditar.value.archivo,
      this.formaEditar.value.color,
      this.idNor
    );

    this._normaService.crearNorma( norma )
            .subscribe( resp => {
              this.cargarNormas();
            });

  }

  eliminarNorma( norma: Norma ) {

    Swal.fire({
      title: '¡Advertencia!',
      text: `¿Estás seguro de eliminar la Norma "${norma.nombreNorma}"?`,
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
        this._normaService.eliminarNorma( norma._id )
          .subscribe( (resp: any) => {
            this.cargarNormas();
          } );
      }
    });

  }

}
