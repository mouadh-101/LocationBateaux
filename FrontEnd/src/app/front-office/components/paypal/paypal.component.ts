import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var paypal: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements AfterViewInit {
  paypalForm: FormGroup;
  amountToPay: string = '50.00';

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.paypalForm = this.fb.group({
      amount: ['50.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
  }

  ngAfterViewInit(): void {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        this.amountToPay = this.paypalForm.value.amount;
        return this.http
          .post(`http://localhost:8081/api/paypal/create-order?currency=USD&amount=${this.amountToPay}`, {}, { responseType: 'text' })
          .toPromise();
      },
      
    }).render('#paypal-button-container');
  }
}

