import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'administrador/:rut',
        loadChildren: () => import('../administrador/administrador.module').then( m => m.AdministradorPageModule),
      },
      {
        path: 'perfil/:rut',
        loadChildren: () => import('../perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      {
        path: 'alumno/:rut',
        loadChildren: () => import('../alumno/alumno.module').then( m => m.AlumnoPageModule)
      },
      {
        path: 'profesor/:rut',
        loadChildren: () => import('../profesor/profesor.module').then( m => m.ProfesorPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
