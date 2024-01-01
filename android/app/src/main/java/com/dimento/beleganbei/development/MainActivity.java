package com.dimento.beleganbei.development;

//import com.dimento.beleganbei.ImportPDF;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;

import datev.de.dcal.*;

public class MainActivity extends ReactActivity {
  final String TAG = "MainActivity";

  Context context;

  protected String intentType;
  protected String intentString;

  @Override
  protected String getMainComponentName() {
    return "BelegAnbeiDevelopment";
  }

  protected String getURLIntentName() { return "beleganbeiopendevelopment";  } // Wichtig für DATEV Login

  private DCALapi DCAL = datev.de.dcal.DCALapiKt.getDCAL();

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Log.i(TAG,"onCreate onCreate");

    try {
      getSupportActionBar().hide();
    } catch (NullPointerException e) {
      Log.e(TAG, "getSupportActionBar");
      e.printStackTrace();
    }
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);

    if (intent != null) {
      Log.i(TAG,"INTENT RECEIVED");

      if(intent.getType() != null) { intentType = intent.getType(); } else { intentType = ""; }
      if(intent.getDataString() != null) { intentString = intent.getDataString(); } else { intentString = ""; }

      Log.i(TAG,"INTENT_STRING intentType " + intentType);
      Log.i(TAG,"INTENT_STRING intentString " + intentString);

      if(intentString.startsWith("beleganbeiopen") && intentString.contains("smartlogin")) {
        Log.i(TAG, "INCOMING: DATEV SMARTLOGIN INTENT");

        intentString = intentString.replace("$intentName://datev?data=", "");
        // DEV HACK
        intentString = intentString.replace("beleganbeiopengrahl://datev?data=", "");
        intentString = intentString.replace("beleganbeiopendevelopment://datev?data=", "");
        // DEV HACK

        Log.e(TAG,"DATEV INTENT_STRING_FIXED " + intentString);
        intentString = Uri.decode(intentString);
        Log.e(TAG,"DATEV INTENT_STRING_FIXED_2 " + intentString);

        try {
          Uri datevCodeURL = Uri.parse(intentString);
          DCAL.handleUrl(datevCodeURL);
        } catch (Exception e) {
          Log.e(TAG,"DATEV Exception DATEV Handle URL");
          Log.e(TAG,e.getLocalizedMessage());
        }

      } else if(intentType.equals("application/pdf")) { // Einzelnes PDF, "Datei senden"
        Log.i(TAG, "INCOMING: PDF IMPORT");

        final Handler handler = new Handler();
        handler.postDelayed(() -> {
          Log.i(TAG, "INCOMING: NOW AFTER DELAY");
//ImportPDF.handleIntent(getApplicationContext(), getReactInstanceManager().getCurrentReactContext(), getPackageName(), intent);
        }, 2000);

      } else if(intentType.equals("*/*")) { // Multiple "Share"
        Log.i(TAG, "INCOMING: */* IMPORT TODO");
      }
    }
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
            this,
            getMainComponentName(),
            // If you opted-in for the New Architecture, we enable the Fabric Renderer.
            DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
}
