package org.nst.bateaux.dto.avis;

import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.nst.bateaux.dto.bateau.BateauData;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.User;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AviData {
    Long avisId ;
    Integer note ;
    String commentaire ;
    LocalDateTime dateCreation ;
    UserDataWithName utilisateur;
    BateauData bateau;

}
