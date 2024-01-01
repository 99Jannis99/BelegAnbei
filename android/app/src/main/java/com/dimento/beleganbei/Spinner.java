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
import java.io.File;
import java.util.Stack;
import java.util.UUID;

import androidx.core.app.ActivityCompat;

import static androidx.core.app.ActivityCompat.finishAfterTransition;
import static androidx.core.app.ActivityCompat.startActivityForResult;
import static androidx.core.content.ContextCompat.startActivity;

/* RESULT CODES/DATA
  NONE
*/

public class Spinner extends ReactContextBaseJavaModule {
    private static String TAG = "Spinner";
    private static ReactApplicationContext reactContext;
    private static Activity mActivity;

    private static Intent SpinnerActivityIntent;

    Spinner(ReactApplicationContext context) {
      //super(context);
      reactContext = context;
    }

    @Override
    public String getName() {
        return "Spinner";
    }

    @ReactMethod
    public void show() {
        Log.d(TAG, "Spinner show");

        SpinnerActivityIntent = new Intent(reactContext, SpinnerActivity.class);
        SpinnerActivityIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        mActivity = reactContext.getCurrentActivity();
        startActivity(mActivity, SpinnerActivityIntent, null);
    }

    @ReactMethod
    public void hide() {
        Log.d(TAG, "Spinner hide");

        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                SpinnerActivity.getInstance().finish();
            }
        }, 1000);
    }

    public static void showSpinner() {
        Log.d(TAG, "showSpinner");

        SpinnerActivityIntent = new Intent(reactContext, SpinnerActivity.class);
        SpinnerActivityIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        mActivity = reactContext.getCurrentActivity();
        startActivity(mActivity, SpinnerActivityIntent, null);
    }
    public static void hideSpinner() {
        Log.d(TAG, "hideSpinner");
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                SpinnerActivity.getInstance().finish();
            }
        }, 1000);
    }
}
