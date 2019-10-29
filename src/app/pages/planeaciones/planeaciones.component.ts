import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlaneacionService, AuditoriaService, UsuarioService, InstitucionService } from '../../services/service.index';
import { Planeacion } from '../../models/planeacion.model';
import { Institucion } from '../../models/institucion.model';
import { Router, ActivatedRoute } from '@angular/router';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import Swal from 'sweetalert2';
import * as $ from 'jquery';

// declare function init_plugins();

@Component({
  selector: 'app-planeaciones',
  templateUrl: './planeaciones.component.html',
  styles: []
})
export class PlaneacionesComponent implements OnInit {

  planeaciones: any[] = [];
  institucion: any[] = [];

  id: string;
  arrFechasT: any[] = [];
  arrFechas: any[] = [];

  arrProActCriV: any[] = [];

  cargando = true;

  nombreV: string;
  objetivosV: string;
  alcanceV: string;
  normasV: string;

  constructor( public _planeacionService: PlaneacionService,
               public _auditoriaService: AuditoriaService,
               public _usuarioService: UsuarioService,
               public _institucionService: InstitucionService,
               public router: Router,
               public activatedRoute: ActivatedRoute ) {
    activatedRoute.params.subscribe( params => {
      this.id = params['idA'];
    });
  }

  ngOnInit() {
    // init_plugins();

    this.cargarPlaneacionesAudi( this.id );
    this.cargarAuditoria( this.id );
    this.cargarInstitucion();
  }

  regresar() {
    this.router.navigate(['/planes']);
  }

  cargarInstitucion() {
    this.cargando = true;

    this._institucionService.cargarInstituciones()
          .subscribe( instituciones => {
            this.institucion = instituciones.instituciones;
            // console.log('Institucion: ', this.institucion);
            this.cargando = false;
          });
  }

  cargarPlaneacionesAudi( id: string ) {

    this.arrFechasT = [];
    this.arrFechas = [];

    this.cargando = true;

    this._planeacionService.cargarPlaneacionesAudi( id )
        .subscribe( planeaciones => {
          this.planeaciones = planeaciones;
          // console.log('Planeaciones: ', this.planeaciones);

          // Se extraen las fechas a un array
          for ( let pl of planeaciones) {
            this.arrFechasT.push(pl.fecha);

            // Arreglo Procesos, Actividad, Criterio
            let array: any[] = [];
            if ( pl.proceso.nombreProceso ) {
              array.push(pl.proceso.nombreProceso);
            }
            if ( pl.actividad ) {
              array.push(pl.actividad);
            }
            if ( pl.criterio ) {
              array.push(pl.criterio);
            }

            this.arrProActCriV.push(array.join(', '));

          }

          // console.log('Planeaciones Audi', this.arrProActCriV);

          // console.log(this.arrProActCriV);

          // Se eliminas duplicados
          for ( let i = 0; i < this.arrFechasT.length; i++ ) {
            for ( let j = 0; j < this.arrFechasT.length - 1; j++ ) {
              if ( i !== j ) {
                if ( this.arrFechasT[i] === this.arrFechasT[j] ) {
                  // eliminamos su valor
                  this.arrFechasT[i] = '';
                }
              }
            }
          }

          // Se crean el nuevo array de fechas sin los duplicados
          for ( let fech of this.arrFechasT) {
            if ( fech !== '') {
              this.arrFechas.push(fech);
            }
          }

          // Ordenamos el array
          // this.arrFechas.sort();

          this.cargando = false;

        });

  }

  cargarAuditoria( id: string ) {

    this.cargando = true;

    this._auditoriaService.cargarAuditoria( id )
          .subscribe( auditoria => {
            this.objetivosV = auditoria.objetivos;
            this.alcanceV = auditoria.alcance;
            this.nombreV = auditoria.nombre;

            let arrNormasV: any[] = [];
            for ( let nor of  auditoria.normas) {
              arrNormasV.push(nor.nombreNorma);
            }

            this.normasV = arrNormasV.join(', ');

            this.cargando = false;

          });

  }

  redirigirNuevo() {
    this.router.navigate(['/planeacionA/n/' + this.id]);
  }

  cambiarEnviar() {

    this._planeacionService.cambiarEnviar( this.id )
          .subscribe( resp => {
            this.cargarPlaneacionesAudi( this.id );
            this.cargarAuditoria( this.id );
          });

  }

  eliminarPlaneacion( planeacion: Planeacion ) {

    Swal.fire({
      title: '¡Advertencia!',
      text: `¿Estás seguro de eliminar esta fila?`,
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
        this._planeacionService.eliminarPlaneacion( planeacion._id )
            .subscribe( (resp: any) => {
              this.cargarPlaneacionesAudi( this.id );
              this.cargarAuditoria( this.id );
            } );
      }
    });

  }

  imprimir( opcion: number) {
    let tablas = [];

    let arrBody = [];

    let arrFilas = [];

    let arrAuditores = [];

    for (let index = 0; index < this.arrFechas.length; index++) {
      arrFilas.push([]);
    }

    //Ciclo para crear las fechas y tablas dependiendo de la planeacion
    for (let index = 0; index < this.arrFechas.length; index++) {
      arrFilas[index].push([
        { text: 'HORARIO', fillColor: '#dddddd', alignment: 'center', fontSize: 9, colSpan: 1, style: 'tableHeader' }, 
        { text: 'PROCESO / ACTIVIDAD-REQUISITO / CRITERIO', fillColor: '#dddddd', alignment: 'center', fontSize: 9, colSpan: 1, style: 'tableHeader' }, 
        { text: 'AUDITOR(ES)', fillColor: '#dddddd', alignment: 'center', fontSize: 9, colSpan: 1, style: 'tableHeader' }, 
        { text: 'PARTICIPANTES', fillColor: '#dddddd', alignment: 'center', fontSize: 9, colSpan: 1, style: 'tableHeader' }, 
        { text: 'CONTACTO', fillColor: '#dddddd', fontSize: 9, alignment: 'center', colSpan: 1, style: 'tableHeader' }, 
        { text: 'ÁREA / SITIO', fillColor: '#dddddd', alignment: 'center', fontSize: 9, colSpan: 1, style: 'tableHeader' }
      ]);

      for (let j = 0; j < this.planeaciones.length; j++) {

        arrAuditores = [];

        for (let k = 0; k < this.planeaciones[j].auditores.length; k++) {
          let nombre = this.planeaciones[j].auditores[k].nombre;
          let pA = this.planeaciones[j].auditores[k].primer_Apellido;
          let sA = this.planeaciones[j].auditores[k].segundo_Apellido || '' ;


          arrAuditores.push(`${nombre} ${pA} ${sA}`);
        }

        if ( this.arrFechas[index] === this.planeaciones[j].fecha) {
          arrFilas[index].push([
            { text: this.planeaciones[j].horario, fontSize: 8, colSpan: 1, style: 'contenido' },
            { text: this.arrProActCriV[j], fontSize: 8, colSpan: 1, style: 'tableHeader' }, 
            { text: arrAuditores.join(', '), fontSize: 8, colSpan: 1, style: 'contenido' },
            { text: this.planeaciones[j].participantes, fontSize: 8, colSpan: 1, style: 'contenido' },
            { text: this.planeaciones[j].contacto, fontSize: 8, colSpan: 1, style: 'contenido' },
            { text: this.planeaciones[j].area, fontSize: 8, colSpan: 1, style: 'contenido' }
          ]);
        }
      }

      arrBody.push(
        arrFilas[index]
      );
      tablas.push({ text: [ 'FECHA: ', {text: this.arrFechas[index], bold: false}], margin: [35, 20, 0, 0], style: 'tableHeader' }, {
        style: 'tableExample',
        table: {
            //widths: [50, 200, 80, 80, 'auto', 'auto'],
            widths: [50, 150, 70, 70, 70, 'auto'],
            body: arrBody[index],

        }
      });

    }


    var docPlaneacion = {
      content: [{
        style: 'titulo',
        table: {
            heights: [50],
            widths: [498],
            body: [
                [{ text: 'PLAN DE AUDITORIA PARA EL SGI DEL G3', color: 'gray', margin: [10, 15, 10, 10], alignment: 'center' }]
            ]
          }
        },
        {
            style: 'tableExample',
            color: '#444',
            table: {
                widths: ['auto', 305, 'auto', 'auto'],
                body: [
                    [{ text: 'Institución:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: this.institucion[0].nombreInstitucion, fontSize: 8, colSpan: 3, style: 'contenido' }, ' ', ' '],
                    [{ text: 'Norma de Referencia:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: this.normasV, fontSize: 8, colSpan: 3, style: 'contenido' }, ' ', ' '],
                    [{ text: 'Domicilio:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: this.institucion[0].domicilio, fontSize: 8, colSpan: 1, style: 'contenido' }, { text: 'Idioma:', fontSize: 10, colSpan: 1, style: 'tableHeader', alignment: 'center' }, { text: 'Español', fontSize: 10, colSpan: 1, style: 'tableHeader', alignment: 'center' }],
                    [{ text: 'Objetivo:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: this.objetivosV, fontSize: 8, colSpan: 1, style: 'contenido' }, { text: 'NACE:', fontSize: 10, colSpan: 1, style: 'tableHeader', alignment: 'center' }, { text: '37', fontSize: 10, colSpan: 1, style: 'tableHeader', alignment: 'center' }],
                    [{ text: 'Alcance:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: this.alcanceV, fontSize: 8, colSpan: 3, style: 'contenido' }, ' ', ' '],
                ]
            }
        },
        tablas,
        {
            style: 'firma',
            table: {
                widths: ['auto', 'auto', 'auto'],
                headerRows: 1,
                body: [
                    [' ', { text: ' ', fontSize: 10, alignment: 'center', colSpan: 1, style: 'tableHeader' }, ''],
                    [' ', { text: 'Nombre y Firma del l(a) Auditor (a)Lider', fontSize: 8, alignment: 'center', colSpan: 1 }, ''],
                ]
            },
            layout: 'lightHorizontalLines'
        },
      ],
      styles: {
        header: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 10]
          },
        subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
        tableExample: {
            bold: true,
            fontSize: 11,
            margin: [5, 5, 0, 15]
          },
        titulo: {
            bold: true,
            fontSize: 20,
            margin: [5, 5, 5, 25]
          },
        firma: {
            margin: [170, 300, 0, 15]
          },
        tableHeader: {
          bold: true,
            color: 'black'
          },
          contenido: {
           color: 'black'
            },
        tableHeader2: {
            bold: true,
            widths: [100, 220, 38, 50],
            color: 'black'
        }
      }
    };

    if ( opcion === 1 ) {
      pdfMake.createPdf(docPlaneacion).download('planeacion.pdf');
    }
    if ( opcion === 2 ) {
      pdfMake.createPdf(docPlaneacion).open();
    }
    if ( opcion === 3 ) {
      pdfMake.createPdf(docPlaneacion).print();
    }

  }

}
