import { Component, OnInit, Input, Output, EventEmitter, input } from '@angular/core';
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
  cities: string[] = [];

  //  prompt: how do I setup get city to print out to html component? - 4 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
  cityControl = new FormControl('');
  @Input() set currCity(value: string) {
    this.cityControl.setValue(value, { emitEvent: false });
  }
  @Output() citySelected = new EventEmitter<string>(); 

  constructor(private auto: AutoCompleteService) {}

  ngOnInit(): void {
      this.cityControl.valueChanges.subscribe(value =>{
        if(value != null && value.length != 0){
          this.auto.getAutoComplete(value).subscribe(response =>{
            this.cities = response.predictions.map((prediction: any) => prediction.terms[0].value);
          })
        } else {
          this.cities = [];
        }
      });
  }
  //  prompt: how do I setup get city to print out to html component? - 3 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
  selectCity(city: string) {
    this.cityControl.setValue(city, { emitEvent: false });
    this.citySelected.emit(city); // Emit the selected city to the parent
  }
}
