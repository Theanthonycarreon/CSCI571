import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  title: any;
// prompt: how do I setup a responsive form in typescript? - 6 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
  constructor(
    private fb: FormBuilder){
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
    console.log("inside ngOnInit()");
    
      
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
  
  getResults() {
    this.showResults = true;
    this.formSubmitted = true;
    console.log("inside getResults()");
    console.log(this.inputForm.value);

  }
  
  getFavorites() {
    
    console.log("inside getFavorites()");
    console.log(this.inputForm.value);
  }
  
  onSubmit() {
    this.formSubmitted = true;
    this.showResults = true;
      var callbackend = false;
      if(this.inputForm.get("autodetect")?.value == true){
        callbackend = true;
        console.log(this.inputForm.get("autodetect"));
      } else {
        if(this.inputForm.get("street")?.value != ""){
          callbackend = true;
          console.log(this.inputForm.get("street"))
        } else {
          console.log("please enter street");
        }
        if(this.inputForm.get("city")?.value != ""){
          callbackend = true;
          console.log(this.inputForm.get("city"))
        } else {
          console.log("please enter city");
        }
        if(this.inputForm.get("state")?.value != ""){
          callbackend = true;
          console.log(this.inputForm.get("state"))
        } else {
          console.log("please enter state");
        }
      }
      if(callbackend){
        console.log("submitting form");
        console.log(this.inputForm.value);
        // call backend here
      }
    }
 
  
}
