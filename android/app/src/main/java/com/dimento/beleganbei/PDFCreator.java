package com.dimento.beleganbei; // replace your-apps-package-name with your app’s package name

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.graphics.pdf.PdfDocument;
import android.print.PDFPrint;
import android.util.Base64;
import android.util.Log;
import android.webkit.WebView;
import android.widget.Toast;

import com.facebook.react.ReactActivity;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.tejpratapsingh.pdfcreator.utils.FileManager;
import com.tejpratapsingh.pdfcreator.utils.PDFUtil;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;
import android.net.Uri;

import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import static android.os.Build.VERSION_CODES.R;
import static androidx.core.content.ContextCompat.startActivity;
import static com.github.barteksc.pdfviewer.util.MathUtils.floor;
import static com.google.gson.internal.bind.TypeAdapters.URI;

import org.json.JSONArray;
import org.json.JSONException;


/* RESULT CODES/DATA
  NONE
*/

public class PDFCreator extends ReactContextBaseJavaModule {
  private String TAG = "PDFCreator";
  private int PDF_CREATE_REQUEST_CODE = 336;
  private static ReactApplicationContext reactContext;

    private WebView webView;

    private String addToItemIdentifer;

    PDFCreator(ReactApplicationContext context) {
      super(context);
      reactContext = context;
    }

    @Override
    public String getName() {
        return "PDFCreator";
    }

    @ReactMethod
    public void create(String addToItem, String images, int dpi) {
        Log.d(TAG, "PDFCreator create addToItem " + addToItem);
        Log.d(TAG, "PDFCreator create images " + images);
        Log.d(TAG, "PDFCreator create dpi " + dpi);

        addToItemIdentifer = addToItem;

        reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                //Intent PDFCreateActivityIntent = new Intent(getReactApplicationContext(), PDFCreationActivity.class);
                //getCurrentActivity().startActivityForResult(PDFCreateActivityIntent, PDF_CREATE_REQUEST_CODE);

                JSONArray pages;
                try {
                    pages = new JSONArray(images);
                    Log.d(TAG, "PDFCreator create pages " + pages.toString());
                    Log.d(TAG, "PDFCreator create pages " + pages.length());
                } catch (JSONException e) {
                    e.printStackTrace();

                    WritableMap params = Arguments.createMap();
                    params.putInt("code", 408);
                    params.putString("message", "PDF Seiten konnten nicht extrahiert werden");

                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("BELEG_PDF_CREATED", params);

                    return;
                }

                Double dpiBaseWidth = 8.263888888888889;
                Double dpiBaseHeight = 11.69444444444444;

                Log.d(TAG, "PDFCreator dpi " + dpi);
                Log.d(TAG, "PDFCreator dpiBaseWidth " + dpiBaseWidth);
                Log.d(TAG, "PDFCreator dpiBaseHeight " + dpiBaseHeight);

                int pageWidth =  (int) (dpi*dpiBaseWidth);
                int pageHeight =  (int) (dpi*dpiBaseHeight);

                Log.d(TAG, "PDFCreator pageWidth " + pageWidth);
                Log.d(TAG, "PDFCreator pageHeight " + pageHeight);

                PdfDocument pdfDocument = new PdfDocument();

                // two variables for paint "paint" is used
                // for drawing shapes and we will use "title"
                // for adding text in our PDF file.
                Paint paint = new Paint();
                //Paint title = new Paint();

                // we are adding page info to our PDF file
                // in which we will be passing our pageWidth,
                // pageHeight and number of pages and after that
                // we are calling it to create our PDF.
                PdfDocument.PageInfo mypageInfo = new PdfDocument.PageInfo.Builder(pageWidth, pageHeight, 1).create();

                for(int i=0;i<pages.length();i++) {
                    try {
                        Log.e(TAG, "pages--> " + i + " --> " + pages.getString(i));

                        PdfDocument.Page myPage = pdfDocument.startPage(mypageInfo);

                        Canvas canvas = myPage.getCanvas();

                        String useImage = pages.getString(i).replace("file:///", "/");
                        Log.d(TAG, "PDFCreator useImage " + useImage);

                        if(!useImage.isEmpty()) {
                            Bitmap scaledbmp = BitmapFactory.decodeFile(useImage);
                            Bitmap scaledbmp2 = getCompressed(scaledbmp);

                            var useLeft = 0;
                            var useTop = 0;

                            int original_width = scaledbmp2.getWidth();
                            int original_height = scaledbmp2.getHeight();
                            Log.d(TAG, "PDFCreator width WxH " + original_width + " x " + original_height);

                            int bound_width = pageWidth;
                            int bound_height = pageHeight;

                            int new_width = original_width;
                            int new_height = original_height;

                            // first check if we need to scale width
                            if (original_width > bound_width) {
                                //scale width to fit
                                new_width = bound_width;
                                //scale height to maintain aspect ratio
                                new_height = (new_width * original_height) / original_width;
                            }

                            // then check if we need to scale even with the new height
                            if (new_height > bound_height) {
                                //scale height to fit instead
                                new_height = bound_height;
                                //scale width to maintain aspect ratio
                                new_width = (new_height * original_width) / original_height;
                            }

                            Log.d(TAG, "PDFCreator use WxH " + new_width + " x " + new_height);

                            useLeft = (pageWidth-new_width)/2;
                            useTop = (pageHeight-new_height)/2;

                            Log.d(TAG, "PDFCreator use LxT " + useLeft + " x " + useTop);

                            canvas.drawBitmap(Bitmap.createScaledBitmap(scaledbmp2, new_width, new_height, true), useLeft, useTop, paint);
                        }

                        pdfDocument.finishPage(myPage);
                    } catch (JSONException e) {
                        e.printStackTrace();

                        WritableMap params = Arguments.createMap();
                        params.putInt("code", 409);
                        params.putString("message", "PDF Seiten/Seite konnte/n nicht extrahiert werden");

                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("BELEG_PDF_CREATED", params);

                        return;
                    }
                }

                String guid = UUID.randomUUID().toString();
                String filename = guid + ".pdf";
                File filesDir = reactContext.getFilesDir();
                File file = new File(filesDir, filename);

                try {
                    pdfDocument.writeTo(new FileOutputStream(file));
                    //Toast.makeText(getReactApplicationContext(), "PDF file generated successfully.", Toast.LENGTH_SHORT).show();
                } catch (IOException e) {
                    e.printStackTrace();

                    WritableMap params = Arguments.createMap();
                    params.putInt("code", 407);
                    params.putString("message", "PDF konnte nicht generiert werden");

                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("BELEG_PDF_CREATED", params);

                    return;
                }

                pdfDocument.close();

                // Output PDF (Info) to React Listener
                WritableMap params = Arguments.createMap();
                params.putInt("code", 200);

                WritableMap paramsResult = Arguments.createMap();
                paramsResult.putString("uuid", UUID.randomUUID().toString());
                paramsResult.putString("addToItemIdentifer", addToItemIdentifer);
                paramsResult.putString("path", filesDir + "/" + filename);
                paramsResult.putInt("size", getFileSizeBytes(file));
                paramsResult.putInt("pages", pages.length());

                params.putMap("data", paramsResult);

                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("BELEG_PDF_CREATED", params);
            }
        });
    }

    public static Bitmap getCompressed(Bitmap imageBitmap) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        if (!imageBitmap.compress(Bitmap.CompressFormat.JPEG, 75, out))
            throw new IllegalStateException("Unable to compress image");
        ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());
        return BitmapFactory.decodeStream(in);
    }

    private static int getFileSizeBytes(File file) {
        return longToIntCast(file.length());
    }

    public static int longToIntCast(long number) {
        return (int) number;
    }
}
