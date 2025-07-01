import { Component, OnInit } from '@angular/core';
import { AlertService, AlertMessage } from '../../services/alert.service';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  alert: AlertMessage | null = null;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.alerts$.subscribe(alert => this.alert = alert);
  }

  close() {
    this.alertService.clearAlert();
  }
}
