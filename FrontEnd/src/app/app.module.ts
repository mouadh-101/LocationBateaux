import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BoatListComponent } from './components/boat-list/boat-list.component';
import { BoatDetailsComponent } from './components/boat-details/boat-details.component';
import { ImageCarouselComponent } from './components/image-carousel/image-carousel.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReservationDetailsComponent } from './components/reservation-details/reservation-details.component';


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
    AuthComponent,
    BoatListComponent,
    BoatDetailsComponent,
    ImageCarouselComponent,
    ReviewsComponent,
    UserMenuComponent,
    NotFoundComponent,
    ReservationDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
