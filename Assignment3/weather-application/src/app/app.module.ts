import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; 

import { AppComponent } from './app.component';
import { ResultsComponent } from './results/results.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { DetailsPaneComponent } from './details-pane/details-pane.component';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AutoCompleteService } from './auto-complete.service';

@NgModule({
  declarations: [
    AppComponent,
    ResultsComponent,
    AutoCompleteComponent
  ],
  imports: [
    BrowserModule,
    FavoritesComponent,
    DetailsPaneComponent,
    ReactiveFormsModule,
  ],
  providers: [AutoCompleteService,provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent] // Main app component to bootstrap
})
export class AppModule { }

