package com.dimento.beleganbei;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.os.Build;

import android.util.Log;

import org.json.JSONException;

import android.content.Context;
import android.content.Intent;

import android.view.Gravity;
import android.widget.Button;

import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.FrameLayout;

import android.view.View;
import android.view.ViewGroup;
import android.view.Window;

import android.content.res.Resources;
import java.util.concurrent.atomic.AtomicInteger;
import android.graphics.Typeface;
import android.graphics.Color;
import android.view.HapticFeedbackConstants;
import android.util.DisplayMetrics;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import android.os.AsyncTask;
import android.widget.ProgressBar;

import org.json.JSONObject;

import com.android.volley.toolbox.Volley;
import com.android.volley.RequestQueue;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import com.github.barteksc.pdfviewer.PDFView;

import java.util.HashMap;
import java.util.Map;

public class FormularPreviewActivity extends Activity {

    public String TAG = "FormulareActivity";

    private ImageView cancelButton;

    private String apiToken;
    private String mandateToken;
    private String fields;
    private String info;
    private String bgColor;
    private String textColor;

    private String previewUrl;

    private PDFView mTdView;

    private int mCurrentPage;

    private ProgressBar progressBar;
    private Context mContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //String package_name = getApplication().getPackageName();
        //setContentView(getApplication().getResources().getIdentifier("activity_pdfviewer", "layout", package_name));

        mContext = this;

        Bundle intentExtras = getIntent().getExtras();

        if (intentExtras != null) {
            Log.e("intentExtras", intentExtras.toString());

            apiToken = intentExtras.getString("apiToken", apiToken);
            Log.e("apiToken", apiToken);

            mandateToken = intentExtras.getString("mandateToken", mandateToken);
            Log.e("mandateToken", mandateToken);

            fields = intentExtras.getString("fields", fields);
            Log.e("fields", fields);

            info = intentExtras.getString("info", info);
            Log.e("info", info);

            bgColor = intentExtras.getString("bgColor", bgColor);
            Log.e("bgColor", bgColor);

            textColor = intentExtras.getString("textColor", textColor);
            Log.e("textColor", textColor);
        } else {
            Log.e("intentExtras", "NULL");
        }

        StatusBarHelper sbc = new StatusBarHelper();
        sbc.setColor(this, bgColor);

        RelativeLayout tDLayout = new RelativeLayout(this);
        tDLayout.setHapticFeedbackEnabled(true);
        tDLayout.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT));

        /*LinearLayout buttonBar = createButtonBar();
        buttonBar.setId(getNextViewId());
        RelativeLayout.LayoutParams buttonBarLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        buttonBarLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        buttonBar.setLayoutParams(buttonBarLayoutParams);
        tDLayout.addView(buttonBar);*/

        FrameLayout tDContainer = new FrameLayout(this);
        RelativeLayout.LayoutParams tDViewLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
        tDViewLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        //tDViewLayoutParams.addRule(RelativeLayout.BELOW, buttonBar.getId());
        tDViewLayoutParams.bottomMargin = 320;
        tDContainer.setLayoutParams(tDViewLayoutParams);
        mTdView = new PDFView(this, null);
        tDContainer.addView(mTdView);
        tDLayout.addView(tDContainer);

        /* Cancel */
        Double buttonWidthDouble = getScreenWidth(this) / 15.5;
        int buttonWidth = (buttonWidthDouble.intValue() * 2);
        Log.e(TAG, "buttonWidth -> " + buttonWidth);
        buttonWidth = buttonWidth > 140 ? 140 : buttonWidth;
        Log.e(TAG, "buttonWidth -> " + buttonWidth);

        Resources activityRes = this.getResources();

        cancelButton = new ImageView(this);
        cancelButton.setBackground(null);
        cancelButton.setBackgroundColor(Color.parseColor("#FFFFFF"));

        int cancelButtonImgDrawable = activityRes.getIdentifier("icon_cancel", "drawable", this.getApplicationContext().getPackageName());
        Drawable cancelButtonImg = activityRes.getDrawable(cancelButtonImgDrawable, this.getApplicationContext().getTheme());
        cancelButton.setImageDrawable(cancelButtonImg);
        cancelButton.setPadding(18, 18, 18, 18);

        GradientDrawable cancelButtonShape =  new GradientDrawable();
        cancelButtonShape.setCornerRadius(buttonWidth / 2f);
        cancelButtonShape.setStroke(4, Color.parseColor("#FFFFFF"));
        cancelButtonShape.setColor(Color.parseColor(bgColor));
        cancelButton.setBackground(cancelButtonShape);

        cancelButton.setScaleType(ImageView.ScaleType.FIT_CENTER);
        cancelButton.setAdjustViewBounds(true);
        cancelButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.v(TAG, "Clickitty click -> cancel");
                cancel();
            }
        });

        FrameLayout.LayoutParams cancelButtonLayoutParams = new FrameLayout.LayoutParams(buttonWidth, buttonWidth);
        cancelButtonLayoutParams.width  = buttonWidth;
        cancelButtonLayoutParams.height  = buttonWidth;
        cancelButtonLayoutParams.leftMargin = (getScreenWidth(this) - buttonWidth) - (buttonWidth / 3);
        cancelButtonLayoutParams.topMargin  = (buttonWidth / 3);

        tDLayout.addView(cancelButton, cancelButtonLayoutParams);
        /* Cancel */

        LinearLayout toolBar = createToolBar();
        toolBar.setId(getNextViewId());
        RelativeLayout.LayoutParams toolBarLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        toolBarLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        toolBar.setLayoutParams(toolBarLayoutParams);
        tDLayout.addView(toolBar);

        RelativeLayout layout = new RelativeLayout(this);
        progressBar = new ProgressBar(FormularPreviewActivity.this,null,android.R.attr.progressBarStyleLarge);
        progressBar.setIndeterminate(true);
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(320,320);
        params.addRule(RelativeLayout.CENTER_IN_PARENT, progressBar.getId());
        tDLayout.addView(progressBar, params);

        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(tDLayout);

        new HttpPostTask().execute();
    }

    private class HttpPostTask extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {
            RequestQueue queue = Volley.newRequestQueue(mContext);

            //String url = "https://apiv3.beleganbei.de/appv3/mandate/filled-preview/" + apiToken + "/";
            String url = "https://app-backend.beleganbei.de/api/app-bridge/vollmachten/vollmacht/fill/" + apiToken + "/" + mandateToken + "-preview.pdf";
            Log.d("url", url);

            StringRequest postRequest = new StringRequest(Request.Method.POST, url,
                    new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            // response
                            Log.d("Response", response);

                            try {
                                JSONObject responseData = new JSONObject(response);

                                if(responseData.has("success")) {

                                    previewUrl = responseData.getString("success");
                                    Log.d("previewUrl", previewUrl);
                                    String usePreviewURL = responseData.getString("success");
                                    Log.d("usePreviewURL", usePreviewURL);

                                    final AsyncTask<Void, Void, Void> execute = new AsyncTask<Void, Void, Void>() {
                                        @Override
                                        protected Void doInBackground(Void... voids) {
                                            try {
                                                InputStream input = new URL(usePreviewURL).openStream();
                                                mTdView.fromStream(input)
                                                        .enableSwipe(true)
                                                        .enableDoubletap(true)
                                                        //.enableAntialiasing(true)
                                                        .onPageChange(FormularPreviewActivity.this::onPageChanged)
                                                        .enableAnnotationRendering(true)
                                                        .load();

                                            } catch (IOException e) {
                                                e.printStackTrace();
                                            }
                                            return null;
                                        }

                                        @Override
                                        protected void onPreExecute() {
                                            super.onPreExecute();
                                            Log.e(TAG, "onPreExecute");
                                            progressBar.setVisibility(View.VISIBLE);
                                        }

                                        @Override
                                        protected void onPostExecute(Void aVoid) {
                                            super.onPostExecute(aVoid);
                                            Log.e(TAG, "onPostExecute");
                                            new android.os.Handler().postDelayed(new Runnable() {
                                                public void run() {
                                                    Log.i("tag", "This'll run 300 milliseconds later");
                                                    progressBar.setVisibility(View.GONE);
                                                }
                                            },1000);
                                        }
                                    };
                                    execute.execute();

                                } else if(responseData.has("error")) {
                                    String errorCode = responseData.getString("error");
                                    showDocError("Fehler: " + errorCode);
                                } else {
                                    showDocError("Es ist ein unbekannter Fehler aufgetreten");
                                }
                            } catch(JSONException e) {
                                Log.v(TAG, e.getLocalizedMessage());
                                return;
                            }

                            /*
                            if(response.contains("Fehler")) {
                                Log.d("Response FEHLER", response);

                            } else {
                                Log.d("Response SUCCESS", response);


                            }
                            */
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.d("Error.Response", "" + error.getLocalizedMessage());
                        }
                    }
            ) {
                @Override
                protected Map<String, String> getParams() {
                    Map<String, String>  params = new HashMap<String, String>();
                    params.put("mandate_token", mandateToken);
                    params.put("fields", fields);

                    return params;
                }
            };
            queue.add(postRequest);

            return null;
        }

        @Override
        protected void onPostExecute(String response) {
            super.onPostExecute(response);

            //do something with you response, connected with UI thread.
        }
    }

    public void onPageChanged(int page, int pageCount) {
        mCurrentPage = page;
        Log.e(TAG, "page: " + page);
        Log.e(TAG, "pageCount: " + pageCount);
        //setTitle(String.format("%s %s / %s", "Page Number", page + 1, pageCount));
        //pdfInfoView.setText(String.format("%s %s %s %s", "Seite", page + 1, "von", pageCount));
    }

    public LinearLayout createToolBar() {
        LinearLayout toolBar = new LinearLayout(this);

        Button doneButton = new Button(this);
        //doneButton.setText("Speichern");
        doneButton.setText("Jetzt versenden");
        doneButton.setTypeface(Typeface.SANS_SERIF);
        doneButton.setBackgroundColor(Color.parseColor(bgColor));
        doneButton.setTextColor(Color.parseColor(textColor));
        doneButton.setTextSize(28);
        //doneButton.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, (float) 0.30));
        doneButton.setLayoutParams(new LinearLayout.LayoutParams(0, 320, (float) 0.30));
        doneButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                v.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY);
                Log.v("Wurstebrot", "sscnitzewl");
                handInMandateExecute();
            }
        });
        toolBar.addView(doneButton);

        return toolBar;
    }

    public void handInMandateExecute() {
        Log.e(TAG, "sendSignedDocument");

        new handInMandate().execute();
    }

    private class handInMandate extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {

            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    progressBar.setVisibility(View.VISIBLE);
                }
            });

            RequestQueue queue = Volley.newRequestQueue(mContext);

            String url = "https://app-backend.beleganbei.de/api/app-bridge/vollmachten/vollmacht/hand-in/";
            //String url = "https://app-backend.beleganbei.de/api/mandates/save/";
            StringRequest postRequest = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {// response
                    Log.d(TAG, "Response -> " + response);
                    try {
                        JSONObject dataJSON = new JSONObject(response);

                        if(dataJSON.has("success")) {
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {

                                    AlertDialog alertDialog = new AlertDialog.Builder(FormularPreviewActivity.this).create();
                                    alertDialog.setCancelable(false);
                                    alertDialog.setTitle("Erfolg");
                                    alertDialog.setMessage("Das Formular wurde erfolgreich zurück gesendet");

                                    alertDialog.setButton(AlertDialog.BUTTON_POSITIVE, "OK", new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialog, int which) {
                                            Log.v(TAG, "YES");
                                            alertDialog.dismiss();

                                            Intent resultIntent = new Intent();
                                            resultIntent.putExtra("code", 200);
                                            resultIntent.putExtra("result", "SUCCESS");
                                            setResult(Activity.RESULT_OK, resultIntent);
                                            finish();
                                        }
                                    });

                                    alertDialog.show();
                                }
                            });
                        } else if(dataJSON.has("error")) {
                            String errorMsg = dataJSON.getString("error");

                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    showDocError(errorMsg);
                                }
                            });
                        } else {
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    showDocError("Unbekannter Fehler!");
                                }
                            });
                        }

                    } catch(JSONException e) {
                        Log.v(TAG, e.getLocalizedMessage());
                    }
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d(TAG,"Error.Response " + ""+error.toString());
                    Log.d(TAG,"Error.Response " + ""+error.getLocalizedMessage());

                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            showDocError(error.toString());
                        }
                    });
                }
            }) {
                @Override
                protected Map<String, String> getParams() {
                    Map<String, String>  params = new HashMap<String, String>();
                    params.put("api_token", apiToken);
                    params.put("mandate_token", mandateToken);
                    params.put("pdf", previewUrl);

                    try {
                        JSONObject dataJSON = new JSONObject(info);

                        String customer_id = dataJSON.getString("customer_id");
                        params.put("customer_id", customer_id);

                        String mandate_id = dataJSON.getString("mandate_id");
                        params.put("mandate_id", mandate_id);

                        String device_uuid = dataJSON.getString("device_uuid");
                        params.put("device_uuid", device_uuid);

                        String sender_manno = dataJSON.getString("sender_manno");
                        params.put("sender_manno", sender_manno);

                        String sender_name = dataJSON.getString("sender_name");
                        params.put("sender_name", sender_name);

                        String sender_email = dataJSON.getString("sender_email");
                        params.put("sender_email", sender_email);

                        String sender_phone = dataJSON.getString("sender_phone");
                        params.put("sender_phone", sender_phone);

                    } catch(JSONException e) {
                        Log.v(TAG, e.getLocalizedMessage());
                    }

                    return params;
                }
            };
            queue.add(postRequest);

            return null;
        }

        @Override
        protected void onPostExecute(String response) {
            super.onPostExecute(response);
            progressBar.setVisibility(View.GONE);
        }
    }

    public void cancel() {
        Log.e(TAG, "cancel");
        Intent resultIntent = new Intent();
        resultIntent.putExtra("code", 400);
        resultIntent.putExtra("message", "cancelled");
        setResult(Activity.RESULT_CANCELED, resultIntent);

        super.finish();
    }

    public void showDocError(String errorMsg) {
        AlertDialog alertDialog = new AlertDialog.Builder(FormularPreviewActivity.this).create();
        alertDialog.setCancelable(false);
        alertDialog.setTitle("Fehler");
        alertDialog.setMessage(errorMsg);

        alertDialog.setButton(AlertDialog.BUTTON_POSITIVE, "OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Log.v(TAG, "YES");
                alertDialog.dismiss();
                cancel();
            }
        });

        alertDialog.show();
    }

    @Override
    public void onBackPressed() {
        cancel();
    }

    private int getNextViewId() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            return View.generateViewId(); // Added in API level 17
        }

        // Re-implement View.generateViewId()for API levels < 17
        // http://stackoverflow.com/a/15442898
        for (;;) {
            final int result = sNextGeneratedId.get();
            // aapt-generated IDs have the high byte nonzero; clamp to the range under that.
            int newValue = result + 1;
            if (newValue > 0x00FFFFFF) newValue = 1; // Roll over to 1, not 0.
            if (sNextGeneratedId.compareAndSet(result, newValue)) {
                return result;
            }
        }
    }

    private static final AtomicInteger sNextGeneratedId = new AtomicInteger(1);

    public static int getScreenWidth(Context context) {
        DisplayMetrics displayMetrics = new DisplayMetrics();
        ((Activity)context).getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
        return displayMetrics.widthPixels;
    }

    public static int getScreenHeight(Context context) {
        DisplayMetrics displayMetrics = new DisplayMetrics();
        ((Activity)context).getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
        return displayMetrics.heightPixels;
    }
}
