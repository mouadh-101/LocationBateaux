package org.nst.bateaux.repository;
import org.nst.bateaux.entity.Avis;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Port;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortRepository extends JpaRepository<Port,Long> {
    Port findByNomAndIsDeletedFalse(String nom);
    List<Port> findAllByIsDeletedFalse();
}
