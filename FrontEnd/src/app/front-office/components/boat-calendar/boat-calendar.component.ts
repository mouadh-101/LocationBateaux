import { CommonModule } from '@angular/common';
import { Component, Input, AfterViewInit, OnChanges, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Reservation } from 'src/app/interfaces/reservation';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  selector: 'app-boat-calendar',
  templateUrl: './boat-calendar.component.html',
  styleUrls: ['./boat-calendar.component.css']
})
export class BoatCalendarComponent implements OnChanges, OnInit {

  @Input() reservations: Array<Reservation> = [];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
    editable: false,
    selectable: false,
    events: [],
    height: 'auto'
  };

  ngOnChanges(): void {
    this.loadReservedDates();
  }
  ngOnInit(): void {
    this.loadReservedDates();
  }

  loadReservedDates(): void {
    if (!this.reservations || this.reservations.length === 0) {
      this.calendarOptions = { ...this.calendarOptions, events: [] };

      return;
    }
    console.log(this.reservations);
    const events: EventInput[] = [];
    for (const res of this.reservations) {
      if (!res.date) continue;

      const date = new Date(res.date);

      if (isNaN(date.getTime())) {
        console.warn('Invalid date format:', res);
        continue;
      }
      let color = '#facc15'; // default yellow for PENDING
      if (res.status === 'ACCEPTER') color = '#ef4444'; // red
      else if (res.status === 'REJECTED') continue; // skip rejected if needed
      events.push({
        title: res.status === 'ACCEPTER' ? 'Réservé' : 'En attente',
        date: date.toISOString().split('T')[0],
        display: 'background',
        color: color
      });
    }

    this.calendarOptions = {
      ...this.calendarOptions,
      events: events
    };
  }



}