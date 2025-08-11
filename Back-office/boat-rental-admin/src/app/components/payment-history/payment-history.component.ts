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
  const doc = new jsPDF.default('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  // Charger et ajouter le logo en haut à gauche
  this.http.get('assets/logo.webp', { responseType: 'blob' }).subscribe(blob => {
    const reader = new FileReader();
    reader.onload = () => {
      const imgData = reader.result as string;
      const imgProps = doc.getImageProperties(imgData);

      // Position logo : x=10 mm, y=10 mm
      // Largeur réduite à 30 mm, hauteur ajustée proportionnellement
      const imgWidth = 30;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      // Titre centré (en tenant compte du logo en haut à gauche)
      doc.setFontSize(18);
      doc.setTextColor('#2563eb');
      const title = 'Historique des paiements';
      const dateExport = new Date().toLocaleString();
      // Décaler verticalement un peu plus bas (ex: y=20)
      doc.text(title, pageWidth / 2, 20, { align: 'center' });

      doc.setFontSize(10);
      doc.setTextColor('#444');
      doc.text(`Exporté le : ${dateExport}`, pageWidth - 14, 27, { align: 'right' });

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
        startY: 40, // commencer sous le logo et titre
        head: [['Client', 'Bateau', 'Date', 'Méthode', 'Montant', 'Statut']],
        body: body,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: '#2563eb', textColor: '#fff', fontStyle: 'bold' },
        columnStyles: {
          4: { halign: 'right' },
          5: { halign: 'center' }
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 5) {
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
        },
        margin: { top: 40 },
        didDrawPage: (data) => {
          const pageNumber = data.pageNumber;
          doc.setFontSize(8);
          doc.setTextColor('#999');
          doc.text(`Page ${pageNumber}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
        }
      });

      doc.save('historique_paiements.pdf');
    };
    reader.readAsDataURL(blob);
  });
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
