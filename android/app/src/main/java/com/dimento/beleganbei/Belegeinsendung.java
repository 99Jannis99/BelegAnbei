package com.dimento.beleganbei;

import static com.dimento.beleganbei.Kontakteinsendung.setErrorResult;

import android.util.Log;
import java.util.*;
import java.text.SimpleDateFormat;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;

public class Belegeinsendung {
    private static String TAG = "Belegeinsendung";
    private JSONObject mailSettings;
    private JSONArray recipientsData;
    private JSONObject senderData;
    private JSONArray belegeData;

    private static String dateTime;
    private static String dateOnly;

    private static HashMap<String,String> HashMap=new HashMap<String,String>();

    public static JSONObject prepare(String sendType, String[] setup) {
        String _mailSettings = setup[0];
        String _recipientsData = setup[1];
        String _senderData = setup[2];
        String _belegeData = setup[3];

        try {
            JSONObject mailSettings = new JSONObject(_mailSettings);
            Log.e(TAG, "mailSettings --> " + mailSettings.toString());

            String state = mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("config").getString("state");
            HashMap.put("state", state);

            HashMap.put("setting_addOverviewSheet", mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("config").getJSONObject("settings").getString("add_overview_sheet"));
            HashMap.put("setting_smtpTimeout", mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("config").getJSONObject("settings").getString("smtp_timeout"));
            HashMap.put("setting_transportMethod", mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("config").getJSONObject("settings").getString("transport_method"));

            HashMap.put("server_host", mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("config").getJSONObject("server").getString("host"));
            HashMap.put("server_port", mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("config").getJSONObject("server").getString("port"));
            HashMap.put("server_email", mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("config").getJSONObject("server").getString("user_email"));
            HashMap.put("server_user", mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("config").getJSONObject("server").getString("user_name"));
            HashMap.put("server_passwd", mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("config").getJSONObject("server").getString("user_passwd"));

            HashMap.put("customer_name", mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("config").getJSONObject(state).getString("sender_name"));
            HashMap.put("customer_email", mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("config").getJSONObject(state).getString("sender_email"));
            HashMap.put("customer_reply", mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("config").getJSONObject(state).getString("sender_reply"));

            JSONArray recipientsData = new JSONArray(_recipientsData);
            Log.e(TAG, "recipientsData --> " + recipientsData.toString());
            HashMap.put("recipients", _recipientsData);
            HashMap<String,String> recipients = new HashMap<String,String>();
            for(int i=0;i<recipientsData.length();i++) {
                JSONObject recipient = recipientsData.getJSONObject(i);
                recipients.put(recipient.getString("name"), recipient.getString("email"));
            }

            JSONObject senderData = new JSONObject(_senderData);
            Log.e(TAG, "senderData --> " + senderData.toString());

            HashMap.put("sender_name", senderData.getString("name"));
            HashMap.put("sender_manno", senderData.getString("manno"));
            HashMap.put("sender_email", senderData.getString("email"));
            HashMap.put("sender_phone", senderData.getString("phone"));
            HashMap.put("sender_locationName", senderData.getJSONObject("location").getString("name"));
            HashMap.put("sender_locationCity", senderData.getJSONObject("location").getString("city"));
            HashMap.put("sender_personName", senderData.getJSONObject("person").getString("name"));
            HashMap.put("sender_personEmail", senderData.getJSONObject("person").getString("email"));

            HashMap.put("comment", senderData.getString("comment"));

            JSONArray belegeData = new JSONArray(_belegeData);
            Log.e(TAG, "belegeData --> " + belegeData.toString());
            HashMap.put("belege", _belegeData);

            HashMap.put("cloud_path", placeholders(mailSettings.getJSONObject("data").getJSONObject("cloud").getString("path"), HashMap));

            HashMap.put("filename_beleg", placeholders(mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("filenames").getString("beleg"), HashMap));
            HashMap.put("filename_overview", placeholders(mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("filenames").getString("overview"), HashMap));
            HashMap.put("filename_comment", placeholders(mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("filenames").getString("comment"), HashMap));
            HashMap.put("filename_singleComment", placeholders(mailSettings.getJSONObject("data").getJSONObject("mail").getJSONObject("filenames").getString("single_comment"), HashMap));

            if(sendType.equals("standard")) {
                JSONObject standardversand = getTemplate(mailSettings.getJSONObject("data").getJSONObject("mail").getJSONArray("templates"), "standardversand");
                if(standardversand == null) {
                    return setErrorResult(408, "Email Template für Standardversand wurde nicht gefunden!");
                }
                HashMap.put("template_subject", placeholders(standardversand.getString("msg_subject"), HashMap));
                HashMap.put("template_body", placeholders(standardversand.getString("msg_content"), HashMap));
            } else if(sendType.equals("ek")) {
                JSONObject ekversand = getTemplate(mailSettings.getJSONObject("data").getJSONObject("mail").getJSONArray("templates"), "ekversand");
                if(ekversand == null) {
                    return setErrorResult(408, "Email Template für Einkommensteuerversand wurde nicht gefunden!");
                }
                HashMap.put("template_subject", placeholders(ekversand.getString("msg_subject"), HashMap));
                HashMap.put("template_body", placeholders(ekversand.getString("msg_content"), HashMap));
            } else {
                return setErrorResult(408, "Email Template für " + sendType + " wurde nicht gefunden!");
            }
            Log.e("HashMap", "--> " + HashMap.toString());

            return send(HashMap, recipientsData);
            //return setErrorResult(999, "TEST ");
        } catch (JSONException e) {
            Log.e(TAG, "JSONException " + e.getMessage());
            e.printStackTrace();
            return setErrorResult(407, "Ausnahmefehler JSON. I: " + e.getMessage());
        } catch (Exception e) {
            Log.e(TAG, "Exception " + e.getMessage());
            e.printStackTrace();
            return setErrorResult(407, "Ausnahmefehler. I: " + e.getMessage());
        }
    }

    public static JSONObject send(HashMap args, JSONArray recipientsData) {
        final String username = args.get("server_user").toString();
        final String password = args.get("server_passwd").toString();
        final String toEmail = args.get("cloud_path").toString();

        System.out.println("Belegeinsendung --> init");
        Properties props = new Properties();
        props.put("mail.smtp.host", args.get("server_host").toString());
        props.put("mail.smtp.port", args.get("server_port").toString());

        props.put("mail.smtp.auth", "true"); //enable authentication

        if(args.get("setting_transportMethod").toString().equals("tls")) {
            props.put("mail.smtp.starttls.enable", "true"); //enable STARTTLS
        } else if(args.get("setting_transportMethod").toString().equals("ssl")) {
            props.put("mail.smtp.socketFactory.port", args.get("server_port").toString());
            props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            props.put("mail.smtp.socketFactory.fallback", "true");
        } else {
            return setErrorResult(405, "Sende-Method entweder 'SSL' oder 'TLS'");
        }

        props.put("mail.smtp.connectiontimeout", args.get("setting_smtpTimeout").toString());
        props.put("mail.smtp.timeout", args.get("setting_smtpTimeout").toString());

        Authenticator auth = new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
            return new PasswordAuthentication(username, password);
            }
        };
        Session session = Session.getInstance(props, auth);

        String[] from = {
            args.get("customer_email").toString(),
            args.get("customer_name").toString()
        };

        String[] replyTo = {
            args.get("customer_reply").toString(),
            args.get("customer_name").toString()
        };

        return EmailUtil.sendEmail(session, recipientsData, from, replyTo, args.get("template_subject").toString(), args.get("template_body").toString());
    }

    public static JSONObject getTemplate(JSONArray templates, String templateKey) {
        for(int i=0;i<templates.length();i++) {
            try {
                JSONObject object = templates.getJSONObject(i);
                String key = object.getString("typename");

                if(key.equals(templateKey)) {
                    return object;
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    public static String placeholders(String template, HashMap args) {
        Log.e(TAG, "placeholders args " + args.toString());
        String replaced = template;

        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat dateTimeFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss aaa z");
        dateTime = dateTimeFormat.format(calendar.getTime()).toString();

        SimpleDateFormat dateOnlyFormat = new SimpleDateFormat("dd.MM.yyyy");
        dateOnly = dateOnlyFormat.format(calendar.getTime()).toString();

        String addressee = "";
        if(args.containsKey("recipients")) {
            try {
                JSONArray recipients = new JSONArray(args.get("recipients").toString());
                for(int i=0;i<recipients.length();i++) {
                    JSONObject recipient = recipients.getJSONObject(i);

                    addressee += recipient.getString("name");
                    addressee += " - ";
                    addressee += recipient.getString("email");
                    addressee += "\r\n";
                }
            } catch (JSONException e) {
                Log.e(TAG, "JSONException " + e.getMessage());
                e.printStackTrace();
            }
        }

        int belegeCount = 0;
        String belegeList = "";
        if(args.containsKey("filename_beleg")) {
            try {
                JSONArray belege = new JSONArray(args.get("belege").toString());
                for(int i=0;i<belege.length();i++) {
                    JSONObject beleg = belege.getJSONObject(i);
                    Log.e(TAG, "beleg " + beleg.toString());

                    String filename = args.get("filename_beleg").toString()
                            .replace(".pdf", "-" + i + ".pdf")
                            .replace("[pages]", beleg.getString("pages"))
                            .replace("[type]", beleg.getString("type"))
                            .replace("[category_short]", beleg.getJSONObject("category").getString("short"))
                            .replace("[category_full]", beleg.getJSONObject("category").getString("name"));

                    filename = filename.replace("ä", "ae")
                            .replace("Ä", "Ae")
                            .replace("ö", "oe")
                            .replace("Ö", "Oe")
                            .replace("ü", "ue")
                            .replace("Ü", "Ue")
                            .replace("ß", "ss")
                            .replace("ä", "ae")
                            .replace("Ä", "Ae")
                            .replace(" ", "_")
                            .replace("---", "-")
                            .replace("--", "-");

                    belegeList += (i+1) + ") PDF in:";
                    belegeList += beleg.getString("pdf");
                    belegeList += " | PDF out:";
                    belegeList += filename;
                    belegeList += "\r\n";

                    belegeCount++;
                }
            } catch (JSONException e) {
                Log.e(TAG, "JSONException belege " + e.getMessage());
                e.printStackTrace();
            }
        }

        try {
            replaced = template.replace("[cloud_folder]", args.get("cloud_path").toString());
        } catch (NullPointerException e) {
            Log.e(TAG, "NullPointerException " + e.getMessage());
            e.printStackTrace();
        }

        try {
            replaced = template.replace("[date]", dateTime.toString())
                    .replace("[dateonly]", dateOnly.toString())
                    .replace("[mandant_name]", args.get("sender_name").toString())
                    .replace("[mandant_no]", args.get("sender_manno").toString())
                    .replace("[mandant_email]", args.get("sender_email").toString())
                    .replace("[mandant_tel]", args.get("sender_phone").toString())
                    .replace("[comment]", args.get("comment").toString())
                    .replace("[addressee]", addressee)
                    .replace("[belege_count]", String.valueOf(belegeCount))
                    .replace("[belege_list]", belegeList);
        } catch (NullPointerException e) {
            Log.e(TAG, "NullPointerException " + e.getMessage());
            e.printStackTrace();
        }
        Log.e(TAG, "replaced AFTER" + replaced);

        return replaced;
    }
}