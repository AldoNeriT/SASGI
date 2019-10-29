import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tabla } from '../../models/tabla.model';
import { URL_SERVICIOS } from '../../config/config';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TablaService {

  // totalNormas: number = 0;

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

  cargarTabla() {

    let url = URL_SERVICIOS + '/tabla';

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        return resp.tablas;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  crearFila( fila: Tabla ) {

    let url = URL_SERVICIOS + '/tabla';

    // *** Aqui se CREA la Tabla ***

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.post( url, fila )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Fila Creada',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.norma;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  eliminarFila( id: string ) {

    let url = URL_SERVICIOS + '/tabla/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Fila Eliminada',
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
