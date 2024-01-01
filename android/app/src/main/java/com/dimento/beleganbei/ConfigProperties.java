package com.dimento.beleganbei; // replace your-apps-package-name with your app’s package name
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.InputStream;
import java.util.Map;
import java.util.HashMap;
import java.util.Properties;

import android.content.res.AssetManager;
import android.util.Log;
import com.facebook.react.bridge.UiThreadUtil;

import org.json.JSONException;
import org.json.JSONObject;


public class ConfigProperties extends ReactContextBaseJavaModule {
  private String TAG = "ConfigProperties";

  ConfigProperties(ReactApplicationContext context) {
      super(context);
  }

  @Override
  public String getName() {
      return "ConfigProperties";
  }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String prop(String propertyName) {
        Log.d(TAG, "propertyName " + propertyName);

        String requestedProperty = "";

        Properties properties = new Properties();
        AssetManager assetManager = getReactApplicationContext().getAssets();
        try {
            InputStream inputStream = assetManager.open("config.properties");
            properties.load(inputStream);

            requestedProperty = properties.getProperty(propertyName);
            Log.e(TAG, "SUCCESS Property");
            Log.e(TAG, requestedProperty);

            return requestedProperty;
        } catch(Exception e) {
            Log.e(TAG, "Error Property");
            Log.e(TAG, e.getMessage());

            return null;
        }
    }
}
