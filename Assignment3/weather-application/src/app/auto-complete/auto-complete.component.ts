import { Component, OnInit, Input, Output, EventEmitter, input, SimpleChanges } from '@angular/core';
// import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AutoCompleteService } from '../auto-complete.service';
import { response } from 'express';
import { color } from 'highcharts';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrl: './auto-complete.component.css'
})
export class AutoCompleteComponent implements OnInit{
  // @Input() currCity?: string;
  cities: string[] = [];
  showDropDown = false;
  cityClicked = '';
  clickedOutOfBox = false;
  clickedCity = false;
  startedTyping = false;
  //  prompt: how do I setup get city to print out to html component? - 4 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
  cityControl = new FormControl('');
  invalidInput = false;
  @Input() set currCity(value: string) {
    this.cityControl.setValue(value, { emitEvent: false });
  }
  @Output() citySelected = new EventEmitter<string>(); 
  @Output() cityChanged = new EventEmitter<string>();

  @Input() clickedOut = false;
  @Input() disabled = false;
  @Input() formSubmitted = false;

  constructor(private auto: AutoCompleteService) {}

  ngOnInit(): void {
    this.showDropDown = true;
    this.clickedOutOfBox = false;
    this.clickedCity = false;
    if (this.clickedOut || this.disabled || this.formSubmitted) {
      this.hideDropdown();
      if(this.formSubmitted){
        this.cityControl.disable();
      }
    } else {
      this.cityControl.valueChanges.subscribe(value =>{
        if(value != null && value.length != 0){
          this.auto.getAutoComplete(value).subscribe(response =>{
            const newCities = response.predictions.map((prediction: any) => prediction.terms[0].value);
              //  prompt: how do I filter to only 1 city? - 1 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
            this.cities = newCities.filter((city: any, index: any, self: string | any[]) => self.indexOf(city) === index);
          })
        } else {
          this.hideDropdown();
        }
      });
    }
      
  }
  
  onBlur(city: string){
    console.log('city string =', city);
    console.log('in OnBlur');
    this.cityChanged.emit(city || undefined);
    if(!this.startedTyping && !this.invalidInput){
      this.startedTyping = true;
      this.invalidInput = true;
    } else if(this.startedTyping && this.cityControl.value == ''){
      this.invalidInput = true;
    } else if(this.startedTyping && this.cityControl.value != '' && this.invalidInput){
      // this.cityChanged.emit(city || undefined);  
    } else {
      // this.cityChanged.emit(city || undefined);  
    }
    
  
    
  }

  currCityInput(){
    this.cityChanged.emit(this.cityControl.value || undefined);
    if(this.cityControl.value == ''){
      this.invalidInput = true;
    }
    if(this.startedTyping && this.cityControl.value == ''){
      this.invalidInput = true;
    } else if(this.cityControl.value != ''){
      this.invalidInput = false;
    }
    this.cityChanged.emit(this.cityControl.value || undefined);
  }
  //  prompt: how do I setup get city to print out to html component? - 3 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
  selectCity(city: string) {
    console.log('Selected city:', city);

  this.cityControl.setValue(city); // Update the cityControl value
  this.citySelected.emit(city); // Emit the selected city to the parent component

  this.showDropDown = false; // Hide the dropdown
  this.cities = []; // Clear the city list
  this.invalidInput = false; 
    // console.log('cities length', this.cities.length)
    // this.cityControl.setValue(city); 
    // this.citySelected.emit(city); 
    // this.cities = [];
    // this.showDropDown = false;
    // this.clickedCity = true;
    // this.clickedOutOfBox = true;
    // this.invalidInput = false;
    // this.hideDropdown();
    // this.cities = [];
    
  }

  hideDropdown() {
    console.log('Hiding dropdown');
    this.showDropDown = false;
    this.cities = [];
  }

  showDropdown() {
    console.log("inside showDropdown()")
    this.showDropDown = true;
    this.clickedOutOfBox = false;
    this.cityControl.valueChanges.subscribe(value =>{
      if(value != null && value.length != 0){
        this.auto.getAutoComplete(value).subscribe(response =>{
          const newCities = response.predictions.map((prediction: any) => prediction.terms[0].value);
          this.cities = newCities.filter((city: any, index: any, self: string | any[]) => self.indexOf(city) === index);
        })
      } else {
        this.cities = [];
        this.showDropDown = true;
      }
    });
  }

}
