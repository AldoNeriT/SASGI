import { Component, OnInit } from '@angular/core';
import { AuditoriaService, UsuarioService, InformeService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { Auditoria } from '../../models/auditoria.model';
import { Informe } from '../../models/informe.model';
import { Usuario } from '../../models/usuario.model';

import Swal from 'sweetalert2';
import * as $ from 'jquery';


// declare function init_plugins();

@Component({
  selector: 'app-menu-auditoria',
  templateUrl: './menu-auditoria.component.html',
  styles: []
})
export class MenuAuditoriaComponent implements OnInit {

  id: string;
  cargando = true;
  pasosV: number;

  auditorL: Usuario;
  director: Usuario;

  constructor( public _auditoriaService: AuditoriaService,
               public _usuarioService: UsuarioService,
               public _informeService: InformeService,
               public router: Router,
               public activatedRoute: ActivatedRoute ) {
    activatedRoute.params.subscribe( params => {
      this.id = params['idA'];
    });
  }

  ngOnInit() {
    // init_plugins();
    this.cargarAuditoria( this.id );
    this.cargarAuditorL();
    this.cargarDirector();
  }

  cargarAuditoria( id: string) {

    this.cargando = true;

    this._auditoriaService.cargarAuditoria( id )
          .subscribe( auditoria => {
            this.cargando = false;
            this.pasosV = auditoria.pasos;
            // console.log(this.pasosV);
          });

  }

  cargarAuditorL() {

    this.cargando = true;

    this._usuarioService.cargarUsuariosPorTipo( 'AUDITOR_LIDER' )
          .subscribe( usuario => {
            // console.log(usuario[0]);
            this.auditorL = usuario[0];
            this.cargando = false;
            // console.log(this.pasosV);
          });

  }

  cargarDirector() {

    this.cargando = true;

    this._usuarioService.cargarUsuariosPorTipo( 'ALTA_DIRECCION' )
          .subscribe( usuario => {
            // console.log(usuario[0]);
            this.director = usuario[0];
            this.cargando = false;
            // console.log(this.pasosV);
          });

  }

  redirigirPlaneacion() {
    this.router.navigate(['/planeacion/' + this.id]);
  }

  redirigirLista() {
    this.router.navigate(['/listas/' + this.id]);
  }

  redirigirInforme() {
    this.router.navigate(['/informe/' + this.id]);
  }

  redirigirBitacora() {
    this.router.navigate(['/bitacora/' + this.id]);
  }

  agregarInforme() {
    // console.log('Aquí se agregara el Informe');

    let auditoria = new Auditoria(
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      3
    );

    Swal.fire({
      title: '¿Empezar Informe?',
      type: 'question',
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
        this.cargando = true;

        let informe = new Informe(
          this.id,
          '',
          '',
          [],
          '',
          '',
          this.auditorL._id,
          this.director._id,
          '',
          ''
        );

        // console.log('INFORMEEEE', informe);

        this._informeService.crearInforme( informe )
          .subscribe( resp => {
            this.cargando = false;

            this._auditoriaService.cambiarPasos( this.id, auditoria )
                  .subscribe( resp => {
                    this.cargando = false;
                    this.cargarAuditoria( this.id );
                  });

            this.cargarAuditoria( this.id );
          });

      }
    });

  }

}
