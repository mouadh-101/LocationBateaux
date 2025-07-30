package org.nst.bateaux.service.Implimentation;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.nst.bateaux.dto.port.PortAddDto;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.entity.Role;
import org.nst.bateaux.repository.PortRepository;
import org.nst.bateaux.service.Interface.IJwtService;
import org.nst.bateaux.service.Interface.IPortService;
import org.nst.bateaux.service.mappers.MapToDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;

@Service
public class PortService implements IPortService {
    @Autowired
    PortRepository portRepository;
    @Autowired
    MapToDto mapToport;

    @Override
    public List<PortAddDto> getAllPorts() {
        List<PortAddDto> ports = portRepository.findAllByIsDeletedFalse().stream()
                .map(port -> mapToport.mapToPortAddDto(port))
                .toList();
        return ports;
    }
}