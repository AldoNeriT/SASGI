import { Component, OnInit } from '@angular/core';

import { SettingsService, UsuarioService } from '../../services/service.index';
import { Imagen } from '../../models/imagen.model';

// declare function init_plugins();
declare function floating_labels();
import * as $ from 'jquery';

@Component({
  selector: 'app-accout-settings',
  templateUrl: './accout-settings.component.html',
  styles: []
})
export class AccoutSettingsComponent implements OnInit {

  idImg: string;

  imagenes: Imagen;

  cargando = true;

  constructor( public _ajustes: SettingsService,
               public _usuarioService: UsuarioService ) { }

  ngOnInit() {
    // init_plugins();
    floating_labels();
    
    this.colocarCheck();
    this.cargarImagenes();
  }

  cambiarColor( tema: string, link: any ) {

    this.aplicarCheck( link );
    this._ajustes.aplicarTema( tema );

  }

  aplicarCheck( link: any ) {

    let selectores: any = document.getElementsByClassName('selector');

    for (let ref of selectores ) {
      ref.classList.remove('working');
    }

    link.classList.add('working');

  }

  colocarCheck() {

    let selectores: any = document.getElementsByClassName('selector');

    let tema = this._ajustes.ajustes.tema;

    for (let ref of selectores ) {
      if ( ref.getAttribute('data-theme') == tema ) {
        ref.classList.add('working');
        break;
      }
    }
  }

  // ************************************************
  // *** IMAGENES ***
  // ************************************************

  cargarImagenes() {

    this.cargando = true;

    this._ajustes.cargarImagenes()
          .subscribe( imagenes => {
            this.imagenes = imagenes[0];
            // console.log(this.imagenes);
            if ( imagenes[0] ) {
              this.idImg = imagenes[0]._id;
              $('#link_fondo').val(this.imagenes.fondo + '');
              $('#link_logo_login').val(this.imagenes.logoLogin + '');
              $('#link_LPC').val(this.imagenes.logoPequenoClaro + '');
              $('#link_LPO').val(this.imagenes.logoPequenoOscuro + '');
              $('#link_LGC').val(this.imagenes.logoGrandeClaro + '');
              $('#link_LGO').val(this.imagenes.logoGrandeOscuro + '');
  
              $('#fondoForm').attr('src', this.imagenes.fondo + '');
              $('#logoLoginForm').attr('src', this.imagenes.logoLogin + '');
              $('#LPCForm').attr('src', this.imagenes.logoPequenoClaro + '');
              $('#LPOForm').attr('src', this.imagenes.logoPequenoOscuro + '');
              $('#LGCForm').attr('src', this.imagenes.logoGrandeClaro + '');
              $('#LGOForm').attr('src', this.imagenes.logoGrandeOscuro + '');
  
              $('#wrapper').attr('style', 'background-image:url(' + imagenes[0].fondo + ');');
              $('#icono').attr('href', imagenes[0].logoLogin + '');
              $('#LLogin').attr('src', imagenes[0].logoLogin + '');
              $('#LPC').attr('src', imagenes[0].logoPequenoClaro + '');
              $('#LPO').attr('src', imagenes[0].logoPequenoOscuro + '');
              $('#LGC').attr('src', imagenes[0].logoGrandeClaro + '');
              $('#LGO').attr('src', imagenes[0].logoGrandeOscuro + '');
              $('#errorFondo').attr('src', imagenes[0].logoLogin + '');
  
              $('div.m-b-40').addClass('focused');
            }

            this.cargando = false;
          });

  }

  cambiarFondo() {
    // https://the1975.com/wp-content/uploads/2018/05/cropped-Facebook_ProfilePic-1.png
    let url = $('#link_fondo').val() + '';
    this._ajustes.cambiarImagen( 'fondoForm',  url );

    let imagen = new Imagen(
      url,
      '',
      '',
      '',
      '',
      '',
      this.idImg
    );

    // console.log('Img: ', imagen);

    this._ajustes.cambiarFondo( imagen )
            .subscribe( resp => {
              floating_labels();
              this.colocarCheck();
              this.cargarImagenes();
            });
  }

  cambiarLogoLogin() {
    let url = $('#link_logo_login').val() + '';
    this._ajustes.cambiarImagen( 'logoLoginForm',  url );

    let imagen = new Imagen(
      '',
      url,
      '',
      '',
      '',
      '',
      this.idImg
    );

    // console.log('Img: ', imagen);

    this._ajustes.cambiarLogoLogin( imagen )
            .subscribe( resp => {
              floating_labels();
              this.colocarCheck();
              this.cargarImagenes();
            });
  }

  cambiarLPC() {
    let url = $('#link_LPC').val() + '';
    this._ajustes.cambiarImagen( 'LPCForm',  url );

    let imagen = new Imagen(
      '',
      '',
      url,
      '',
      '',
      '',
      this.idImg
    );

    // console.log('Img: ', imagen);

    this._ajustes.cambiarLPC( imagen )
            .subscribe( resp => {
              floating_labels();
              this.colocarCheck();
              this.cargarImagenes();
            });
  }

  cambiarLPO() {
    let url = $('#link_LPO').val() + '';
    this._ajustes.cambiarImagen( 'LPOForm',  url );

    let imagen = new Imagen(
      '',
      '',
      '',
      url,
      '',
      '',
      this.idImg
    );

    // console.log('Img: ', imagen);

    this._ajustes.cambiarLPO( imagen )
            .subscribe( resp => {
              floating_labels();
              this.colocarCheck();
              this.cargarImagenes();
            });
  }

  cambiarLGC() {
    let url = $('#link_LGC').val() + '';
    this._ajustes.cambiarImagen( 'LGCForm',  url );

    let imagen = new Imagen(
      '',
      '',
      '',
      '',
      url,
      '',
      this.idImg
    );

    // console.log('Img: ', imagen);

    this._ajustes.cambiarLGC( imagen )
            .subscribe( resp => {
              floating_labels();
              this.colocarCheck();
              this.cargarImagenes();
            });
  }

  cambiarLGO() {
    let url = $('#link_LGO').val() + '';
    this._ajustes.cambiarImagen( 'LGOForm',  url );

    let imagen = new Imagen(
      '',
      '',
      '',
      '',
      '',
      url,
      this.idImg
    );

    // console.log('Img: ', imagen);

    this._ajustes.cambiarLGO( imagen )
            .subscribe( resp => {
              floating_labels();
              this.colocarCheck();
              this.cargarImagenes();
            });
  }

}
