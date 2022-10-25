import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { StorageAsistService } from 'src/app/services/storage-asist.service';
import { StorageClasesService } from 'src/app/services/storage-clases.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage implements OnInit {

  userlogin: any = UsuarioService.user_login;
  isModalOpen = false;
  comenzar_clase: boolean = false;
  asistencias: any[]=[];
  asignaturas: any[]=[];
  personas: any[]=[];
  KEY_ASISTENCIAS = 'asistencias';
  KEY_ASIGNATURAS = 'asignaturas';
  KEY_PERSONAS = 'personas';
  rut: string;
  nombre: string;
  nombre_carrera: string;
  ap_paterno: string;
  usuario: any;

  asistencia_actu: any;

  cod_asistencia_alumno: any ;
  asistencia_alumno: any = false;

  asistencia = new FormGroup({
    cod_asistencia: new FormControl(),
    cod_asignatura: new FormControl(),
    horario: new FormControl(),
    alumnos: new FormControl()
  });

  constructor(private menu: MenuController, private alertController: AlertController,
    private usuarioService: UsuarioService, private storageAsist: StorageAsistService, private storageClas: StorageClasesService,
    private router:Router, private activatedRoute: ActivatedRoute , private storage: StorageService, private loadingCtrl: LoadingController) { }

  async ngOnInit() {
    await this.cargarAsignaturas();
    await this.cargarAsistencias();
    console.log(this.userlogin);
    this.rut = await this.activatedRoute.snapshot.paramMap.get('rut');
    console.log(this.rut);
    this.usuario = await this.storage.getDato(this.KEY_PERSONAS, this.rut);
    this.nombre = this.usuario.nombre;
    this.nombre_carrera = this.usuario.nombre_carrera;
    this.ap_paterno = this.usuario.ap_paterno;

    console.log(this.nombre);
    console.log(this.usuario);


  }

  async cargarAsignaturas(){
    this.asignaturas = await this.storageClas.getDatos(this.KEY_ASIGNATURAS);
  }
  async cargarAsistencias(){
    this.asistencias = await this.storageAsist.getDatos(this.KEY_ASISTENCIAS);
  }



  comenzarAlert(isOpen:boolean) {
    this.comenzar_clase = true;
    this.isModalOpen=isOpen;
  }

  close_bd(isOpen: boolean){

    this.isModalOpen = isOpen;

  }

  async verificarCodigo(){
    //var asistence = await this.storageAsist.getDatos(this.KEY_ASISTENCIAS);
    this.asistencia_actu = await this.storageAsist.getDato(this.KEY_ASISTENCIAS, this.cod_asistencia_alumno);
    if (this.asistencia_actu == undefined) {
      alert('ingrese codigo correcto');
    } else {
      
      this.asistencia_alumno = true;
      console.log(this.nombre);

      this.asistencia.setValue(this.asistencia_actu);

      console.log(this.asistencia.value);

      this.asistencia.value.alumnos = ({
        nombre: this.nombre,
        ap_paterno: this.ap_paterno,
        rut: this.rut,
        nombre_carrera: this.nombre_carrera,
        asistio: this.asistencia_alumno
      });

      /*this.asistencia_actu.controls.alumnos.value= {
        nombre: this.nombre,
        ap_paterno: this.ap_paterno,
        rut: this.rut,
        asistio: this.asistencia_alumno
      };*/

      
      var mensaje= await this.storageAsist.actualizarAlumnos(this.KEY_ASISTENCIAS, this.asistencia.value);

      this.confirmAsistAlert(mensaje);

      this.asistencia_alumno= false;
      this.cod_asistencia_alumno = undefined;
    }
    
  }

  async confirmAsistAlert(mensaje) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      header: 'Atención!',
      subHeader: mensaje,
      buttons: ['OK'],
    });
  
    await alert.present();
  }

  async cargando(mensaje){
    const loading = await this.loadingCtrl.create({
      message: mensaje,
      duration: 1000
    });
    loading.present();
  }



}
