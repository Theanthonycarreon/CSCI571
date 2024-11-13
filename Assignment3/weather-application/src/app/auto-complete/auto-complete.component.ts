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
    console.log('inside NgOninit')
    if (this.clickedOut || this.disabled || this.formSubmitted) {
      this.hideDropdown();
      if(this.formSubmitted){
        this.cityControl.disable();
      }
    } else {
      // console.log("setting data again")
      this.cityControl.valueChanges.subscribe(value =>{
        if(value != null && value.length != 0){
          this.auto.getAutoComplete(value).subscribe(response =>{
            const newCities = response.predictions.map((prediction: any) => prediction.terms[0].value);
              //  prompt: how do I filter to only 1 city? - 1 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
            this.cities = newCities.filter((city: any, index: any, self: string | any[]) => self.indexOf(city) === index);
            console.log(newCities.length)
            if(newCities.length == 0){
              this.invalidInput = true;
            }
          })
        } else {
          // this.invalidInput = true;
          this.cities = [];
          this.showDropDown = false;
        }
      });
    }
      
  }
  ngOnChanges(changes: SimpleChanges) {
    // console.log('inside changes' this.cityControl[changes]);
    if (this.clickedOut || this.disabled || this.formSubmitted) {
      this.hideDropdown();
      if(this.formSubmitted){
        this.cityControl.disable();
      }
    }
    if(this.cities.length > 0 && this.cityControl.value == ''){
      this.invalidInput = true;
    }
    // console.log('cities' this.cities);
    // console.log('city length', this.cities.length);
    
    
  }
  onBlur(){
    console.log('inside onBlur()')
    console.log('this.cityControl.value inside OnBlur()', this.cityControl.value)
    if(this.cityControl.value == ''){
      this.invalidInput = true;
    }
    
  }

  currCityInput(){
    console.log('inside currCityInput()')
    if(this.cityControl.value == ''){
      console.log('this.cityControl.value is empty')
      this.invalidInput = true;
    }
    if(this.startedTyping && this.cityControl.value == ''){
      this.invalidInput = true;
    }
    // if(this.cities.length > 0 && this.cityControl.value == ''){
    //   this.invalidInput = true;
    // }
    this.cityChanged.emit(this.cityControl.value || undefined);
  }
  //  prompt: how do I setup get city to print out to html component? - 3 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
  selectCity(city: string) {
    this.citySelected.emit(city); 
    this.cities = [];
    this.showDropDown = false;
    this.clickedCity = true;
    this.clickedOutOfBox = true;
  }

  hideDropdown() {
    console.log('inside hideDropdown()');
    this.cities = [];
    this.showDropDown = false;
    this.clickedCity = true;
    this.clickedOutOfBox = true;
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
