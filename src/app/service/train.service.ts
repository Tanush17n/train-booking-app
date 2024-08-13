import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer, IApiResponse, loginCustomer } from '../model/trainInterfaceClass';

@Injectable({
  providedIn: 'root'
})
export class TrainService {

  apiUrl: string = "https://freeapi.miniprojectideas.com/api/TrainApp/";

  constructor( private http: HttpClient) { }

  getAllStations(){
    return this.http.get(`${this.apiUrl}GetAllStations`)
    
  }

  getTrainsAvailable(from:number, to:number, date:string){
    return this.http.get(`${this.apiUrl}GetTrainsBetweenStations?departureStationId=${from}&arrivalStationId=${to}&departureDate=${date}`)
  }

  createNewCustomer(obj: Customer){
    return this.http.post<IApiResponse>(`${this.apiUrl}AddUpdatePassengers`, obj)
  }

  loginCustomer(obj: loginCustomer){
    return this.http.post<IApiResponse>(`${this.apiUrl}Login`, obj)
  }

  bookTrain(obj: any){
    return this.http.post<IApiResponse>(`${this.apiUrl}BookTrain`, obj)
  }
}
