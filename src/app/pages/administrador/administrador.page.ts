import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import {  validate, clean, format, getCheckDigit } from 'rut.js'
import { StorageService } from 'src/app/services/storage.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';
import { StorageClasesService } from 'src/app/services/storage-clases.service';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {

  persona: any = {
    rut: '',
    nombre: '',
    ap_paterno: '',
    fecha_nac: '',
    semestre: '',
    password: '',
    email: '',
    tipo_usuario: ''
  };
  asignatu: any = {
    codigo_asig: '',
    nom_asig: '',
    sigla_asig: '',
    semestre: '',
    profesor: '',
  };


  //Formularios:
  user = new FormGroup({
    rut : new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]{1}')]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^\b[A-Z]{1}[a-z]*$/)]),
    ap_paterno: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^\b[A-Z]{1}[a-z]*$/)]),
    fecha_nac: new FormControl('', Validators.required),
    semestre: new FormControl('', [Validators.min(1), Validators.max(8)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18), Validators.pattern(/^((?!\s{1,}).)*$/)]),
    email: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(duoc|duocuc|profesor.duoc)+(?:(\\.cl))$')]),
    tipo_usuario: new FormControl(''),
    nombre_carrera: new FormControl(''),
    
  });

  asignatura = new FormGroup({
    codigo_asig : new FormControl(),
    nom_asig: new FormControl('', [Validators.required, Validators.minLength(8)]),
    sigla_asig: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(7)]),
    semestre: new FormControl('', [Validators.required, Validators.min(1), Validators.max(8)]),
    profesor: new FormControl(),
    nombre_carrera: new FormControl(),
  });
  
  //VAMOS A CREAR UNA VARIABLE PARA OBTENER LA LISTA DE USUARIOS DEL SERVICIO DE USUARIOS:
  userlogin: any ;
  usuariosSer: any = UsuarioService.usuarios;
  usuarios: any[] = [];
  verificar_password: string;
  isClicked : boolean = false;
  mostrar_lista_profesores: boolean=false;
  mostrar_lista_alumnos:boolean=false;
  mostrar_lista_administradores:boolean=false;
  mostrar_lista_asignaturas:boolean=false;
  buscar_usuario: boolean = false;
  buscar_asigna: boolean = false;
  chequeo: boolean = false;
  chequeoAsig: boolean = false;
  isModalOpen = false;
  agregar: boolean = false;
  agregarAsig: boolean = false;
  today:any;
  validoFecha: boolean = false;
  message_alert: string;
  usuario_logueado: any;
  listaIds: number[];
  asig_one: any;
  person_one:any ;
  rut: string;
  usuario: any;
  nombre_ad: string;
  nom_profesor: any;
  ap_profesor: any;
  nomcom_prof:any;
  //Arrays:
  personas: any[] = [];
  asignaturas: any[] = [];
  //Llaves:
  KEY_PERSONA = 'personas';
  KEY_ASIGNATURAS = 'asignaturas';


  constructor(private modalCtrl: ModalController,private usuarioService: UsuarioService, 
    private router: Router, public modalController: ModalController, public actionSheetController: ActionSheetController,
    private loadingCtrl: LoadingController,
    private toastController: ToastController, private alertController: AlertController, private storageService: StorageService,
    private validacionesService: ValidacionesService, private activatedRoute: ActivatedRoute, private storageClas: StorageClasesService) {
     }

     //Variables para probar Storage
  /*persona : any = {
    rut: '13233432-4',
    nombre: "Jessica Jung"
  };
  nuevaPersona: any = {
    rut : '13222333-2',
    nombre : 'Charles Chensual'
  };
  //Llave:
  KEY_PERSONA = 'personas';


  constructor( private storage: StorageService) { }

  async ngOnInit() {
    await this.storage.agregar (this.KEY_PERSONA , this.persona);
    //await this.storage.eliminar (this.KEY_PERSONA, this.persona.rut);
    await this.storage.actualizar (this.KEY_PERSONA, this.nuevaPersona);
  }*/


  async ngOnInit() {
    //this.usuario_logueado = this.router.getCurrentNavigation().extras.state.usuario;
    await this.cargarPersonas();
    await this.cargarAsignaturas();
    console.log(this.getDate())
    console.log(this.usuarios);
    this.getDate();
    this.userlogin  = await UsuarioService.user_login;
    console.log(this.userlogin);
    this.rut = await this.activatedRoute.snapshot.paramMap.get('rut');
    this.usuario = await this.storageService.getDato(this.KEY_PERSONA, this.rut);
    this.usuario.nombre = this.nombre_ad;
    /*this.variable = 'a';
    console.log(this.variable);
    console.log(this.variable);*/
  }
  
  //para validar fecha ingresada
  getDate() { 
    const date = new Date(); this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2); 
    console.log(this.today); 
  }

  async cargarPersonas(){
    this.personas = await this.storageService.getDatos(this.KEY_PERSONA);
  }

  

  

  //método del formulario
  async anadirUser(){
    var rut_user=this.validacionesService.validarRut(this.user.controls.rut.value);
    var validarEdad = this.usuarioService.calcularEdad(this.user.controls.fecha_nac.value);
    var validarFecha = this.user.controls.fecha_nac.value;
    if (this.user.controls.password.value != this.verificar_password) {
      this.message_alert= 'Las contraseñas no coinciden!';
      this.presentAlert(this.message_alert)  
      return;
    }else if (this.today <= validarFecha ) {
      this.validoFecha = true;
      console.log('entro');
      console.log(validarFecha);
      /*var split_fecha=validarFecha.split('-');
      console.log(split_fecha[0]+split_fecha[1]+split_fecha[2])*/
      this.message_alert='La fecha no puede ser posterior a hoy ';
      this.presentAlert(this.message_alert);
      return;      
    
    }else if (validarEdad <= 16) {
      this.message_alert='Edad no puede ser menor a 17 años!';
      this.presentAlert(this.message_alert);
      return;
    
    }else if (rut_user == false) {

      this.message_alert='Usuario con rut no valido!';
      this.presentAlert(this.message_alert);
      
      
      
    } else {

      console.log('aqui en booleano');
      var respuesta: boolean = await this.storageService.agregar(this.KEY_PERSONA, this.user.value);
      console.log('aqui en x');
      if (!respuesta) {
        console.log('aqui en no registrado');
        this.message_alert='Usuario ya se encuentra registrado!';
        this.presentAlert(this.message_alert);
      }else if(respuesta){
        console.log('aqui en registrado');
        this.message_alert='Usuario agregado con exito!';
        await this.cargarPersonas();
        this.presentAlert(this.message_alert);
        console.log(validarFecha)
        this.user.reset();
        this.verificar_password = '';
      }
      return;
    }
  }


  async eliminar(rutEliminar){
    await this.storageService.eliminar(this.KEY_PERSONA,rutEliminar);
    await this.cargarPersonas();
  }

  es_user: any;

  //PENDIENTE
  async buscar(rutBuscar, isOpen: boolean){
    this.isClicked = true;
    this.buscar_usuario = true;
    this.agregar = false;
    var usuarioEncontrado = await this.storageService.getDato(this.KEY_PERSONA,rutBuscar);
    console.log(usuarioEncontrado)
    this.isModalOpen = isOpen;
    this.chequeo = true;
    this.chequeoAsig = false;

    if (usuarioEncontrado != undefined) {

      this.persona = usuarioEncontrado;
      this.user.setValue(this.persona);
      this.verificar_password= this.user.value.password;
      this.es_user=usuarioEncontrado;
      
      
    }
    

   

  }



  close_bd(isOpen: boolean){
    this.limpiar();
    this.isModalOpen = isOpen;

  }



  async modificar(){
    //alert(this.alumno.value);
    //console.log(this.alumno.value);
    console.log(this.user)
    if (this.user.value.tipo_usuario == 'profesor' || this.user.value.tipo_usuario == 'administrador') {
      
      this.user.value.semestre='';
      this.user.value.nombre_carrera='';

    }
    await this.storageService.actualizar(this.KEY_PERSONA, this.user.value);
    await this.cargarPersonas()
      //arreglar verificar_password´
    this.tostadaConfirmMod('bottom')
    this.limpiar();
  }


  async limpiar(){
    this.user.reset();
    this.verificar_password='';
  }
  async limpiarAsig(){
    this.asignatura.reset();
    this.verificar_password='';
  }

  listar_profesores(){
    this.isClicked = true;
    this.mostrar_listas('mostrar_lista_profesores');   
  }
  
  listar_administradores(){
    this.isClicked = true;
    this.mostrar_listas('mostrar_lista_administradores');   
  }
  listar_alumnos(){
    this.isClicked = true;
    console.log(this.usuarios)
    this.mostrar_listas('mostrar_lista_alumnos');   
  }

  agregarUser(isOpen: boolean){
    this.user.reset()
    this.agregar = true;
    this.agregarAsig = false;
    this.buscar_asigna=false;
    this.buscar_usuario = false;
    this.isModalOpen = isOpen;
    return isOpen;   
  }

  //asignaturas y usuarios

  mostrar_listas(valor:string){

    switch (valor) {
      case 'mostrar_lista_profesores':
        this.mostrar_lista_profesores= true;
        this.mostrar_lista_alumnos=false;
        this.mostrar_lista_administradores = false;
        this.mostrar_lista_asignaturas = false;
        break;
      case 'mostrar_lista_alumnos':
        this.mostrar_lista_profesores= false;
        this.mostrar_lista_alumnos=true;
        this.mostrar_lista_administradores = false;
        this.mostrar_lista_asignaturas = false;
        break;
      case 'mostrar_lista_administradores':
        this.mostrar_lista_profesores= false;
        this.mostrar_lista_alumnos=false;
        this.mostrar_lista_administradores = true;
        this.mostrar_lista_asignaturas = false;
        break;
      case 'mostrar_lista_asignaturas':
        this.mostrar_lista_profesores= false;
        this.mostrar_lista_alumnos=false;
        this.mostrar_lista_administradores = false;
        this.mostrar_lista_asignaturas = true;
        break;
      default:
        //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
        break;
    }


    
    
  }

  //Asignaturas:

  async cargarAsignaturas(){
    this.asignaturas = await this.storageClas.getDatos(this.KEY_ASIGNATURAS);
  }

  listar_asignaturas(){
    this.isClicked = true;
    this.mostrar_listas('mostrar_lista_asignaturas');   
  }

  agregarAsignaturas(isOpen: boolean){
    this.asignatura.reset()
    this.agregarAsig = true;
    this.agregar = false;
    this.buscar_asigna=false;
    this.buscar_usuario = false;
    this.isModalOpen = isOpen;
    return isOpen;
  }

  async anadirAsignaturas(){
    const lastElement = await this.asignaturas[this.asignaturas.length - 1];
    
    /*if(lastElement != undefined){
      //this.asignatura.controls.codigo_asig.setValue(lastElement.id+1);
      //this.asignatura.setValue(lastElement.id+1);
    }
   else{
    this.asignatura.controls.codigo_asig.setValue(0);
   }*/
   //ID autoincrementable
   var asignaturas = await this.storageClas.getDatos(this.KEY_ASIGNATURAS);
   console.log(asignaturas);
   this.listaIds = [];
   asignaturas.forEach(objeto => { 
    this.listaIds.push(objeto.codigo_asig);
    });
   var id_nueva = Math.max(...this.listaIds);
   this.asignatura.value.codigo_asig=id_nueva+1;

   //obtener json profesor
   console.log(this.personas);
   console.log(this.asignatura.value.profesor);

   var persona = this.personas.filter(objeto => {
    console.log(objeto);
    console.log(this.asignatura.value.profesor.trim());
    console.log(this.asignatura.value);
    console.log(objeto.nombre+objeto.ap_paterno);
    console.log(this.asignatura.value.profesor.trim());

    if ((objeto.nombre+' '+objeto.ap_paterno) == this.asignatura.value.profesor.trim()) {
      console.log('hola');
    }
    return (objeto.nombre+' '+objeto.ap_paterno) == this.asignatura.value.profesor.trim();
   })[0];
   console.log(persona);
   this.asignatura.value.profesor= {
    nombre: persona.nombre,
    ap_paterno: persona.ap_paterno,
    rut: persona.rut
   };
   

   var respuesta: boolean = await this.storageClas.agregar(this.KEY_ASIGNATURAS, this.asignatura.value);
   if (respuesta) {
     this.presentAlert('Asignatura agregada!');
     await this.cargarAsignaturas();
   }

  }

  es_asig: any;

  async buscarAsig(codBuscar, isOpen: boolean){
    this.isClicked = true;
    this.buscar_asigna = true;
    this.agregar = false;
    var asignaturaEncontrado = await this.storageClas.getDato(this.KEY_ASIGNATURAS,codBuscar);
    console.log(asignaturaEncontrado)
    this.isModalOpen = isOpen;
    this.chequeo = false;
    this.chequeoAsig = true;

    if (asignaturaEncontrado != undefined) {
      this.asignatu=asignaturaEncontrado;
      console.log(this.asignatu)

      this.nom_profesor=this.asignatu.profesor.nombre;
      this.ap_profesor=this.asignatu.profesor.ap_paterno;
      this.nomcom_prof=this.nom_profesor+' '+this.ap_profesor;
      
      

      this.asignatura.setValue(this.asignatu);
      
      
      
      this.es_asig=asignaturaEncontrado;
      
      
    }
    

   

  }

  async eliminarAsig(codAsigEliminar){
    await this.storageClas.eliminar(this.KEY_ASIGNATURAS,codAsigEliminar);
    await this.cargarAsignaturas();
    console.log(codAsigEliminar);
  }

  async modificarAsig(){
    //alert(this.alumno.value);
    //console.log(this.alumno.value);
    var persona = this.personas.filter(objeto => {
      console.log(objeto);
      console.log(this.asignatura.value.profesor.trim());
      console.log(this.asignatura.value);
      console.log(objeto.nombre+objeto.ap_paterno);
      console.log(this.asignatura.value.profesor.trim());
  
      if ((objeto.nombre+' '+objeto.ap_paterno) == this.asignatura.value.profesor.trim()) {
        console.log('hola');
      }
      return (objeto.nombre+' '+objeto.ap_paterno) == this.asignatura.value.profesor.trim();
     })[0];
     console.log(persona);
     this.asignatura.value.profesor= {
      nombre: persona.nombre,
      ap_paterno: persona.ap_paterno,
      rut: persona.rut
     };
    await this.storageClas.actualizar(this.KEY_ASIGNATURAS, this.asignatura.value);
      //arreglar verificar_password´
    this.tostadaConfirmModAsig('bottom')
    this.limpiarAsig();
  }


  async testeoSheet(rutUser) {
    const actionSheet = await this.actionSheetController.create({
      header: '¿Eliminar Usuario?',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Si',
        id: 'delete-button',
        icon: 'trash',
        handler: () => {
          this.eliminar(rutUser);
          this.tostadaConfirma('top');
          
        }
      }, {
        text: 'No',
        icon: 'caret-back-outline',
        handler: () => {
          console.log('No clicked');
          this.tostadaDesConfirma('top');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }
  async asigSheet(codAsig) {
    const actionSheet = await this.actionSheetController.create({
      header: '¿Eliminar Asignatura?',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Si',
        id: 'delete-button',
        icon: 'trash',
        handler: () => {
          this.eliminarAsig(codAsig);
          console.log(codAsig);
          this.tostadaConfirmaAsig('top');
          
        }
      }, {
        text: 'No',
        icon: 'caret-back-outline',
        handler: () => {
          console.log('No clicked');
          this.tostadaDesConfirmaAsig('top');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }
//
async tostadaConfirma(position: 'top' | 'middle' | 'bottom') {
  const toast = await this.toastController.create({
    message: 'Usuario eliminado correctamente!',
    duration: 5000,
    position: position
  });
  toast.present();
}
async tostadaConfirmaAsig(position: 'top' | 'middle' | 'bottom') {
  const toast = await this.toastController.create({
    message: 'Asignatura eliminada correctamente!',
    duration: 5000,
    position: position
  });
  toast.present();
}
async tostadaDesConfirma(position: 'top' | 'middle' | 'bottom') {
  const toast = await this.toastController.create({
    message: 'El usuario no ha sido eliminado',
    duration: 5000,
    position: position
  });
  toast.present();
}
async tostadaDesConfirmaAsig(position: 'top' | 'middle' | 'bottom') {
  const toast = await this.toastController.create({
    message: 'La asignatura no ha sido eliminada',
    duration: 5000,
    position: position
  });
  toast.present();
}
async tostadaConfirmMod(position: 'top' | 'middle' | 'bottom') {
  const toast = await this.toastController.create({
    message: 'El usuario ha sido modificado con exito!',
    duration: 5000,
    position: position
  });
  toast.present();
}
async tostadaConfirmModAsig(position: 'top' | 'middle' | 'bottom') {
  const toast = await this.toastController.create({
    message: 'La asignatura ha sido modificada con exito!',
    duration: 5000,
    position: position
  });
  toast.present();
}

async presentAlert(mensaje_a) {
  const alert = await this.alertController.create({
    cssClass: 'custom-alert',
    header: 'Atención!',
    subHeader: mensaje_a,
    buttons: ['OK'],
  });

  await alert.present();
}


}

