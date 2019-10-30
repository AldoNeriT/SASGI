import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginGuardGuard,
         AbcGuard,
         UsuarioIdGuard,
         SettingsService,
         SharedService,
         SidebarService,
         InstitucionService,
         UsuarioService,
         NormaService,
         ProcesoService,
         SubprocesoService,
         PlanService,
         AuditoriaService,
         PlaneacionService,
         ListaVerificacionService,
         TablaService,
         InformeService,
         BitacoraService,
         AvisosService
        } from './service.index';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    LoginGuardGuard,
    AbcGuard,
    UsuarioIdGuard,
    SettingsService,
    SharedService,
    SidebarService,
    InstitucionService,
    UsuarioService,
    NormaService,
    ProcesoService,
    SubprocesoService,
    PlanService,
    AuditoriaService,
    PlaneacionService,
    ListaVerificacionService,
    TablaService,
    InformeService,
    BitacoraService,
    AvisosService
  ]
})
export class ServiceModule { }
