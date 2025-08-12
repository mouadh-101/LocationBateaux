import { Component, OnInit } from '@angular/core';
import { PaiementService } from '../../services/paiement.service';
import { PaiementData } from '../../interfaces/paiment-data.model';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-historique-paiement',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class HistoriquePaiementComponent implements OnInit {
  paiements: PaiementData[] = [];
  paiementsFiltres: PaiementData[] = [];

  totalAcceptes: number = 0;
  totalEnAttente: number = 0;
  totalRefuser: number = 0;
  montantTotal: number = 0;

  selectedStatus: string | null = null; // filtre actif

  filterClient: string = '';
  filterBateau: string = '';
  filterDate: string = '';

  logoBase64: string | null = null;  // <-- ici on stocke le logo

  constructor(
    private paiementService: PaiementService,
    private authService: AuthService,
    private http: HttpClient  // <-- injection HttpClient pour charger l’image
  ) {}

  ngOnInit(): void {
    // Charger logo depuis assets (modifie le chemin si besoin)
    this.http.get('assets/logo.webp', { responseType: 'blob' }).subscribe(blob => {
      const reader = new FileReader();
      reader.onload = () => {
        this.logoBase64 = reader.result as string;
      };
      reader.readAsDataURL(blob);
    });

    if (this.authService.isGestionnaire()) {
      this.paiementService.getPaiementsForGestionnaire().subscribe({
        next: (data) => {
          this.paiements = data;
          this.calculerStatistiques();
          this.appliquerFiltres();
        },
        error: (err) => console.error('Erreur API Paiements:', err)
      });
    } else if (this.authService.isAdmin()) {
      this.paiementService.getAllPaiements().subscribe({
        next: (data) => {
          this.paiements = data;
          this.calculerStatistiques();
          this.appliquerFiltres();
        },
        error: (err) => console.error('Erreur API Paiements:', err)
      });
    }
  }

  calculerStatistiques(): void {
    this.totalAcceptes = this.paiements.filter(p => p.status === 'ACCEPTER').length;
    this.totalEnAttente = this.paiements.filter(p => p.status === 'EN_ATTENTE').length;
    this.totalRefuser = this.paiements.filter(p => p.status === 'REFUSER').length;
    this.montantTotal = this.paiements
      .filter(p => p.status === 'ACCEPTER')
      .reduce((acc, p) => acc + (p.montant || 0), 0);
  }

  appliquerFiltres(): void {
    this.paiementsFiltres = this.paiements.filter(p => {
      const matchStatus = this.selectedStatus ? p.status === this.selectedStatus : true;
      const matchClient = this.filterClient
        ? (p.reservation?.utilisateur?.name || '').toLowerCase().includes(this.filterClient.toLowerCase())
        : true;
      const matchBateau = this.filterBateau
        ? (p.reservation?.bateau?.nom || '').toLowerCase().includes(this.filterBateau.toLowerCase())
        : true;
      let matchDate = true;
      if (this.filterDate) {
        const paiementDate = new Date(p.datePaiement);
        const filtreDate = new Date(this.filterDate);
        matchDate = paiementDate.toDateString() === filtreDate.toDateString();
      }
      return matchStatus && matchClient && matchBateau && matchDate;
    });
  }

  filtrerParStatut(status: string | null): void {
    if (this.selectedStatus === status) {
      this.selectedStatus = null;
    } else {
      this.selectedStatus = status;
    }
    this.appliquerFiltres();
  }

 exportPDF(): void {
  if (!this.logoBase64) {
    alert('Le logo est encore en chargement, veuillez réessayer.');
    return;
  }

  const doc = new jsPDF.default('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const dateExport = new Date().toLocaleString();

  // Taille et position du logo
  const imgWidth = 30;
  const imgProps = doc.getImageProperties(this.logoBase64);
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
  doc.addImage(this.logoBase64, 'PNG', 10, 10, imgWidth, imgHeight);

  // Titre centré
  doc.setFontSize(30);
  doc.setTextColor('#2563eb');
  const title = 'Historique des paiements';
  doc.text(title, pageWidth / 2, 20, { align: 'center' });

  // Préparer body
  const body = this.paiementsFiltres.map(p => [
    p.reservation?.utilisateur?.name || 'N/A',
    p.reservation?.bateau?.nom || 'N/A',
    new Date(p.datePaiement).toLocaleString(),
    p.methode,
    `${p.montant.toFixed(2)} DT`,
    p.status
  ]);

  autoTable(doc, {
    startY: 40,
    head: [['Client', 'Bateau', 'Date', 'Méthode', 'Montant', 'Statut']],
    body: body,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: '#2563eb', textColor: '#fff', fontStyle: 'bold' },
    columnStyles: {
      4: { halign: 'right' },
      5: { halign: 'center' }
    },
    didParseCell: (data) => {
      if (data.section === 'body') {
        // Fond alterné gris clair
        if (data.row.index % 2 === 0) {
          data.cell.styles.fillColor = '#f9fafb';
        }
        // Couleurs statut
        if (data.column.index === 5) {
          const statut = data.cell.text[0];
          if (statut === 'ACCEPTER') {
            data.cell.styles.fillColor = '#d1fae5';
            data.cell.styles.textColor = '#065f46';
          } else if (statut === 'EN_ATTENTE') {
            data.cell.styles.fillColor = '#fef3c7';
            data.cell.styles.textColor = '#92400e';
          } else if (statut === 'REFUSER') {
            data.cell.styles.fillColor = '#fee2e2';
            data.cell.styles.textColor = '#991b1b';
          }
        }
      }
    },
    margin: { top: 42, left: 10, right: 10, bottom: 20 },
    didDrawPage: (data) => {
      const pageNumber = data.pageNumber;
       const pageHeight = doc.internal.pageSize.getHeight();  // <-- ici !
      doc.setFontSize(8);
      doc.setTextColor('#999');

      // Numéro de page en bas à gauche
      doc.text(`Page ${pageNumber}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);

      // Texte copyright en bas à droite
      doc.text('© NST-GROUPE 2025-2026', pageWidth - 10, doc.internal.pageSize.getHeight() - 10, { align: 'right' });

      // Date export en haut à droite
  doc.setFontSize(9);
  doc.setTextColor('#444');
  doc.text(`Exporté le : ${dateExport}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Ligne de séparation en bas
      doc.setDrawColor('#2563eb');
      doc.setLineWidth(0.5);
      doc.line(10, doc.internal.pageSize.getHeight() - 20, pageWidth - 10, doc.internal.pageSize.getHeight() - 20);



    }

  });

  doc.save('historique_paiements.pdf');
}



  exportExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.paiementsFiltres.map(p => ({
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
