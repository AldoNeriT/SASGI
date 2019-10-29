import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlanService, UsuarioService, AuditoriaService } from '../../services/service.index';
import { Plan } from '../../models/plan.model';
import { Auditoria } from '../../models/auditoria.model';
import { Usuario } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';
import * as $ from 'jquery';

// declare function init_plugins();
declare function inicializando_dateRange();

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styles: []
})
export class PlanesComponent implements OnInit {

  planes: Plan[] = [];
  auditorias: any[] = [];
  forma: FormGroup;
  formaEditar: FormGroup;

  idNor: string;

  cargando = true;

  constructor( public _planService: PlanService,
               public _auditoriaService: AuditoriaService,
               public _usuarioService: UsuarioService,
               public router: Router,
               public activatedRoute: ActivatedRoute ) { }

  ngOnInit() {
    // init_plugins();
    inicializando_dateRange();

    this.cargarPlanes();
    this.cargarAuditorias();
  }

  cargarPlanes() {

    this.cargando = true;

    this._planService.cargarPlanes()
          .subscribe( planes => {
            this.planes = planes;
            this.cargando = false;
          });

  }

  cargarAuditorias() {

    this.cargando = true;

    if ( (this._usuarioService.usuario.tipo_Usuario === 'ROOT') ||
        (this._usuarioService.usuario.tipo_Usuario === 'ADMIN') ||
        (this._usuarioService.usuario.tipo_Usuario === 'AUDITOR_LIDER') ||
        (this._usuarioService.usuario.tipo_Usuario === 'ALTA_DIRECCION')) {
      this._auditoriaService.cargarAuditorias()
          .subscribe( auditorias => {
            this.auditorias = auditorias;
            this.cargando = false;
          });
    }

    if ( this._usuarioService.usuario.tipo_Usuario === 'AUDITOR' ) {
      this._auditoriaService.cargarAuditoriasGA()
          .subscribe( auditorias => {
            this.auditorias = auditorias;
            this.cargando = false;
          });
    }

    if ( this._usuarioService.usuario.tipo_Usuario === 'AUDITADO' ) {
      this._auditoriaService.cargarAuditoriasAu()
          .subscribe( auditorias => {
            this.auditorias = auditorias;
            this.cargando = false;
          });
    }

  }

  cargarAuditoriasPlan( id: string ) {

    this.cargando = true;

    this._auditoriaService.cargarAuditoriasPlan( id )
          .subscribe( auditorias => {
            this.auditorias = auditorias;
            $('#card-acordeon > div.collapse').removeClass('show');
            $('#card-acordeon > a').attr('aria-expanded', 'false');
            this.cargando = false;
          });

  }

  // ************************************************
  // *** PLANES ***
  // ************************************************

  modalAgregar() {

    Swal.mixin({
      confirmButtonText: 'Siguiente',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      progressSteps: ['1', '2']
    }).queue([
      {
        title: 'Plan de Auditorías',
        text: 'Escribe el nombre',
        input: 'text'
      },
      {
        title: '¿Cúantas Auditorías?',
        text: 'Escoge la cantidad de Auditorías que tendrá el Plan',
        input: 'select',
        inputOptions: {
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          5: '5'
        },
      }
    ]).then((result) => {
      if ( result.value ) {
        // ************************************************
        // *** SI NO FUE CANCELADO EL FORMULARIO 1, PASA ESTO ***
        // ************************************************
        if (result.value[0] === '') {
          Swal.fire({
            title: '¡Campo Vacío!',
            text: 'El nombre del Plan de Auditorías está vacío, inténtalo de nuevo',
            type: 'error',
            animation: false,
            customClass: {
              popup: 'animated tada'
            }
          });
        } else {
          // ************************************************
          // *** AQUI SE AGREGARA EL PLAN ***
          // ************************************************
          let plan = new Plan(
            result.value[0]
          );

          this._planService.crearPlan( plan )
              .subscribe( resp => {
                let cant: any[] = [];
                let cont: any[] = [];

                if (result.value[1] === '1') {
                  cant = ['1'];
                  cont = [
                    {
                      html:
                      '<h1 style="font-weight: bold;">Auditoría 1</h1>' +
                      '<div style="display: block;">Nombre</div>' +
                      '<input id="input1" class="swal2-input">' +
                      '<div style="display: block;">Fecha Inicial</div>' +
                      '<input class="swal2-input" id="input2" type="date">' +
                      '<div style="display: block;">Fecha Final</div>' +
                      '<input class="swal2-input" id="input3" type="date">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          $('#input1').val(),
                          $('#input2').val(),
                          $('#input3').val()
                        ];
                      }
                    }
                  ];
                }
                if (result.value[1] === '2') {
                  cant = ['1', '2'];
                  cont = [
                    {
                      html:
                      '<h1 style="font-weight: bold;">Auditoría 1</h1>' +
                      '<div style="display: block;">Nombre</div>' +
                      '<input id="input1" class="swal2-input">' +
                      '<div style="display: block;">Fecha Inicial</div>' +
                      '<input class="swal2-input" id="input2" type="date">' +
                      '<div style="display: block;">Fecha Final</div>' +
                      '<input class="swal2-input" id="input3" type="date">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          $('#input1').val(),
                          $('#input2').val(),
                          $('#input3').val()
                        ];
                      }
                    },
                    {
                      html:
                      '<h1 style="font-weight: bold;">Auditoría 2</h1>' +
                      '<div style="display: block;">Nombre</div>' +
                      '<input id="input1" class="swal2-input">' +
                      '<div style="display: block;">Fecha Inicial</div>' +
                      '<input class="swal2-input" id="input2" type="date">' +
                      '<div style="display: block;">Fecha Final</div>' +
                      '<input class="swal2-input" id="input3" type="date">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          $('#input1').val(),
                          $('#input2').val(),
                          $('#input3').val()
                        ];
                      }
                    }
                  ];
                }
                if (result.value[1] === '3') {
                  cant = ['1', '2', '3'];
                  cont = [
                    {
                      html:
                      '<h1 style="font-weight: bold;">Auditoría 1</h1>' +
                      '<div style="display: block;">Nombre</div>' +
                      '<input id="input1" class="swal2-input">' +
                      '<div style="display: block;">Fecha Inicial</div>' +
                      '<input class="swal2-input" id="input2" type="date">' +
                      '<div style="display: block;">Fecha Final</div>' +
                      '<input class="swal2-input" id="input3" type="date">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          $('#input1').val(),
                          $('#input2').val(),
                          $('#input3').val()
                        ];
                      }
                    },
                    {
                      html:
                      '<h1 style="font-weight: bold;">Auditoría 2</h1>' +
                      '<div style="display: block;">Nombre</div>' +
                      '<input id="input1" class="swal2-input">' +
                      '<div style="display: block;">Fecha Inicial</div>' +
                      '<input class="swal2-input" id="input2" type="date">' +
                      '<div style="display: block;">Fecha Final</div>' +
                      '<input class="swal2-input" id="input3" type="date">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          $('#input1').val(),
                          $('#input2').val(),
                          $('#input3').val()
                        ];
                      }
                    },
                    {
                      html:
                      '<h1 style="font-weight: bold;">Auditoría 3</h1>' +
                      '<div style="display: block;">Nombre</div>' +
                      '<input id="input1" class="swal2-input">' +
                      '<div style="display: block;">Fecha Inicial</div>' +
                      '<input class="swal2-input" id="input2" type="date">' +
                      '<div style="display: block;">Fecha Final</div>' +
                      '<input class="swal2-input" id="input3" type="date">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          $('#input1').val(),
                          $('#input2').val(),
                          $('#input3').val()
                        ];
                      }
                    }
                  ];
                }
                if (result.value[1] === '4') {
                  cant = ['1', '2', '3', '4'];
                  cont = [
                    {
                      html:
                      '<h1 style="font-weight: bold;">Auditoría 1</h1>' +
                      '<div style="display: block;">Nombre</div>' +
                      '<input id="input1" class="swal2-input">' +
                      '<div style="display: block;">Fecha Inicial</div>' +
                      '<input class="swal2-input" id="input2" type="date">' +
                      '<div style="display: block;">Fecha Final</div>' +
                      '<input class="swal2-input" id="input3" type="date">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          $('#input1').val(),
                          $('#input2').val(),
                          $('#input3').val()
                        ];
                      }
                    },
                    {
                      html:
                      '<h1 style="font-weight: bold;">Auditoría 2</h1>' +
                      '<div style="display: block;">Nombre</div>' +
                      '<input id="input1" class="swal2-input">' +
                      '<div style="display: block;">Fecha Inicial</div>' +
                      '<input class="swal2-input" id="input2" type="date">' +
                      '<div style="display: block;">Fecha Final</div>' +
                      '<input class="swal2-input" id="input3" type="date">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          $('#input1').val(),
                          $('#input2').val(),
                          $('#input3').val()
                        ];
                      }
                    },
                    {
                      html:
                      '<h1 style="font-weight: bold;">Auditoría 3</h1>' +
                      '<div style="display: block;">Nombre</div>' +
                      '<input id="input1" class="swal2-input">' +
                      '<div style="display: block;">Fecha Inicial</div>' +
                      '<input class="swal2-input" id="input2" type="date">' +
                      '<div style="display: block;">Fecha Final</div>' +
                      '<input class="swal2-input" id="input3" type="date">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          $('#input1').val(),
                          $('#input2').val(),
                          $('#input3').val()
                        ];
                      }
                    },
                    {
                      html:
                      '<h1 style="font-weight: bold;">Auditoría 4</h1>' +
                      '<div style="display: block;">Nombre</div>' +
                      '<input id="input1" class="swal2-input">' +
                      '<div style="display: block;">Fecha Inicial</div>' +
                      '<input class="swal2-input" id="input2" type="date">' +
                      '<div style="display: block;">Fecha Final</div>' +
                      '<input class="swal2-input" id="input3" type="date">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          $('#input1').val(),
                          $('#input2').val(),
                          $('#input3').val()
                        ];
                      }
                    }
                  ];
                }
                if (result.value[1] === '5') {
                  cant = ['1', '2', '3', '4', '5'];
                  cont = [
                    {
                      html:
                      '<h1 style="font-weight: bold;">Auditoría 1</h1>' +
                      '<div style="display: block;">Nombre</div>' +
                      '<input id="input1" class="swal2-input">' +
                      '<div style="display: block;">Fecha Inicial</div>' +
                      '<input class="swal2-input" id="input2" type="date">' +
                      '<div style="display: block;">Fecha Final</div>' +
                      '<input class="swal2-input" id="input3" type="date">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          $('#input1').val(),
                          $('#input2').val(),
                          $('#input3').val()
                        ];
                      }
                    },
                    {
                      html:
                      '<h1 style="font-weight: bold;">Auditoría 2</h1>' +
                      '<div style="display: block;">Nombre</div>' +
                      '<input id="input1" class="swal2-input">' +
                      '<div style="display: block;">Fecha Inicial</div>' +
                      '<input class="swal2-input" id="input2" type="date">' +
                      '<div style="display: block;">Fecha Final</div>' +
                      '<input class="swal2-input" id="input3" type="date">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          $('#input1').val(),
                          $('#input2').val(),
                          $('#input3').val()
                        ];
                      }
                    },
                    {
                      html:
                      '<h1 style="font-weight: bold;">Auditoría 3</h1>' +
                      '<div style="display: block;">Nombre</div>' +
                      '<input id="input1" class="swal2-input">' +
                      '<div style="display: block;">Fecha Inicial</div>' +
                      '<input class="swal2-input" id="input2" type="date">' +
                      '<div style="display: block;">Fecha Final</div>' +
                      '<input class="swal2-input" id="input3" type="date">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          $('#input1').val(),
                          $('#input2').val(),
                          $('#input3').val()
                        ];
                      }
                    },
                    {
                      html:
                      '<h1 style="font-weight: bold;">Auditoría 4</h1>' +
                      '<div style="display: block;">Nombre</div>' +
                      '<input id="input1" class="swal2-input">' +
                      '<div style="display: block;">Fecha Inicial</div>' +
                      '<input class="swal2-input" id="input2" type="date">' +
                      '<div style="display: block;">Fecha Final</div>' +
                      '<input class="swal2-input" id="input3" type="date">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          $('#input1').val(),
                          $('#input2').val(),
                          $('#input3').val()
                        ];
                      }
                    },
                    {
                      html:
                      '<h1 style="font-weight: bold;">Auditoría 5</h1>' +
                      '<div style="display: block;">Nombre</div>' +
                      '<input id="input1" class="swal2-input">' +
                      '<div style="display: block;">Fecha Inicial</div>' +
                      '<input class="swal2-input" id="input2" type="date">' +
                      '<div style="display: block;">Fecha Final</div>' +
                      '<input class="swal2-input" id="input3" type="date">',
                      focusConfirm: false,
                      preConfirm: () => {
                        return [
                          $('#input1').val(),
                          $('#input2').val(),
                          $('#input3').val()
                        ];
                      }
                    }
                  ];
                }
                Swal.mixin({
                  confirmButtonText: 'Siguiente',
                  cancelButtonText: 'Cancelar',
                  showCancelButton: true,
                  progressSteps: cant
                }).queue(cont).then((result2) => {
                  if (result2.value) {
                    // ************************************************
                    // *** SI NO FUE CANCELADO EL FORMULARIO 2, PASA ESTO ***
                    // ************************************************

                    let vacio = false;

                    for (let i = 0; i < result2.value.length; i++) {
                      for (let j = 0; j < 3; j++) {
                        if ( result2.value[i][j] === '') {
                          vacio = true;
                        }
                      }
                    }

                    if ( vacio === true) {
                      Swal.fire({
                        title: '¡Campos Vacíos!',
                        text: 'Alguna Auditoría quedó con campos vacíos, inténtalo de nuevo',
                        type: 'error',
                        animation: false,
                        customClass: {
                          popup: 'animated tada'
                        }
                      });
                      // ************************************************
                      // *** AQUI SE ELIMINARÁ EL PLAN CREADO ***
                      // ************************************************
                      this._planService.eliminarPlanPermanente( resp._id )
                          .subscribe( resp2 => {
                            // this.cargarPlanes();
                          });
                    } else {
                      // ************************************************
                      // *** AQUI SE AGREGARAN LAS AUDITORIAS QUE SEAN NECESARIAS ***
                      // ************************************************

                      for ( let i = 0; i < result2.value.length; i++) {
                        let auditoria = new Auditoria(
                          resp.nombrePlan + '_' + result2.value[i][0],
                          result2.value[i][0],
                          [],
                          result2.value[i][1],
                          result2.value[i][2],
                          resp._id,
                          [],
                          '',
                          '',
                          ''
                        );

                        this._auditoriaService.crearAuditoria( auditoria )
                            .subscribe( resp3 => {
                              this.cargarPlanes();
                              this.cargarAuditorias();
                              Swal.fire('Auditorías Creadas', 'Enviaremos las Auditorías para su Validación', 'success');
                            });

                      }
                    }
                  } else {
                    // ************************************************
                    // *** SI FUE CANCELADO EL FORMULARIO 2, PASA ESTO ***
                    // ************************************************

                    // ************************************************
                    // *** AQUI SE ELIMINARÁ EL PLAN CREADO ***
                    // ************************************************
                    this._planService.eliminarPlanPermanente( resp._id )
                          .subscribe( resp2 => {
                            Swal.fire('Cancelado', 'Se canceló la creación de las Auditorías', 'error');
                          });
                  }
                });
              });
        }
      } else {
        // ************************************************
        // *** SI FUE CANCELADO EL FORMULARIO 1, PASA ESTO ***
        // ************************************************
        Swal.fire('Cancelado', 'Se canceló la creación del Plan de Auditorías', 'error');
      }
    });
  }

  editarPlan( plan2: Plan ) {

    Swal.fire({
      title: 'Modificar Nombre',
      text: 'Ingrese el nuevo nombre que tendrá el Plan de Auditorías',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Listo',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#e74c3c'
    }).then((result) => {
      if (result.value) {
        let plan = new Plan(
          result.value,
          plan2._id
        );
        this._planService.crearPlan( plan )
            .subscribe( resp2 => {
              this.cargarPlanes();
              this.cargarAuditorias();
            });
      } else {
        if ( result.value === undefined) {
        } else {
          Swal.fire({
            title: '¡Campo Vacío!',
            text: 'El nombre del Plan de Auditorías está vacío, inténtalo de nuevo',
            type: 'error',
            animation: false,
            customClass: {
              popup: 'animated tada'
            }
          });
        }
      }
    });

  }

  eliminarPlan( plan: Plan ) {

    Swal.fire({
      title: '¡Advertencia!',
      text: `Si eliminas el Plan "${plan.nombrePlan}" se borrarán las Auditorías asociadas. ¿Deseas continuar?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      cancelButtonColor: '#e74c3c',
      animation: false,
      customClass: {
        popup: 'animated tada'
      }
    }).then((eliminar) => {
      if (eliminar.value) {
        this._planService.eliminarAuditoriasPlan( plan._id )
          .subscribe( (resp: any) => {
          } );
        this._planService.eliminarPlan( plan._id )
            .subscribe( (resp: any) => {
              this.cargarPlanes();
              this.cargarAuditorias();
            } );
      }
    });

  }

  validarContrasenaPlan( usuario2: Usuario, plan: Plan ) {

    Swal.fire({
      title: 'Ingrese su contraseña',
      input: 'password',
      showCancelButton: true,
      confirmButtonText: 'Validar',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#e74c3c'
    }).then((result) => {
      if (result.value) {
        let usuario = new Usuario(
          usuario2.numero_Empleado,
          usuario2.nombre_Usuario,
          usuario2.numero_Empleado,
          usuario2.primer_Apellido,
          usuario2.email,
          usuario2.telefono,
          usuario2.puesto,
          result.value,
          usuario2.tipo_Usuario,
          usuario2.segundo_Apellido,
          usuario2._id
        );
        this._usuarioService.validarContrasena( usuario )
          .subscribe( resp => {
            this._planService.validarPlan( plan )
                .subscribe( resp2 => {
                  this.cargarPlanes();
                  this.cargarAuditorias();
                });
          });
      } else {
        if ( result.value === undefined) {
        } else {
          Swal.fire({
            title: '¡Campo Vacío!',
            text: 'No ingresaste ninguna contraseña, inténtalo de nuevo',
            type: 'error',
            animation: false,
            customClass: {
              popup: 'animated tada'
            }
          });
        }
      }
    });

  }

  // ************************************************
  // *** AUDITORÍAS ***
  // ************************************************

  verAuditoria( auditoria: Auditoria, plan: Plan ) {

    if ( plan.valido === true ) {

      if ( auditoria.progreso === 'empezar') {
        Swal.fire({
          title: '¡Empezar!',
          text: `¿Deseas iniciar la Auditoría "${auditoria.nombre}"?`,
          type: 'question',
          showCancelButton: true,
          confirmButtonText: 'Empezar',
          cancelButtonText: 'Cancelar',
          animation: false,
          customClass: {
            popup: 'animated bounceInDown'
          }
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['/auditoria/' + auditoria._id ]);
          }
        });
      }

      if ( auditoria.progreso === 'encurso') {
        if ( auditoria.valido === true ) {
          Swal.fire({
            title: '¡En Curso!',
            text: `La Auditoría "${auditoria.nombre}" está en curso`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ver Menú',
            cancelButtonText: 'Cancelar',
            animation: false,
            customClass: {
              popup: 'animated bounceInDown'
            }
          }).then((result) => {
            if (result.value) {
              this.router.navigate(['/menu-auditoria/' + auditoria._id ]);
            }
          });
        } else {
          if ( auditoria.pasos === 1 ) {
            this.router.navigate(['/planeacion/' + auditoria._id ]);
          } else {
            Swal.fire({
              title: '¡Advertencia!',
              text: `Sólo puedes ingresar a la Planeación hasta que validen la Auditoría "${auditoria.nombre}"`,
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Planeación',
              cancelButtonText: 'Cancelar',
              animation: false,
              customClass: {
                popup: 'animated pulse'
              }
            }).then((result) => {
              if (result.value) {
                this.router.navigate(['/planeacion/' + auditoria._id ]);
              }
            });
          }
        }
      }

      if ( auditoria.progreso === 'terminado') {
        if ( auditoria.valido === true ) {
          Swal.fire({
            title: '¡Finalizado!',
            text: `La Auditoría "${auditoria.nombre}" ha finalizado`,
            type: 'success',
            showCancelButton: true,
            confirmButtonText: 'Ver Menú',
            cancelButtonText: 'Cancelar',
            animation: false,
            customClass: {
              popup: 'animated bounceInDown'
            }
          }).then((result) => {
            if (result.value) {
              this.router.navigate(['/menu-auditoria/' + auditoria._id ]);
            }
          });
        } else {
          Swal.fire({
            title: '¡Advertencia!',
            text: `No puedes ingresar hasta que validen la Auditoría "${auditoria.nombre}"`,
            type: 'warning',
            animation: false,
            customClass: {
              popup: 'animated pulse'
            }
          });
        }
      }

    } else {

      Swal.fire({
        title: '¡Advertencia!',
        text: `No puedes ingresar hasta que validen el Plan "${plan.nombrePlan}"`,
        type: 'warning',
        animation: false,
        customClass: {
          popup: 'animated pulse'
        }
      });

    }

  }

  verAuditoriaAltaD( auditoria: Auditoria ) {

    if ( auditoria.progreso === 'encurso') {
      if ( auditoria.valido === true ) {
        Swal.fire({
          title: '¡En Curso!',
          text: `La Auditoría "${auditoria.nombre}" está en curso`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ver Menú',
          cancelButtonText: 'Cancelar',
          animation: false,
          customClass: {
            popup: 'animated bounceInDown'
          }
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['/menu-auditoria/' + auditoria._id ]);
          }
        });
      } else {
        Swal.fire({
          title: '¡Empecemos!',
          text: `Antes de validar la Auditoría "${auditoria.nombre}" verifica sus datos`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ver Planeación',
          cancelButtonText: 'Cancelar',
          animation: false,
          customClass: {
            popup: 'animated bounceInDown'
          }
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['/planeacion/' + auditoria._id]);
          }
        });
      }
    }

    if ( auditoria.progreso === 'terminado') {
      Swal.fire({
        title: '¡Finalizado!',
        text: `La Auditoría "${auditoria.nombre}" ha finalizado`,
        type: 'success',
        showCancelButton: true,
        confirmButtonText: 'Ver Menú',
        cancelButtonText: 'Cancelar',
        animation: false,
        customClass: {
          popup: 'animated bounceInDown'
        }
      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/menu-auditoria/' + auditoria._id ]);
        }
      });
    }

  }

  agregarAuditoria( plan: Plan ) {

    if ( plan.valido === true ) {
      Swal.fire({
        title: '¡Advertencia!',
        text: `Si agregas una nueva Auditoría estarías modificando el Plan y se necesitaría validación nuevamente. ¿Deseas continuar?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        animation: false,
        customClass: {
          popup: 'animated tada'
        }
      }).then((result) => {
        if (result.value) {

          // Modal
          // Se puede agregar pero se invalidará el Plan

          this.modalAgregarAuditoria( plan, true );

        }
      });
    } else {

      // Modal
      // Se puede agregar directamente

      this.modalAgregarAuditoria( plan, false );

    }

  }

  modalAgregarAuditoria( plan: Plan, invalidacion: boolean ) {

    Swal.fire({
      title: 'Nueva Auditoría',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      html:
        '<div style="display: block;">Nombre</div>' +
        '<input id="input1" class="swal2-input">' +
        '<div style="display: block;">Fecha Inicial</div>' +
        '<input class="swal2-input" id="input2" type="date">' +
        '<div style="display: block;">Fecha Final</div>' +
        '<input class="swal2-input" id="input3" type="date">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            $('#input1').val(),
            $('#input2').val(),
            $('#input3').val()
          ];
        }
    }).then(( result2 ) => {
      if (result2.value) {

        let vacio = false;

        for (let i = 0; i < 3; i++) {
          if ( result2.value[i] === '') {
            vacio = true;
          }
        }

        if ( vacio === true) {

          Swal.fire({
            title: '¡Campos Vacíos!',
            text: 'Inténtalo de nuevo',
            type: 'error',
            animation: false,
            customClass: {
              popup: 'animated tada'
            }
          });

        } else {

          let auditoria = new Auditoria(
            plan.nombrePlan + '_' + result2.value[0],
            result2.value[0],
            [],
            result2.value[1],
            result2.value[2],
            plan._id,
            [],
            '',
            '',
            ''
          );

          this._auditoriaService.crearAuditoria( auditoria )
              .subscribe( resp3 => {
                this.cargarPlanes();
                this.cargarAuditorias();
                if ( invalidacion ) {
                  Swal.fire('Auditoría Creada', 'Enviaremos las modificaciones del Plan para su Validación', 'success');
                } else {
                  Swal.fire('Auditoría Creada', '', 'success');
                }
              });

        }
      }
    });

  }

  editarAuditoria( auditoria: Auditoria ) {

    if ( auditoria.progreso === 'encurso') {
      if ( auditoria.valido === true ) {
        Swal.fire({
          title: '¡En Curso!',
          text: `Si modificas la Auditoría "${auditoria.nombre}" se necesitará que la validen de nuevo. ¿Deseas continuar?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No',
          animation: false,
          customClass: {
            popup: 'animated tada'
          }
        }).then((result) => {
          if (result.value) {
            // Se puede modificar pero se invalidará'
            this.router.navigate(['/auditoria/' + auditoria._id ]);
          }
        });
      } else {
        // Se puede modificar directamente
        this.router.navigate(['/auditoria/' + auditoria._id ]);
      }
    }

  }

  eliminarAuditoria( auditoria: Auditoria, plan: Plan ) {

    if ( auditoria.progreso !== 'terminado') {
      if ( plan.valido === true ) {
        Swal.fire({
          title: '¡En Curso!',
          text: `Si eliminas la Auditoría "${auditoria.nombre}" estarías modificando
                 el Plan y se necesitaría validación nuevamente. ¿Deseas continuar?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No',
          animation: false,
          customClass: {
            popup: 'animated tada'
          }
        }).then((result) => {
          if (result.value) {
            // Se puede eliminar pero se invalidará el Plan

            this._auditoriaService.eliminarAuditoria( auditoria._id )
                .subscribe( (resp: any) => {
                  this.cargarPlanes();
                  this.cargarAuditorias();
                } );
          }
        });
      } else {
        Swal.fire({
          title: '¡En Curso!',
          text: `¿Estás seguro de eliminar la Auditoría "${auditoria.nombre}" del Plan "${plan.nombrePlan}"?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No',
          animation: false,
          customClass: {
            popup: 'animated tada'
          }
        }).then((result) => {
          if (result.value) {
            // Se puede eliminar directamente

            this._auditoriaService.eliminarAuditoria( auditoria._id )
                .subscribe( (resp: any) => {
                  this.cargarPlanes();
                  this.cargarAuditorias();
                } );
          }
        });
      }
    }

  }

  validarContrasenaAudi( usuario2: Usuario, auditoria: Auditoria ) {

    // auditoria.pasos = 2;

    Swal.fire({
      title: 'Ingrese su contraseña',
      input: 'password',
      showCancelButton: true,
      confirmButtonText: 'Validar',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#e74c3c'
    }).then((result) => {
      if (result.value) {
        let usuario = new Usuario(
          usuario2.numero_Empleado,
          usuario2.nombre_Usuario,
          usuario2.numero_Empleado,
          usuario2.primer_Apellido,
          usuario2.email,
          usuario2.telefono,
          usuario2.puesto,
          result.value,
          usuario2.tipo_Usuario,
          usuario2.segundo_Apellido,
          usuario2._id
        );
        this._usuarioService.validarContrasena( usuario )
          .subscribe( resp => {
            this._auditoriaService.validarAuditoria( auditoria )
                .subscribe( resp2 => {
                  // this._auditoriaService.crearAuditoria( auditoria )
                  //     .subscribe( resp3 => {
                        this.cargarPlanes();
                        this.cargarAuditorias();
                      // });
                });
          });
      } else {
        if ( result.value === undefined) {
        } else {
          Swal.fire({
            title: '¡Campo Vacío!',
            text: 'No ingresaste ninguna contraseña, inténtalo de nuevo',
            type: 'error',
            animation: false,
            customClass: {
              popup: 'animated tada'
            }
          });
        }
      }
    });

  }

}
