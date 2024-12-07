import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  formCleared = false;
  streetControl = new FormControl('');
  cityControl = new FormControl('');
  stateControl = new FormControl('');
  stateClickedOut = false;
  cityClickedOut = false;
  streetClickedOut = false;
  started = false;
  doneLoading = false;
  noRecordsFound = true;
  noStateInput = false;
  chosenFavoriteCityData = {};

  showProgressBar: boolean = false;
  progressWidth: number = 0;


  @Output() inputData = new EventEmitter<{auto_loc: boolean,street:string, city:string, state:string}>();
  @Output() inTextBox = new EventEmitter<{clickedOut: boolean}>();
  @Output() clearedForm = new EventEmitter<{formCleared: boolean}>();
  @Output() favoriteCity = new EventEmitter<any>();
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
    this.stateControl.setValue("no_state");
    this.formCleared = false;
    this.createForm();
    this.showResults = false; 
    this.showFavorites = false; 
    this.clickedOut = false;
    this.streetClickedOut = false;
    this.inputForm.get('autodetect')?.valueChanges.subscribe((isAutoDetect: boolean) => {
      this.showProgressBar = true;
      this.progressWidth = 0;
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
    console.log('inside ngOnInit()');
    this.started = true;
  }

  loadFavoriteCity(city:string,state:string){
    console.log('City:', city, 'State:', state); // Debugging
    this.city = city;
    this.state = state;
    this.showResults = true; 
    this.customerService.getWeatherData(false,'',city,state).subscribe(response => {
      const { latitude, longitude, address, weatherData } = response;
      this.chosenFavoriteCityData = weatherData.data?.timelines[0]?.intervals;
      // console.log('inside loadFavor() - chosenFavoriteCityData= ', this.chosenFavoriteCityData); 
      this.favoriteCity.emit({chosenData: this.chosenFavoriteCityData});
      
    });
    // this.doneLoading = true;
    //     console.log("submitting form");
    //     this.showProgressBar = true;
    //     this.progressWidth = 0;
    //     const interval = setInterval(() => {
    //       if (this.progressWidth < 100) {
    //         this.progressWidth += 10; 
    //       } else {
    //         clearInterval(interval); 
    //         this.showProgressBar = false; 
    //       }
    //     }, 500);
    //     this.favoriteCity.emit({})
  }

  noLoadBar(){
    console.log('back in app component from results component');
    // console.log('this.progressWidth(before)', this.progressWidth);
    // console.log('showProgressBar (before)', this.showProgressBar);
    // this.showProgressBar = false;
    // // this.progressWidth = 0;
    // console.log('this.progressWidth(before)', this.progressWidth);
    // console.log('showProgressBar (before)', this.showProgressBar);
  }
  lockFields(){
    // console.log('inside lockFields()')
    this.inputForm.get('street')?.disable();
    this.inputForm.get('city')?.disable();
    // i need this to call 
    this.inputForm.get('state')?.disable();
    this.formSubmitted = true;
  }

  onCitySelected(city: string) {
    this.inputForm.get('city')?.setValue(city);
    // console.log('this.inputForm.get(city)?.value = ',this.inputForm.get('city')?.value);
    // console.log('passing from autocomplete city =',city);
    // console.log('this.cityControl.value =',this.cityControl.value);
    this.inputForm.get('city')?.disable();
  }
  clickedOutOfCity() {
    this.clickedOut = true;
    this.inTextBox.emit({clickedOut: this.clickedOut});
    // console.log("inside clickedOutOfCity");
  }

  onClear() {
    this.showResults = false;
    this.showFavorites = false;
    this.formSubmitted = false;
    this.formCleared = true;
    this.showProgressBar = false;
    this.clearedForm.emit({formCleared: this.formCleared});
    this.inputForm.get('city')?.setValue("");
    this.inputForm.reset({ autodetect: false }); 
    this.stateControl.setValue('no_state');
    this.stateControl.value === 'no_state';
    // console.log('this.stateControl.value ',this.stateControl.value );
  }
  
  clickedOutStreet(){
    this.started = false;
  }
  clickedOutCity(){
    this.started = false;
  }
  clickedOutState(){
    this.started = false;
  }

  getResults(){
    console.log('inside getResults()');
    // if(this.formSubmitted){
      if(this.formSubmitted){
        this.showResults = true;
        this.showProgressBar = true;
        this.progressWidth = 0;
        const interval = setInterval(() => {
          if (this.progressWidth < 100) {
            this.progressWidth += 20; 
          } else {
            clearInterval(interval); 
            this.showProgressBar = false; 
          }
        }, 500);
      } 
      this.showFavorites = false; 
      this.getDifferentDataTab = 'results';
    // }

    
  }

  checkStateStatus(){
    if (this.stateControl.value === 'no_state' || this.stateControl.value == '') {
      this.noStateInput = true;
      return true; 
    } 
    this.noStateInput = false;
    return false;
  }


  foundNoRecords(noneFound: boolean){
    if(noneFound){
      this.noRecordsFound = true;  
    } else {
      this.noRecordsFound = false;  
    }

    

  }
  
  getFavorites() {
    if(this.noRecordsFound){
      this.noRecordsFound = true;
      this.showProgressBar = false;
      // console.log('in if  inside getFavorites()- this.noRecordsFound == ', this.noRecordsFound);
      // console.log('in if  inside getFavorites()- this.showProgressBar == ', this.showProgressBar);
    } else {
      // console.log('in else  inside getFavorites()- this.noRecordsFound == ', this.noRecordsFound);
      this.noRecordsFound = false;
      this.showProgressBar = true;
        this.progressWidth = 0;
        const interval = setInterval(() => {
          if (this.progressWidth < 100) {
            this.progressWidth += 20; 
          } else {
            clearInterval(interval); 
            this.showProgressBar = false; 
          }
        }, 500);
    }
    this.showResults = false; 
    this.showFavorites = true; 
    this.getDifferentDataTab = 'favorites';
  }

  

  onSubmit() {
    this.formSubmitted = true;
      var callbackend = false;
      // console.log("this.inputForm.get(street.value)", this.inputForm.get("street")?.value);
      // console.log("this.inputForm.get(city.value)", this.inputForm.get("city")?.value);
      // console.log("this.inputForm.get(state.value)", this.inputForm.get("state")?.value);
      // console.log("this.streetControl.value =", this.streetControl.value);
      // console.log("this.cityControl.value =", this.cityControl.value);
      // console.log("this.stateControl.value =", this.stateControl.value);
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
        console.log('street value', this.inputForm.get("street")?.value)
        if(this.streetControl.value != "" || !this.streetControl ){
          this.street = this.inputForm.get("street")?.value || '';
        } else {
          if(this.streetControl && !this.inputForm.get("city")?.value){
            this.streetControl.setValue('');
          }
          callbackend = false;
        }
        if(this.inputForm.get("city")?.value != ""){
          this.city = this.inputForm.get("city")?.value ?? '';
          this.cityControl.setValue(this.city); 
        } else {
          callbackend = false;
        }
        if(this.stateControl.value != ""){
          this.state = this.stateControl.value ?? '';
        } else {
          callbackend = false;
        }
      }
      if(callbackend){
        this.doneLoading = true;
        console.log("submitting form");
        this.showProgressBar = true;
        this.progressWidth = 0;
        const interval = setInterval(() => {
          if (this.progressWidth < 100) {
            this.progressWidth += 10; 
          } else {
            clearInterval(interval); 
            this.showProgressBar = false; 
          }
        }, 500);



        this.inputData.emit({auto_loc:this.auto_loc, street: this.street, city: this.city, state: this.state});
        this.inTextBox.emit({clickedOut: this.clickedOut});
        this.showResults = true;
      } else {
          this.noStateInput = true;
          return; 
      }
    }
  
}
