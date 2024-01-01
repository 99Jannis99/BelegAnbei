package com.dimento.beleganbei;

import android.content.ContentResolver;
import android.content.Context;
import android.net.Uri;
import android.os.Handler;
import android.util.Log;
import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.Arrays;
import java.util.UUID;

/* Import PDF files */
public class ImportPDF extends ReactContextBaseJavaModule {
    static final private String TAG = "ImportPDF";

    public static void handleIntent(Context context, ReactContext reactContext, String packageName, Intent intent) {
        final JSONObject json = toJSONObject(context, intent);

        Log.i(TAG, "INCOMING: json " + json.toString());

        //final ContentResolver contentResolver = context.getContentResolver();
        try {
            final JSONArray fileDescriptor2 = json.getJSONArray("items");
            //Log.i(TAG, "INCOMING: fileDescriptor2 " + fileDescriptor2.toString());

            final JSONObject fileDescriptor = fileDescriptor2.getJSONObject(0);
            Log.i(TAG, "INCOMING: fileDescriptor " + fileDescriptor.toString());

            final Uri uri = Uri.parse(fileDescriptor.getString("uri"));
            //final String data = Serializer.getDataFromURI(contentResolver, uri);

            Log.i(TAG, "INCOMING: uri " + uri.toString());
            //Log.i(TAG, "INCOMING: data " + data);

            String path = fileDescriptor.has("path") ? fileDescriptor.getString("path") : "";

            String guid = UUID.randomUUID().toString();
            String filename = path.substring(path.lastIndexOf("/")+1);
            String name = filename.replace(".pdf", "").replace("-", " ").replace("_", " ");

            /*params.putString("_id", guid);
            params.putString("name", name);
            params.putString("sourceFilename", filename);
            params.putString("targetFilename", guid + ".pdf");
            params.putString("type", fileDescriptor.getString("type"));
            params.putString("uri", fileDescriptor.getString("uri"));
            //params.putString("base64", data);*/

            File filesDir = reactContext.getFilesDir();
            String destPath = filesDir.getAbsolutePath() + "/" + guid + ".pdf";

            FileUtils.saveToFile(reactContext, uri, destPath);

            WritableMap params = Arguments.createMap();
            if(!FileUtils.fileExists(destPath)) {
                params.putInt("code", 407);
                params.putString("message", "Ziel konnte nicht erstellt werden");
            } else {
                params.putInt("code", 200);
                WritableMap paramsResult = Arguments.createMap();
                paramsResult.putString("name", guid);
                paramsResult.putString("path", destPath);
                paramsResult.putString("type", "application/pdf");
                paramsResult.putString("addToItemIdentifer", "");
                //params.putString("sourceFilename", filename);
                //params.putString("targetFilename", filename);
                //params.putString("uri", uri.toString());
                params.putMap("result", paramsResult);
            }
            Log.i(TAG, "INCOMING: params " + params.toString());

            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("NEW_PDF_IMPORT", params);
        }
        catch (JSONException e) {
            Log.i(TAG, "INCOMING: ERR " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static JSONObject toJSONObject(Context context, final Intent intent) {
        try {
            final ContentResolver contentResolver = context.getContentResolver();
            return Serializer.toJSONObject(contentResolver, intent);
        } catch (JSONException e) {
            Log.e(TAG, "Error converting intent to JSON: " + e.getMessage());
            Log.e(TAG, Arrays.toString(e.getStackTrace()));
            return null;
        }
    }

    @NonNull
    @Override
    public String getName() {
        return null;
    }
}