// historique-paiement.component.ts
import { Component, OnInit } from '@angular/core';
import { PaiementService } from '../../services/paiement.service';
import { PaiementData } from '../../interfaces/paiment-data.model';

@Component({
  selector: 'app-historique-paiement',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class HistoriquePaiementComponent implements OnInit {
  paiements: PaiementData[] = [];

  constructor(private paiementService: PaiementService) {}

  ngOnInit(): void {
    this.paiementService.getAllPaiements().subscribe({
      next: (data) => {
        this.paiements = data;
        console.log('Paiements reçus:', this.paiements);
      },
      error: (err) => console.error('Erreur API Paiements:', err)
    });
  }
}
