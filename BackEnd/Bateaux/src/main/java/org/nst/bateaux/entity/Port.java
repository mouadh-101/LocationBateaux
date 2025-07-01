package org.nst.bateaux.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Port {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long idPort;
    @Column(nullable = false, unique = true)
    String nom;
    @OneToMany(mappedBy = "port" ,orphanRemoval = true, cascade = CascadeType.ALL)
    List<Bateaux> bateaux=new ArrayList<>();
}
