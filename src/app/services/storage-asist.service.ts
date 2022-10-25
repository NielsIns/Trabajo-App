import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageAsistService {
  datos : any [] = [];
  dato : any [];


  constructor(private storage: Storage) {
    storage.create ();
   }

   async agregar (key,dato){
    this.datos = await this.storage.get(key) || [];
    

    this.dato = await this.getDato (key, dato.cod_asistencia);
    if (this.dato == undefined) {
      this.datos.push(dato);
      await this.storage.set(key, this.datos);
      return true;
    }
    return false;
    

   } // PENDIENTE
   async getDato (key, identificador){
    this.datos = await this.storage.get (key) || [];
    this.dato = this.datos.find (asistencia => asistencia.cod_asistencia == identificador);
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
      if (value.cod_asistencia == dato) {
        this.datos.splice (index,1);
      }
    });
    await this.storage.set (key,this.datos);
    
  }
  async actualizar (key, dato) {
    this.datos = await this.storage.get (key) || [];

    var index = this.datos.findIndex (asistencia =>  asistencia.cod_asistencia == dato.cod_asistencia);
    this.datos [index] = dato ;

    console.log(index);

    await this.storage.set(key, this.datos);
  }

  async actualizarAlumnos (key, dato) {
    this.datos = await this.storage.get (key) || [];

    var index = this.datos.findIndex (asistencia =>  asistencia.cod_asistencia == dato.cod_asistencia);
    console.log(this.datos[index]);
    var asistencia = this.datos[index];
    var existe_asist = false;
    asistencia.alumnos.forEach(x => {
      if (x.rut == dato.alumnos.rut) {
        existe_asist=true;
      } 
    });

    var existe_carrera=false;
    if (dato.cod_asignatura.nombre_carrera.includes(dato.alumnos.nombre_carrera)) {
      existe_carrera=true;
    }
    console.log(dato);
    console.log(this.datos);
    console.log(asistencia);
    asistencia.alumnos.push(dato.alumnos);

    if (existe_carrera) {
      if (!existe_asist) {
        await this.storage.set(key, this.datos);
        return 'Asistencia registrada correctamente';
      } else {
        return 'Asistencia ya registrada anteriormente';
      }
    } else {
      return 'No registrado en la carrera'
    }
    

    /*this.datos [index] = dato ;

    console.log(index);*/

    
  }

  /*async validarUser ( email, pass){
    this.datos = await this.storage.get ("asignaturas") || [];
    
    var usuario_login = this.datos.find(u => u.email == email && u.password == pass);

    

    return usuario_login;
    
  }*/

}
