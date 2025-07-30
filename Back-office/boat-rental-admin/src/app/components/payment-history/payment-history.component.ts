import { Component, OnInit } from '@angular/core';
import { PaiementService } from '../../services/paiement.service';
import { PaiementData } from '../../interfaces/paiment-data.model';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-historique-paiement',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class HistoriquePaiementComponent implements OnInit {
  paiements: PaiementData[] = [];

  totalAcceptes: number = 0;
  totalEnAttente: number = 0;
  totalRefuser: number = 0;
  montantTotal: number = 0;

  constructor(private paiementService: PaiementService) {}

  ngOnInit(): void {
    this.paiementService.getAllPaiements().subscribe({
      next: (data) => {
        this.paiements = data;
        this.calculerStatistiques();
      },
      error: (err) => console.error('Erreur API Paiements:', err)
    });
  }

  calculerStatistiques(): void {
    this.totalAcceptes = this.paiements.filter(p => p.status === 'ACCEPTER').length;
    this.totalEnAttente = this.paiements.filter(p => p.status === 'EN_ATTENTE').length;
    this.totalRefuser = this.paiements.filter(p => p.status === 'REFUSER').length;
    this.montantTotal = this.paiements
      .filter(p => p.status === 'ACCEPTER')
      .reduce((acc, p) => acc + (p.montant || 0), 0);
  }

   exportPDF(): void {
    const doc = new jsPDF.default();
    doc.setFontSize(18);
    doc.text('Historique des paiements', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Client', 'Bateau', 'Date', 'Méthode', 'Montant', 'Statut']],
      body: this.paiements.map(p => [
        p.reservation?.utilisateur?.name || 'N/A',
        p.reservation?.bateau?.nom || 'N/A',
        new Date(p.datePaiement).toLocaleString(),
        p.methode,
        `${p.montant.toFixed(2)} DT`,
        p.status
      ])
    });

    doc.save('historique_paiements.pdf');
  }

  exportExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.paiements.map(p => ({
      Client: p.reservation?.utilisateur?.name || 'N/A',
      Bateau: p.reservation?.bateau?.nom || 'N/A',
      Date: new Date(p.datePaiement).toLocaleString(),
      Méthode: p.methode,
      Montant: p.montant.toFixed(2),
      Statut: p.status
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Paiements');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'historique_paiements.xlsx');
  }
}
