import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ActionSheetController, IonicModule } from '@ionic/angular';

import { AdministradorPageRoutingModule } from './administrador-routing.module';

import { AdministradorPage } from './administrador.page';
import { UsuarioService } from 'src/app/services/usuario.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministradorPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    AdministradorPage
  ],
  providers: [
    UsuarioService, ActionSheetController
   ]
})
export class AdministradorPageModule {}
