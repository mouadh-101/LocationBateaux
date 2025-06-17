package org.nst.bateaux.repository;

import org.nst.bateaux.entity.Reservation;
import org.nst.bateaux.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation,Long> {
}
