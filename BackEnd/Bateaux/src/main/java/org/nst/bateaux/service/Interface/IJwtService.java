package org.nst.bateaux.service.Interface;

import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.entity.Role;

public interface IJwtService {

    UserData extractUserData(String token);
    String generateToken(String email, Role role, Long id,Boolean isActive);
    boolean isTokenValid(String token, String email);


}
