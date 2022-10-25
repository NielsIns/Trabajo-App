import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  rut: string;
  usuario: any;
  correo: string;
  tipo_usuario: any;
  carrera: any;
  nombre: any;
  apellido: any;
  fecha_nac: any;

  constructor(private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService, private storage: StorageService) { }

  personas: any [] = [];
  KEY_PERSONAS= 'personas';

  async ngOnInit() {
    this.rut = this.activatedRoute.snapshot.paramMap.get('rut');
    this.usuario = await this.storage.getDato(this.KEY_PERSONAS, this.rut);
    this.correo=this.usuario.email;
    this.nombre=this.usuario.nombre;
    this.apellido=this.usuario.ap_paterno;
    this.tipo_usuario=this.usuario.tipo_usuario;
    this.carrera = this.usuario.nombre_carrera;
    this.fecha_nac=this.usuario.fecha_nac;
    console.table(this.usuario);
  }

}
