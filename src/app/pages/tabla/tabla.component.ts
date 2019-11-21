import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NormaService, TablaService, UsuarioService } from '../../services/service.index';
import { Norma } from '../../models/norma.model';
import { Tabla } from '../../models/tabla.model';
import { Router, ActivatedRoute } from '@angular/router';
import { WebsocketService } from '../../services/websocket/websocket.service';

import Swal from 'sweetalert2';
import * as $ from 'jquery';

declare function floating_labels();
declare function cerrarModal( nombreModal );

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html'
})
export class TablaComponent implements OnInit {

  constructor( public _normaService: NormaService,
               public _tablaService: TablaService,
               public _usuarioService: UsuarioService,
               public _webSocketServive: WebsocketService ) {

  }

  normas: Norma[] = [];
  tablas: Tabla[] = [];

  objNormas: any[] = [];

  totalNormas = 0;
  idTab: string;

  cargando = true;

  ngOnInit() {
    floating_labels();
    this.cargarNormas();
    this.cargarTablas();
    this.escucharSocket();
  }

  escucharSocket() {
    this._webSocketServive.listen('cambio-tabla')
        .subscribe( ( data: any ) => {
          // console.log('Socket: ', data);

          floating_labels();
          this.cargarNormas();
          this.cargarTablas();
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
          });

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

  agregarFila() {

    let numero = $('#numero').val() + '';
    let requisito = $('#requisito').val() + '';
    let num = 0;

    let arrNumeros = numero.split('.');
    if ( isNaN( +arrNumeros[0] ) ) {
      num = 0;
    } else {
      num = +arrNumeros[0];
    }
    // console.log(num);


    this.objNormas = [];

    for ( let n of this.normas ) {
      if ( $('#ch_' + n._id).prop('checked') ) {
        this.objNormas.push({_id: n._id});
      }
    }
    
    // console.log('objNormas: ', this.objNormas);


    let tabla = new Tabla(
      num,
      numero,
      requisito,
      this.objNormas
    );

    // console.log('Tabla Agregar: ', tabla);

    this._tablaService.crearFila( tabla )
          .subscribe( resp => {
            floating_labels();
            this.cargarNormas();
            this.cargarTablas();
            cerrarModal('modalTablaAgregar');
          });

  }

  formEditable( tabla: any ) {

    $('#numero2').val(tabla.numero);
    $('#requisito2').val(tabla.requisito);

    this.idTab = tabla._id;

    for ( let n of this.normas ) {
      $('#ch2_' + n._id).removeAttr('checked');
    }

    for ( let n of this.normas ) {
      for ( let n2 of tabla.normas ) {
        if ( n._id === n2._id ) {
          // console.log('Listo');
          $('#ch2_' + n._id).attr('checked', 'true');
        }
      }
    }

    $('#modalTablaEditar > div > div > div > form > div.m-b-40').addClass('focused');
  }

  editarFila() {

    let numero2 = $('#numero2').val() + '';
    let requisito2 = $('#requisito2').val() + '';
    let num = 0;

    let arrNumeros2 = numero2.split('.');
    if ( isNaN( +arrNumeros2[0] ) ) {
      num = 0;
    } else {
      num = +arrNumeros2[0];
    }
    // console.log(num);

    this.objNormas = [];

    for ( let n of this.normas ) {
      if ( $('#ch2_' + n._id).prop('checked') ) {
        this.objNormas.push({_id: n._id});
      }
    }

    // console.log('objNormas: ', this.objNormas);

    let tabla = new Tabla(
      num,
      numero2,
      requisito2,
      this.objNormas,
      this.idTab
    );

    console.log('Tabla Editar: ', tabla);

    this._tablaService.editarFila( tabla )
          .subscribe( resp => {
            floating_labels();
            this.cargarNormas();
            this.cargarTablas();
            cerrarModal('modalTablaEditar');
          });

  }

  eliminarFila( tabla: Tabla ) {

    Swal.fire({
      title: '¡Advertencia!',
      text: `¿Estás seguro de eliminar esta fila?`,
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
        this._tablaService.eliminarFila( tabla._id )
          .subscribe( (resp: any) => {
            floating_labels();
            this.cargarNormas();
            this.cargarTablas();
          } );
      }
    });

  }

}
