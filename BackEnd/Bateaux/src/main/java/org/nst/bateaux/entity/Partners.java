package org.nst.bateaux.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Partners {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    Long partnerId ;
    String nom;
    String logo ;
    @Column(nullable = false)
    boolean isDeleted=false;

}
