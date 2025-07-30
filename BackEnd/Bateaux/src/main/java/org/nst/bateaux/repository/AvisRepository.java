package org.nst.bateaux.repository;
import org.nst.bateaux.entity.Avis;
import org.nst.bateaux.entity.Bateaux;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvisRepository extends JpaRepository<Avis,Long> {
    List<Avis> findAllByBateauAndIsDeletedFalse(Bateaux bateaux);
}
