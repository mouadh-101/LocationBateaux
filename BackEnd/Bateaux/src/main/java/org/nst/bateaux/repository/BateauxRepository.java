package org.nst.bateaux.repository;

import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BateauxRepository extends JpaRepository<Bateaux,Long> {
    @Query("""
    SELECT b FROM Bateaux b
    JOIN b.avis a
    WHERE b.isDeleted = false and a.isDeleted = false
    GROUP BY b
    ORDER BY AVG(a.note) DESC
    LIMIT 4
    
    """)
    List<Bateaux> findTop5ByOrderByAvisNoteDesc();
    @Query("""
  SELECT b FROM Bateaux b
  WHERE b.port.nom = :portName
    AND b.carecteristique.capacite >= :nbPersonnes
    AND b.disponible = true
    and b.isDeleted = false
    AND NOT EXISTS (
      SELECT r FROM Reservation r
      WHERE r.bateau = b
        AND r.status = 'ACCEPTER'
        AND (:date = r.date)
    )
""")
    List<Bateaux> searchAvailableBoats(
            @Param("portName") String portName,
            @Param("nbPersonnes") int nbPersonnes,
            @Param("date") LocalDateTime date

    );
    Bateaux findByBateauxIdAndIsDeletedFalse(Long id);
    List<Bateaux> findAllByIsDeletedFalse();


    List<Bateaux> findByProprietaire(User user);



}
