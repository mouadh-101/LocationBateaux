package org.nst.bateaux.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    Long maintenanceId ;
    String description ;
    LocalDateTime dateDebut ;
    LocalDateTime dateFin ;
    @ManyToOne
    private Bateaux bateau;
    @Column(nullable = false)
    boolean isDeleted=false;


}
