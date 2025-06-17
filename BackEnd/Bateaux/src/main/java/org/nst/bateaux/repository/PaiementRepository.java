package org.nst.bateaux.repository;

import org.nst.bateaux.entity.Paiement;
import org.nst.bateaux.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaiementRepository extends JpaRepository<Paiement,Long> {
}
