package com.dimento.beleganbei; // replace your-apps-package-name with your app’s package name

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.os.StrictMode;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Properties;
import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;

/* RESULT CODES/DATA
  NONE
*/

public class SendMail extends ReactContextBaseJavaModule {
    private String TAG = "SendMail";
    private ReactApplicationContext reactContext;

    SendMail(ReactApplicationContext context) {
      super(context);
      reactContext = context;

        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
    }

    @Override
    public String getName() {
        return "SendMail";
    }

    @ReactMethod
    public void send(String sendType, String mailSettings, String recipientsData, String senderData, String belegeData) {
        Log.d(TAG, "SendMail sendType " + sendType);
        Log.d(TAG, "SendMail mailSettings " + mailSettings);
        Log.d(TAG, "SendMail recipientsData " + recipientsData);
        Log.d(TAG, "SendMail senderData " + senderData);
        Log.d(TAG, "SendMail belegeData " + belegeData);

        String[] items = {
            mailSettings,
            recipientsData,
            senderData,
            belegeData
        };

        Log.e(TAG, "Send mail action.... now");
        JSONObject result = Belegeinsendung.prepare(sendType, items);

        try {
            int resultCode = result.getInt("code");
            String resultMessage = result.getString("message");

            Log.e(TAG, "Send mail action.... resultCode -> " + resultCode);
            Log.e(TAG, "Send mail action.... message -> " + resultMessage);

            WritableMap params = Arguments.createMap();

            params.putString("type", sendType);
            params.putInt("code", resultCode);
            params.putString("message",  resultMessage);

            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("BELEGE_SENDED_RESULT", params);
        } catch (JSONException e) {
            WritableMap params = Arguments.createMap();

            params.putString("type", sendType);
            params.putInt("code", 401);
            params.putString("message",  "Fehler bei der Ergebnisevaluierung...");

            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("BELEGE_SENDED_RESULT", params);
        }

        Log.e(TAG, "Send mail action.... result -> " + result.toString());
    }

    @ReactMethod
    public void contact(String content, String mailSettings, String recipientsData, String senderData) {
        Log.d(TAG, "contact content " + content);
        Log.d(TAG, "contact mailSettings " + mailSettings);
        Log.d(TAG, "contact recipientsData " + recipientsData);
        Log.d(TAG, "contact senderData " + senderData);

        Spinner.showSpinner();

        String[] items = {
            content,
            mailSettings,
            recipientsData,
            senderData
        };

        Log.e(TAG, "contact Send mail action.... now");
        JSONObject result = Kontakteinsendung.prepare(items);

        try {
            int resultCode = result.getInt("code");

            if(resultCode == 200) {
                WritableMap params = Arguments.createMap();
                params.putInt("code", 200);
                params.putString("message",  result.getString("message"));

                WritableMap details = Arguments.createMap();
                params.putMap("result",  details);

                Spinner.hideSpinner();

                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("CONTACT_FORM_SENDED", params);
            } else {
                WritableMap params = Arguments.createMap();
                params.putInt("code", resultCode);
                params.putString("message",  result.getString("message"));

                Spinner.hideSpinner();

                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("CONTACT_FORM_SENDED", params);
            }

        } catch (JSONException e) {
            WritableMap params = Arguments.createMap();

            params.putInt("code", 401);
            params.putString("message",  "Fehler bei der Ergebnisevaluierung...");

            Spinner.hideSpinner();

            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("CONTACT_FORM_SENDED", params);
        }

        Log.e(TAG, "contact Send mail action.... result -> " + result.toString());
    }
}