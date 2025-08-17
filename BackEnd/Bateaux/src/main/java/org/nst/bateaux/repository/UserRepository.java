package org.nst.bateaux.repository;

import org.nst.bateaux.dto.stats.StatsUserProfile;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User,Long> {
    User findUserByEmailAndIsDeletedFalse(String email);
    @Query("SELECT u.id AS id, u.email AS email, u.role AS role , u.name As name, u.isActive as isActive  FROM User u where u.isDeleted = false")
    List<UserDataWithName> findAllUserData();
    @Query("""
    SELECT new org.nst.bateaux.dto.stats.StatsUserProfile (
        COUNT(DISTINCT b),
        COUNT(DISTINCT r),
        COUNT(DISTINCT a),
        COUNT(DISTINCT f)
    )
    FROM User u
    LEFT JOIN u.bateaux b
    LEFT JOIN u.reservations r
    LEFT JOIN u.avis a
    LEFT JOIN u.favourit f
    WHERE u.id = :userId
""")
    StatsUserProfile getUserStatsById(@Param("userId") Long userId);
    @Query("select u.email from User u where u.role = 'ADMIN' and u.isDeleted = false")
    List<String> findAllAdminEmails();

}
