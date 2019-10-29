import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/service.index';

declare function init_plugins();

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styleUrls: ['./nopagefound.component.css']
})
export class NopagefoundComponent implements OnInit {

  anio: number = new Date().getFullYear();

  constructor( public _ajustes: SettingsService ) { }

  ngOnInit() {
    init_plugins();
    this.cargarImagenesInicializar();
  }

  cargarImagenesInicializar() {
    this._ajustes.cargarImagenes()
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

}
