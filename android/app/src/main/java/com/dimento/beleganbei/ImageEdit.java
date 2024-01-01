package com.dimento.beleganbei; // replace your-apps-package-name with your app’s package name

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;


/* RESULT CODES/DATA
  NONE
*/

public class ImageEdit extends ReactContextBaseJavaModule implements ActivityEventListener {
  private String TAG = "ImageEdit";
  private String useImageId;
  private static ReactApplicationContext reactContext;

    private Integer REQUEST_CODE = 400;

    ImageEdit(ReactApplicationContext context) {
      super(context);
      reactContext = context;
      reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "ImageEdit";
    }

    @ReactMethod
    public void edit(String imageId, String imageSrc, Double jpegQuality, String bgColor, String textColor) {
        Log.d("", "ImageEdit edit " + imageSrc);

        useImageId = imageId;

        File filesDir = reactContext.getFilesDir();
        String destPath = filesDir.getAbsolutePath();
        Log.i(TAG, "destPath -> " + destPath);

        reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Intent ImageEditActivityIntent = new Intent(getReactApplicationContext(), ImageEditActivity.class);

                ImageEditActivityIntent.putExtra("file", imageSrc);
                ImageEditActivityIntent.putExtra("imageViewImageIndex", 0);
                ImageEditActivityIntent.putExtra("folder", destPath);
                ImageEditActivityIntent.putExtra("jpegQuality", jpegQuality);
                ImageEditActivityIntent.putExtra("bgColor", bgColor);
                ImageEditActivityIntent.putExtra("textColor", textColor);

                ImageEditActivityIntent.putExtra("returnToDetailview", "1");

                getCurrentActivity().startActivityForResult(ImageEditActivityIntent, REQUEST_CODE);
           }
        });
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_CODE) {
            Log.i(TAG, "requestCode -> " + requestCode);
            Log.i(TAG, "resultCode -> " + resultCode);

            if (resultCode == Activity.RESULT_OK) {
                Log.i(TAG, "RESULT_OK");

                String path = data.getStringExtra("path");

                WritableMap params = Arguments.createMap();
                params.putInt("code", 200);

                WritableMap paramsResult = Arguments.createMap();
                paramsResult.putString("path", path);
                paramsResult.putString("imageId", useImageId);
                params.putMap("result", paramsResult);

                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("IMAGE_EDITED", params);
            } else {
                int Code = data.getIntExtra("code", 0);

                WritableMap params = Arguments.createMap();

                if(Code == 407) {
                    params.putInt("code", 407);
                    params.putString("message", "Speichern fehlgeschlagen");
                } else if(Code == 408) {
                    params.putInt("code", 408);
                    params.putString("message", "Unbekannter Fehler");
                } else if(Code == 409) {
                    params.putInt("code", 409);
                    params.putString("message", "Speichern fehlgeschlagen");
                } else if(Code == 410) {
                    params.putInt("code", 410);
                    params.putString("message", "Einlesen der Datei fehlgeschlagen");
                } else if(Code == 411) {
                    params.putInt("code", 411);
                    params.putString("message", "Datei konnte nicht geöffnet/gefunden werden");
                } else if(Code == 412) {
                    params.putInt("code", 412);
                    params.putString("message", "Datei konnte nicht geöffnet/gefunden werden");
                } else {
                    params.putInt("code", 400);
                    params.putString("message", "Abbruch");
                }

                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("IMAGE_EDITED", params);
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
       //
    }
}
