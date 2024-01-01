package com.dimento.beleganbei; // replace your-apps-package-name with your app’s package name

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;


/* RESULT CODES/DATA
  NONE
*/

public class PDFViewer extends ReactContextBaseJavaModule {
  private String TAG = "PDFViewer";
  private static ReactApplicationContext reactContext;

    PDFViewer(ReactApplicationContext context) {
      super(context);
      reactContext = context;
    }

    @Override
    public String getName() {
        return "PDFViewer";
    }

    @ReactMethod
    public void show(String pdfSource, String bgColor, String textColor) {
        Log.d("", "PDFViewer capture");

        reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Intent PDFViewerActivityIntent = new Intent(getReactApplicationContext(), PDFViewerActivity.class);

                String usePDFSource = pdfSource;
                Log.d("", "PDFViewer usePDFSource " + usePDFSource);
                if(!pdfSource.startsWith("http")) {
                    if(!pdfSource.startsWith("file:")) {
                        if(pdfSource.startsWith("/")) {
                            usePDFSource = "file://" + pdfSource;
                        }
                    }
                }

                Log.d("", "PDFViewer usePDFSource " + usePDFSource);

                PDFViewerActivityIntent.putExtra("pdfSource", usePDFSource);
                PDFViewerActivityIntent.putExtra("bgColor", bgColor);
                PDFViewerActivityIntent.putExtra("textColor", textColor);

                getCurrentActivity().startActivity(PDFViewerActivityIntent);
           }
        });
    }
}
