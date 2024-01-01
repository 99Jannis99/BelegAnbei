package com.dimento.beleganbei; // replace your-apps-package-name with your app’s package name

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;

import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Map;
import java.util.Stack;
import java.util.UUID;

import androidx.core.app.ActivityCompat;

import static androidx.core.app.ActivityCompat.finishAfterTransition;
import static androidx.core.app.ActivityCompat.startActivityForResult;
import static androidx.core.content.ContextCompat.startActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/* RESULT CODES/DATA
  NONE
*/

public class BelegeStore extends ReactContextBaseJavaModule {
    private static String TAG = "BelegeStore";
    private static ReactApplicationContext reactContext;

    private static String jsonFileName = "belegestore.json";

    private static File jsonFile;

    BelegeStore(ReactApplicationContext context) {
        reactContext = context;

        jsonFile = new File(reactContext.getFilesDir(), jsonFileName);
    }

    @Override
    public String getName() {
        return "BelegeStore";
    }

    @ReactMethod
    public static void read() {
        Log.d(TAG, "BelegeStore read");

        if(!jsonFileExists()) {
            createJsonFile("[]");
        }

        String jsonString = getJsonFileContents();
        Log.d(TAG, "BelegeStore read jsonString -> " + jsonString);

        WritableMap params = Arguments.createMap();
        params.putString("result", jsonString);
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("BELEGESTORE_UPDATED", params);
    }

    @ReactMethod
    public static void save(String newData) {
        Log.d(TAG, "BelegeStore save -> " + newData);
        if (createJsonFile(newData)) {
            Log.d(TAG, "BelegeStore saved !");
            read();
        }
    }

    @ReactMethod
    public static void delete(String belegID, String deleteData) {
        Log.d(TAG, "BelegeStore delete belegID -> " + belegID);
        Log.d(TAG, "BelegeStore delete deleteData -> " + deleteData);

        // DELETE ACTION
        try {
            JSONArray files = new JSONArray(deleteData);

            for(int i = 0; i< files.length(); i++) {
                String deleteFilePath = files.getString(i);
                Log.d(TAG, "BelegeStore delete file -> " + deleteFilePath);

                File deleteFile = new File(deleteFilePath);
                if (deleteFile.exists()) {
                    boolean deleted = deleteFile.delete();
                    Log.e(TAG, "BelegeStore delete file deleted" + deleted);
                } else {
                    Log.e(TAG, "BelegeStore delete file deleted !! NOT EXISTS");
                }
            }

            WritableMap params = Arguments.createMap();
            params.putInt("code", 200);
            params.putString("_id", belegID);
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("BELEG_DELETED", params);
        } catch (JSONException e) {
            e.printStackTrace();

            WritableMap params = Arguments.createMap();
            params.putInt("code", 401);
            params.putString("message", "Die Belegdaten (Dateien) wurden nicht (alle) entfernt. Führen Sie ggf. \"App aufräumen\" aus.");
            params.putString("_id", belegID);
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("BELEG_DELETED", params);
        }
    }

    private static String getJsonFileContents() {
        try {
            FileReader fileReader = new FileReader(jsonFile);
            BufferedReader bufferedReader = new BufferedReader(fileReader);
            StringBuilder stringBuilder = new StringBuilder();
            String line = bufferedReader.readLine();
            while (line != null){
                stringBuilder.append(line);
                line = bufferedReader.readLine();
            }
            bufferedReader.close();

            return stringBuilder.toString();
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static Boolean jsonFileExists() {
        return jsonFile.exists();
    }

    private static Boolean createJsonFile(String saveData) {
        try {
            FileOutputStream fos = new FileOutputStream(jsonFile);
            fos.write(saveData.getBytes());
            fos.close();
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    /*
    public static void add(WritableMap newData) {
        Log.d(TAG, "BelegeStore save async -> " + newData.toString());

        String jsonString = getJsonFileContents();
        Log.d(TAG, "BelegeStore save jsonString -> " + jsonString);

        try {
            JSONArray json  = new JSONArray(jsonString);
            Log.d(TAG, "BelegeStore save JSONArray -> " + json.toString());

            // SAVE
            Calendar calendar = Calendar.getInstance();
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String dateTime = simpleDateFormat.format(calendar.getTime()).toString();

            JSONObject newSet = new JSONObject();

            newSet.put("_id", UUID.randomUUID());
            newSet.put("type", "image");
            newSet.put("group", "standard");
            newSet.put("groupSpecific", "belegzentrale");
            newSet.put("added", dateTime);
            newSet.put("update", dateTime);
            newSet.put("previewImage", "");
            newSet.put("targetPDF", "");

            JSONArray pages = new JSONArray();

            JSONObject page = new JSONObject();
            page.put("imageId", UUID.randomUUID());
            page.put("imageSource", "");
            page.put("imageWidth", 1);
            page.put("imageHeight", 2);
            page.put("imageSize", 3);
            page.put("imageMime", "");
            pages.put(page);

            newSet.put("pages", pages);

            JSONObject settings = new JSONObject();

            JSONObject standard = new JSONObject();
                standard.put("category_id", "");
                standard.put("comment", "");
            settings.put("standard", standard);

            JSONObject ek = new JSONObject();
            ek.put("category_id", "");
            ek.put("comment", "");
            ek.put("year", 2023);
            settings.put("ek", ek);

            JSONObject belegzentrale = new JSONObject();
            belegzentrale.put("category_id", "");
            belegzentrale.put("comment", "");
            settings.put("belegzentrale", belegzentrale);

            JSONObject DUO = new JSONObject();
            DUO.put("client_id", "");
            DUO.put("category_id", "");
            DUO.put("comment", "");
            settings.put("DUO", DUO);

            JSONObject MeineSteuern = new JSONObject();
            MeineSteuern.put("year", 2023);
            MeineSteuern.put("client_id", "");
            MeineSteuern.put("category_id", "");
            MeineSteuern.put("comment", "");
            settings.put("MeineSteuern", MeineSteuern);

            JSONObject Addison = new JSONObject();
            Addison.put("client_id", "");
            Addison.put("category_id", "");
            Addison.put("comment", "");
            settings.put("Addison", Addison);

            newSet.put("settings", settings);

            json.put(newSet);
            Log.d(TAG, "BelegeStore save JSONArray -> " + json.toString());

            createJsonFile(json.toString());
            // SAVE

            read();
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }
    */
}
