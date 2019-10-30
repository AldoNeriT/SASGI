import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Aviso } from '../../models/aviso.model';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AvisosService {

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

  cargarAvisos() {

    let url = URL_SERVICIOS + '/aviso';

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        return resp.avisos;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  crearAviso( aviso: Aviso ) {

    let url = URL_SERVICIOS + '/aviso';

    // *** Aqui se CREA el Aviso ***

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.post( url, aviso )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Aviso Creado',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.aviso;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  eliminarAviso( id: string ) {

    let url = URL_SERVICIOS + '/aviso/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Aviso Eliminado',
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
