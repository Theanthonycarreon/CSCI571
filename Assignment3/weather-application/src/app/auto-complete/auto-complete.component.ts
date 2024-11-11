import { Component, OnInit, Input, Output, EventEmitter, input, SimpleChanges } from '@angular/core';
// import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AutoCompleteService } from '../auto-complete.service';
import { response } from 'express';

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
  //  prompt: how do I setup get city to print out to html component? - 4 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
  cityControl = new FormControl('');
  @Input() set currCity(value: string) {
    this.cityControl.setValue(value, { emitEvent: false });
  }
  @Output() citySelected = new EventEmitter<string>(); 

  @Input() clickedOut = false;

  constructor(private auto: AutoCompleteService) {}

  ngOnInit(): void {
    console.log('inside ngOnInIt()')
    this.showDropDown = true;
    this.clickedOutOfBox = false;
    this.clickedCity = false;
    this.cityControl.valueChanges.subscribe(value =>{
      if(value != null && value.length != 0){
        this.auto.getAutoComplete(value).subscribe(response =>{
          const newCities = response.predictions.map((prediction: any) => prediction.terms[0].value);
            //  prompt: how do I filter to only 1 city? - 1 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
          this.cities = newCities.filter((city: any, index: any, self: string | any[]) => self.indexOf(city) === index);
        })
      } else {
        this.cities = [];
        this.showDropDown = false;
      }
    });
      
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clickedOut'] && changes['clickedOut'].currentValue) {
      this.hideDropdown();
    }
  }
  //  prompt: how do I setup get city to print out to html component? - 3 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
  selectCity(city: string) {
    console.log('inside selectCity()')
    this.citySelected.emit(city); 
    this.cities = [];
    this.showDropDown = false;
    this.clickedCity = true;
    this.clickedOutOfBox = true;
  }

  hideDropdown() {
    console.log('inside hideDropdown()')
    this.cities = [];
    this.showDropDown = false;
    this.clickedCity = true;
    this.clickedOutOfBox = true;
  }

  showDropdown() {
    console.log('inside showDropdown()')
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
