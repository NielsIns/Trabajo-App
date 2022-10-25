import { DatePipe, getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { StorageAsistService } from 'src/app/services/storage-asist.service';
import { StorageClasesService } from 'src/app/services/storage-clases.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { v4 } from 'uuid';



@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.page.html',
  styleUrls: ['./profesor.page.scss'],
})
export class ProfesorPage implements OnInit {

  userlogin: any = UsuarioService.user_login;
  isModalOpen = false;
  comenzar_clase: boolean = false;
  isClicked: boolean = false;
  mostrar_lista_asignaturas:boolean=false;
  mostrar_lista_asistencias:boolean=false;
  isEnabled: boolean=true;

  listaIds: number[];
  elementType = 'canvas';
  value = undefined;
  asistencias: any[]=[];
  asignaturas: any[]=[];
  personas: any[]=[];
  KEY_ASISTENCIAS = 'asistencias';
  KEY_ASIGNATURAS = 'asignaturas';
  KEY_PERSONAS = 'personas';

  user:any;
  rut:string;

  usuario:any;

  asistencia = new FormGroup({
    cod_asistencia: new FormControl(),
    cod_asignatura: new FormControl(),
    horario: new FormControl(),
    alumnos: new FormControl()
  });

  constructor(private menu: MenuController, private alertController: AlertController,
    private usuarioService: UsuarioService, private storageAsist: StorageAsistService, private storageClas: StorageClasesService,
    private router:Router, private dateTime: DatePipe, private activatedRoute: ActivatedRoute, private storageService: StorageService,
    private toastController: ToastController) { }

  async ngOnInit() {
    await this.cargarAsignaturas();
    await this.cargarAsistencias();
    console.log(this.userlogin);
    this.rut = await this.activatedRoute.snapshot.paramMap.get('rut');
    this.usuario = await this.storageService.getDato(this.KEY_PERSONAS, this.rut);

    //this.user = await this.router.getCurrentNavigation().extras.state.usuario;
  }

  async cargarAsignaturas(){
    this.asignaturas = await this.storageClas.getDatos(this.KEY_ASIGNATURAS);
  }
  async cargarAsistencias(){
    this.asistencias = await this.storageAsist.getDatos(this.KEY_ASISTENCIAS);
  }

  listar_asignaturas(){
    this.isClicked = true;
    this.mostrar_listas('mostrar_lista_asignaturas');   
  }
  listar_asistencias(){
    this.isClicked = true;
    this.mostrar_listas('mostrar_lista_asistencias');   
  }

  mostrar_listas(valor:string){

    switch (valor) {
      case 'mostrar_lista_asistencias':
        this.mostrar_lista_asistencias=true;
        this.mostrar_lista_asignaturas = false;
        break;
      case 'mostrar_lista_asignaturas':
        this.mostrar_lista_asistencias=false;
        this.mostrar_lista_asignaturas = true;
        break;
      default:
        //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
        break;
    }
   }

  async anadirAsistencia(cod_asig, isOpen:boolean){
    var asistencias = await this.storageAsist.getDatos(this.KEY_ASISTENCIAS);
    /*console.log(asistencias);
    this.listaIds = [];
    asistencias.forEach(objeto => { 
     this.listaIds.push(objeto.cod_asistencia);
     });
    var id_nueva = Math.max(...this.listaIds);
    //this.asistencia.value.cod_asistencia= id_nueva+1;*/
    this.asistencia.value.cod_asistencia= v4();

    var asignaturaEncontrado = await this.storageClas.getDato(this.KEY_ASIGNATURAS,cod_asig);

    this.asistencia.value.cod_asignatura = asignaturaEncontrado;

    var date_time: any;
    this.asistencia.value.horario = new Date();
    let currentDateTime =this.dateTime.transform((new Date), 'MM/dd/yyyy h:mm:ss');
    console.log(currentDateTime);

    this.asistencia.value.alumnos = [] ;
    this.comenzar_clase = true;
    this.isModalOpen=isOpen;
    var respuesta: boolean = await this.storageAsist.agregar(this.KEY_ASISTENCIAS, this.asistencia.value);
    if (respuesta) {
      //var mensaje = 'asistencia creada agregada!';
      console.log('Asistencia creada!')
      this.claseIniciadaToast('top', 'Asistencia creada!');
      
      await this.cargarAsistencias();
    }
    

  }

  

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('main-content');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  /*comenzarAlert(isOpen:boolean) {
    this.comenzar_clase = true;
    this.isModalOpen=isOpen;
  }*/

  close_bd(isOpen: boolean){
    this.value='';
    this.isModalOpen = isOpen;
    this.isEnabled=true;

  }

  generarCodigo(){

    this.isEnabled = false;

    this.value='';
    if (this.value == '') {
      this.value = this.asistencia.value.cod_asistencia;
      console.log(this.value);
    }
  }

  async claseIniciadaToast(position: 'top' | 'middle' | 'bottom', msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: position
    });

    toast.present();

  }
}
