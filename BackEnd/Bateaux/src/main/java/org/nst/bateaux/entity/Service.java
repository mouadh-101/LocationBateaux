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
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long idService;
    String nom;
    @ManyToMany(mappedBy = "services",cascade = CascadeType.ALL)
    List<Bateaux> bateaux=new ArrayList<>();
    @Column(nullable = false)
    boolean isDeleted=false;
}
