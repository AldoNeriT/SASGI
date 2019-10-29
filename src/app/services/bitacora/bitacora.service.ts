import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bitacora } from '../../models/bitacora.model';
import { URL_SERVICIOS } from '../../config/config';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {

  totalBitacoras: number = 0;

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

  cargarBitacoras() {

    let url = URL_SERVICIOS + '/bitacora';

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        this.totalBitacoras = resp.cuantos;
        return resp.bitacoras;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  crearBitacora( bitacora: Bitacora ) {

    let url = URL_SERVICIOS + '/bitacora';

    if ( bitacora._id ) {
      // *** Aqui se ACTUALIZA la Bitacora ***
      url += '/' + bitacora._id;

      // *** TOKEN ***
      url += '?token=' + this.token;

      return this.http.put( url, bitacora )
      .pipe(
        map( (resp: any ) => {
          Swal.fire({
            title: 'Bitácora Actualizada',
            type: 'success',
            showConfirmButton: false,
            timer: 2000
          });
          return resp.bitacora;
        }),
        catchError( err => {
          Swal.fire('Error', err.error.err.message, 'error');
          return throwError( err ) ;
        })
      );

    } else {
      // *** Aqui se CREA la Bitacora ***

      // *** TOKEN ***
      url += '?token=' + this.token;

      return this.http.post( url, bitacora )
      .pipe(
        map( (resp: any ) => {
          Swal.fire({
            title: 'Bitácora Creada',
            type: 'success',
            showConfirmButton: false,
            timer: 2000
          });
          return resp.bitacora;
        }),
        catchError( err => {
          Swal.fire('Error', err.error.err.message, 'error');
          return throwError( err ) ;
        })
      );
    }

  }

  eliminarBitacora( id: string ) {

    let url = URL_SERVICIOS + '/bitacora/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Bitácora Eliminada',
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
}
