import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NormaService, UsuarioService, AuditoriaService } from '../../services/service.index';
import { Auditoria } from '../../models/auditoria.model';
import { Usuario } from '../../models/usuario.model';
import { Norma } from '../../models/norma.model';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';
import * as $ from 'jquery';

// declare function init_plugins();
declare function floating_labels();
declare function inicializando_multiSelect();
declare function inicializando_dateRange();

@Component({
  selector: 'app-auditorias',
  templateUrl: './auditorias.component.html',
  styles: []
})
export class AuditoriasComponent implements OnInit {

  normas: Norma[] = [];
  auditores: Usuario[] = [];
  // auditados: Usuario[] = [];

  formaEditar: FormGroup;

  id: string;
  ver: string;

  idPlan: string;
  idAuditoria: string;
  progresoAudi: string;

  // *** Variables para los Formularios ***
  cargando = true;

  // *** Variables para la pestaña VER ***
  nombreV: string;
  normasV: string;
  fechaInicialV: Date;
  fechaFinalV: Date;
  planV: string;
  auditoresV: string;
  auditadosV: string;
  objetivoV: string;
  alcanceV: string;
  contactoV: string;

  constructor( public _normaService: NormaService,
               public _auditoriaService: AuditoriaService,
               public _usuarioService: UsuarioService,
               public router: Router,
               public activatedRoute: ActivatedRoute) { 
    activatedRoute.params.subscribe( params => {
      this.id = params['id'];
      this.ver = params['ver'];

      // if ( this.ver === 'ver') {
      //   this.cargarAuditoriaVer( this.id );
      //   this.mostrarFormEditar = false;
      //   this.mostrarFormVer = true;
      // } else {
      //   this.cargarAuditoria( this.id );
      //   this.mostrarFormEditar = true;
      //   this.mostrarFormVer = false;
      // }
    });
  }

  ngOnInit() {
    // init_plugins();
    floating_labels();
    inicializando_multiSelect();
    inicializando_dateRange();

    this.cargarNormas();
    this.cargarAuditores();
    // this.cargarAuditados();

    this.formaEditar = new FormGroup({
      nombre: new FormControl( null, Validators.required ),
      normas: new FormControl( null, Validators.required ),
      fechas: new FormControl( null, Validators.required ),
      auditores: new FormControl( null, Validators.required ),
      // auditados: new FormControl( null, Validators.required ),
      objetivos: new FormControl( null, Validators.required ),
      alcance: new FormControl( null, Validators.required ),
      contacto: new FormControl( null, Validators.required ),
    });

    // this.condiciones();
  }

  condiciones() {
    this.cargarAuditoria( this.id );
  }

  cargarAuditoria( id: string) {

    // this.cargarNormas();
    // console.log('Normas: ', this.normas);
    // this.cargarAuditores();
    // this.cargarAuditados();

    this.cargando = true;

    this._auditoriaService.cargarAuditoria( id )
          .subscribe( auditoria => {
            // *** La Respuesta es el arreglo como esta en la Base de
            //     datos y se le insertan los valores al formulario ***

            // console.log('Entro');
            // console.log(auditoria);

            let fi: string = auditoria.fechaInicial;
            let ff: string = auditoria.fechaFinal;
            let fi1 = fi.split('-');
            let ff1 = ff.split('-');
            let fecha = `${fi1[1]}/${fi1[2]}/${fi1[0]} - ${ff1[1]}/${ff1[2]}/${ff1[0]}`;
            // console.log(fecha);
            // año-mes-dia
            // fi2:ff2 [0][1][2]

            this.formaEditar.setValue({
              nombre: auditoria.nombre,
              normas: auditoria.normas,
              // fechas: 'mes/dia/año - mes/dia/año',
              fechas: fecha,
              auditores: auditoria.grupoAuditor,
              // auditados: auditoria.auditados,
              objetivos: auditoria.objetivos,
              alcance: auditoria.alcance,
              contacto: auditoria.contacto,
            });

            this.planV = auditoria.plan.nombrePlan;
            this.idPlan = auditoria.plan._id;
            this.idAuditoria = auditoria._id;
            this.progresoAudi = auditoria.progreso;

            $('#formEditable > div > div > div > form > div.m-b-40').addClass('focused');

            // ************************************************
            // *** AQUI SE AGREGARAN LOS DATOS AL SELECT NORMAS 01 ***
            // ************************************************

            // Inicializando arreglos necesarios
            let arrNormas: any[] = [];
            let arrNormasNombre: any[] = [];

            // Llenando arreglos
            for ( let i = 0; i < this.normas.length; i++ ) {
              for ( let j = 0; j < auditoria.normas.length; j++ ) {
                if ( this.normas[i]._id === auditoria.normas[j]._id ) {
                  arrNormas.push(`${i}: '${this.normas[i]._id}'`);
                  arrNormasNombre.push(`${this.normas[i].nombreNorma}`);
                }
              }
            }

            // Agregar arreglo al select
            $('#normas').val(arrNormas);

            // Agregar el diseño al select
            $('ul.select2-selection__rendered:eq(0)').html('');
            for ( let k = 0; k < arrNormas.length; k++ ) {
              $('ul.select2-selection__rendered:eq(0)').append(`<li class="select2-selection__choice" title=" ${arrNormasNombre[k]} "><span class="select2-selection__choice__remove" role="presentation">×</span> ${arrNormasNombre[k]} </li>`);
            }

            // ************************************************
            // *** AQUI SE AGREGARAN LOS DATOS AL SELECT AUDITORES 02 ***
            // ************************************************

            // Inicializando arreglos necesarios
            let arrAuditores: any[] = [];
            let arrAuditoresNombre: any[] = [];

            // Llenando arreglos
            for ( let i = 0; i < this.auditores.length; i++ ) {
              for ( let j = 0; j < auditoria.grupoAuditor.length; j++ ) {
                if ( this.auditores[i]._id === auditoria.grupoAuditor[j]._id ) {
                  arrAuditores.push(`${i}: '${this.auditores[i]._id}'`);
                  arrAuditoresNombre.push(`${this.auditores[i].nombre} ${this.auditores[i].primer_Apellido} ${this.auditores[i].segundo_Apellido || ''}`);
                }
              }
            }

            // Agregar arreglo al select
            $('#auditores').val(arrAuditores);

            // Agregar el diseño al select
            $('ul.select2-selection__rendered:eq(1)').html('');
            for ( let k = 0; k < arrAuditores.length; k++ ) {
              $('ul.select2-selection__rendered:eq(1)').append(`<li class="select2-selection__choice" title=" ${arrAuditoresNombre[k]} "><span class="select2-selection__choice__remove" role="presentation">×</span> ${arrAuditoresNombre[k]} </li>`);
            }

            // ************************************************
            // *** FIN SELECTS ***
            // ************************************************

            this.cargando = false;

            // init_plugins();
            inicializando_multiSelect();
            inicializando_dateRange();

          });

  }

  cargarNormas() {

    this.cargando = true;

    this._normaService.cargarNormas()
          .subscribe( normas => {
            this.normas = normas;
            // console.log('Normas: ', this.normas);
            this.cargando = false;
            // init_plugins();
            inicializando_multiSelect();
            inicializando_dateRange();
            this.condiciones();
          });

  }

  cargarAuditores() {

    this.cargando = true;

    this._usuarioService.cargarUsuariosPorTipo('AUDITOR')
          .subscribe( auditores => {
            this.auditores = auditores;
            // console.log('Auditores: ', this.auditores);
            this.cargando = false;
            // init_plugins();
            inicializando_multiSelect();
            inicializando_dateRange();
            this.condiciones();
          });

  }

  agregarAuditoria() {

    if ( this.formaEditar.invalid ) {
      // console.log('invalido');
      // console.log(this.formaEditar.value);
      // return;
    }

    let fechas: any = $('#fechas').val();
    let arrFechas = fechas.split(' - ');
    let fi = arrFechas[0].split('/');
    let ff = arrFechas[1].split('/');
    let fechaI = fi[2] + '-' + fi[0] + '-' + fi[1];
    let fechaF = ff[2] + '-' + ff[0] + '-' + ff[1];
    // mes - dia - año
    // [][][]

    // console.log('fechas: ', fechas);
    // console.log('fechaI: ', fechaI);
    // console.log('fechaF: ', fechaF);

    let norma: any = $('#normas').val();
    let objNormas: any[] = [];
    for ( let i = 0; i < norma.length; i++) {
      let normafor: string = norma[i];
      let rnormafor = normafor.split(`'`);
      objNormas.push({_id: rnormafor[1]});
    }
    // objNormas = [{_id: '5d81486c0e34b70017e458ed'}, {_id: '5d8e34c854d9040017111c19'}];
    // console.log('ObjNormas: ', objNormas);

    let auditor: any = $('#auditores').val();
    let objAuditor: any[] = [];
    for ( let i = 0; i < auditor.length; i++) {
      let auditorfor: string = auditor[i];
      let rauditorfor = auditorfor.split(`'`);
      objAuditor.push({_id: rauditorfor[1]});
    }
    // console.log('objAuditor: ', objAuditor);

    let auditoria = new Auditoria(
      this.planV + '_' + this.formaEditar.value.nombre,
      this.formaEditar.value.nombre,
      objNormas,
      fechaI,
      fechaF,
      this.idPlan,
      objAuditor,
      this.formaEditar.value.objetivos,
      this.formaEditar.value.alcance,
      this.formaEditar.value.contacto,
      this.idAuditoria,
      1
    );

    this._auditoriaService.crearAuditoria( auditoria )
          .subscribe( resp => {
            this.router.navigate(['/planes']);
          });

  }

}
