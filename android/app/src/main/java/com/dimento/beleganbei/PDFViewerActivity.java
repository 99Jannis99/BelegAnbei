package com.dimento.beleganbei;

import java.io.File;

import android.app.ActionBar;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.os.Build;

import android.content.Context;
import android.content.Intent;

import android.transition.Explode;
import android.transition.Fade;
import android.transition.Slide;
import android.util.Log;
import android.view.Gravity;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.FrameLayout;

import android.view.View;
import android.view.ViewGroup;
import android.view.Window;

import android.content.res.Resources;
import java.util.concurrent.atomic.AtomicInteger;
import android.graphics.Color;
import android.view.HapticFeedbackConstants;
import android.util.DisplayMetrics;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import android.os.AsyncTask;
import android.widget.ProgressBar;
import android.widget.Toolbar;

import androidx.appcompat.app.AppCompatActivity;

import com.dimento.beleganbei.development.MainActivity;
import com.dimento.beleganbei.development.R;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.github.barteksc.pdfviewer.PDFView;

public class PDFViewerActivity extends Activity {

    public String TAG = "PDFViewerActivity";

    private ImageView cancelButton;

    private String pdfSource;
    private String bgColor;
    private String textColor;

    private PDFView mTdView;

    private int mCurrentPage;

    private ProgressBar progressBar;

    private TextView pdfInfoView;

    // Language
    private Resources languageRes;
    // Language

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Language
        Context context = LocaleHelper.setLocale(getApplicationContext(), "de");
        languageRes = context.getResources();
        // CALL: languageRes.getString(R.string.XXX)
        // Language

        Bundle intentExtras = getIntent().getExtras();

        if (intentExtras != null) {
            Log.e("intentExtras", intentExtras.toString());

            pdfSource = intentExtras.getString("pdfSource", pdfSource);
            Log.e("pdfSource", pdfSource);

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

        FrameLayout tDContainer = new FrameLayout(this);
        RelativeLayout.LayoutParams tDViewLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
        tDViewLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
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

        RelativeLayout layout = new RelativeLayout(this);
        progressBar = new ProgressBar(PDFViewerActivity.this,null,android.R.attr.progressBarStyleLarge);
        progressBar.setIndeterminate(true);
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(320,320);
        params.addRule(RelativeLayout.CENTER_IN_PARENT, progressBar.getId());
        tDLayout.addView(progressBar, params);

        pdfInfoView = new TextView(this);
        pdfInfoView.setBackgroundColor(Color.parseColor(bgColor));
        pdfInfoView.setTextColor(Color.parseColor(textColor));
        pdfInfoView.setText(languageRes.getString(R.string.wird_geoffnet));
        pdfInfoView.setPadding(10, 6, 10, 6);
        pdfInfoView.getBackground().setAlpha(128);
        pdfInfoView.setGravity(Gravity.CENTER_VERTICAL | Gravity.CENTER_HORIZONTAL);

        Integer pdfInfoViewWidth = (getScreenWidth(this) / 10 * 6);

        FrameLayout.LayoutParams paramsX = new FrameLayout.LayoutParams(pdfInfoViewWidth, RelativeLayout.LayoutParams.WRAP_CONTENT);
        paramsX.leftMargin = (getScreenWidth(this) - pdfInfoViewWidth) / 2;
        paramsX.topMargin  = getScreenHeight(this) - 140;
        tDLayout.addView(pdfInfoView, paramsX);

        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(tDLayout);

        if(pdfSource.contains("http://") || pdfSource.contains("https://")) { // http file
            Log.e(TAG, "PDF from WEB / HTTP");

            pdfSource = pdfSource.replace("http://", "https://");

            final AsyncTask<Void, Void, Void> execute = new AsyncTask<>() {
                @Override
                protected Void doInBackground(Void... voids) {
                    try {
                        InputStream input = new URL(pdfSource).openStream();
                        mTdView.fromStream(input)
                                .enableSwipe(true)
                                .enableDoubletap(true)
                                .enableAntialiasing(true)
                                .onPageChange(PDFViewerActivity.this::onPageChanged)
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
                    }, 1000);
                }
            };
            execute.execute();

        } else { // local file
            String localFileFixed = pdfSource.replace("file://", "");
            Log.e(TAG, localFileFixed);

            File file = new File(localFileFixed);
            mTdView.fromFile(file)
                    .enableSwipe(true)
                    .enableDoubletap(true)
                    .enableAntialiasing(true)
                    .onPageChange(this::onPageChanged)
                    .enableAnnotationRendering(true)
                    .load();

            progressBar.setVisibility(View.GONE);
        }
    }

    public void onPageChanged(int page, int pageCount) {
        mCurrentPage = page;
        Log.e(TAG, "page: " + page);
        Log.e(TAG, "pageCount: " + pageCount);
        //setTitle(String.format("%s %s / %s", "Page Number", page + 1, pageCount));

        Resources activityRes = this.getResources();

        pdfInfoView.setText(String.format("%s %s %s %s", languageRes.getString(R.string.page), page + 1, languageRes.getString(R.string.von), pageCount));
    }

    public void cancel() {
        Log.e(TAG, "cancel");
        finish();
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
