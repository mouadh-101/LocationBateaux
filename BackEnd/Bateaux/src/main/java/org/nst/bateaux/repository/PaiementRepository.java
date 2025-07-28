package org.nst.bateaux.repository;

import org.nst.bateaux.entity.Paiement;
import org.nst.bateaux.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaiementRepository extends JpaRepository<Paiement,Long> {
    @Query("""
    SELECT p FROM Paiement p
    JOIN p.reservation r
    where r.utilisateur.id=:userId
    """)
    List<Paiement> getPaiementByUser(@Param("userId") Long userId);
}
