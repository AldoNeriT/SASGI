import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plan } from '../../models/plan.model';
import { URL_SERVICIOS } from '../../config/config';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  totalPlanes: number = 0;

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

  cargarPlanes() {
    this.cargarStorage();

    let url = URL_SERVICIOS + '/plan';

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        this.totalPlanes = resp.cuantos;
        return resp.planes;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cargarPlan( id: string ) {
    this.cargarStorage();

    let url = URL_SERVICIOS + '/plan/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        return resp.plan;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  crearPlan( plan: Plan ) {

    let url = URL_SERVICIOS + '/plan';

    if ( plan._id ) {
      // *** Aqui se ACTUALIZA el Plan ***
      url += '/' + plan._id;

      // *** TOKEN ***
      url += '?token=' + this.token;

      return this.http.put( url, plan )
      .pipe(
        map( (resp: any ) => {
          Swal.fire({
            title: 'Plan de Auditorías Actualizado',
            type: 'success',
            showConfirmButton: false,
            timer: 2000
          });
          return resp.plan;
        }),
        catchError( err => {
          Swal.fire('Error', err.error.err.message, 'error');
          return throwError( err ) ;
        })
      );

    } else {
      // *** Aqui se CREA el Plan ***

      // *** TOKEN ***
      url += '?token=' + this.token;

      return this.http.post( url, plan )
      .pipe(
        map( (resp: any ) => {
          // Swal.fire({
          //   title: 'Plan de Auditorías Creado',
          //   text: `El Plan de Auditorías "${plan.nombrePlan}" se ha creado exitosamente`,
          //   type: 'success',
          //   showConfirmButton: false,
          //   timer: 2000
          // });
          return resp.plan;
        }),
        catchError( err => {
          Swal.fire('Error', err.error.err.message, 'error');
          return throwError( err ) ;
        })
      );
    }

  }

  eliminarPlan( id: string ) {

    let url = URL_SERVICIOS + '/plan/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Plan de Auditorías Eliminado',
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

  eliminarPlanPermanente( id: string ) {

    let url = URL_SERVICIOS + '/plan/eliminar/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        // Swal.fire({
        //   title: 'Plan de Auditorías Eliminado',
        //   type: 'success',
        //   showConfirmButton: false,
        //   timer: 2000
        // });
        return resp;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  eliminarAuditoriasPlan( id: string ) {

    let url = URL_SERVICIOS + '/auditoria/plan/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        // Swal.fire({
        //   title: 'Subprocesos del Proceso Eliminado',
        //   type: 'success',
        //   showConfirmButton: false,
        //   timer: 2000
        // });
        return resp;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  validarPlan( plan: Plan ) {

    let url = URL_SERVICIOS + '/plan/validacion/' + plan._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, plan )
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
}
