package org.nst.bateaux.repository;

import org.nst.bateaux.entity.Bateaux;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BateauxRepository extends JpaRepository<Bateaux,Long> {
    @Query("""
    SELECT b FROM Bateaux b
    JOIN b.avis a
    GROUP BY b
    ORDER BY AVG(a.note) DESC
    LIMIT 4
    """)
    List<Bateaux> findTop5ByOrderByAvisNoteDesc();
    @Query("""
  SELECT b FROM Bateaux b
  WHERE b.port.nom = :portName
    AND b.Carecteristique.capacite >= :nbPersonnes
    AND b.disponible = true
    AND NOT EXISTS (
      SELECT r FROM Reservation r
      WHERE r.bateau = b
        AND r.status = 'ACCEPTER'
        AND (:dateDebut < r.dateFin AND :dateFin > r.dateDebut)
    )
""")
    List<Bateaux> searchAvailableBoats(
            @Param("portName") String portName,
            @Param("nbPersonnes") int nbPersonnes,
            @Param("dateDebut") LocalDateTime dateDebut,
            @Param("dateFin") LocalDateTime dateFin
    );

}
