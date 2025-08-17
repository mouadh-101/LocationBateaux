import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
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
import { BoatListComponent } from './components/boat-list/boat-list.component';
import { BoatDetailsComponent } from './components/boat-details/boat-details.component';
import { ImageCarouselComponent } from './components/image-carousel/image-carousel.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ReservationDetailsComponent } from './components/reservation-details/reservation-details.component';
import { MyReservationsComponent } from './components/my-reservations/my-reservations.component';
import { FavoriteBoatsComponent } from './components/favorite-boats/favorite-boats.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ChatbotModalComponent } from './components/chatbot-modal/chatbot-modal.component';
import { PaypalComponent } from './components/paypal/paypal.component';
import { PaimentListComponent } from './components/paiment-list/paiment-list.component';
import { PaimentDetailsComponent } from './components/paiment-details/paiment-details.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { BoatCalendarComponent } from './components/boat-calendar/boat-calendar.component';
import { FrontLayoutComponent } from './layouts/front-layout/front-layout.component';
import { SharedModule } from '../shared/shared.module';
import { FacebookLoginProvider, GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
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
    UserProfileComponent,
    ChatbotModalComponent,
    PaypalComponent,
    PaimentListComponent,
    PaimentDetailsComponent,
    ContactUsComponent,
    ResetPasswordComponent,
    FrontLayoutComponent,
  ],
  imports: [
    CommonModule,
    FrontOfficeRoutingModule,
    BoatCalendarComponent,
    SocialLoginModule,
    GoogleSigninButtonModule,
    SharedModule,
    FullCalendarModule,
    
  ],
  providers: [
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
  ]
})
export class FrontOfficeModule { }
