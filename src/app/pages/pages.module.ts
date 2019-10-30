import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PAGES_ROUTES } from './pages.routes';

import { SharedModule } from '../shared/shared.module';

import { PagesComponent } from './pages.component';

import { PipesModule } from '../pipes/pipes.module';

import { ChartsModule } from 'ng2-charts';

import { PrincipalComponent } from './principal/principal.component';
import { InstitucionComponent } from './institucion/institucion.component';
import { NormasComponent } from './normas/normas.component';
import { AccoutSettingsComponent } from './accout-settings/accout-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioComponent } from './usuarios/usuario.component';
import { ProfileComponent } from './profile/profile.component';
import { ProcesosComponent } from './procesos/procesos.component';
import { PlanesComponent } from './planes/planes.component';
import { AuditoriasComponent } from './auditorias/auditorias.component';
import { MenuAuditoriaComponent } from './menu-auditoria/menu-auditoria.component';
import { PlaneacionesComponent } from './planeaciones/planeaciones.component';
import { ListaVerificacionComponent } from './lista-verificacion/lista-verificacion.component';
import { InformeComponent } from './informe/informe.component';
import { BitacoraAccionesComponent } from './bitacora-acciones/bitacora-acciones.component';
import { PlaneacionComponent } from './planeaciones/planeacion.component';
import { ListasComponent } from './lista-verificacion/listas.component';
import { TablaComponent } from './tabla/tabla.component';


@NgModule({
    declarations: [
        // PagesComponent,
        PrincipalComponent,
        InstitucionComponent,
        NormasComponent,
        AccoutSettingsComponent,
        UsuariosComponent,
        UsuarioComponent,
        ProfileComponent,
        ProcesosComponent,
        PlanesComponent,
        AuditoriasComponent,
        MenuAuditoriaComponent,
        PlaneacionesComponent,
        ListaVerificacionComponent,
        InformeComponent,
        BitacoraAccionesComponent,
        PlaneacionComponent,
        ListasComponent,
        TablaComponent
    ],
    exports: [
        PrincipalComponent,
        InstitucionComponent,
        NormasComponent,
    ],
    imports: [
        SharedModule,
        PAGES_ROUTES,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        ChartsModule
    ]
})
export class PagesModule {}
