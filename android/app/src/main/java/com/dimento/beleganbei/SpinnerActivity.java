package com.dimento.beleganbei;

import java.io.File;

import android.app.Activity;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.os.Build;

import android.content.Context;
import android.content.Intent;

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

import com.github.barteksc.pdfviewer.PDFView;

public class SpinnerActivity extends Activity {

    public String TAG = "SpinnerActivity";
    private ProgressBar progressBar;

    static SpinnerActivity spinnerActivity;

    public static SpinnerActivity getInstance(){
        return spinnerActivity;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        spinnerActivity = this;

        RelativeLayout tDLayout = new RelativeLayout(this);
        tDLayout.setHapticFeedbackEnabled(true);
        tDLayout.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT));

        RelativeLayout layout = new RelativeLayout(this);
        progressBar = new ProgressBar(SpinnerActivity.this,null,android.R.attr.progressBarStyleLarge);
        progressBar.setIndeterminate(true);
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(320,320);
        params.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        tDLayout.addView(progressBar, params);

        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(tDLayout);
    }
}
