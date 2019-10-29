import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListaVerificacion } from '../../models/lista-verificacion.model';
import { URL_SERVICIOS } from '../../config/config';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ListaVerificacionService {

  totalListas: number = 0;

  token: string;

  constructor( public http: HttpClient ) {
    this.cargarStorage();
   }

  cargarStorage() {

    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
    } else {
      this.token = '';
    }

  }

  cargarListasPlaneacionUsuario( idP: string, idU: string ) {

    let url = URL_SERVICIOS + '/verificacion/planeacion/usuario/' + idP + '/' + idU;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        return resp.verificaciones;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cargarListasPlaneacionUsuarioEnviar( idP: string, idU: string ) {

    let url = URL_SERVICIOS + '/verificacion/planeacion/usuario/enviar/' + idP + '/' + idU;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        return resp.verificaciones;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }


  crearListaVerificacion( listaVerificacion: ListaVerificacion ) {

    let url = URL_SERVICIOS + '/verificacion';

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.post( url, listaVerificacion )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Lista Creada',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.verificacion;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  editarListaVerificacion( listaVerificacion: ListaVerificacion ) {

    let url = URL_SERVICIOS + '/verificacion/punto/' + listaVerificacion._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, listaVerificacion )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Listo',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.verificacion;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  completarListaVerificacion( listaVerificacion: ListaVerificacion ) {

    let url = URL_SERVICIOS + '/verificacion/documento/' + listaVerificacion._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, listaVerificacion )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Listo',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.verificacion;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  eliminarLista( id: string ) {

    let url = URL_SERVICIOS + '/verificacion/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Eliminada',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cambiarEnviar( idPlaneacion: string ) {

    let url = URL_SERVICIOS + '/verificacion/planeacion/' + idPlaneacion;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, null )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Listas de Verificación Enviadas',
          text: 'Espera a que validen las Listas de Verificación para completarla',
          type: 'success'
        });
        return resp.planeacion;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cambiarValido( idPlaneacion: string ) {

    let url = URL_SERVICIOS + '/verificacion/planeacion/validar/' + idPlaneacion;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, null )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Listas de Verificación Validadas',
          type: 'success'
        });
        return resp.planeacion;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cambioMasivoEntrevistado( listaVerificacion: ListaVerificacion, idPlaneacion: string ) {

    let url = URL_SERVICIOS + '/verificacion/planeacion/entrevistado/' + idPlaneacion;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, listaVerificacion )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Cambios guardados',
          type: 'success'
        });
        return resp.planeacion;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

}
