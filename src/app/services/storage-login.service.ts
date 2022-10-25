import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageLoginService {

  datos : any [] = [];
  dato : any [];

  constructor(private storage : Storage) { 
    storage.create ();
  }

     //metodos del crud del storage

     async agregar (key,dato){
      this.datos = await this.storage.get(key) || [];
      
  
      this.dato = await this.getDato (key, dato.c);
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
  
    async validarUser ( email, pass){
      this.datos = await this.storage.get ("personas") || [];
      
      var usuario_login = this.datos.find(u => u.email == email && u.password == pass);
  
      
  
      return usuario_login;
      
    }

}
