package org.nst.bateaux.service.Implimentation;

import org.nst.bateaux.dto.port.PortAddDto;
import org.nst.bateaux.dto.service.ServiceData;
import org.nst.bateaux.repository.PortRepository;
import org.nst.bateaux.repository.ServiceRepository;
import org.nst.bateaux.service.Interface.IPortService;
import org.nst.bateaux.service.Interface.IServiceService;
import org.nst.bateaux.service.mappers.MapToDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceService implements IServiceService {
    @Autowired
    ServiceRepository serviceRepository;
    @Autowired
    MapToDto mapToport;

    @Override
    public List<ServiceData> getAll(Long idUser) {
        List<ServiceData> serviceList = serviceRepository.findVisibleServicesForGestionnaire(idUser)
                .stream()
                .map(mapToport::mapToServiceDto)
                .toList();
        return serviceList;
    }
}