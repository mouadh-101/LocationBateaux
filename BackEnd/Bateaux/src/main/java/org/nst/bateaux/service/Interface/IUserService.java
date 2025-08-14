package org.nst.bateaux.service.Interface;

import jakarta.mail.MessagingException;
import org.nst.bateaux.dto.auth.*;
import org.nst.bateaux.dto.bateau.BateauData;
import org.nst.bateaux.dto.stats.StatsUserProfile;
import org.nst.bateaux.dto.user.ChangePasswordRequest;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

@Service
public interface IUserService {
    User creatUser(RegisterRequest user);

    User createUserWithRandomPassword(RegisterRequest user);

    User findUserByEmail(String email);
    AuthenticationResponse login(AuthenticationRequest user);
    AuthenticationResponse register(RegisterRequest user);
    List<UserDataWithName> getAllUsers();
    UserDataWithName updateUser(Long userId,UserDataWithName user);
    void banUser(Long userId);
    void unBanUser(Long userId);
    void changePassword(Long id, ChangePasswordRequest request);
    UserDataWithName findUserById(Long id);

    void supprimerUser(Long id);

    StatsUserProfile getUserStats(Long userId);
    AuthenticationResponse loginAdmin(AuthenticationRequest user);

    AuthenticationResponse googleLogin(GoogleLoginRequest request) throws Exception;


    AuthenticationResponse facebookLogin(FacebookLoginRequest request) throws Exception;

    Map<String, String> forgotPassword(Map<String, String> request) throws MessagingException;

    Map<String, String> resetPassword(Map<String, String> request);
}
