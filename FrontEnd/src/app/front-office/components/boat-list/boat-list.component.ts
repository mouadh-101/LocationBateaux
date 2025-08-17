import { Component } from '@angular/core';
import { Boat, BoatFilter } from 'src/app/interfaces/boat';
import { BoatService } from 'src/app/services/boat.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AuthModalService } from 'src/app/services/auth-modal.service';
import { PortAdd } from 'src/app/interfaces/port';
import { PortService } from 'src/app/services/port.service';
import { s } from '@fullcalendar/core/internal-common';
interface FilterState {
  priceRange: { min: number; max: number };
  availability: string[];
  boatTypes: string[];
  sortBy: string;
  ports: string[];
}

interface ActiveFilter {
  type: string;
  label: string;
  value: any;
}
@Component({
  selector: 'app-boat-list',
  templateUrl: './boat-list.component.html',
  styleUrls: ['./boat-list.component.css']
})
export class BoatListComponent {
  allBoats: Boat[] = [];
  filteredBoats: Boat[] = [];
  ports: PortAdd[] | null = null;
  currentPage = 1;
  itemsPerPage = 6;
  showFilters: boolean = false;
  isLoggedIn: boolean = false;
  searchDetails!: BoatFilter;


  filters: FilterState = {
    priceRange: { min: 0, max: 5000 },
    availability: [],
    boatTypes: [],
    sortBy: 'newest',
    ports: []
  };


  activeFilters: ActiveFilter[] = [];

  // Filter options
  availabilityOptions = [
    { value: 'available', label: 'Disponible' },
    { value: 'unavailable', label: 'Indisponible' }
  ];

  boatTypeOptions = [
    { value: 'YACHT', label: 'Yacht' },
    { value: 'VOILIER', label: 'Voilier' },
    { value: 'CATAMARAN', label: 'Catamaran' },
    { value: 'SPORT', label: 'Bateau de Sport' },
    { value: 'AUTRE', label: 'Autre' }
  ];

  sortOptions = [
    { value: 'newest', label: 'Plus Récent' },
    { value: 'price-low', label: 'Prix Croissant' },
    { value: 'price-high', label: 'Prix Décroissant' },
    { value: 'name', label: 'Nom A-Z' }
  ];

  priceRange = { min: 0, max: 5000 };
  currentPriceRange = { min: 0, max: 5000 };

  constructor(private boatService: BoatService, private route: ActivatedRoute, public router: Router, private authService: AuthService, private authModalService: AuthModalService, private portService: PortService) { }
  ngOnInit() {
    this.authService.authState$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
    this.route.queryParams.subscribe(params => {
      this.searchDetails = {
        port: params['port'],
        date: params['date'],
        nbPersonnes: params['nbPersonnes']
      };
    });

    if (this.searchDetails.port || this.searchDetails.date|| this.searchDetails.nbPersonnes) {
      this.loadSearchBoats(this.searchDetails);
    } else {
      this.loadBoats();
    }
    this.loadPorts()
  }

  loadBoats() {
    this.boatService.getBoats().subscribe((boats) => {
      this.allBoats = boats;
      this.filteredBoats = [...this.allBoats];
      this.initializePriceRange();
      this.loadPorts();
    });
  }
  loadSearchBoats(serachDetails: BoatFilter) {
    this.boatService.getFilteredBoats(serachDetails)
      .subscribe(boats => {
        this.allBoats = boats;
        this.filteredBoats = boats;
        this.initializePriceRange();
      });
  }

  loadPorts() {
    this.portService.getPorts().subscribe((ports) => {
      this.ports = ports;
    });
  }

  initializePriceRange() {
    if (this.allBoats.length > 0) {
      const prices = this.allBoats.map(boat => boat.prix);
      this.priceRange.min = Math.min(...prices);
      this.priceRange.max = Math.max(...prices);
      this.currentPriceRange = { ...this.priceRange };
      this.filters.priceRange = { ...this.priceRange };
    }
  }
  initializePorts() {
    if (this.ports && this.ports.length > 0) {
      this.filters.ports = this.ports.map(port => port.nom.toString());
    }
  }

  onAvailabilityChange(value: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;
    if (checked) {
      this.filters.availability.push(value);
    } else {
      this.filters.availability = this.filters.availability.filter(v => v !== value);
    }
    this.applyFilters();
  }

  onBoatTypeChange(value: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;

    if (checked) {
      this.filters.boatTypes.push(value);
    } else {
      this.filters.boatTypes = this.filters.boatTypes.filter(v => v !== value);
    }
    this.applyFilters();
  }
  onPortChange(portName: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.filters.ports.push(portName);
    } else {
      this.filters.ports = this.filters.ports.filter(p => p !== portName);
    }
    this.applyFilters();
  }

  onPriceRangeChange() {
    this.filters.priceRange = { ...this.currentPriceRange };
    this.applyFilters();
  }

  onSortChange(sortValue: string) {
    this.filters.sortBy = sortValue;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allBoats];

    // Filter by availability
    if (this.filters.availability.length > 0) {
      filtered = filtered.filter(boat => {
        if (this.filters.availability.includes('available') && boat.disponible) return true;
        if (this.filters.availability.includes('unavailable') && !boat.disponible) return true;
        return false;
      });
    }

    // Filter by boat type (based on boat name keywords)
    if (this.filters.boatTypes.length > 0) {
      const selectedTypes = this.filters.boatTypes.map(type => type.toLowerCase());
      filtered = filtered.filter(boat =>
        selectedTypes.includes(boat.carecteristique.type.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(boat =>
      boat.prix >= this.filters.priceRange.min && boat.prix <= this.filters.priceRange.max
    );
    // Filter by port
    if (this.filters.ports.length > 0) {
      filtered = filtered.filter(boat =>
        this.filters.ports.includes(boat.port.nom.toString())
      );
    }

    // Sort
    switch (this.filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.prix - b.prix);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.prix - a.prix);
        break;
      case 'name':
        filtered.sort((a, b) => a.nom.localeCompare(b.nom));
        break;
      default:
        // Keep original order for 'newest'
        break;
    }

    this.filteredBoats = filtered;
    this.updateActiveFilters();
  }

  updateActiveFilters() {
    this.activeFilters = [];

    // Add availability filters
    this.filters.availability.forEach(av => {
      const option = this.availabilityOptions.find(opt => opt.value === av);
      if (option) {
        this.activeFilters.push({
          type: 'availability',
          label: option.label,
          value: av
        });
      }
    });

    // Add boat type filters
    this.filters.boatTypes.forEach(type => {
      const option = this.boatTypeOptions.find(opt => opt.value === type);
      if (option) {
        this.activeFilters.push({
          type: 'boatType',
          label: option.label,
          value: type
        });
      }
    });
    // Add ports
    this.filters.ports.forEach(portName => {
      this.activeFilters.push({
        type: 'ports',
        label: `Port: ${portName}`,
        value: portName
      });
    });



    // Add price range filter if not default
    if (this.filters.priceRange.min !== this.priceRange.min ||
      this.filters.priceRange.max !== this.priceRange.max) {
      this.activeFilters.push({
        type: 'price',
        label: `Prix: ${this.filters.priceRange.min}TND - ${this.filters.priceRange.max}TND`,
        value: this.filters.priceRange
      });
    }
  }

  removeFilter(filter: ActiveFilter) {
    switch (filter.type) {
      case 'availability':
        this.filters.availability = this.filters.availability.filter(v => v !== filter.value);
        break;
      case 'boatType':
        this.filters.boatTypes = this.filters.boatTypes.filter(v => v !== filter.value);
        break;
      case 'price':
        this.currentPriceRange = { ...this.priceRange };
        this.filters.priceRange = { ...this.priceRange };
        break;
      case 'ports':
        this.filters.ports = this.filters.ports.filter(v => v !== filter.value);
        break;
    }
    this.applyFilters();
  }

  clearAllFilters() {
    this.filters = {
      priceRange: { ...this.priceRange },
      availability: [],
      boatTypes: [],
      sortBy: 'newest',
      ports: []
    };
    this.currentPriceRange = { ...this.priceRange };
    this.applyFilters();
  }

  trackByBoatId(index: number, boat: Boat): number {
    return boat.bateauxId;
  }

  get paginatedBoats() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredBoats.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBoats.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }





}
