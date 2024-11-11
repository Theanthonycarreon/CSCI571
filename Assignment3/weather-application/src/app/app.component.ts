import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerResultsService } from './customer-results.service';
// 2 way binding to send data from one component and back 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  inputForm!: FormGroup;
  formSubmitted = false;
  showResults = false; 
  showFavorites = false; 
  title: any;
  street = '';
  city = '';
  state = '';
  auto_loc = false;
  latitude: number = 0;  
  longitude: number = 0; 
  address: string = '';  
  weatherData: any; 

  @Output() inputData = new EventEmitter<{auto_loc: boolean,street:string, city:string, state:string}>();

// prompt: how do I setup a responsive form in typescript? - 6 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerResultsService){
  }
  createForm() {
    this.inputForm = this.fb.group({ 
      street: [''],
      city: [''],      
      state: [''],        
      autodetect: [false] 
    });
  }

  ngOnInit(): void {
    this.createForm();
    this.showResults = false; 
    this.showFavorites = false; 
    
      
  }
  onCitySelected(city: string) {
    this.inputForm.get('city')?.setValue(city);
  }

  onClear() {
    this.showResults = false;
    this.formSubmitted = false;
    this.inputForm.get('city')?.setValue("");
    this.inputForm.reset(); 
    console.log("inside onClear()");
    console.log(this.inputForm.value);
  }
  

  
  getFavorites() {
    this.showResults = false; 
    this.showFavorites = true; 
  }

  

  onSubmit() {
    this.formSubmitted = true;
      var callbackend = false;
      if(this.inputForm.get("autodetect")?.value == true){
        callbackend = true;
        this.auto_loc = true;
      } else {
        callbackend = true;
        if(this.inputForm.get("street")?.value != ""){
          this.street = this.inputForm.get("street")?.value || '';
        } else {
          console.log("please enter street");
          callbackend = false;
        }
        if(this.inputForm.get("city")?.value != ""){
          this.city = this.inputForm.get("city")?.value || '';
        } else {
          console.log("please enter city");
          callbackend = false;
        }
        if(this.inputForm.get("state")?.value != ""){
          this.state = this.inputForm.get("state")?.value || '';
        } else {
          console.log("please enter state");
          callbackend = false;
        }
      }
      if(callbackend){
        console.log("submitting form");
        this.inputData.emit({auto_loc:this.auto_loc, street: this.street, city: this.city, state: this.state});
        this.showResults = true;
      } 
    }
 
  
}
