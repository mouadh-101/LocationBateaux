package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
import org.nst.bateaux.entity.Maintenance;
import org.nst.bateaux.entity.Notification;
import org.nst.bateaux.repository.NotificationRepository;
import org.nst.bateaux.service.Interface.INotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class NotificationService implements INotificationService {

    @Autowired
    NotificationRepository notificationRepository;

    @Override
    public Notification ajouterNotification(Notification notification)
    {
        return notificationRepository.save(notification);
    }

    @Override
    public void supprimerNotification(Long id)
    {
        notificationRepository.deleteById(id);
    }

    @Override
    public Notification updateNotification(Long id,Notification notification)
    {
        Notification i=notificationRepository.findById(id).orElse(null);
        i.setMessage(notification.getMessage());
        i.setDateEnvoie(notification.getDateEnvoie());
        return notificationRepository.save(i);
    }

    @Override
    public Optional<Notification> chercherNotification(Long id)
    {
        return notificationRepository.findById(id);
    }

    @Override
    public List<Notification> getAll() {return notificationRepository.findAll();}

}
