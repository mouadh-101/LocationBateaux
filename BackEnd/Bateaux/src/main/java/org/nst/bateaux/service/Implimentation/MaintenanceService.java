package org.nst.bateaux.service.Implimentation;
import lombok.AllArgsConstructor;
import org.nst.bateaux.entity.Avis;
import org.nst.bateaux.entity.Maintenance;
import org.nst.bateaux.repository.MaintenanceRepository;
import org.nst.bateaux.service.Interface.IMaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class MaintenanceService implements IMaintenanceService {

    @Autowired
    MaintenanceRepository maintenanceRepository ;

    @Override
    public Maintenance ajouterMaintenance(Maintenance maintenance)
    {
        return maintenanceRepository.save(maintenance);
    }

    @Override
    public void supprimerMaintenance(Long id)
    {
        maintenanceRepository.deleteById(id);
    }

    @Override
    public Maintenance updateMaintenance(Long id,Maintenance maintenance)
    {
        Maintenance i=maintenanceRepository.findById(id).orElse(null);
        i.setDescription(maintenance.getDescription());
        i.setDateDebut(maintenance.getDateDebut());
        i.setDateFin(maintenance.getDateFin());
        return maintenanceRepository.save(i);
    }

    @Override
    public Optional<Maintenance> chercherMaintenance(Long id)
    {
        return maintenanceRepository.findById(id);
    }

    @Override
    public List<Maintenance> getAll() {return maintenanceRepository.findAll();}

}
