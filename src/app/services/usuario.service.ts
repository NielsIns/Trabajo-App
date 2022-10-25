import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  edad_sol: any;
  mostrar_edad: any;
  static user_login: any;
  static usuarios: any[] = [
    {
      rut: '19.644.623-0',
      nom_completo: 'Christopher Bang',
      fecha_nac: '1997-12-24',
      semestre: 1,
      password: 'administrador',
      email: 'administrador@duoc.cl',
      tipo_usuario: 'administrador'
    },
    {
      rut: '20.987.310-9 ',
      nom_completo: 'Wendy Luz',
      fecha_nac: '1995-10-10',
      semestre: 5,
      password: 'wendy123',
      email: 'wendy@duoc.cl',
      tipo_usuario: 'administrador'
    },
    {
      rut: '8.665.713-9',
      nom_completo: 'Félix Lee',
      fecha_nac: '1970-03-24',
      semestre: 1,
      password: 'profesor',
      email: 'profesor@profesor.duoc.cl',
      tipo_usuario: 'profesor'
    },
    {
      rut: '18.832.931-4',
      nom_completo: 'Irene Son',
      fecha_nac: '1992-03-24',
      semestre: 1,
      password: 'irene123',
      email: 'ireneRV@duocuc.cl',
      tipo_usuario: 'alumno'
    },
    {
      rut: '18.936.605-1',
      nom_completo: 'Giselle Ríos',
      fecha_nac: '2000-08-04',
      semestre: 1,
      password: 'alumno',
      email: 'alumno@duocuc.cl',
      tipo_usuario: 'alumno'
    }
  ];

  //Variable que se encarga de si estoy o no logueado
  isAuthenticated = new BehaviorSubject (false);

  constructor(private router: Router, private storageService: StorageService) { }

  //métodos del CRUD:
  agregarUsuario(usuario): boolean{
    var registrado : boolean = false;
    if (this.obtenerUsuario(usuario.rut) == undefined) {
      console.log('hola2')
      console.log(usuario)
      UsuarioService.usuarios.push(usuario);
      registrado = true;
      return registrado ; 
    }
    return registrado;
  }

  eliminarUsuario(rut){
    
    UsuarioService.usuarios.forEach((usu, index) => {
      if(usu.rut == rut) {
        UsuarioService.usuarios.splice(index, 1);
      }
      
    });

  }

  modificarUsuario(usuario){

    var index = UsuarioService.usuarios.findIndex(usu => usu.rut == usuario.rut);
    UsuarioService.usuarios[index] = usuario;

  }

  obtenerUsuario(rut){
    return UsuarioService.usuarios.find(usuario => usuario.rut == rut);

  }
  obtenerUsuarios(){
    return UsuarioService.usuarios;
  }

  
  //Metodo customer
  //.find(u => u.email == email && u.password == pass);
  //validar rut y contraseña: método que recibe rut y password y me entrega un JSON de un usuario
  async validarEmailPassword(email, pass){
    var usuario_login = await this.storageService.validarUser(email, pass);
    if (usuario_login != undefined){
      this.isAuthenticated.next(true);
      return usuario_login;
    }
    //return this.usuarios.find(u => u.email == email && u.password == pass);
  }

  getAuth () {
    return this.isAuthenticated.value;
  }

  logout(){
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  validarEmail(email){
    return UsuarioService.usuarios.find(u => u.email == email);  
    //return this.usuarios.find(u => u.email == email);
  }



  calcularEdad(nac){
    if(nac){
      const convertAge = new Date(nac);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.mostrar_edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
      this.edad_sol = this.mostrar_edad;
      console.log(this.edad_sol);
      return this.edad_sol;
    }else{
      console.log('no entre')
    }
  }

}
