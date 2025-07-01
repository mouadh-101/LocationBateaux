import { Component } from '@angular/core';
import { Boat } from '../../interfaces/boat';
import { BoatService } from '../../services/boat.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AuthModalService } from 'src/app/services/auth-modal.service';
interface FilterState {
  priceRange: { min: number; max: number };
  availability: string[];
  boatTypes: string[];
  sortBy: string;
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
  currentPage = 1;
  itemsPerPage = 6;
  showFilters: boolean = false;
  isLoggedIn: boolean = false;


  filters: FilterState = {
    priceRange: { min: 0, max: 5000 },
    availability: [],
    boatTypes: [],
    sortBy: 'newest'
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
  
  constructor(private boatService: BoatService,public router:Router, private authService : AuthService,private authModalService :AuthModalService) { }
  ngOnInit() {
    this.authService.authState$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
    
    this.loadBoats();
  }

  loadBoats() {
    this.boatService.getBoats().subscribe((boats) => {
      this.allBoats = boats;
      this.filteredBoats = [...this.allBoats];
      this.initializePriceRange();
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
    }
    this.applyFilters();
  }

  clearAllFilters() {
    this.filters = {
      priceRange: { ...this.priceRange },
      availability: [],
      boatTypes: [],
      sortBy: 'newest'
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
  onSeeMore(batauxId:number) {
    this.router.navigate(['/boat-details',batauxId]);
  }

  

}
