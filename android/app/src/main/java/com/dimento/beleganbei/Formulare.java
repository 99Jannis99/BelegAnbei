package com.dimento.beleganbei; // replace your-apps-package-name with your app’s package name

import static androidx.core.app.ActivityCompat.startActivityForResult;

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


/* RESULT CODES/DATA
message ->
    only on on error/cancel

code ->
    201 OK
    400 Cancel
    401 neither RESULT OK nor CANCELLED - shouldnt happen
    402 OK, but no result given
*/

public class Formulare extends ReactContextBaseJavaModule implements ActivityEventListener {
    private String TAG = "Formulare";

    public ReactApplicationContext reactContext;

    private Integer REQUEST_CODE = 650;

    Formulare(ReactApplicationContext context) {
      super(context);
      reactContext = context;
      reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "Formulare";
    }

    @ReactMethod
    public void preview(String apiToken, String mandateToken, String fields, String info, String bgColor, String textColor) {
        Log.d("", "Formulare preview");

        reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Intent FormularPreviewActivityIntent = new Intent(getReactApplicationContext(), FormularPreviewActivity.class);

                FormularPreviewActivityIntent.putExtra("apiToken", apiToken);
                FormularPreviewActivityIntent.putExtra("mandateToken", mandateToken);
                FormularPreviewActivityIntent.putExtra("fields", fields);
                FormularPreviewActivityIntent.putExtra("info", info);
                FormularPreviewActivityIntent.putExtra("bgColor", bgColor);
                FormularPreviewActivityIntent.putExtra("textColor", textColor);

                Activity mActivity = reactContext.getCurrentActivity();
                startActivityForResult(mActivity, FormularPreviewActivityIntent, REQUEST_CODE, null);
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

                WritableMap params = Arguments.createMap();
                params.putInt("code", 200);

                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("FORMULAR_HANDED_IN", params);
            } else {

                WritableMap params = Arguments.createMap();
                params.putInt("code", 400);
                params.putString("message", "Abbruch");

                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("FORMULAR_HANDED_IN", params);
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        //
    }
}
