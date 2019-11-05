import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Informe } from '../../models/informe.model';
import { PersonalContactado } from '../../models/personal-contactado.model';
import { NoConformidades } from '../../models/no-conformidades.model';
import { Matriz } from '../../models/matriz.model';
import { URL_SERVICIOS } from '../../config/config';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InformeService {

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

  cargarInforme( id: string ) {
    this.cargarStorage();

    let url = URL_SERVICIOS + '/informe/auditoria/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        return resp.informe;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  crearInforme( informe: Informe ) {

    let url = URL_SERVICIOS + '/informe';

    // *** Aqui se CREA el Informe ***

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.post( url, informe )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Puedes empezar el Informe',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.hallazgo;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  modificarTitulo( informe: Informe ) {

    let url = URL_SERVICIOS + '/informe/proceso/' + informe._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, informe )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Cambios Guardados',
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

  modificarComentarios( informe: Informe ) {

    let url = URL_SERVICIOS + '/informe/comentarios/' + informe._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, informe )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Comentarios Guardados',
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

  modificarConclusiones( informe: Informe ) {

    let url = URL_SERVICIOS + '/informe/conclusiones/' + informe._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, informe )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Conclusiones Guardadas',
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

  modificarFechas( informe: Informe ) {

    let url = URL_SERVICIOS + '/informe/fechaauditorias/' + informe._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, informe )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Fechas de Auditoría Guardadas',
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

  modificarFechaEmision( informe: Informe ) {

    let url = URL_SERVICIOS + '/informe/fechaemision/' + informe._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, informe )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Fecha de Emisión Guardada',
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

  modificarOM( informe: Informe ) {

    let url = URL_SERVICIOS + '/informe/oportunidades/' + informe._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, informe )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Oportunidad de Mejora Agregada',
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

  eliminarOM( informe: Informe ) {

    let url = URL_SERVICIOS + '/informe/oportunidades/' + informe._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, informe )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Oportunidad de Mejora Eliminada',
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

  // ************************************************
  // *** PERSONAL CONTACTADO ***
  // ************************************************

  cargarPersonal( id: string ) {

    let url = URL_SERVICIOS + '/personal/informe/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        return resp.auditados;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  crearPersonal( personal: PersonalContactado ) {

    let url = URL_SERVICIOS + '/personal';

    // *** Aqui se CREA el Personal ***

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.post( url, personal )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Personal Creado',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.auditado;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  eliminarPersonal( id: string ) {

    let url = URL_SERVICIOS + '/personal/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Personal Eliminado',
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

  // ************************************************
  // *** NO CONFORMIDADES ***
  // ************************************************

  cargarNoConformidades( id: string ) {

    let url = URL_SERVICIOS + '/hallazgo/informe/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        return resp.hallazgos;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  crearNoConformidades( hallazgo: NoConformidades ) {

    let url = URL_SERVICIOS + '/hallazgo';

    // *** Aqui se CREA el Personal ***

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.post( url, hallazgo )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'No Conformidad Agregada',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.hallazgo;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  eliminarNoConformidades( id: string ) {

    let url = URL_SERVICIOS + '/hallazgo/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'No Conformidad Eliminada',
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

  // ************************************************
  // *** MATRIZ ***
  // ************************************************

  cargarMatrizInforme( id: string ) {

    let url = URL_SERVICIOS + '/matriz/informe/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        return resp.matrices;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  crearMatriz( matriz: Matriz ) {

    let url = URL_SERVICIOS + '/matriz';

    // *** Aqui se CREA la Matriz ***

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.post( url, matriz )
    .pipe(
      map( (resp: any ) => {
        // Swal.fire({
        //   title: 'Matriz Creada',
        //   type: 'success',
        //   showConfirmButton: false,
        //   timer: 2000
        // });
        return resp.matriz;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  eliminarMatriz( id: string ) {

    let url = URL_SERVICIOS + '/matriz/informe/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        // Swal.fire({
        //   title: 'Matriz Eliminada',
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

}
