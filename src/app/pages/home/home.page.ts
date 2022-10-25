import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { StorageLoginActService } from 'src/app/services/storage-login-act.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  usuario: any;
  rut:string;
  clave: any;
  logins: any [] = [];
  KEY_LOGINS='logins';

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private usuarioService: UsuarioService,
    private storage: StorageService, private storageLoginAct: StorageLoginActService) {}

  ngOnInit(){

    this.usuario = this.router.getCurrentNavigation().extras.state.usuario;
    this.rut=this.usuario.rut;
    this.clave=this.usuario.password;
    console.log(this.usuario);
    console.log('estoy en home')
    
  }


  async logout(){
    console.log(this.rut)
    this.storageLoginAct.eliminar(this.KEY_LOGINS, this.clave)
    this.storage.logout();
  }

}
