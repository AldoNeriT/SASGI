import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService, SettingsService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

// import swal from 'sweetalert';
import Swal from 'sweetalert2';

declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame: boolean = false;
  userName: string;

  constructor( public router: Router,
               public _usuarioService: UsuarioService,
               public _ajustes: SettingsService ) { }

  ngOnInit() {
    init_plugins();

    // *** Poner en el input el usuario guardado en el localStorage ***
    this.userName = localStorage.getItem('userName') || '';

    // *** Si hay datos en la variable de userName del localStorage, el check recuerdame se queda en true ***
    if ( this.userName.length > 1 ) {
      this.recuerdame = true;
    }

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

  ingresar( forma: NgForm) {

    if ( forma.invalid) {
      return;
    }

    let usuario = new Usuario(null, forma.value.usuario, null, null, null, null, null, forma.value.password, null, null);

    this._usuarioService.login( usuario, forma.value.recuerdame )
                  .subscribe( correcto => this.router.navigate(['/home']));
  }

  perdiCuenta() {
    // Swal.fire('¡Importante!',
    //      'Para recuperar los datos de tu cuenta, favor de comunicarte con el Administrador del Sistema',
    //      'warning');
    Swal.fire({
      title: '¡Importante!',
      text: 'Para recuperar los datos de tu cuenta, favor de comunicarte con el Administrador del Sistema',
      type: 'warning',
      animation: false,
      customClass: {
        popup: 'animated heartBeat'
      }
    });
  }

}
