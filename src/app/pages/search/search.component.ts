import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Customer, IApiResponse, IStation, ITrains, Search } from '../../model/trainInterfaceClass';
import { TrainService } from '../../service/train.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  activatedRoute = inject(ActivatedRoute);
  searchData: Search = new Search();
  trainSrv = inject(TrainService);
  trainList: ITrains[] = [];
  stationList: IStation[] = [];
  selectedTrain?: ITrains;

  passengerDetails: any = {
    "passengerName": "",
    "age": ""
  }

  loggedData: Customer = new Customer();

  passengersList: any[] = [];

  constructor() {
    if(typeof window!== 'undefined' && typeof localStorage!== 'undefined'){
      const localData = localStorage.getItem('trainApp');
    if(localData!=null){
      this.loggedData = JSON.parse(localData);
    }
    }
    
    
    this.activatedRoute.params.subscribe((res: any) => {
      debugger;
      // assigning separately because if we do the normal way it takes as constant values and the feature MODIFY SEARCH won't work
      this.searchData.fromStationId = res.fromStationId;
      this.searchData.toStationId = res.toStationId;
      this.searchData.dateOfTravel = res.dateOfTravel;
      // this.searchData = res;
      this.getSearchTrains();
    })

  }

  ngOnInit(): void {
    this.loadAllStation();
  }


  loadAllStation() {
    this.trainSrv.getAllStations().subscribe((res: any) => {
      this.stationList = res.data;
    })
  }


  getSearchTrains() {
    this.trainSrv.getTrainsAvailable(this.searchData.fromStationId, this.searchData.toStationId, this.searchData.dateOfTravel).subscribe((res: any) => {
      debugger;
      this.trainList = res.data;
    })
  }

  open(train: ITrains) {
    this.selectedTrain = train;
    const model = document.getElementById("myBookModal");
    if (model != null) {
      model.style.display = 'block';
    }
  }

  close() {
    const model = document.getElementById("myBookModal");
    if (model != null) {
      model.style.display = 'none';
      this.passengersList = [];
    }
  }

  addPassenger() {
    const strObj = JSON.stringify(this.passengerDetails);
    const parseObj = JSON.parse(strObj);
    this.passengersList.push(parseObj);
    this.passengerDetails = {
      "passengerName": "",
      "age": ""
    }
  }

  removePassenger(){
    
  }

  bookTicket() {
    debugger;
    const bookingObj = {
      "bookingId": 0,
      "trainId": this.selectedTrain?.trainId,
      "passengerId": this.loggedData.passengerID,
      "travelDate": this.searchData.dateOfTravel,
      "bookingDate": new Date(),
      "totalSeats": 0,
      "TrainAppBookingPassengers": [] as any
    }
    bookingObj.TrainAppBookingPassengers = this.passengersList;
    bookingObj.totalSeats = this.passengersList.length;
    this.trainSrv.bookTrain(bookingObj).subscribe((res:IApiResponse) => {
      if(res.result){
        alert("booking succesful");
        this.close();
        
        
      }
      else if(bookingObj.passengerId == 0){
        alert("you need to login before booking tickets")
      }
      else{
        alert(res.message);
        
      }
    })
  }

}
