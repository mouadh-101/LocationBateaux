package org.nst.bateaux.repository;
import org.nst.bateaux.entity.Avis;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Partners;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartnersRepository extends JpaRepository<Partners,Long> {
}
