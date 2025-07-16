package org.nst.bateaux.service.Implimentation;


import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.nst.bateaux.config.BusinessException;
import org.nst.bateaux.dto.auth.AuthenticationRequest;
import org.nst.bateaux.dto.auth.AuthenticationResponse;
import org.nst.bateaux.dto.auth.RegisterRequest;
import org.nst.bateaux.dto.stats.StatsUserProfile;
import org.nst.bateaux.dto.user.ChangePasswordRequest;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.Role;
import org.nst.bateaux.entity.User;
import org.nst.bateaux.repository.BateauxRepository;
import org.nst.bateaux.repository.UserRepository;
import org.nst.bateaux.service.Interface.IJwtService;
import org.nst.bateaux.service.Interface.IUserService;
import org.nst.bateaux.service.mappers.MapToDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class UserService implements IUserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    IJwtService jwtService;
    @Autowired
    BateauxRepository bateauxRepository;
    @Autowired
    MapToDto mapToDto;

    @Override
    public User creatUser(RegisterRequest user) {
        User newUser=new User() ;
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setName(user.getName());
        newUser.setRole(user.getRole());
        newUser.setPhone(user.getPhone());
        return userRepository.save(newUser);
    }


    @Override
    public User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    @Override
    public AuthenticationResponse login(AuthenticationRequest request) {
        User user = findUserByEmail(request.getEmail());

        // Check if user exists
        if (user == null) {
            return new AuthenticationResponse(null,"ERROR", "User not found");
        }

        // Check if user is active
        if (!user.isActive()) {
            return new AuthenticationResponse(null,"BANNED", "User is banned or inactive");
        }

        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthenticationResponse(null,"ERROR", "Invalid credentials");
        }

        // Generate token
        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole(),
                user.getId(),
                user.isActive()
        );

        return new AuthenticationResponse(token,"SUCCESS","Authentication successful");
    }

    @Override
    public AuthenticationResponse register(RegisterRequest user) {
        User newUser=creatUser(user);
        String token = jwtService.generateToken(
                newUser.getEmail(),
                newUser.getRole(),
                newUser.getId(),
                newUser.isActive()
        );

        return new AuthenticationResponse(token,"SUCCESS","Authentication successful");
    }

    @Override
    public List<UserDataWithName> getAllUsers() {
        return userRepository.findAllUserData();
    }

    @Override
    public UserDataWithName updateUser(Long userId, UserDataWithName userData) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found with ID: " + userId));

        existingUser.setName(userData.getName());
        existingUser.setPhone(userData.getPhone());
        existingUser.setRole(userData.getRole());

        User updatedUser = userRepository.save(existingUser);

        return mapToDto.mapToDtoWithName(updatedUser);
    }

    @Override
    public void banUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found"));

        if (!user.isActive()) {
            throw new BusinessException("User is already banned");
        }

        user.setActive(false);
        userRepository.save(user);
    }

    @Override
    public void unBanUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found"));

        if (user.isActive()) {
            throw new BusinessException("User is already Active");
        }

        user.setActive(true);
        userRepository.save(user);
    }

    @Override
    public void changePassword(Long id, ChangePasswordRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("User not found"));

        if (!passwordEncoder.matches(request.getCurentPassword(), user.getPassword())) {
            throw new BusinessException("Current Password doesn't match");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }


    @Override
    public UserDataWithName findUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("User not found with ID: " + id));
        return mapToDto.mapToDtoWithName(user);
    }

    @Override
    public StatsUserProfile getUserStats(Long userId) {
        return userRepository.getUserStatsById(userId);
    }

    @Override
    public AuthenticationResponse loginAdmin(AuthenticationRequest request) {
        User user = findUserByEmail(request.getEmail());

        // Check if user exists
        if (user == null) {
            return new AuthenticationResponse(null,"ERROR", "User not found");
        }

        // Check if user is active
        if (!user.isActive()) {
            return new AuthenticationResponse(null,"BANNED", "User is banned or inactive");
        }

        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthenticationResponse(null,"ERROR", "Invalid credentials");
        }
        if(user.getRole()!=Role.ADMIN && user.getRole()!=Role.GESTIONNAIRE)
        {
            return new AuthenticationResponse(null,"ERROR", "Accès refusé");
        }

        // Generate token
        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole(),
                user.getId(),
                user.isActive()
        );

        return new AuthenticationResponse(token,"SUCCESS","Authentication successful");
    }
    @Override
    public ResponseEntity<AuthenticationResponse> authenticateWithGoogle(Map<String, String> body) {
        String idTokenString = body.get("idToken");

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance()
        )
                .setAudience(Collections.singletonList("702034366364-h92rafiso21l7puiboock14h5f1cuetl.apps.googleusercontent.com"))
                .build();

        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthenticationResponse(null, "ERROR", "Invalid Google ID Token"));
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String phone=(String) payload.get("phone_number");

            User user = userRepository.findUserByEmail(email);
            if (user == null) {
                RegisterRequest requestReg = new RegisterRequest();
                requestReg.setEmail(email);
                requestReg.setName(name);
                requestReg.setPassword(UUID.randomUUID().toString());
                requestReg.setPhone(phone);
                requestReg.setRole(Role.CLIENT);
                user=this.creatUser(requestReg);
            }

            if (!user.isActive()) {
                return ResponseEntity.ok(new AuthenticationResponse(null, "BANNED", "User is banned or inactive"));
            }

            String token = jwtService.generateToken(
                    user.getEmail(),
                    user.getRole(),
                    user.getId(),
                    user.isActive()
            );

            return ResponseEntity.ok(new AuthenticationResponse(token, "SUCCESS", "Google login successful"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthenticationResponse(null, "ERROR", "Token validation failed: " + e.getMessage()));
        }
    }
    @Override
    public ResponseEntity<AuthenticationResponse> authenticateWithFacebook(Map<String, String> body) {
        String accessToken = body.get("accessToken");

        String url = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + accessToken;

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> fbResponse = restTemplate.getForObject(url, Map.class);

        if (fbResponse == null || fbResponse.get("email") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthenticationResponse(null, "ERROR", "Invalid Facebook token or email permission missing"));
        }

        String email = (String) fbResponse.get("email");
        String name = (String) fbResponse.get("name");

        User user = userRepository.findUserByEmail(email);
        if (user == null) {
            RegisterRequest requestReg = new RegisterRequest();
            requestReg.setEmail(email);
            requestReg.setName(name);
            requestReg.setPassword(UUID.randomUUID().toString());
            requestReg.setRole(Role.CLIENT);
            this.creatUser(requestReg);
        }

        if (!user.isActive()) {
            return ResponseEntity.ok(new AuthenticationResponse(null, "BANNED", "User is banned or inactive"));
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole(),
                user.getId(),
                user.isActive()
        );

        return ResponseEntity.ok(new AuthenticationResponse(token, "SUCCESS", "Facebook login successful"));
    }



}
