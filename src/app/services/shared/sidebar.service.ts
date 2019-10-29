import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [];

  constructor( public _usuarioService: UsuarioService ) { }

  seleccionarMenu() {
    if ( this._usuarioService.usuario.tipo_Usuario === 'ROOT') {
      this.menuRoot();
      return;
    }
    if ( this._usuarioService.usuario.tipo_Usuario === 'ADMIN') {
      this.menuAdmin();
      return;
    }
    if ( this._usuarioService.usuario.tipo_Usuario === 'AUDITOR_LIDER') {
      this.menuAuditorLider();
      return;
    }
    if ( this._usuarioService.usuario.tipo_Usuario === 'AUDITOR') {
      this.menuAuditor();
      return;
    }
    if ( this._usuarioService.usuario.tipo_Usuario === 'AUDITADO') {
      this.menuAuditado();
      return;
    }
    if ( this._usuarioService.usuario.tipo_Usuario === 'ALTA_DIRECCION') {
      this.menuAltaD();
      return;
    }
  }

  menuRoot() {

    this.menu = [
      {
        titulo: 'Sistema ABC',
        icono: 'mdi mdi-account-settings-variant',
        submenu: [
          { titulo: 'Institución', url: '/institucion' },
          { titulo: 'Usuarios', url: '/usuarios' },
          { titulo: 'Normas', url: '/normas' },
          { titulo: 'Procesos', url: '/procesos' },
          { titulo: 'Matriz del Informe', url: '/matriz' }
        ]
      },
      {
        titulo: 'Auditorías',
        icono: 'mdi mdi-book',
        submenu: [
          { titulo: 'Plan de Auditorías', url: '/planes' },
          { titulo: 'Bitácora de Acciones', url: '/bitacora' }
        ]
      }
    ];

  }

  menuAdmin() {

    this.menu = [
      {
        titulo: 'Sistema ABC',
        icono: 'mdi mdi-account-settings-variant',
        submenu: [
          { titulo: 'Institución', url: '/institucion' },
          { titulo: 'Usuarios', url: '/usuarios' },
          { titulo: 'Normas', url: '/normas' },
          { titulo: 'Procesos', url: '/procesos' },
          { titulo: 'Matriz del Informe', url: '/matriz' }
        ]
      },
      {
        titulo: 'Auditorías',
        icono: 'mdi mdi-book',
        submenu: [
          { titulo: 'Plan de Auditorías', url: '/planes' },
          { titulo: 'Bitácora de Acciones', url: '/bitacora' }
        ]
      }
    ];

  }

  menuAuditorLider() {

    this.menu = [
      {
        titulo: 'Sistema',
        icono: 'mdi mdi-account-settings-variant',
        submenu: [
          { titulo: 'Institución', url: '/institucion' },
          { titulo: 'Usuarios', url: '/usuarios' },
          { titulo: 'Normas', url: '/normas' },
          { titulo: 'Procesos', url: '/procesos' },
          { titulo: 'Matriz del Informe', url: '/matriz' }
        ]
      },
      {
        titulo: 'Auditorías',
        icono: 'mdi mdi-book',
        submenu: [
          { titulo: 'Plan de Auditorías', url: '/planes' },
          { titulo: 'Bitácora de Acciones', url: '/bitacora' }
        ]
      }
    ];

  }

  menuAuditor() {

    this.menu = [
      {
        titulo: 'Auditorias',
        icono: 'mdi mdi-book',
        submenu: [
          { titulo: 'Plan de Auditorías', url: '/planes' }
        ]
      }
    ];

  }

  menuAuditado() {

    this.menu = [
      {
        titulo: 'Auditorias',
        icono: 'mdi mdi-book',
        submenu: [
          { titulo: 'Plan de Auditorías', url: '/planes' }
        ]
      }
    ];

  }

  menuAltaD() {

    this.menu = [
      {
        titulo: 'Auditorias',
        icono: 'mdi mdi-book',
        submenu: [
          { titulo: 'Plan de Auditorías', url: '/planes' }
        ]
      }
    ];

  }

}
