package com.example.backend.service.email;

import com.example.backend.exception.InternalServerException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService{
    @Autowired
    private JavaMailSender emailSender;

    //Gửi email
    @Override
    public void sendMessage(String from, String to, String subject, String message) {

        //MimeMailMessage  : có đính kèm file
        //SimpleMailMessage : nội dung thông thường 

        try {
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(message, true);
            emailSender.send(mimeMessage);
        } catch (MessagingException | MailException e) {
            throw new InternalServerException("Gửi email thất bại", e);
        }


    }
}
