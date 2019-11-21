import { Component, OnInit } from '@angular/core';
import { PlaneacionService, UsuarioService } from '../../services/service.index';
import { Planeacion } from '../../models/planeacion.model';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styles: []
})
export class ListasComponent implements OnInit {

  planeaciones: any[] = [];

  id: string;

  cargando = true;

  constructor( public _planeacionService: PlaneacionService,
               public _usuarioService: UsuarioService,
               public router: Router,
               public activatedRoute: ActivatedRoute ) {
  activatedRoute.params.subscribe( params => {
  this.id = params['idA'];
  });
}

  ngOnInit() {
    this.cargarPlaneacionesAudi( this.id );
  }

  redirigir( idPlaneacion: string, idUser: string ) {
    // console.log('idP= ', idPlaneacion);
    // console.log('idU= ', idUser);

    this.router.navigate(['/listaVerificacion/' + idPlaneacion + '/' + idUser]);
  }

  cargarPlaneacionesAudi( id: string ) {

    this.cargando = true;

    if ( (this._usuarioService.usuario.tipo_Usuario === 'ROOT') ||
         (this._usuarioService.usuario.tipo_Usuario === 'ADMIN') ||
         (this._usuarioService.usuario.tipo_Usuario === 'AUDITOR_LIDER') ||
         (this._usuarioService.usuario.tipo_Usuario === 'ALTA_DIRECCION') ) {
      this._planeacionService.cargarPlaneacionesAudi( id )
          .subscribe( planeaciones => {
            this.planeaciones = planeaciones;
            // console.log('Planeaciones: ', this.planeaciones);

            this.cargando = false;

          });
    } else {
      this._planeacionService.cargarPlaneacionesAudiUsuario( id )
          .subscribe( planeaciones => {
            this.planeaciones = planeaciones;
            // console.log('Planeaciones: ', this.planeaciones);

            this.cargando = false;
 
          });
    }

  }

}
