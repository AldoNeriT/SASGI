import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Institucion } from '../../models/institucion.model';
import { URL_SERVICIOS } from '../../config/config';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InstitucionService {

  totalInstituciones: number = 0;

  institucion: Institucion;
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

  cargarInstituciones() {
    this.cargarStorage();

    let url = URL_SERVICIOS + '/institucion';

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        this.totalInstituciones = resp.cuantos;
        return resp;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  // *** ESTE METODO NO ES USADO, SE ELIMINARÁ ***
  // cargarInstitucion( id: string ) {

  //   let url = URL_SERVICIOS + '/institucion/' + id;

  //   // *** TOKEN ***
  //   // url += '?token=' + this.token;

  //   return this.http.get( url )
  //   .pipe(
  //     map( (resp: any ) => {
  //       return resp.institucion;
  //     }),
  //     catchError( err => {
  //       swal('Error', err.error.err.message, 'error');
  //       return throwError( err ) ;
  //     })
  //   );

  // }

  crearInstitucion( institucion: Institucion ) {

    let url = URL_SERVICIOS + '/institucion';

    if ( institucion._id ) {
      // *** Aqui se ACTUALIZA la Institucion ***
      url += '/' + institucion._id;

      // *** TOKEN ***
      url += '?token=' + this.token;

      return this.http.put( url, institucion )
      .pipe(
        map( (resp: any ) => {
          Swal.fire({
            title: 'Institución Actualizada',
            type: 'success',
            showConfirmButton: false,
            timer: 2000
          });
          return resp.institucion;
        }),
        catchError( err => {
          Swal.fire('Error', err.error.err.message, 'error');
          return throwError( err ) ;
        })
      );

    } else {
      // *** Aqui se CREA la Institucion ***

      // *** TOKEN ***
      url += '?token=' + this.token;

      return this.http.post( url, institucion )
      .pipe(
        map( (resp: any ) => {

          Swal.fire({
            title: 'Institución Creada',
            text: `"${institucion.nombreInstitucion}" se ha creado exitosamente`,
            type: 'success',
            showConfirmButton: false,
            timer: 2000
          });
          return resp.institucion;
        }),
        catchError( err => {
          Swal.fire('Error', err.error.err.message, 'error');
          return throwError( err ) ;
        })
      );
    }

  }

  // ************************************************
  // *** ESTE METODO ES DE EMERGENCIA PARA BORRAR ***
  // ************************************************
  eliminarInstitucion( id: string ) {

    let url = URL_SERVICIOS + '/institucion/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Institución Eliminada',
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

  almacenamiento() {

    let url = URL_SERVICIOS + '/size';

    // *** TOKEN ***
    // url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        return resp;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

}
