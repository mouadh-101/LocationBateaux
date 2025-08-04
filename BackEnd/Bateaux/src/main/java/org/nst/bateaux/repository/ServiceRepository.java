package org.nst.bateaux.repository;
import org.nst.bateaux.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

public interface ServiceRepository extends JpaRepository<Service,Long> {
    Service findByNomAndIsDeletedFalse(String nom);

    List<Service> findAllByIsDeletedFalse();
}
