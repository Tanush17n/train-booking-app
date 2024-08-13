import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Customer, IApiResponse, loginCustomer } from './model/trainInterfaceClass';
import { FormsModule } from '@angular/forms';
import { TrainService } from './service/train.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  registerObj: Customer = new Customer();
  loginObj: loginCustomer = new loginCustomer();
  trainSrv = inject(TrainService);
  loggedUser: Customer = new Customer();


  // constructor(){
  //   const loggedData = localStorage.getItem('trainApp');
  //   if(loggedData != null){
  //     this.loggedUser = JSON.parse(loggedData);
  //   }
  // }

  constructor() {
    
    
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const loggedData = localStorage.getItem('trainApp');
      if (loggedData != null) {
        this.loggedUser = JSON.parse(loggedData);
      }
    }
  }
  


  openRegister(){
    const model = document.getElementById("registerModel");
    if(model != null){
      model.style.display = 'block';
    } 
  }

  openLogin(){
    const model = document.getElementById("loginModel");
    if(model != null){
      model.style.display = 'block';
    } 
  }

  closeRegister(){
    const model = document.getElementById("registerModel");
    if(model != null){
      model.style.display = 'none';
    } 
  }

  closeLogin(){
    const model = document.getElementById("loginModel");
    if(model != null){
      model.style.display = 'none';
    } 
  }

  onRegister(){
    this.trainSrv.createNewCustomer(this.registerObj).subscribe((res:IApiResponse) => {
      if(res.result){
        alert("Registration succesful");
        this.closeRegister();
      }
      else{
        alert(res.message);
      }
    })
  }

  onLogin(){
    this.trainSrv.loginCustomer(this.loginObj).subscribe((res:IApiResponse) =>{
      if(res.message){
        alert("login succesful");
        localStorage.setItem('trainApp', JSON.stringify(res.data));
        this.loggedUser = res.data;
        this.closeLogin();
        this.loginObj.phone = '';
        this.loginObj.password = '';
        
      }
      else{
        alert(res.message);
      }
    })
  }

  logOff(){
    const isLogOut = confirm("are you sure you want to logOut")
    if(isLogOut){
      this.loggedUser = new Customer();
      localStorage.removeItem('trainApp');
    }
    
  }



}
