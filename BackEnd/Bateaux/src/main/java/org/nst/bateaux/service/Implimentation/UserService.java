package org.nst.bateaux.service.Implimentation;

import org.nst.bateaux.dto.auth.AuthenticationRequest;
import org.nst.bateaux.dto.auth.AuthenticationResponse;
import org.nst.bateaux.dto.auth.RegisterRequest;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.User;
import org.nst.bateaux.repository.UserRepository;
import org.nst.bateaux.service.Interface.IJwtService;
import org.nst.bateaux.service.Interface.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    IJwtService jwtService;
    @Override
    public User creatUser(RegisterRequest user) {
        User newUser=new User() ;
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setName(user.getName());
        newUser.setRole(user.getRole());
        return userRepository.save(newUser);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    @Override
    public AuthenticationResponse login(AuthenticationRequest request) {
        User user=findUserByEmail(request.getEmail());
        if(passwordEncoder.matches(request.getPassword(),user.getPassword())) {

            String token = jwtService.generateToken(
                    user.getEmail(),
                    user.getRole(),
                    user.getId(),
                    user.isActive()
            );
            return new AuthenticationResponse(token);
        }
        return null;
    }

    @Override
    public AuthenticationResponse register(RegisterRequest user) {
        User newUser=new User() ;
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setName(user.getName());
        newUser.setRole(user.getRole());
        userRepository.save(newUser);
        String token = jwtService.generateToken(
                newUser.getEmail(),
                newUser.getRole(),
                newUser.getId(),
                newUser.isActive()
        );

        return new AuthenticationResponse(token);
    }

    @Override
    public List<UserDataWithName> getAllUsers() {
        return userRepository.findAllUserData();
    }


}
