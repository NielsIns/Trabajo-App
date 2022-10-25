import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageLoginActService {

  datos : any [] = [];
  dato : any [];


  constructor(private storage: Storage, private router: Router) { 
    storage.create ();
  }

  async agregar (key,dato){
    this.datos = await this.storage.get(key) || [];
    

    this.dato = await this.getDato (key, dato.clave, dato.correo);
    if (this.dato == undefined) {
      this.datos.push(dato);
      console.log(dato.clave);
      console.log(dato.correo);
      await this.storage.set(key, this.datos);
      return true;
    }
    return false;
    

   } // PENDIENTE
   async getDato (key, clave, correo){
    this.datos = await this.storage.get (key) || [];
    this.dato = this.datos.find (usu => usu.clave == clave && usu.correo == correo);
    console.log(key); 
    console.log(clave); 
    console.log(correo); 
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
      if (value.clave == dato) {
        this.datos.splice (index,1);
      }
    });
    await this.storage.set (key,this.datos);
    
  }

  async estaLogueado(){
    this.datos = await this.storage.get ("logins") || [];

    if (await this.datos != undefined){
      console.log(this.datos[0]);

      //var datPrueba=this.datos.findIndex(objLogin => objLogin.clave)

      var primerDato=this.datos[0];

      console.log(primerDato)

      return primerDato;
      /*var persona = this.logins[0];
      console.log(persona);
      var datoLogin = await this.storageLogin.getDato(this.KEY_LOGIN, persona.clave, persona.correo);
      console.log(datoLogin);
      var usuarioLoginStr = await this.storageService.validarUser(persona.correo, persona.clave);*/
    }
    
    return undefined;
  }

}
