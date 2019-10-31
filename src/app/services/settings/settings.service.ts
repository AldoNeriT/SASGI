import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Imagen } from '../../models/imagen.model';
import { URL_SERVICIOS } from '../../config/config';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  ajustes: Ajustes = {
    temaUrl: 'assets/css/colors/default.css',
    tema: 'default'
  };

  totalImagenes: number = 0;

  token: string;

  constructor( @Inject(DOCUMENT) private _document,
              public http: HttpClient ) {
    this.cargarAjustes();
    this.cargarStorage();
  }
  
  cargarStorage() {

    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
    } else {
      this.token = '';
    }

  }

  guardarAjustes() {
    // Guardando en el LocalStorage
    localStorage.setItem( 'ajustes', JSON.stringify( this.ajustes) );
  }

  cargarAjustes() {
    if ( localStorage.getItem('ajustes') ) {
      // Cargando del local Storage
      this.ajustes = JSON.parse( localStorage.getItem('ajustes') );

      this.aplicarTema( this.ajustes.tema );
    } else {
      // Usando valores por defecto
      this.aplicarTema( this.ajustes.tema );
    }

    // console.log('AQUIIII HACER LO DE LAS IMAGENES');

    this.cargarImagenes()
          .subscribe( imagenes => {
            // this.imagenes = imagenes[0];
            // console.log(imagenes[0]);

            if ( imagenes[0] ) {
              $('#wrapper').attr('style', 'background-image:url(' + imagenes[0].fondo + ');');
              $('#icono').attr('href', imagenes[0].logoLogin + '');
              $('#LLogin').attr('src', imagenes[0].logoLogin + '');
              $('#LPC').attr('src', imagenes[0].logoPequenoClaro + '');
              $('#LPO').attr('src', imagenes[0].logoPequenoOscuro + '');
              $('#LGC').attr('src', imagenes[0].logoGrandeClaro + '');
              $('#LGO').attr('src', imagenes[0].logoGrandeOscuro + '');
              $('#errorFondo').attr('src', imagenes[0].logoLogin + '');
            }

          });
  }

  aplicarTema( tema: string ) {

    let url = `assets/css/colors/${ tema }.css`;
    this._document.getElementById('tema').setAttribute('href', url);

    this.ajustes.tema = tema;
    this.ajustes.temaUrl = url;

    this.guardarAjustes();

  }

  cambiarImagen( id: string, url: string ) {

    this._document.getElementById('' + id).setAttribute('src', url);

  }

  // ************************************************
  // *** IMAGENES ***
  // ************************************************

  cargarImagenes() {

    this.cargarStorage();

    let url = URL_SERVICIOS + '/imagen';

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe(
      map( (resp: any ) => {
        this.totalImagenes = resp.cuantos;
        return resp.imagenes;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cambiarFondo( imagen: Imagen ) {

    let url = URL_SERVICIOS + '/imagen/fondo/' + imagen._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, imagen )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Cambios Guardados',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.imagen;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cambiarLogoLogin( imagen: Imagen ) {

    let url = URL_SERVICIOS + '/imagen/logoLogin/' + imagen._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, imagen )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Cambios Guardados',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.imagen;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cambiarLPC( imagen: Imagen ) {

    let url = URL_SERVICIOS + '/imagen/logopc/' + imagen._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, imagen )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Cambios Guardados',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.imagen;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cambiarLPO( imagen: Imagen ) {

    let url = URL_SERVICIOS + '/imagen/logopo/' + imagen._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, imagen )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Cambios Guardados',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.imagen;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cambiarLGC( imagen: Imagen ) {

    let url = URL_SERVICIOS + '/imagen/logogc/' + imagen._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, imagen )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Cambios Guardados',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.imagen;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }

  cambiarLGO( imagen: Imagen ) {

    let url = URL_SERVICIOS + '/imagen/logogo/' + imagen._id;

    // *** TOKEN ***
    url += '?token=' + this.token;

    return this.http.put( url, imagen )
    .pipe(
      map( (resp: any ) => {
        Swal.fire({
          title: 'Cambios Guardados',
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        return resp.imagen;
      }),
      catchError( err => {
        Swal.fire('Error', err.error.err.message, 'error');
        return throwError( err ) ;
      })
    );

  }



}

interface Ajustes {
  temaUrl: string;
  tema: string;
}
