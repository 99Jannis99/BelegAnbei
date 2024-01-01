package com.dimento.beleganbei;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Base64;

import android.os.ParcelFileDescriptor;

import java.io.File;
import java.io.ByteArrayOutputStream;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Rect;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.pdf.PdfRenderer;
import android.graphics.pdf.PdfRenderer.Page;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class PdfToPng extends ReactContextBaseJavaModule {

    File sourceFile;
    PdfRenderer renderer = null;

    private String TAG = "PdfToPng";
    private static ReactApplicationContext reactContext;

    PdfToPng(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "PdfToPng";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public void firstPageAsPNG(String sourcePDF, Integer pageNumber, Integer useWidth, Integer useHeight, Integer useDpi) {

        String inputFile;

        Boolean calcWithDpi = false;
        Double dpiCalcWidthF = 8.2677165354330708661417322834646; // A4: 21/2.54 * dpi
        Double dpiCalcHeightF = 11.692913385826771653543307086614; // A4: 21/2.54 * dpi

        String outputType = "base64";

        String targetFileDir = "";
        String targetFileName = "";

        String imageBase64Data;

        if(sourcePDF.isEmpty()) {
            try {
              JSONObject errorObj = new JSONObject();
              errorObj.put("error", " Parameter is missing");
              errorObj.put("parameter",  "sourcePDF");

                Log.i(TAG, "RESULT ERROR" + errorObj.toString());
            } catch (Exception e) {

            }

            return;
        }

        if(useDpi > 0) {
            useWidth = 0;
            useHeight = 0;

            calcWithDpi = true;
        }

        inputFile = sourcePDF.replace("file:///", "/");
        Integer usePage = pageNumber-1;

        Log.i(TAG,"************** inputFile " + inputFile);
        Log.i(TAG,"************** usePage " +usePage);
        Log.i(TAG,"************** useWidth " +useWidth);
        Log.i(TAG,"************** useHeight " +useHeight);
        Log.i(TAG,"************** useHeight " +useHeight);
        Log.i(TAG,"************** outputType " +outputType);

        try {
            sourceFile = new File(inputFile);

            renderer = new PdfRenderer(ParcelFileDescriptor.open(sourceFile, ParcelFileDescriptor.MODE_READ_ONLY));

            try {
                Page page = renderer.openPage(usePage);

                final int pageCount = renderer.getPageCount();

                if(useWidth.equals(0) || useHeight.equals(0)) {
                    if(calcWithDpi) {
                        Log.i(TAG, "************** Calc with dpi " + useDpi);

                        Double useWidthT = (dpiCalcWidthF*useDpi);
                        Double useHeightT = (dpiCalcHeightF*useDpi);

                        Log.i(TAG,"************** useWidthT " + useWidthT);
                        Log.i(TAG,"************** useHeightT " + useHeightT);

                        useWidth = useWidthT.intValue();
                        useHeight = useHeightT.intValue();

                        Log.i(TAG,"************** useWidth FROM PDF width DPI " + useWidth);
                        Log.i(TAG,"************** useHeight FROM PDF width DPI " + useHeight);
                    } else {
                        useWidth = page.getWidth();
                        useHeight = page.getHeight();
                        Log.i(TAG,"************** useWidth FROM PDF " + useWidth);
                        Log.i(TAG,"************** useHeight FROM PDF " + useHeight);
                    }
                }

                Bitmap preBitmap = Bitmap.createBitmap(useWidth, useHeight, Bitmap.Config.ARGB_4444);

                Bitmap bitmap = Bitmap.createBitmap(preBitmap.getWidth(), preBitmap.getHeight(), preBitmap.getConfig());

                Canvas canvas = new Canvas(bitmap);
                canvas.drawColor(Color.WHITE);
                canvas.drawBitmap(preBitmap, 0, 0, null);

                Rect rect = new Rect(0, 0, useWidth, useHeight);

                page.render(bitmap, rect, null, Page.RENDER_MODE_FOR_DISPLAY);

                JSONObject jsonObj = new JSONObject();
                jsonObj.put("pages", pageCount);
                jsonObj.put("page", (usePage+1));
                jsonObj.put("width", useWidth);
                jsonObj.put("height", useHeight);

                imageBase64Data = convert(bitmap);

                final Integer b63str = imageBase64Data.length();
                final Double approxSize =  ((b63str * 0.75) - 2); // == -> 2, = -> 1

                jsonObj.put("size", approxSize.toString());
                jsonObj.put("base64", imageBase64Data);

                page.close();

                Log.i(TAG, "RESULT ERROR" + jsonObj.toString());
            } catch (Exception e) {

                JSONObject errorObj = new JSONObject();
                errorObj.put("error", "Page not found in PDF");
                errorObj.put("page",  usePage);
                errorObj.put("file",  inputFile);
                errorObj.put("exception",  e.getMessage());

                Log.i(TAG, "RESULT ERROR" + errorObj.toString());
            }
        } catch (Exception e) {
            try {
                JSONObject errorObj = new JSONObject();
                errorObj.put("error", "Source PDF unavailable, assure full qualified path, e.g. file:///emulated/...");
                errorObj.put("file",  inputFile);
                errorObj.put("exception",  e.getMessage());

                Log.i(TAG, "RESULT ERROR" + errorObj.toString());
            } catch (Exception e2) {

            }
        }
    }

    public static Bitmap convert(String base64Str) throws IllegalArgumentException {
        byte[] decodedBytes = Base64.decode(
            base64Str.substring(base64Str.indexOf(",")  + 1),
            Base64.DEFAULT
        );

        return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
    }

    public static String convert(Bitmap bitmap) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);

        return Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT);
    }
}
