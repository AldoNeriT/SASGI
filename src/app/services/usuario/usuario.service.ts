import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Injectable()
export class UsuarioService {

  totalUsuarios: number = 0;

  usuario: Usuario;
  token: string;

  constructor( public http: HttpClient,
               public router: Router) {
    this.cargarStorage();
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {

    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
    } else {
      this.token = '';
      this.usuario = null;
    }

  }

  guardarStorage( id: string, token: string, usuario: Usuario) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify( usuario ) );

    this.usuario = usuario;
    this.token = token;

  }

  logout() {

    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);

  }

  login( usuario: Usuario, recordar: boolean = false) {

    if ( recordar ) {
      localStorage.setItem('userName', usuario.nombre_Usuario);
    } else {
      localStorage.removeItem('userName');
    }

    let url = URL_SERVICIOS + '/login';

    return this.http.post( url, usuario )
          .pipe(
            map( (resp: any) => {
              this.guardarStorage( resp.id, resp.token, resp.usuario)
              return true;
            }),
            catchError( err => {
              Swal.fire('Error', err.error.err.message, 'error');
              return throwError( err ) ;
            })
          );
  }

  crearUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario';

    if ( usuario._id ) {
      // *** Aqui se ACTUALIZA el Usuario ***
      url += '/' + usuario._id;

      // *** TOKEN ***
      url += '?token=' + this.token;

      return this.http.put( url, usuario )
      .pipe(
        map( (resp: any ) => {
          Swal.fire({
            title: 'Usuario Actualizado',
            type: 'success',
            showConfirmButton: false,
            timer: 2000
          });
          return resp.usuario;
        }),
        catchError( err => {
          Swal.fire('Error', err.error.err.message, 'error');
          return throwError( err ) ;
        })
      );

    } else {
      // *** Aqui se CREA el Usuario ***

        // *** TOKEN ***
      url += '?token=' + this.token;

      return this.http.post( url, usuario )
      .pipe(
        map( (resp: any ) => {
          Swal.fire({
            title: 'Usuario Creado',
            text: `"${usuario.nombre_Usuario}" se ha creado exitosamente`,
            type: 'success',
            showConfirmButton: false,
            timer: 2000
          });
          return resp.usuario;
        }),
        catchError( err => {
          Swal.fire('Error', err.error.err.message, 'error');
          return throwError( err ) ;
        })
      );
    }

  }

  cargarUsuarios() {
    this.cargarStorage();

    let url = URL_SERVICIOS + '/usuario';

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        this.totalUsuarios = resp.cuantos;
        return resp.usuarios;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cargarUsuariosInactivos() {
    this.cargarStorage();

    let url = URL_SERVICIOS + '/usuario/inactivos';

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        this.totalUsuarios = resp.cuantos;
        return resp.usuarios;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cargarUsuario( id: string) {
    this.cargarStorage();

    let url = URL_SERVICIOS + '/usuario/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        return resp.usuario;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  desactivarUsuario( id: string ) {

    let url = URL_SERVICIOS + '/usuario/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Usuario Desactivado',
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

  desactivarUsuarioPermanente( id: string ) {

    let url = URL_SERVICIOS + '/usuario/inactivos/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Usuario Eliminado',
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

  activarUsuario( id: string ) {

    let url = URL_SERVICIOS + '/usuario/inactivos/' + id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, '' )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Usuario Activado',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.usuario;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  actualizarPass( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario/password/' + usuario._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, usuario )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Contraseña Actualizada',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.usuario;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  actualizarMiPerfil( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario/miperfil/' + usuario._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, usuario )
    .pipe(
      map( (resp: any ) => {
        this.usuario = resp.usuario;
        Swal.fire({
          title: 'Datos Actualizados',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.usuario;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );
  }

  validarContrasena( usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario/director/' + usuario._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.post( url, usuario )
          .pipe(
            map( (resp: any) => {
              return resp;
            }),
            catchError( err => {
              Swal.fire('Error', err.error.err.message, 'error');
              return throwError( err ) ;
            })
          );
  }

  validarContrasenaAudiL( usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario/lider/' + usuario._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.post( url, usuario )
          .pipe(
            map( (resp: any) => {
              return resp;
            }),
            catchError( err => {
              Swal.fire('Error', err.error.err.message, 'error');
              return throwError( err ) ;
            })
          );
  }

  cargarUsuariosPorTipo( role: string ) {

    let url = URL_SERVICIOS + '/usuario/tipo/' + role;
    // let url = URL_SERVICIOS + '/planeacion/auditoria/auditores/' + role;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        // this.totalUsuarios = resp.cuantos;
        return resp.usuarios;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

}
