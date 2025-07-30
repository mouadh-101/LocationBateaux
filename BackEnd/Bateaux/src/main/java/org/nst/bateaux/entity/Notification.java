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
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    Long notificationId ;
    String message ;
    LocalDateTime dateEnvoie ;

    @ManyToOne
    private User destinataire;
    @Column(nullable = false)
    boolean isDeleted=false;

}
