package com.dimento.beleganbei; // replace your-apps-package-name with your app’s package name

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;


/* RESULT CODES/DATA
message ->
    only on on error/cancel

data ->
    base64 signature

code ->
    201 OK
    400 Cancel
    401 neither RESULT OK nor CANCELLED - shouldnt happen
    402 OK, but no result given
*/

public class MakeSignature extends ReactContextBaseJavaModule implements ActivityEventListener {
    private String TAG = "MakeSignature";
    private Integer REQUEST_CODE = 900;
    private static ReactApplicationContext reactContext;

    MakeSignature(ReactApplicationContext context) {
      super(context);
      reactContext = context;
      reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "MakeSignature";
    }

    @ReactMethod
    public void capture(Boolean trim, Float stroke, String bgColor, String textColor) {
        Log.d("", "MakeSignature capture");
        Log.d("", "MakeSignature capture trim " + trim);
        Log.d("", "MakeSignature capture stroke " + stroke);
        Log.d("", "MakeSignature capture bgColor " + bgColor);
        Log.d("", "MakeSignature capture textColor " + textColor);

        reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Intent MakeSignatureActivityIntent = new Intent(getReactApplicationContext(), MakeSignatureActivity.class);

                MakeSignatureActivityIntent.putExtra("trim", trim);
                MakeSignatureActivityIntent.putExtra("stroke", stroke);
                MakeSignatureActivityIntent.putExtra("bgColor", bgColor);
                MakeSignatureActivityIntent.putExtra("textColor", textColor);

                getCurrentActivity().startActivityForResult(MakeSignatureActivityIntent, REQUEST_CODE);
           }
        });
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_CODE) {
            Log.i(TAG, "requestCode -> " + requestCode);
            Log.i(TAG, "resultCode -> " + resultCode);

            WritableMap params = Arguments.createMap();

            if (resultCode == Activity.RESULT_OK) {
                Log.i(TAG, "RESULT_OK");

                if(data.hasExtra("result")) {
                    params.putInt("code", 200);
                    String result = data.getStringExtra("result");
                    params.putString("result", result);
                } else {
                    params.putInt("code", 407);
                    params.putString("message", "Unterschriftsdaten wurden nicht empfangen");
                }
            }

            if (resultCode == Activity.RESULT_CANCELED) {
                Log.i(TAG, "RESULT_CANCELED");
                params.putInt("code", 400);
                params.putString("message", "Abbruch");
            }

            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("NEW_SIGNATURE_CAPTURED", params);
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
       //
    }
}
