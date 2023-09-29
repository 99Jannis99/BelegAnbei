package com.meinprojekt;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;



public class OpenActavityModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    public OpenActavityModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);
    }

    @NonNull
    @Override
    public String getName() {
        return "OpenActivity";
    }

    @ReactMethod
    public void open(String name){
        Intent intent = new Intent(getCurrentActivity(), OpenActivity.class);
        intent.putExtra("name", name);
        getCurrentActivity().startActivityForResult(intent, 768);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        Log.i("requestCode", requestCode + "");
        Log.i("resultCode", resultCode + "");

        if (requestCode == 768) {
            WritableMap params = Arguments.createMap();
            if (resultCode == Activity.RESULT_OK) {
                Log.i("fddsf", "RES OK");
                params.putString("result", "RES OK");
            }
            if (resultCode == Activity.RESULT_CANCELED) {
                Log.i("fddsf", "RES CANCEL");
                params.putString("result", "RES CANCEL");
            }
            getReactApplicationContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("ActivityResult", params);
        }
    }




    @Override
    public void onNewIntent(Intent intent) {
        // Hier musst du nichts tun, wenn du diese Methode nicht benötigst
    }
}
