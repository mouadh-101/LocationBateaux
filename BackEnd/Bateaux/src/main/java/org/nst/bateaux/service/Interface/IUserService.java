package org.nst.bateaux.service.Interface;

import org.nst.bateaux.dto.auth.AuthenticationRequest;
import org.nst.bateaux.dto.auth.AuthenticationResponse;
import org.nst.bateaux.dto.auth.RegisterRequest;
import org.nst.bateaux.dto.user.ChangePasswordRequest;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IUserService {
    User creatUser(RegisterRequest user);
    User findUserByEmail(String email);
    AuthenticationResponse login(AuthenticationRequest user);
    AuthenticationResponse register(RegisterRequest user);
    List<UserDataWithName> getAllUsers();
    UserDataWithName updateUser(Long userId,UserDataWithName user);
    void banUser(Long userId);
    void unBanUser(Long userId);
    void changePassword(Long id, ChangePasswordRequest request);
    UserData mapToDto(User user);
    UserDataWithName mapToDtoWithName(User user);
    UserDataWithName findUserById(Long id);
}
