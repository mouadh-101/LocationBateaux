package org.nst.bateaux.repository;

import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Reservation;
import org.nst.bateaux.entity.StatusRes;
import org.nst.bateaux.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation,Long> {


    @Query("SELECT r FROM Reservation r WHERE r.bateau.proprietaire.id = :gestionnaireId")
    List<Reservation> findByGestionnaireId(@Param("gestionnaireId") Long gestionnaireId);
    List<Reservation> findByUtilisateurAndIsDeletedFalse(User utilisateur);
    List<Reservation> findByBateauAndStatusAndIsDeletedFalse(Bateaux bat, StatusRes status);
    List<Reservation> findByBateauAndIsDeletedFalse(Bateaux bat);
    Reservation findByReservationIdAndIsDeletedFalse(Long id);
    List<Reservation> findAllByIsDeletedFalse();
}
