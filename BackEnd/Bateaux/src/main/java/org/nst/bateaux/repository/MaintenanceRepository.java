package org.nst.bateaux.repository;
import org.nst.bateaux.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceRepository extends JpaRepository<Maintenance,Long> {
}
