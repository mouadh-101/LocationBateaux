import { Injectable } from '@angular/core';
import { Boat, Service, Partner, Benefit } from '../interfaces/boat';


@Injectable({
  providedIn: 'root'
})
export class MokeDataService {

  getBoats(): Boat[] {
    return [
      {
        bateauxId: 1,
        nom: "Azur Prestige",
        description: "Yacht de luxe pour une expérience inoubliable en Méditerranée",
        prix: 2500,
        images: [
          { url: "https://wallpapers.com/images/hd/sea-hd-luxury-yacht-ked79brp2z4egz63.jpg?height=300&width=400" },
          { url: "https://w0.peakpx.com/wallpaper/505/178/HD-wallpaper-boat-car-on-deck-expensive-yacht-mercedes-luxury-yachts-sea.jpg?height=300&width=400" }
        ],
        disponible: true
      },
      {
        bateauxId: 2,
        nom: "Océan Élégance",
        description: "Catamaran spacieux idéal pour les groupes et événements",
        prix: 1800,
        images: [
          { url: "https://wallpapers.com/images/hd/sea-hd-luxury-yacht-ked79brp2z4egz63.jpg?height=300&width=400" }
        ],
        disponible: true
      },
      {
        bateauxId: 3,
        nom: "Riviera Dream",
        description: "Bateau de sport haute performance pour les amateurs de sensations",
        prix: 3200,
        images: [
          { url: "https://wallpapers.com/images/hd/sea-hd-luxury-yacht-ked79brp2z4egz63.jpg?height=300&width=400" }
        ],
        disponible: false
      },
      {
        bateauxId: 4,
        nom: "Sunset Paradise",
        description: "Voilier traditionnel pour des moments romantiques au coucher du soleil",
        prix: 1200,
        images: [
          { url: "https://wallpapers.com/images/hd/sea-hd-luxury-yacht-ked79brp2z4egz63.jpg?height=300&width=400" }
        ],
        disponible: true
      }
    ];
  }

  getServices(): Service[] {
    return [
      {
        id: 1,
        titre: "+20 bateaux à louer",
        description: "Profitez en famille ou entre amis d'un bateau de votre choix pour une escapade inoubliable",
        icone: "boat"
      },
      {
        id: 2,
        titre: "Des partenaires de confiance",
        description: "Des bateaux soigneusement sélectionnés pour vous garantir une expérience unique",
        icone: "partner"
      },
      {
        id: 3,
        titre: "Assurances & Garantie",
        description: "Des locations assurées pour des sorties en mer en toute tranquillité",
        icone: "shield"
      },
      {
        id: 4,
        titre: "Les meilleurs prix",
        description: "Des prix abordables avec des paiements sécurisés",
        icone: "price-tag"
      }
    ];
  }

  getPartners(): Partner[] {
    return [
      { id: 1, logo: "/assets/img/partners/afkar.png?height=80&width=120" },
      { id: 2, logo: "/assets/img/partners/fifthApp.png?height=80&width=120" },
      { id: 3,logo: "/assets/img/partners/gamarthYachting.png?height=80&width=120" },
      { id: 4,logo: "/assets/img/partners/kayak.png?height=80&width=120" },
      { id: 5,logo: "/assets/img/partners/StartupTunisia.png?height=80&width=120" },
      { id: 6,logo: "/assets/img/partners/technoPole.png?height=80&width=120" },
      { id: 7,logo: "/assets/img/partners/ticDce.png?height=80&width=120" }

    ];
  }

  getBenefits(): Benefit[] {
    return [
      {
        id: 1,
        titre: "Flotte de Luxe",
        description: "Des bateaux haut de gamme entretenus par des professionnels",
        icone: "star"
      },
      {
        id: 2,
        titre: "Prix Transparents",
        description: "Aucun frais caché, tarification claire et équitable",
        icone: "shield-check"
      },
      {
        id: 3,
        titre: "Service 24/7",
        description: "Support client disponible à tout moment",
        icone: "clock"
      },
      {
        id: 4,
        titre: "Capitaines Expérimentés",
        description: "Équipage professionnel pour votre sécurité et confort",
        icone: "award"
      }
    ];
  }
}
