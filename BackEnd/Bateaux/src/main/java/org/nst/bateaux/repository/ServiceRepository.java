package org.nst.bateaux.repository;
import org.nst.bateaux.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Arrays;
import java.util.List;

public interface ServiceRepository extends JpaRepository<Service,Long> {
    Service findByNomAndIsDeletedFalse(String nom);

    List<Service> findAllByIsDeletedFalse();
    @Query("SELECT s FROM Service s WHERE s.isDeleted = false AND (s.createdBy.role = 'ADMIN' OR s.createdBy.id = :gestionnaireId)")
    List<Service> findVisibleServicesForGestionnaire(@Param("gestionnaireId") Long id);
}
