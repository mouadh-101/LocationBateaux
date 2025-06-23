package org.nst.bateaux.service.Interface;
import org.nst.bateaux.entity.Notification;
import java.util.List;
import java.util.Optional;
public interface INotificationService {

    Notification ajouterNotification(Notification notification) ;
    void supprimerNotification(Long id);
    Notification updateNotification(Long id,Notification notification);
    Optional<Notification> chercherNotification(Long id);
    List<Notification> getAll();
}
