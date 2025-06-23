package org.nst.bateaux.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    Long BateauxId;
    String nom ;
    String description ;
    double prix ;
    boolean disponible ;
    @ManyToOne
    private User proprietaire;
    @OneToMany(mappedBy = "bateau", cascade = CascadeType.ALL)
    private List<Image> images=new ArrayList<>();
    @OneToMany(mappedBy = "bateau",cascade = CascadeType.ALL)
    private List<Reservation> reservations=new ArrayList<>();
    @OneToMany(mappedBy = "bateau",cascade = CascadeType.ALL)
    private List<Avis> avis=new ArrayList<>();
    @OneToMany(mappedBy = "bateau",cascade = CascadeType.ALL)
    private List<Maintenance> maintenances=new ArrayList<>();

}
