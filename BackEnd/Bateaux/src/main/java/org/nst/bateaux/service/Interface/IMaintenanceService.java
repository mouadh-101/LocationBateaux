package org.nst.bateaux.service.Interface;
import org.nst.bateaux.entity.Maintenance;
import java.util.List;
import java.util.Optional;
public interface IMaintenanceService {

    Maintenance ajouterMaintenance(Maintenance maintenance) ;
    void supprimerMaintenance(Long id);
    Maintenance updateMaintenance(Long id,Maintenance maintenance);
    Optional<Maintenance> chercherMaintenance(Long id);
    List<Maintenance> getAll();
}
