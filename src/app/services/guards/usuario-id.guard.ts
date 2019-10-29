import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioIdGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router ) {

  }

  canActivate() {

    if (
          (this._usuarioService.usuario.tipo_Usuario === 'ROOT') ||
          (this._usuarioService.usuario.tipo_Usuario === 'ADMIN')
      ) {
      return true;
    } else {
      console.log('Bloqueado por USUARIO:ID GUARD');
      this.router.navigate(['/home']);
      return false;
    }
  }
  
}
