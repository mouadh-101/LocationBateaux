package org.nst.bateaux.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.nst.bateaux.dto.bateau.CarecteristiqueBateauxDto;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Bateaux {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    Long bateauxId;
    String nom ;
    String description ;
    double prix ;
    boolean disponible ;
    @ManyToOne
    private User proprietaire;
    @OneToMany(mappedBy = "bateau", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images=new ArrayList<>();
    @OneToMany(mappedBy = "bateau",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations=new ArrayList<>();
    @OneToMany(mappedBy = "bateau",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Avis> avis=new ArrayList<>();
    @OneToMany(mappedBy = "bateau",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Maintenance> maintenances=new ArrayList<>();
    @ManyToOne(cascade = CascadeType.ALL)
    Port port;
    @OneToOne(cascade = CascadeType.ALL)
    Carecteristique Carecteristique;

}
