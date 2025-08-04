package org.nst.bateaux.repository;

import org.nst.bateaux.entity.Paiement;
import org.nst.bateaux.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaiementRepository extends JpaRepository<Paiement,Long> {
    @Query("""
    SELECT p FROM Paiement p
    JOIN p.reservation r
    where r.utilisateur.id=:userId
    and p.isDeleted = false
    """)
    List<Paiement> getPaiementByUser(@Param("userId") Long userId);



    @Query("""
SELECT p FROM Paiement p
JOIN p.reservation r
JOIN r.bateau b
WHERE b.proprietaire.id = :gestionnaireId and p.isDeleted=FALSE 
""")
    List<Paiement> findPaiementsByGestionnaireId(@Param("gestionnaireId") Long gestionnaireId);



    List<Paiement> findAllByIsDeletedFalse();
    Paiement findByPaiementIdAndIsDeletedFalse(Long id);
}
