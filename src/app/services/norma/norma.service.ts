import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Norma } from '../../models/norma.model';
import { URL_SERVICIOS } from '../../config/config';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NormaService {

  totalNormas: number = 0;

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

  cargarNormas() {
    this.cargarStorage();

    let url = URL_SERVICIOS + '/norma';

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        this.totalNormas = resp.cuantos;
        return resp.normas;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  // *** NO SE ESTA USANDO ESTE METODO   ***
  // cargarNorma( id: string ) {

  //   let url = URL_SERVICIOS + '/norma/' + id;

  //   // *** TOKEN ***
  //   // url += '?token=' + this.token;

  //   return this.http.get( url )
  //   .pipe(
  //     map( (resp: any ) => {
  //       return resp.norma;
  //     }),
  //     catchError( err => {
  //       swal('Error', err.error.err.message, 'error');
  //       return throwError( err ) ;
  //     })
  //   );

  // }

  crearNorma( norma: Norma ) {

    let url = URL_SERVICIOS + '/norma';

    if ( norma._id ) {
      // *** Aqui se ACTUALIZA la Norma ***
      url += '/' + norma._id;

      // *** TOKEN ***
      url += '?token=' + this.token;

      return this.http.put( url, norma )
      .pipe(
        map( (resp: any ) => {
          Swal.fire({
            title: 'Norma Actualizada',
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

    } else {
      // *** Aqui se CREA la Norma ***

      // *** TOKEN ***
      url += '?token=' + this.token;

      return this.http.post( url, norma )
      .pipe(
        map( (resp: any ) => {
          Swal.fire({
            title: 'Norma Creada',
            text: `La Norma "${norma.nombreNorma}" se ha creado exitosamente`,
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

  }

  eliminarNorma( id: string ) {

    let url = URL_SERVICIOS + '/norma/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Norma Eliminada',
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
