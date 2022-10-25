import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  //variables a utilizar
  datos : any [] = [];
  dato : any [];

  isAuthenticated = new BehaviorSubject (false);

  constructor(private storage : Storage, private router:Router) {
    storage.create ();
   }

   //metodos del crud del storage

   async agregar (key,dato){
    this.datos = await this.storage.get(key) || [];
    

    this.dato = await this.getDato (key, dato.rut);
    if (this.dato == undefined) {
      this.datos.push(dato);
      await this.storage.set(key, this.datos);
      return true;
    }
    return false;
    

   } // PENDIENTE
   async getDato (key, identificador){
    this.datos = await this.storage.get (key) || [];
    this.dato = this.datos.find (persona => persona.rut == identificador);
    console.log(key); 
    console.log(identificador); 
    console.log(this.datos); 

    return this.dato;
    
  }
  async getDatos (key): Promise<any[]>{
    this.datos = await this.storage.get (key) || [];
    
    return this.datos
    
  }
   async eliminar (key , dato){
    this.datos = await this.storage.get (key) || [];
    this.datos.forEach ((value, index) => {
      if (value.rut == dato) {
        this.datos.splice (index,1);
      }
    });
    await this.storage.set (key,this.datos);
    
  }
  async actualizar (key, dato) {
    this.datos = await this.storage.get (key) || [];

    var index = this.datos.findIndex (persona => persona.rut == dato.rut);
    console.log(this.datos);
    console.log(dato);
    console.log(index);
    this.datos [index] = dato ;

   await this.storage.set(key, this.datos);
  }

  

  getAuth () {
    return this.isAuthenticated.value;
  }

  logout(){
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  async validarUser ( email, pass){
    this.datos = await this.storage.get ("personas") || [];
    
    var usuario_login = this.datos.find(u => u.email == email && u.password == pass);

    if (usuario_login != undefined) {
      console.log(usuario_login.correo)
      //PARA CAMBIAR EL VALOR A UN BehaviorSubject SE UTILIZA EL METODO .next(valor);
      
      this.isAuthenticated.next(true);
      return usuario_login;
    }

    
  }

  async validarEmail(email){
    this.datos = await this.storage.get ("personas") || [];
    return this.datos.find(u => u.email == email);  
    //return this.usuarios.find(u => u.email == email);
  }
  
}
