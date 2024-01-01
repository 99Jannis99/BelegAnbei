package com.dimento.beleganbei; // replace your-apps-package-name with your app’s package name

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.facebook.react.bridge.WritableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.UUID;

/* RESULT CODES/DATA
  NONE
*/

public class PDFPicker extends ReactContextBaseJavaModule implements ActivityEventListener {
    private String TAG = "PDFPicker";

    public ReactApplicationContext reactContext;

    private Integer REQUEST_CODE = 750;
    public String addToItemIdentifer;

    PDFPicker(ReactApplicationContext context) {
      super(context);
      reactContext = context;
      reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "PDFPicker";
    }

    @ReactMethod
    public void pick(String addToItem) {
        Log.d(TAG, "PDFPicker addToItem " + addToItem);

        addToItemIdentifer = addToItem;

        reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.setType("application/pdf");
                getCurrentActivity().startActivityForResult(intent, REQUEST_CODE);
           }
        });
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_CODE) {
            Log.i(TAG, "requestCode -> " + requestCode);
            Log.i(TAG, "resultCode -> " + resultCode);

            if(resultCode == Activity.RESULT_OK) {
                Log.i(TAG, "resultCode -> OK");

                Uri uri = data.getData();
                Log.i(TAG, "getData() -> " + uri);

                String guid = UUID.randomUUID().toString();
                String filename = guid + ".pdf";
                File filesDir = reactContext.getFilesDir();
                String destPath = filesDir.getAbsolutePath() + "/" + filename;
                Log.i(TAG, "destPath -> " + destPath);

                FileUtils.saveToFile(getReactApplicationContext(), uri, destPath);

                if(!FileUtils.fileExists(destPath)) {
                    WritableMap params = Arguments.createMap();
                    params.putInt("code", 407);
                    params.putString("message", "Ziel konnte nicht erstellt werden");


                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("NEW_PDF_IMPORT", params);
                } else {
                    WritableMap params = Arguments.createMap();
                    params.putInt("code", 200);

                    ImageProcessor imageProcessor = new ImageProcessor();
                    String originalFileName = imageProcessor.getOriginalFileNameFromUri(reactContext, uri);

                    Calendar calendar = Calendar.getInstance();
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    String dateTime = simpleDateFormat.format(calendar.getTime()).toString();

                    WritableMap paramsResult = Arguments.createMap();
                    paramsResult.putString("uuid", UUID.randomUUID().toString());
                    paramsResult.putString("type", "pdf");
                    paramsResult.putString("source", "pdfpicker");
                    paramsResult.putString("name", originalFileName);
                    paramsResult.putString("targetPDF", destPath);
                    paramsResult.putInt("targetPDFSize", imageProcessor.getFileSize(destPath));
                    paramsResult.putString("date", dateTime);
                    paramsResult.putString("addToItemIdentifer", addToItemIdentifer);

                    WritableArray pages = Arguments.createArray();
                    paramsResult.putArray("pages", pages);

                    params.putMap("data", paramsResult);

                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("NEW_PDF_IMPORT", params);
                    /*
                    params.putInt("code", 200);
                    WritableMap paramsResult = Arguments.createMap();
                    paramsResult.putString("name", guid);
                    paramsResult.putString("path", destPath);
                    paramsResult.putString("type", "application/pdf");
                    paramsResult.putString("addToItemIdentifer", addToItemIdentifer);
                    //params.putString("sourceFilename", filename);
                    //params.putString("targetFilename", filename);
                    //params.putString("uri", uri.toString());
                    params.putMap("result", paramsResult);
                    */
                }
            }

            if(resultCode == Activity.RESULT_CANCELED) {
                Log.i(TAG, "resultCode -> CANCELLED");

                WritableMap params = Arguments.createMap();
                params.putInt("code", 400);
                params.putString("message", "Abbruch");

                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("NEW_PDF_IMPORT", params);
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        //
    }
}
