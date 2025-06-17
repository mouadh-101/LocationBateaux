package org.nst.bateaux.repository;

import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User,Long> {
    User findUserByEmail(String email);
    @Query("SELECT u.id AS id, u.email AS email, u.role AS role , u.name As name, u.isActive as isActive FROM User u")
    List<UserDataWithName> findAllUserData();

}
