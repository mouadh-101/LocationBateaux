import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { HeroComponent } from './components/hero/hero.component';
import { ServiceOverviewComponent } from './components/service-overview/service-overview.component';
import { BoatCardComponent } from './components/boat-card/boat-card.component';
import { FeaturedBoatComponent } from './components/featured-boat/featured-boat.component';
import { WhyChooseUsComponent } from './components/why-choose-us/why-choose-us.component';
import { PartnerComponent } from './components/partner/partner.component';
import { AuthComponent } from './components/auth/auth.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    HeroComponent,
    ServiceOverviewComponent,
    BoatCardComponent,
    FeaturedBoatComponent,
    WhyChooseUsComponent,
    PartnerComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
