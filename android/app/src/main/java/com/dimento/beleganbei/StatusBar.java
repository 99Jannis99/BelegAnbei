package com.dimento.beleganbei;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class StatusBar extends ReactContextBaseJavaModule {
    final private String TAG = "StatusBar";

    public ReactApplicationContext reactContext;

    StatusBar(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "StatusBar";
    }

    @ReactMethod
    public void setColor(String color) {
        Log.d(TAG, "setColor " + color);

        reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.i(TAG,"window window");

                StatusBarHelper sbc = new StatusBarHelper();
                sbc.setColor(reactContext.getCurrentActivity(), color);
            }
        });
    }
}
