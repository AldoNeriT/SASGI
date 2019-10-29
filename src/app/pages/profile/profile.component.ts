import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';

// declare function init_plugins();

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  formaMiPerfil: FormGroup;

  mostrarEditable = false;
  usuario: Usuario;

  constructor( public _usuarioService: UsuarioService ) {
    this.usuario = this._usuarioService.usuario;
}

  ngOnInit() {
    // init_plugins();
    
    this.formaMiPerfil = new FormGroup({
      correo: new FormControl( null, [Validators.required, Validators.email] ),
      telefono: new FormControl( null, Validators.required )
    });
  }

  cargarDatos() {
    this.mostrarEditable = !this.mostrarEditable;

    // DATOS TEMPORALES PARA LLENAR EL FORM
    this.formaMiPerfil.setValue({
      correo: this.usuario.email,
      telefono: this.usuario.telefono
    });
  }

  actualizarMiPerfil() {

    if ( this.formaMiPerfil.invalid ) {
      return;
    }

    let usuario = new Usuario(
      '',
      '',
      '',
      '',
      this.formaMiPerfil.value.correo,
      this.formaMiPerfil.value.telefono,
      '',
      '',
      '',
      '',
      this.usuario._id
    );

    this._usuarioService.actualizarMiPerfil( usuario)
          .subscribe( resp => {
            this.mostrarEditable = !this.mostrarEditable;
            this._usuarioService.guardarStorage( resp._id, this._usuarioService.token, resp );
            // *** Se iguala con la respuesta para que se actualice en pantalla ***
            this.usuario = resp;
          });
  }

}
