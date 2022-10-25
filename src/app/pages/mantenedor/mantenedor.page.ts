import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-mantenedor',
  templateUrl: './mantenedor.page.html',
  styleUrls: ['./mantenedor.page.scss'],
})
export class MantenedorPage implements OnInit {

  //VARIABLES PARA PROBAR EL STORAGE:
  persona: any = {
    rut: '19.644.623-0',
    nom_completo: 'Christopher Bong',
    fecha_nac: '1997-12-24',
    semestre: 1,
    password: 'estudiante',
    email: 'estudiante@duocuc.cl',
    tipo_usuario: 'alumno' 
  };
  personas: any[] = [
    
  ];

  //LLAVE:
  KEY_PERSONAS = 'personas';  

  constructor(private storage: StorageService, private loadingCtrl: LoadingController) { }

  async ngOnInit() {
    await this.cargarPersonas();
  }
  
  //CARGAR TODAS LAS PERSONAS QUE VIENEN DESDE EL STORAGE:
  async cargarPersonas(){
    this.personas = await this.storage.getDatos(this.KEY_PERSONAS) || [];
  }

  async registrar(){
    var respuesta: boolean = await this.storage.agregar(this.KEY_PERSONAS, this.persona);
    if (respuesta) {
      alert('Registrado');
      await this.cargarPersonas();
    }
  }

  async eliminar(rut){
    await this.storage.eliminar(this.KEY_PERSONAS, rut);
    await this.cargando('eliminando...');
    await this.cargarPersonas();
  }

  async buscar(rut){
    this.persona = await this.storage.getDato(this.KEY_PERSONAS, rut);
  }

  async modificar(){
    await this.storage.actualizar(this.KEY_PERSONAS, this.persona);
    await this.cargando('actualizando personas...');
    await this.cargarPersonas();
  }



  //METODO DE LOADING:
  async cargando(mensaje){
    const loading = await this.loadingCtrl.create({
      message: mensaje,
      duration: 1000
    });
    loading.present();
  }

}
