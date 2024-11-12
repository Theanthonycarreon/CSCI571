import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  street = '';
  city = '';
  state = '';
  auto_loc = false;
  clickedOut = false;
  getDifferentDataTab: string = 'results';

  @Output() inputData = new EventEmitter<{auto_loc: boolean,street:string, city:string, state:string}>();
  @Output() inTextBox = new EventEmitter<{clickedOut: boolean}>();

// prompt: how do I setup a responsive form in typescript? - 6 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerResultsService){
  }
  createForm() {
    this.inputForm = this.fb.group({ 
      street: ['', Validators.required],
      city: ['', Validators.required],      
      state: ['', Validators.required],        
      autodetect: [false] 
    });
  }

  ngOnInit(): void {
    this.createForm();
    this.showResults = false; 
    this.showFavorites = false; 
    this.clickedOut = false;
    this.inputForm.get('autodetect')?.valueChanges.subscribe((isAutoDetect: boolean) => {
      if (isAutoDetect) {
        this.inputForm.get('street')?.disable();
        this.inputForm.get('city')?.disable();
        this.inputForm.get('state')?.disable();
      } else {
        this.inputForm.get('street')?.enable();
        this.inputForm.get('city')?.enable();
        this.inputForm.get('state')?.enable();
      }
    });
    
  }

  lockFields(){
    console.log('inside lockFields()')
    this.inputForm.get('street')?.disable();
    this.inputForm.get('city')?.disable();
    // i need this to call 
    this.inputForm.get('state')?.disable();
    this.formSubmitted = true;
  }

  onCitySelected(city: string) {
    this.inputForm.get('city')?.setValue(city);
    this.inputForm.get('city')?.disable();
  }
  clickedOutOfCity() {
    this.clickedOut = true;
    this.inTextBox.emit({clickedOut: this.clickedOut});
    console.log("inside clickedOutOfCity");
  }

  onClear() {
    this.showResults = false;
    this.showFavorites = false;
    this.formSubmitted = false;
    this.inputForm.get('city')?.setValue("");
    this.inputForm.reset({ autodetect: false }); 
    console.log("inside onClear()");
    console.log(this.inputForm.value);
  }
  
  getResults(){
    console.log('inside getResults()');
    if(this.formSubmitted){
      this.showResults = true; 
      this.showFavorites = false; 
      this.getDifferentDataTab = 'results';
    }

    
  }
  
  getFavorites() {
    console.log('inside getFavorites()');
    if(this.formSubmitted){
      this.showResults = false; 
      this.showFavorites = true; 
      this.getDifferentDataTab = 'favorites';
    }
  }

  

  onSubmit() {
    this.formSubmitted = true;
      var callbackend = false;
      if(this.inputForm.get("autodetect")?.value == true){
        callbackend = true;
        this.auto_loc = true;
        this.inputForm.get('street')?.disable();
        this.inputForm.get('city')?.disable();
        this.inputForm.get('state')?.disable();
      } else {
        callbackend = true;
        this.inputForm.get('street')?.enable();
        this.inputForm.get('city')?.enable();
        this.inputForm.get('state')?.enable();
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
        this.inTextBox.emit({clickedOut: this.clickedOut});
        this.showResults = true;
      } 
    }
 
  
}
