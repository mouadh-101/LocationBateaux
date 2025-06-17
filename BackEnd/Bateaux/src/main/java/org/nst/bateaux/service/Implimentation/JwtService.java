package org.nst.bateaux.service.Implimentation;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.entity.Role;
import org.nst.bateaux.service.Interface.IJwtService;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService implements IJwtService {

    // Use a base64 encoded string
    private final String SECRET_KEY = "7851243a4d6f752e696f2f6b6579732f736563726574206b657920666f72206a7774";
    private final long EXPIRATION = 86400000; // 24 hours
    @Override
    public UserData extractUserData(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(getSignInKey())
                .parseClaimsJws(token)
                .getBody();

        Long id = claims.get("id", Long.class);
        String email = claims.getSubject(); // email stored in subject
        String roleString = claims.get("role", String.class);
        Role role = Role.valueOf(roleString);
        Boolean isActive = claims.get("isActive", Boolean.class);

        return new UserData(id, email, role,isActive);
    }
    @Override
    public String generateToken(String email, Role role, Long id, Boolean isActive) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role.name())
                .claim("id", id)
                .claim("isActive",isActive)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSignInKey())
                .compact();
    }
    @Override
    public boolean isTokenValid(String token, String email) {
        return extractUserData(token).getEmail().equals(email);
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}