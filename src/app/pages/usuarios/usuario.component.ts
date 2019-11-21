import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

// declare function init_plugins();

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: []
})
export class UsuarioComponent implements OnInit {

  forma: FormGroup;
  formaActualizar: FormGroup;
  formaPass: FormGroup;
  id: string;
  ver: string;
  titulo: string;

  cargando = true;
  roleUsuario: string;

  // *** Variables para los Formularios ***
  mostrarFormAgregar: boolean;
  mostrarFormEditar: boolean;
  mostrarFormVer: boolean;
  mostrarFormPassword: boolean;

  // *** Variables para la pestaña VER ***
  numEmpleadoV: string;
  usuarioV: string;
  nombreV: string;
  priApellidoV: string;
  segApellidoV: string;
  correoV: string;
  telefonoV: string;
  puestoV: string;
  tipoUserV: string;

  constructor( public _usuarioService: UsuarioService,
               public router: Router,
               public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe( params => {

      this.id = params['id'];
      this.ver = params['ver'];

      if ( this.ver === 'ver') {
        this.cargarUsuarioVer( this.id );
        this.titulo = 'Datos del Usuario: ';
        this.mostrarFormAgregar = false;
        this.mostrarFormEditar = false;
        this.mostrarFormVer = true;
        this.mostrarFormPassword = false;
      } else {
        if ( this.ver === 'pass') {
          this.cargarUsuarioPass( this.id );
          this.titulo = 'Actualizando Contraseña del Usuario: ';
          this.mostrarFormPassword = true;
        } else {
          if ( this.id === 'nuevo') {
            this.cargando = false;
            this.titulo = 'Agregar Usuario';
            this.mostrarFormAgregar = true;
            this.mostrarFormEditar = false;
            this.mostrarFormVer = false;
            this.mostrarFormPassword = false;
          } else {
            this.cargarUsuario( this.id );
            this.titulo = 'Actualizar Usuario';
            this.mostrarFormAgregar = false;
            this.mostrarFormEditar = true;
            this.mostrarFormVer = false;
            this.mostrarFormPassword = false;
          }
        }
      }
    });
  }

  ngOnInit() {
    // init_plugins();
    this.forma = new FormGroup({
      numEmpleado: new FormControl( null, Validators.required ),
      usuario: new FormControl( null, Validators.required ),
      nombre: new FormControl( null, Validators.required ),
      priApellido: new FormControl( null, Validators.required ),
      segApellido: new FormControl(),
      correo: new FormControl( null, [Validators.required, Validators.email] ),
      telefono: new FormControl( null, Validators.required ),
      puesto: new FormControl( null, Validators.required ),
      contrasenia: new FormControl( null, Validators.required ),
      contrasenia2: new FormControl( null, Validators.required ),
      tipoUser: new FormControl( null, Validators.required ),
    }, { validators: this.sonIguales( 'contrasenia', 'contrasenia2') });

    this.formaActualizar = new FormGroup({
      numEmpleado: new FormControl( null, Validators.required ),
      usuario: new FormControl( null, Validators.required ),
      nombre: new FormControl( null, Validators.required ),
      priApellido: new FormControl( null, Validators.required ),
      segApellido: new FormControl(),
      correo: new FormControl( null, [Validators.required, Validators.email] ),
      telefono: new FormControl( null, Validators.required ),
      puesto: new FormControl( null, Validators.required ),
      tipoUser: new FormControl( null, Validators.required ),
    });

    this.formaPass = new FormGroup({
      contrasenia: new FormControl( null, Validators.required ),
      contrasenia2: new FormControl( null, Validators.required )
    }, { validators: this.sonIguales( 'contrasenia', 'contrasenia2') });

    // DATOS TEMPORALES PARA LLENAR EL FORM
    // this.forma.setValue({
    //   numEmpleado: '1',
    //   usuario: 'test',
    //   nombre: 'Juan',
    //   priApellido: 'Gonzalez',
    //   segApellido: 'Perez',
    //   correo: 'test@gmail.com',
    //   telefono: '4456589541',
    //   puesto: 'Jefe',
    //   contrasenia: '123456',
    //   contrasenia2: '123456',
    //   tipoUser: 'ADMIN'
    // });
  }

  sonIguales( campo1: string, campo2: string ) {

    return ( group: FormGroup ) => {

      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;

      if ( pass1 === pass2 ) {
        return null;
      }

      return {
        sonIguales: true
      };

    };

  }

  crearUsuario() {

    // if ( !this.forma.value.tipoUser ) {
    //   swal('Error', 'Elige un tipo de Usuario', 'error');
    // }

    if ( this.forma.invalid ) {
      return;
    }

    // *** Si el ID de la URL es igual a 'nuevo' lo convierte a null
    //     para que el servicio lo detecte para Agregar ***
    if ( this.id === 'nuevo') {
      this.id = null;
    }

    let usuario = new Usuario(
      this.forma.value.numEmpleado,
      this.forma.value.usuario,
      this.forma.value.nombre,
      this.forma.value.priApellido,
      this.forma.value.correo,
      this.forma.value.telefono,
      this.forma.value.puesto,
      this.forma.value.contrasenia,
      this.forma.value.tipoUser,
      this.forma.value.segApellido,
      this.id
    );

    // console.log(usuario);

    if ( ( this.forma.value.tipoUser === 'AUDITOR_LIDER') || ( this.forma.value.tipoUser === 'ALTA_DIRECCION')) {
      // console.log('solo una vez');

      let tp = '';

      if ( this.forma.value.tipoUser === 'AUDITOR_LIDER' ){
        tp = 'Auditor Líder';
      }

      if ( this.forma.value.tipoUser === 'ALTA_DIRECCION' ){
        tp = 'Alta Dirección';
      }

      this._usuarioService.cargarUsuariosPorTipo( this.forma.value.tipoUser )
          .subscribe( resp => {
            // console.log(' RESPUESTA ',resp);
            if ( resp.length === 0 ) {
              // console.log('PUEDES AGREGAR OTRO');
              this._usuarioService.crearUsuario( usuario )
                  .subscribe( resp => {
                    this.router.navigate(['/usuarios']);
                  });
            } else {
              Swal.fire({
                title: '¡Error!',
                text: `No puedes tener otro usuario como "${tp}"`,
                type: 'error',
                animation: false,
                customClass: {
                  popup: 'animated tada'
                }
              });
            }
          });

    } else {
      // console.log('puede muchas veces');
      this._usuarioService.crearUsuario( usuario )
          .subscribe( resp => {
            this.router.navigate(['/usuarios']);
          });
    }

  }

  actualizarUsuario() {

    // if ( !this.formaActualizar.value.tipoUser ) {
    //   swal('Error', 'Elige un tipo de Usuario', 'error');
    // }

    if ( this.formaActualizar.invalid ) {
      return;
    }

    // *** Si el ID de la URL es igual a 'nuevo' lo convierte a null
    //     para que el servicio lo detecte para Agregar ***
    if ( this.id === 'nuevo') {
      this.id = null;
    }

    let usuario = new Usuario(
      this.formaActualizar.value.numEmpleado,
      this.formaActualizar.value.usuario,
      this.formaActualizar.value.nombre,
      this.formaActualizar.value.priApellido,
      this.formaActualizar.value.correo,
      this.formaActualizar.value.telefono,
      this.formaActualizar.value.puesto,
      '',
      this.formaActualizar.value.tipoUser,
      this.formaActualizar.value.segApellido,
      this.id
    );

    // console.log(usuario);

    if ( ( this.formaActualizar.value.tipoUser === 'AUDITOR_LIDER') || ( this.formaActualizar.value.tipoUser === 'ALTA_DIRECCION')) {
      // console.log('solo una vez');

      let tp = '';

      if ( this.formaActualizar.value.tipoUser === 'AUDITOR_LIDER' ){
        tp = 'Auditor Líder';
      }

      if ( this.formaActualizar.value.tipoUser === 'ALTA_DIRECCION' ){
        tp = 'Alta Dirección';
      }

      this._usuarioService.cargarUsuariosPorTipo( this.formaActualizar.value.tipoUser )
          .subscribe( resp => {
            // console.log(' RESPUESTA ',resp);
            // console.log(this.roleUsuario);
            if ( (resp.length === 0) || ( this.roleUsuario === this.formaActualizar.value.tipoUser ) ) {
              // console.log('PUEDES AGREGAR OTRO');
              this._usuarioService.crearUsuario( usuario )
                  .subscribe( resp => {
                    this.router.navigate(['/usuarios']);
                  });
              
            } else {
              Swal.fire({
                title: 'Error!',
                text: `No puedes tener otro usuario como "${tp}"`,
                type: 'error',
                animation: false,
                customClass: {
                  popup: 'animated tada'
                }
              });
            }
          });

    } else {
      this._usuarioService.crearUsuario( usuario )
          .subscribe( resp => {
            this.router.navigate(['/usuarios']);
          });
    }

  }

  actualizarPass() {

    if ( this.formaPass.invalid ) {
      return;
    }

    // *** Si el ID de la URL es igual a 'nuevo' lo convierte a null
    //     para que el servicio lo detecte para Agregar ***
    if ( this.id === 'nuevo') {
      this.id = null;
    }

    let usuario = new Usuario(
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      this.formaPass.value.contrasenia,
      '',
      '',
      this.id
    );

    this._usuarioService.actualizarPass( usuario)
          .subscribe( resp => {
            this.router.navigate(['/usuarios']);
          });

  }

  cargarUsuario( id: string) {

    this.cargando = true;

    this._usuarioService.cargarUsuario( id )
          .subscribe( usuario => {
            // *** La Respuesta es el arreglo como esta en la Base de
            //     datos y se le insertan los valores al formulario ***
            this.formaActualizar.setValue({
              numEmpleado: usuario.numero_Empleado,
              usuario: usuario.nombre_Usuario,
              nombre: usuario.nombre,
              priApellido: usuario.primer_Apellido,
              segApellido: usuario.segundo_Apellido || '',
              correo: usuario.email,
              telefono: usuario.telefono,
              puesto: usuario.puesto,
              tipoUser: usuario.tipo_Usuario
            });

            this.roleUsuario = usuario.tipo_Usuario;

            this.cargando = false;

          });

  }

  cargarUsuarioVer( id: string) {

    this.cargando = true;

    this._usuarioService.cargarUsuario( id )
          .subscribe( usuario => {
            // *** La Respuesta es el arreglo como esta en la Base de
            //     datos y se le insertan los valores al formulario ***
            this.numEmpleadoV = usuario.numero_Empleado;
            this.usuarioV = usuario.nombre_Usuario;
            this.nombreV = usuario.nombre;
            this.priApellidoV = usuario.primer_Apellido;
            this.segApellidoV = usuario.segundo_Apellido || '';
            this.correoV = usuario.email;
            this.telefonoV = usuario.telefono;
            this.puestoV = usuario.puesto;
            this.tipoUserV = usuario.tipo_Usuario;
            this.titulo += usuario.nombre + ' ' + usuario.primer_Apellido + ' ' + (usuario.segundo_Apellido || '');

            this.cargando = false;
          });

  }

  cargarUsuarioPass( id: string) {

    this.cargando = true;

    this._usuarioService.cargarUsuario( id )
          .subscribe( usuario => {
            // *** La Respuesta es el arreglo como esta en la Base de
            //     datos y se le insertan los valores al formulario ***
            this.titulo += usuario.nombre + ' ' + usuario.primer_Apellido + ' ' + (usuario.segundo_Apellido || '');
            this.cargando = false;
          });

  }

}
