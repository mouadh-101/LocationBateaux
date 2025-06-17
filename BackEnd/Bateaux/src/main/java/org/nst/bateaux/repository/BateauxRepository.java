package org.nst.bateaux.repository;

import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BateauxRepository extends JpaRepository<Bateaux,Long> {
}
