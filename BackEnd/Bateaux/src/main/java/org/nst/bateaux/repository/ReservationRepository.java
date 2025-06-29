package org.nst.bateaux.repository;

import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Reservation;
import org.nst.bateaux.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    List<Reservation> findByUtilisateur(User utilisateur);
    List<Reservation> findByBateau(Bateaux bat);
}
