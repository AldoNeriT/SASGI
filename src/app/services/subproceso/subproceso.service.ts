import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subproceso } from '../../models/subproceso.model';
import { URL_SERVICIOS } from '../../config/config';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SubprocesoService {

  totalSubprocesos: number = 0;

  subproceso: Subproceso;
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

  cargarSubprocesos() {
    this.cargarStorage();

    let url = URL_SERVICIOS + '/subproceso';

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        this.totalSubprocesos = resp.cuantos;
        return resp.subprocesos;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cargarSubproceso( id: string ) {
    this.cargarStorage();

    let url = URL_SERVICIOS + '/subproceso/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        return resp.subproceso;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cargarSubprocesosProceso( id: string ) {
    this.cargarStorage();

    let url = URL_SERVICIOS + '/subproceso/proceso/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        return resp.subprocesos;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  crearSubproceso( subproceso: Subproceso ) {

    let url = URL_SERVICIOS + '/subproceso';

    if ( subproceso._id ) {
      // *** Aqui se ACTUALIZA el Subproceso ***
      url += '/' + subproceso._id;

      // *** TOKEN ***
      url += '?token=' + this.token;

      return this.http.put( url, subproceso )
      .pipe(
        map( (resp: any ) => {
          Swal.fire({
            title: 'Subproceso Actualizado',
            type: 'success',
            showConfirmButton: false,
            timer: 2000
          });
          return resp.subproceso;
        }),
        catchError( err => {
          Swal.fire('Error', err.error.err.message, 'error');
          return throwError( err ) ;
        })
      );

    } else {
      // *** Aqui se CREA el Subroceso ***

      // *** TOKEN ***
      url += '?token=' + this.token;

      return this.http.post( url, subproceso )
      .pipe(
        map( (resp: any ) => {
          Swal.fire({
            title: 'Subproceso Creado',
            text: `"${subproceso.nombreSubproceso}" se ha creado exitosamente`,
            type: 'success',
            showConfirmButton: false,
            timer: 2000
          });
          return resp.subproceso;
        }),
        catchError( err => {
          Swal.fire('Error', err.error.err.message, 'error');
          return throwError( err ) ;
        })
      );
    }

  }

  eliminarSubproceso( id: string ) {

    let url = URL_SERVICIOS + '/subproceso/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Subproceso Eliminado',
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
