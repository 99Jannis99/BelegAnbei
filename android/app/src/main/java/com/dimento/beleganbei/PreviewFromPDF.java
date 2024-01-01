package com.dimento.beleganbei; // replace your-apps-package-name with your app’s package name

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.pdf.PdfRenderer;
import android.os.ParcelFileDescriptor;
import android.util.Base64;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.UUID;

/* RESULT CODES/DATA
  NONE
*/

public class PreviewFromPDF extends ReactContextBaseJavaModule {
    final private String TAG = "PreviewFromPDF";

    public ReactApplicationContext reactContext;

    PdfRenderer renderer = null;
    public String addToItemIdentifer;

    public PreviewFromPDF(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "PreviewFromPDF";
    }

    @ReactMethod
    public void generate(String pdfSource, String addToItem) {
        Log.d(TAG, "PreviewFromPDF pdfSource " + pdfSource);
        Log.d(TAG, "PreviewFromPDF addToItem " + addToItem);

        addToItemIdentifer = addToItem;

        reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                String inputFile;

                String imageBase64Data;

                if(pdfSource.isEmpty()) {
                    WritableMap params = Arguments.createMap();
                    params.putInt("code", 407);
                    params.putString("message", "PDF Quelle nicht angegeben");

                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("PDFPREVIEW_GENERATED", params);

                    return;
                }

                inputFile = pdfSource.replace("file:///", "/");
                Integer usePage = 0;

                Log.i(TAG,"************** inputFile " + inputFile);
                Log.i(TAG,"************** usePage " +usePage);

                try {
                    File sourceFile = new File(inputFile);

                    renderer = new PdfRenderer(ParcelFileDescriptor.open(sourceFile, ParcelFileDescriptor.MODE_READ_ONLY));

                    try {
                        PdfRenderer.Page page = renderer.openPage(usePage);

                        final int pageCount = renderer.getPageCount();

                        Integer useWidth = page.getWidth();
                        Integer useHeight = page.getHeight();
                        Log.i(TAG,"************** useWidth FROM PDF " + useWidth);
                        Log.i(TAG,"************** useHeight FROM PDF " + useHeight);


                        Bitmap preBitmap = Bitmap.createBitmap(useWidth, useHeight, Bitmap.Config.ARGB_4444);

                        Bitmap bitmap = Bitmap.createBitmap(preBitmap.getWidth(), preBitmap.getHeight(), preBitmap.getConfig());

                        Canvas canvas = new Canvas(bitmap);
                        canvas.drawColor(Color.WHITE);
                        canvas.drawBitmap(preBitmap, 0, 0, null);

                        Rect rect = new Rect(0, 0, useWidth, useHeight);

                        page.render(bitmap, rect, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);

                        //imageBase64Data = convert(bitmap);

                        String guid = UUID.randomUUID().toString();
                        String filename = guid + ".png";

                        //File filesDir = reactContext.getCacheDir(); // ue this when optimize image (see blow) is active
                        File filesDir = reactContext.getFilesDir();
                        String destPath = filesDir.getAbsolutePath() + "/" + filename;
                        Log.i(TAG, "destPath -> " + destPath);

/*
* EDIT AND OPTIMIZE IMAGE HERE BEFORE RETURNING
* --> bitmap --> optimize --> save
* --> delete "old" file, return new
* */

                        FileUtils.saveBitmapToFile(bitmap, destPath);

                        //final Integer b63str = imageBase64Data.length();
                        //final Double approxSize =  ((b63str * 0.75) - 2); // == -> 2, = -> 1

                        page.close();

                        //Log.i(TAG, "RESULT imageBase64Data " + imageBase64Data);

                        WritableMap params = Arguments.createMap();
                        if(!FileUtils.fileExists(destPath)) {
                            params.putInt("code", 410);
                            params.putString("message", "Ziel konnte nicht erstellt werden");
                        } else {
                            params.putInt("code", 200);
                            WritableMap paramsResult = Arguments.createMap();
                            paramsResult.putString("path", destPath);
                            paramsResult.putString("addToItemIdentifer", addToItemIdentifer);
                            params.putMap("data", paramsResult);
                        }

                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("PDFPREVIEW_GENERATED", params);
                    } catch (Exception e) {
                        WritableMap params = Arguments.createMap();

                        params.putInt("code", 408);
                        params.putString("message", "Seite im PDF nicht gefunden");

                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("PDFPREVIEW_GENERATED", params);
                    }
                } catch (Exception e) {
                    WritableMap params = Arguments.createMap();

                    params.putInt("code", 409);
                    params.putString("message", "PDF Dateiname nicht korrekt, PDF prüfen.");

                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("PDFPREVIEW_GENERATED", params);
                }
            }
        });
    }

    public static Bitmap convert(String base64Str) throws IllegalArgumentException {
        byte[] decodedBytes = Base64.decode(
                base64Str.substring(base64Str.indexOf(",")  + 1),
                Base64.DEFAULT
        );

        return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
    }

    public static String convert(Bitmap bitmap) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);

        return Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT);
    }
}
