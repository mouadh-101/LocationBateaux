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
import { MyReservationsComponent } from './components/my-reservations/my-reservations.component';
import { FavoriteBoatsComponent } from './components/favorite-boats/favorite-boats.component';
import { BoatCalendarComponent } from './components/boat-calendar/boat-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AlertComponent } from './shared/alert/alert.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ChatbotModalComponent } from './components/chatbot-modal/chatbot-modal.component';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { PaypalComponent } from './components/paypal/paypal.component';
import { PaimentListComponent } from './components/paiment-list/paiment-list.component';
import { PaimentDetailsComponent } from './components/paiment-details/paiment-details.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

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
    MyReservationsComponent,
    FavoriteBoatsComponent,
    AlertComponent,
    UserProfileComponent,
    ChatbotModalComponent,
    PaypalComponent,
    PaimentListComponent,
    PaimentDetailsComponent,
    ContactUsComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BoatCalendarComponent,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    FullCalendarModule,
    SocialLoginModule,
    GoogleSigninButtonModule
    

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('702034366364-h92rafiso21l7puiboock14h5f1cuetl.apps.googleusercontent.com')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('682257074836301')
          }
        ],
        onError: (err) => console.error(err)
      } as SocialAuthServiceConfig,
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
