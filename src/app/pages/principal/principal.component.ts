import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { Aviso } from '../../models/aviso.model';
import { UsuarioService, InstitucionService, SettingsService, AvisosService } from '../../services/service.index';

// declare function init_plugins();

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styles: []
})
export class PrincipalComponent implements OnInit {

  avisos: Aviso[] = [];

  usuario: Usuario;
  hora: number;
  titulo: string;

  cargando = true;

  // barChartOptions = {
  //   scaleShowVerticalLines: false,
  //   responsive: true
  // };

  // barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  // barChartType = 'bar';
  // barChartLegend = true;

  // barChartData = [
  //   {data: [65, 85, 65, 96, 45, 25, 65], label: 'Serie A'},
  //   {data: [65, 85, 65, 96, 45, 25, 65], label: 'Serie B'}
  // ];

  pieChartLabels = ['En uso', 'Libre'];
  pieChartData = [112, 400];
  pieChartType = 'pie';
  pieChartLegend = true;
  pieChartColors = [
    {
      backgroundColor: ['rgba(41, 128, 185, 1)', 'rgba(189, 195, 199, 1)'],
    },
  ];


  constructor( public _usuarioService: UsuarioService,
               public _ajustes: SettingsService,
               public _institucionService: InstitucionService,
               public _avisosService: AvisosService ) {
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit() {
    // init_plugins();

    this.hora = new Date().getHours();
    this.saludo();
    this.almacenamiento();
    this.cargarImagenesInicializar();
    this.cargarAvisos();
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

  saludo() {
    if ( this.hora >= 0  &&  this.hora < 5 ) {
      this.titulo = 'Buenas Noches';
      return;
    }
    if ( this.hora >= 5  &&  this.hora < 12 ) {
      this.titulo = 'Buenos Días';
      return;
    }
    if ( this.hora >= 12  &&  this.hora < 19 ) {
      this.titulo = 'Buenas Tardes';
      return;
    }
    if ( this.hora >= 19  &&  this.hora <= 23 ) {
      this.titulo = 'Buenas Noches';
      return;
    }
  }

  almacenamiento() {

    this._institucionService.almacenamiento()
            .subscribe( resp => {
              console.log(resp);

              let tam = resp.tamaño.dataSize + resp.tamaño.indexSize;

              this.pieChartData = [ ((tam / 1024) / 1024) , ( ((536870912 / 1024)) / 1024 - ((tam / 1024)) / 1024) ];

            });

  }

  cargarAvisos() {

    this.cargando = true;

    this._avisosService.cargarAvisos()
          .subscribe( avisos => {
            this.avisos = avisos;
            console.log(avisos);
            this.cargando = false;
          });

  }

}
