package com.dimento.beleganbei;

import static com.dimento.beleganbei.Kontakteinsendung.setErrorResult;
import static com.dimento.beleganbei.Kontakteinsendung.setResult;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.Address;
import javax.mail.AuthenticationFailedException;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.SendFailedException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

public class EmailUtil {

    /**
     * Utility method to send simple HTML email
     * @param session
     * @param recipients
     * @param from
     * @param replyTo
     * @param subject
     * @param body
     */
    public static JSONObject sendEmail(Session session, JSONArray recipients, String[] from, String[] replyTo, String subject, String body){
        Log.i("sendEmail", "subject: " + subject);
        Log.i("sendEmail", "body: " + body);
        Log.i("sendEmail", "from 0: " + from[0]);
        Log.i("sendEmail", "from 1: " + from[1]);
        Log.i("sendEmail", "replyTo 0: " + replyTo[0]);
        Log.i("sendEmail", "replyTo 1: " + replyTo[1]);
        Log.i("sendEmail", "recipients: " + recipients.toString());

        try {
            MimeMessage msg = new MimeMessage(session);
            //set message headers

            msg.addHeader("Content-type", "text/HTML; charset=UTF-8");
            msg.addHeader("format", "flowed");
            msg.addHeader("Content-Transfer-Encoding", "8bit");

            msg.setFrom(new InternetAddress(from[0], from[1]));

            InternetAddress[] replyToAdress = new InternetAddress[1];
            replyToAdress[0] = new InternetAddress(replyTo[0], replyTo[1]);
            msg.setReplyTo(replyToAdress);

            msg.setSubject(subject, "UTF-8");
            msg.setText(body, "UTF-8");

            msg.setSentDate(new Date());

            InternetAddress[] recipientAddress = new InternetAddress[recipients.length()];
            for(int i=0;i<recipients.length();i++) {
                JSONObject recipient = recipients.getJSONObject(i);
                recipientAddress[i] = new InternetAddress(recipient.getString("email"), recipient.getString("name"));
            }
            msg.setRecipients(Message.RecipientType.TO, recipientAddress);

            System.out.println("Message is ready");

            Transport.send(msg);

            WritableMap details = Arguments.createMap();

            System.out.println("EMail Sent Successfully!!");
            return setResult(200, "Email erfolgreich versandt!", details);
        } catch (AuthenticationFailedException e) {
            e.printStackTrace();
            return setErrorResult(406, "Authentifzierung fehlgeschlagen. Email Einstellungen überprüfen! I: " + e.getLocalizedMessage());
        } catch (SendFailedException e) {
            e.printStackTrace();
            return setErrorResult(406, "Senden fehlgeschlagen. Email Einstellungen überprüfen! I: " + e.getLocalizedMessage());
        } catch (MessagingException e) {
            e.printStackTrace();
            return setErrorResult(406, "Sendefehler. Internetverbindung und Email Einstellungen überprüfen! I: " + e.getLocalizedMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return setErrorResult(407, "JSONException I: " + e.getMessage());
        }
    }






    /**
     * Utility method to send email with attachment
     * @param session
     * @param toEmail
     * @param subject
     * @param body
     */
    public static void sendAttachmentEmail(Session session, String toEmail, String subject, String body){
        try{
            MimeMessage msg = new MimeMessage(session);
            msg.addHeader("Content-type", "text/HTML; charset=UTF-8");
            msg.addHeader("format", "flowed");
            msg.addHeader("Content-Transfer-Encoding", "8bit");

            msg.setFrom(new InternetAddress("no_reply@example.com", "NoReply-JD"));

            msg.setReplyTo(InternetAddress.parse("no_reply@example.com", false));

            msg.setSubject(subject, "UTF-8");

            msg.setSentDate(new Date());

            msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail, false));


            BodyPart messageBodyPart = new MimeBodyPart(); // Create the message body part
            messageBodyPart.setText(body); // Fill the message

            Multipart multipart = new MimeMultipart(); // Create a multipart message for attachment
            multipart.addBodyPart(messageBodyPart); // Set text message part

            // Second part is attachment
            messageBodyPart = new MimeBodyPart();
            String filename = "abc.txt";
            DataSource source = new FileDataSource(filename);
            messageBodyPart.setDataHandler(new DataHandler(source));
            messageBodyPart.setFileName(filename);
            multipart.addBodyPart(messageBodyPart);

            // Send the complete message parts
            msg.setContent(multipart);

            // Send message
            Transport.send(msg);
            System.out.println("EMail Sent Successfully with attachment!!");
        }catch (MessagingException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    /**
     * Utility method to send image in email body
     * @param session
     * @param toEmail
     * @param subject
     * @param body
     */
    public static void sendImageEmail(Session session, String toEmail, String subject, String body){
        try{
            MimeMessage msg = new MimeMessage(session);
            msg.addHeader("Content-type", "text/HTML; charset=UTF-8");
            msg.addHeader("format", "flowed");
            msg.addHeader("Content-Transfer-Encoding", "8bit");

            msg.setFrom(new InternetAddress("no_reply@example.com", "NoReply-JD"));

            msg.setReplyTo(InternetAddress.parse("no_reply@example.com", false));

            msg.setSubject(subject, "UTF-8");

            msg.setSentDate(new Date());

            msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail, false));

            // Create the message body part
            BodyPart messageBodyPart = new MimeBodyPart();

            messageBodyPart.setText(body);

            // Create a multipart message for attachment
            Multipart multipart = new MimeMultipart();

            // Set text message part
            multipart.addBodyPart(messageBodyPart);

            // Second part is image attachment
            messageBodyPart = new MimeBodyPart();
            String filename = "image.png";
            DataSource source = new FileDataSource(filename);
            messageBodyPart.setDataHandler(new DataHandler(source));
            messageBodyPart.setFileName(filename);
            //Trick is to add the content-id header here
            messageBodyPart.setHeader("Content-ID", "image_id");
            multipart.addBodyPart(messageBodyPart);

            //third part for displaying image in the email body
            messageBodyPart = new MimeBodyPart();
            messageBodyPart.setContent("<h1>Attached Image</h1>" +
                    "<img src='cid:image_id'>", "text/html");
            multipart.addBodyPart(messageBodyPart);

            //Set the multipart message to the email message
            msg.setContent(multipart);

            // Send message
            Transport.send(msg);
            System.out.println("EMail Sent Successfully with image!!");
        }catch (MessagingException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }
}