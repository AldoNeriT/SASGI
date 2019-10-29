import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auditoria } from '../../models/auditoria.model';
import { URL_SERVICIOS } from '../../config/config';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  totalAuditorias: number = 0;

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

  cargarAuditorias() {

    let url = URL_SERVICIOS + '/auditoria';

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        this.totalAuditorias = resp.cuantos;
        return resp.auditorias;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cargarAuditoriasGA() {

    let url = URL_SERVICIOS + '/auditoria/usuario/grupoauditor';

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        this.totalAuditorias = resp.cuantos;
        return resp.auditorias;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cargarAuditoriasAu() {

    let url = URL_SERVICIOS + '/auditoria/usuario/auditados';

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        this.totalAuditorias = resp.cuantos;
        return resp.auditorias;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cargarAuditoria( id: string ) {

    let url = URL_SERVICIOS + '/auditoria/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        return resp.auditoria;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cargarAuditoriasPlan( id: string ) {

    let url = URL_SERVICIOS + '/auditoria/plan/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        return resp.auditorias;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  crearAuditoria( auditoria: Auditoria ) {

    let url = URL_SERVICIOS + '/auditoria';

    if ( auditoria._id ) {
      // *** Aqui se ACTUALIZA la Auditoria ***
      url += '/' + auditoria._id;

      // *** TOKEN ***
      url += '?token=' + this.token;

      return this.http.put( url, auditoria )
      .pipe(
        map( (resp: any ) => {
          Swal.fire({
            title: '¡Listo!',
            type: 'success',
            showConfirmButton: false,
            timer: 2000
          });
          return resp.auditoria;
        }),
        catchError( err => {
          Swal.fire('Error', err.error.err.message, 'error');
          return throwError( err ) ;
        })
      );

    } else {
      // *** Aqui se CREA la Auditoria ***

      // *** TOKEN ***
      url += '?token=' + this.token;

      return this.http.post( url, auditoria )
      .pipe(
        map( (resp: any ) => {
          // Swal.fire({
          //   title: 'Auditoría Creada',
          //   text: `La Auditoría "${auditoria.nombreAuditoria}" se ha creado exitosamente`,
          //   type: 'success',
          //   showConfirmButton: false,
          //   timer: 2000
          // });
          return resp.auditoria;
        }),
        catchError( err => {
          Swal.fire('Error', err.error.err.message, 'error');
          return throwError( err ) ;
        })
      );
    }

  }

  eliminarAuditoria( id: string ) {

    let url = URL_SERVICIOS + '/auditoria/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Auditoría Eliminada',
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

  validarAuditoria( auditoria: Auditoria ) {

    let url = URL_SERVICIOS + '/auditoria/validacion/' + auditoria._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, auditoria )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Validación exitosa',
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

  cambiarPasos( idAuditoria: string, auditoria: Auditoria ) {

    let url = URL_SERVICIOS + '/auditoria/pasos/' + idAuditoria;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, auditoria )
    .pipe(
      map( (resp: any ) => {
        // Swal.fire({
        //   title: 'Puedes empezar',
        //   type: 'success'
        // });
        return resp.planeacion;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cambiarTerminado( idAuditoria: string ) {

    let url = URL_SERVICIOS + '/auditoria/progreso/' + idAuditoria;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, null )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Auditoría Concluida',
          type: 'success'
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
