package org.nst.bateaux.service.Interface;

import org.nst.bateaux.dto.service.ServiceData;
import org.nst.bateaux.entity.Notification;

import java.util.List;
import java.util.Optional;

public interface IServiceService {
    List<ServiceData> getAll(Long idUser);
}
