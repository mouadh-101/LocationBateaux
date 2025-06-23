package org.nst.bateaux.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "\"user\"")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;
    private boolean isActive= true;
    @OneToMany(mappedBy = "utilisateur",cascade = CascadeType.ALL)
    private List<Reservation> reservations=new ArrayList<>();
    @OneToMany(mappedBy = "proprietaire",cascade = CascadeType.ALL)
    private List<Bateaux> bateaux = new ArrayList<>();

    @OneToMany(mappedBy = "utilisateur",cascade = CascadeType.ALL)
    private List<Avis> avis = new ArrayList<>();


}

