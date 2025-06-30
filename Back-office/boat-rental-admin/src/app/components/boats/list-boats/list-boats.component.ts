import { Component, OnInit } from '@angular/core';
import { BoatService } from '../../../services/boats.service';
import { Boat } from '../../../interfaces/boats';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-boat',
  templateUrl: './list-boats.component.html',
  styleUrls: ['./list-boats.component.css']
})
export class ListBoatsComponent implements OnInit {
  boats: Boat[] = [];

  constructor(private boatService: BoatService, private router: Router) {}

  ngOnInit(): void {
    this.getBoats();
  }

  getBoats(): void {
    this.boatService.getAllBoats().subscribe(data => {
      this.boats = data;
    });
  }

 
}
