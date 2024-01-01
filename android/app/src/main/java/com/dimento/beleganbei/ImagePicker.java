package com.dimento.beleganbei; // replace your-apps-package-name with your app’s package name

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.Image;
import android.net.Uri;
import android.util.Log;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.UUID;

/* RESULT CODES/DATA
  NONE
*/

public class ImagePicker extends ReactContextBaseJavaModule implements ActivityEventListener {
    final private String TAG = "ImagePicker";

    private Integer REQUEST_CODE = 700;

    public ReactApplicationContext reactContext;
    public String addToItemIdentifer;
    public int useDPI;
    public Double useJPEGQuality;

    ImagePicker(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "ImagePicker";
    }

    @ReactMethod
    public void pick(String addToItem, int dpi, Double jpegQuality) {
        Log.d(TAG, "ImagePicker addToItem " + addToItem);
        Log.d(TAG, "ImagePicker dpi " + dpi);
        Log.d(TAG, "ImagePicker addToItem " + jpegQuality);

        addToItemIdentifer = addToItem;
        useDPI = dpi;
        useJPEGQuality = jpegQuality;

        reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                String[] mimeTypes = {"image/jpeg", "image/jpg", "image/png"};

                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.setType("image/*");
                intent.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes);
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

                ImageProcessor imageProcessor = new ImageProcessor();
                imageProcessor.initialize(reactContext, useDPI, useJPEGQuality, "jpg");

                if(ImageProcessor.createCacheBitmapFromURI(reactContext, uri)) {
                    String originalFileName = imageProcessor.getOriginalFileNameFromUri(reactContext, uri);
                    Bitmap resized = imageProcessor.checkAndSetResize();
                    String filePath = imageProcessor.createFilePath();
                    byte[] compressed = imageProcessor.compress(resized);

                    Boolean saved = imageProcessor.save(compressed, filePath);
                    if(saved) {
                        WritableMap params = Arguments.createMap();
                        params.putInt("code", 200);

                        Calendar calendar = Calendar.getInstance();
                        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                        String dateTime = simpleDateFormat.format(calendar.getTime()).toString();

                        WritableMap paramsResult = Arguments.createMap();
                        paramsResult.putString("uuid", UUID.randomUUID().toString());
                        paramsResult.putString("type", "image");
                        paramsResult.putString("source", "imagepicker");
                        paramsResult.putString("name", originalFileName);
                        paramsResult.putString("preview", filePath);
                        paramsResult.putString("date", dateTime);
                        paramsResult.putString("addToItemIdentifer", addToItemIdentifer);

                        WritableArray pages = Arguments.createArray();

                            WritableMap page = Arguments.createMap();
                            page.putString("uuid", UUID.randomUUID().toString());
                            page.putString("path", filePath);
                            page.putString("mime", imageProcessor.getFileMimeType());
                            page.putInt("size", imageProcessor.getFileSize(filePath));
                            page.putInt("width", resized.getWidth());
                            page.putInt("height", resized.getHeight());
                            pages.pushMap(page);

                        paramsResult.putArray("pages", pages);

                        params.putMap("data", paramsResult);

                        //BelegeStore.add(params);

                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("NEW_IMAGE_IMPORT", params);
                    } else {
                        WritableMap params = Arguments.createMap();
                        params.putInt("code", 410);
                        params.putString("message", "Ziel Datei konnte nicht erstellt werden");

                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("NEW_IMAGE_IMPORT", params);
                        return;
                    }

                    // Clean Bitmaps
                    resized.recycle();
                } else {
                    WritableMap params = Arguments.createMap();
                    params.putInt("code", 409);
                    params.putString("message", "Temporäre Datei konnte nicht erstellt werden");

                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("NEW_IMAGE_IMPORT", params);
                    return;
                }
            }

            if(resultCode == Activity.RESULT_CANCELED) {
                Log.i(TAG, "resultCode -> CANCELLED");

                WritableMap params = Arguments.createMap();
                params.putInt("code", 400);
                params.putString("message", "Abbruch");

                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("NEW_IMAGE_IMPORT", params);
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        //
    }
}
