import { RouterModule, Routes } from '@angular/router';

import {
    LoginGuardGuard,
    AbcGuard,
    UsuarioIdGuard
} from '../services/service.index';

import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { AccoutSettingsComponent } from './accout-settings/accout-settings.component';
import { PrincipalComponent } from './principal/principal.component';
import { InstitucionComponent } from './institucion/institucion.component';
import { UsuarioComponent } from './usuarios/usuario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NormasComponent } from './normas/normas.component';
import { ProcesosComponent } from './procesos/procesos.component';
import { PlanesComponent } from './planes/planes.component';
import { AuditoriasComponent } from './auditorias/auditorias.component';
import { MenuAuditoriaComponent } from './menu-auditoria/menu-auditoria.component';
import { PlaneacionesComponent } from './planeaciones/planeaciones.component';
import { PlaneacionComponent } from './planeaciones/planeacion.component';
import { ListaVerificacionComponent } from './lista-verificacion/lista-verificacion.component';
import { InformeComponent } from './informe/informe.component';
import { BitacoraAccionesComponent } from './bitacora-acciones/bitacora-acciones.component';
import { ListasComponent } from './lista-verificacion/listas.component';
import { TablaComponent } from './tabla/tabla.component';

const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [ LoginGuardGuard ],
        children: [
            { path: 'home', component: PrincipalComponent, data: { titulo: 'Home' } },
            { path: 'account-settings', component: AccoutSettingsComponent, data: { titulo: 'Ajustes' } },
            { path: 'perfil', component: ProfileComponent, data: { titulo: 'Mi Perfil' } },
            // Mantenimiento
            {
                path: 'institucion',
                component: InstitucionComponent,
                canActivate: [ AbcGuard ],
                data: { titulo: 'Institución' }
            },
            {
                path: 'usuarios',
                component: UsuariosComponent,
                canActivate: [ AbcGuard ],
                data: { titulo: 'Lista de Usuarios' }
            },
            {
                path: 'usuario/:id',
                component: UsuarioComponent,
                canActivate: [ UsuarioIdGuard ],
                data: { titulo: 'Usuario' }
            },
            {
                path: 'usuario/:ver/:id',
                component: UsuarioComponent,
                canActivate: [ AbcGuard ],
                data: { titulo: 'Usuario' }
            },
            {
                path: 'normas',
                component: NormasComponent,
                canActivate: [ AbcGuard ],
                data: { titulo: 'Normas' }
            },
            {
                path: 'procesos',
                component: ProcesosComponent,
                canActivate: [ AbcGuard ],
                data: { titulo: 'Procesos' }
            },
            {
                path: 'matriz',
                component: TablaComponent,
                canActivate: [ AbcGuard ],
                data: { titulo: 'Matriz del Informe' }
            },
            {
                path: 'auditoria/:id',
                component: AuditoriasComponent,
                canActivate: [ AbcGuard ],
                data: { titulo: 'Auditoría' }
            },
            {
                path: 'bitacora',
                component: BitacoraAccionesComponent,
                canActivate: [ AbcGuard ],
                data: { titulo: 'Bitácora de Acciones'}
            },
            { path: 'planes', component: PlanesComponent, data: { titulo: 'Plan de Auditorías' } },
            { path: 'menu-auditoria/:idA', component: MenuAuditoriaComponent, data: { titulo: 'Menú de Auditorias' } },
            { path: 'planeacion/:idA', component: PlaneacionesComponent, data: { titulo: 'Planeación' } },
            { path: 'planeacionA/:accion/:idA', component: PlaneacionComponent, data: { titulo: 'Planeación' } },
            { path: 'planeacionA/:accion/:idA/:idP', component: PlaneacionComponent, data: { titulo: 'Planeación' } },
            { path: 'listas/:idA', component: ListasComponent, data: { titulo: 'Listas' } },
            { path: 'listaVerificacion/:idP/:idU', component: ListaVerificacionComponent, data: { titulo: 'Lista de Verificación' } },
            { path: 'informe/:idA', component: InformeComponent, data: { titulo: 'Informe' } },
            { path: '', redirectTo: '/home', pathMatch: 'full'}
        ]
     }
];


export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
