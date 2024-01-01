package com.dimento.beleganbei; // replace your-apps-package-name with your app’s package name
import static androidx.core.app.ActivityCompat.startActivityForResult;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.InputStream;
import java.util.Map;
import java.util.HashMap;
import java.util.Properties;

import android.app.Activity;
import android.content.Intent;
import android.content.res.AssetManager;
import android.util.Log;
import com.facebook.react.bridge.UiThreadUtil;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import datev.de.dcal.*;
import datev.de.dcal.HTTPHeader;

public class DocExchange extends ReactContextBaseJavaModule implements ActivityEventListener {
    private String TAG = "DocExchange";
    private static ReactApplicationContext reactContext;

    private Integer REQUEST_CODE = 800;

  DocExchange(ReactApplicationContext context) {
      super(context);
      reactContext = context;
      reactContext.addActivityEventListener(this);
  }

    @Override
    public String getName() {
        return "DocExchange";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public void open(String data, String apiToken, String fetchToken, String cid, String uuid, String bgColor, String textColor, String stroke, String appVersion, String addSignDate) {
        Log.d("", "DocExchange open");

        reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Intent docExchangeActivityIntent = new Intent(getReactApplicationContext(), DocExchangeActivity.class);

                docExchangeActivityIntent.putExtra("data", data);
                docExchangeActivityIntent.putExtra("apiToken", apiToken);
                docExchangeActivityIntent.putExtra("fetchToken", fetchToken);
                docExchangeActivityIntent.putExtra("cid", cid);
                docExchangeActivityIntent.putExtra("uuid", uuid);
                docExchangeActivityIntent.putExtra("bgColor", bgColor);
                docExchangeActivityIntent.putExtra("textColor", textColor);
                docExchangeActivityIntent.putExtra("stroke", stroke);
                docExchangeActivityIntent.putExtra("appVersion", appVersion);
                docExchangeActivityIntent.putExtra("addSignDate", addSignDate);

                Activity mActivity = reactContext.getCurrentActivity();
                startActivityForResult(mActivity, docExchangeActivityIntent, 800, null);
            }
        });
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

        if (requestCode == REQUEST_CODE) {
            Log.i(TAG, "requestCode -> " + requestCode);
            Log.i(TAG, "resultCode -> " + resultCode);

            Log.i(TAG, "RESPONSE FOR CODE " + REQUEST_CODE);

            if (resultCode == Activity.RESULT_OK) {
                Log.i(TAG, "RESPONSE OK");

                WritableMap params = Arguments.createMap();
                params.putInt("code", 200);

                if(data.hasExtra("title")) {
                    String title = data.getStringExtra("title");
                    Log.i(TAG, "RESPONSE title " + title);

                    WritableMap params2 = Arguments.createMap();
                    params2.putString("title", title);
                    params.putMap("result", params2);
                } else {
                    WritableMap params2 = Arguments.createMap();
                    params2.putString("title", "");
                    params.putMap("result", params2);
                }

                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("DOCEXCHANGE_DOCUMENT_RESULT", params);
            }

            if (resultCode == Activity.RESULT_CANCELED) {
                Log.i(TAG, "RESPONSE CANCEL");

                WritableMap params = Arguments.createMap();

                int Code = data.getIntExtra("code", 0);

                if(Code == 400) {
                    params.putInt("code", 400);
                    params.putString("message", "Abbruch");
                } else if(Code == 407) {
                    params.putInt("code", 407);
                    params.putString("message", "Dokument wurde zur Löschung markiert");
                } else {
                    params.putInt("code", 408);
                    params.putString("message", "Unbekannter Fehler");
                }

                if(data.hasExtra("title")) {
                    String title = data.getStringExtra("title");
                    Log.i(TAG, "RESPONSE title " + title);
                    params.putString("title", title);
                }

                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("DOCEXCHANGE_DOCUMENT_RESULT", params);
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        //
    }
}
