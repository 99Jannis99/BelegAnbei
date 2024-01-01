package com.dimento.beleganbei;

import java.io.BufferedOutputStream;
import java.io.File;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Build;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.Intent;

import android.transition.Fade;
import android.transition.Slide;
import android.util.Log;
import android.view.Gravity;
import android.view.MotionEvent;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.FrameLayout;

import android.view.View;
import android.view.ViewGroup;
import android.view.Window;

import android.content.res.Resources;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import android.graphics.drawable.Drawable;
import android.graphics.Typeface;
import android.graphics.Color;
import android.view.HapticFeedbackConstants;
import android.util.DisplayMetrics;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import android.os.AsyncTask;
import android.widget.ProgressBar;

import com.android.volley.toolbox.Volley;
import com.android.volley.RequestQueue;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import java.io.DataInputStream;
import java.io.FileOutputStream;
import java.net.MalformedURLException;
import androidx.core.content.FileProvider;
import android.widget.ListView;
import android.widget.Toast;

import java.text.SimpleDateFormat;
import java.text.ParseException;
import java.util.Locale;

import android.util.Pair;

import com.github.barteksc.pdfviewer.PDFView;
import com.github.barteksc.pdfviewer.listener.OnRenderListener;
import com.github.barteksc.pdfviewer.listener.OnErrorListener;
import com.github.barteksc.pdfviewer.listener.OnLoadCompleteListener;
import com.squareup.picasso.Picasso;

public class DocExchangeActivity extends Activity {
    public String TAG = "DocExchangeActivity";

    private ImageView cancelButton;
    private ImageView deleteButton;

    //private Button cancelButton;
    //private Button deleteButton;

    private String sessionHash = "";

    private String data;
    private String apiToken;
    private String fetchToken;
    private String cid;
    private String uuid;
    private String addSignDate;
    private String stroke;
    private String bgColor;
    private String textColor;

    private int for_all;
    private int group_id;
    private int size;
    private int auto_delete;
    private String auto_delete_at;
    private int encrypted;

    private int signaturable;
    private int user_signed;
    private int user_signed_locked;
    private String user_signed_at;
    private int open_count;
    private String token;
    private String title = "";
    private String date;
    private String text;
    private String filename;
    private String type;
    private String appendix;
    private String added_at;
    private String open_date;
    private String category_name;
    private int category_id;
    private int signdata_valid;

    private String sourceFilePdfUrl;
    private String signedDoneURL;

    private JSONArray signaturable_document_data;

    private ProgressBar progressBar;

    private String inputPassword;

    private Context mContext;
    private ImageView mImgView;
    private TextView otherInfoView;

    private ImageView signButton;
    private ImageView infoButton;
    private ImageView shareButton;
    private ImageView emailButton;
    private ImageView infoExitButton;

    private int mCurrentPage = 0;

    private PDFView mTdView;
    private ImageView signImageView;
    private TextView pdfInfoView;

    private FrameLayout tDContainer;
    private LinearLayout listViewELement;

    private Boolean detailListShown;
    private ListView detailList;

    private ArrayList<DocExchangeActivity.ListItem> arrayOfListItems = new ArrayList<DocExchangeActivity.ListItem>();
    private DocExchangeActivity.ListDataAdapter adapter;

    List<Pair> signaturesHolder = new ArrayList<Pair>();
    private String currentlyUsedSignatureToken = "";

    //signaturesHolder.add(new Pair("signatureId","signatureFILENAME"));

    private List<String> signViewImages;
    private int signViewImagesIndex;
    private int signViewImagesIndexReStore;

    private int allSignaturesCount = -1;
    private Boolean signedDocumentSended = false;

    //private OnTouchZone onTouchZone;

    private LinearLayout sendBar;

    //private ScaleGestureDetector scaleGestureDetector;
    private float mScaleFactor = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.v(TAG, "executeSignature 1onCreate => " + currentlyUsedSignatureToken);
        super.onCreate(savedInstanceState);
        Log.v(TAG, "executeSignature 2onCreate => " + currentlyUsedSignatureToken);
        //String package_name = getApplication().getPackageName();
        //setContentView(getApplication().getResources().getIdentifier("activity_pdfviewer", "layout", package_name));

        /*// Inside your activity (if you did not enable transitions in your theme)
        getWindow().requestFeature(Window.FEATURE_ACTIVITY_TRANSITIONS);

        // Set an exit transition
        getWindow().setEnterTransition(new Fade());
        getWindow().setExitTransition(new Slide());
        getWindow().setSharedElementEnterTransition(new Fade());
        getWindow().setSharedElementExitTransition(new Slide());
        */

        mContext = this;

        data = "";
        apiToken = "";
        fetchToken = "";
        cid = "";
        uuid = "";
        bgColor = "";
        textColor = "";
        //currentlyUsedSignatureToken = "";

        signedDoneURL = "";

        detailListShown = false;

        signViewImages = new ArrayList<String>();

        //scaleGestureDetector = new ScaleGestureDetector(this, new ScaleListener());

        Bundle intentExtras = getIntent().getExtras();

        if (intentExtras != null) {
            data = intentExtras.getString("data", data);
            Log.e(TAG,"data -> " + data);

            apiToken = intentExtras.getString("apiToken", apiToken);
            Log.e(TAG,"apiToken -> " + apiToken);

            fetchToken = intentExtras.getString("fetchToken", fetchToken);
            Log.e(TAG,"fetchToken -> " + fetchToken);

            cid = intentExtras.getString("cid", cid);
            Log.e(TAG,"cid -> " + cid);

            uuid = intentExtras.getString("uuid", uuid);
            Log.e(TAG,"uuid -> " + uuid);

            stroke = intentExtras.getString("stroke", stroke);
            Log.e(TAG,"stroke -> " + stroke);

            bgColor = intentExtras.getString("bgColor", bgColor);
            Log.e(TAG,"bgColor -> " + bgColor);

            textColor = intentExtras.getString("textColor", textColor);
            Log.e(TAG,"textColor -> " + textColor);

            addSignDate = intentExtras.getString("addSignDate", addSignDate);
            Log.e(TAG,"addSignDate -> " + addSignDate);
        } else {
            Log.e(TAG,"intentExtras NULL");
        }

        StatusBarHelper sbc = new StatusBarHelper();
        sbc.setColor(this, bgColor);

        try {
            JSONObject dataJSON = new JSONObject(data);

            for_all = dataJSON.getInt("for_all");
            group_id = dataJSON.getInt("group_id");
            size = dataJSON.getInt("size");
            auto_delete = dataJSON.getInt("auto_delete");
            auto_delete_at = dataJSON.getString("auto_delete_at");
            encrypted = dataJSON.getInt("encrypted");

            signaturable = dataJSON.getInt("signaturable");
            user_signed = dataJSON.getInt("user_signed");
            user_signed_locked = dataJSON.getInt("user_signed_locked");
            user_signed_at = dataJSON.getString("user_signed_at");
            open_count = dataJSON.getInt("open_count");
            token = dataJSON.getString("token");
            title = dataJSON.getString("title");
            date = dataJSON.getString("date");
            text = dataJSON.getString("text");
            filename = dataJSON.getString("filename");
            type = dataJSON.getString("type");
            appendix = dataJSON.getString("appendix");
            added_at = dataJSON.getString("added_at");
            open_date = dataJSON.getString("open_date");
            category_name = dataJSON.getString("category_name");
            category_id = dataJSON.getInt("category_id");
            signdata_valid = dataJSON.getInt("signdata_valid");

            signaturable_document_data = dataJSON.getJSONArray("signaturable_document_data");
        } catch(JSONException e) {
            Log.v(TAG, e.getLocalizedMessage());
        }

        Resources activityRes = DocExchangeActivity.this.getResources();

        /* Layout */
        RelativeLayout tDLayout = new RelativeLayout(this);
        tDLayout.setHapticFeedbackEnabled(true);
        tDLayout.setBackgroundColor(Color.WHITE);
        tDLayout.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT));
        /* Layout */

        /* Top Bar
        LinearLayout buttonBar = createButtonBar();
        buttonBar.setId(getNextViewId());
        RelativeLayout.LayoutParams buttonBarLayoutParams = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        buttonBarLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        buttonBar.setLayoutParams(buttonBarLayoutParams);
        tDLayout.addView(buttonBar);
        Top Bar */

        listViewELement = createListViewElement();
        listViewELement.setId(getNextViewId());
        RelativeLayout.LayoutParams listViewELementLayoutParams = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        listViewELementLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        //listViewELementLayoutParams.addRule(RelativeLayout.BELOW, buttonBar.getId());
        listViewELement.setLayoutParams(listViewELementLayoutParams);
        listViewELement.setVisibility(View.GONE);
        tDLayout.addView(listViewELement);

        adapter = new DocExchangeActivity.ListDataAdapter(this, arrayOfListItems);

        setAdapterItems();

        detailList.setAdapter(adapter);

        //collectAndShowList();

        /* PDF / OTHER View */
        if(appendix.contains("pdf")) {
            Log.v(TAG, "LOAD PDF");

            if(signaturable == 1 && user_signed != 1) {

                Double oneTenth = getScreenHeight(this) / 10.0;
                Integer bottomMargin = oneTenth.intValue();

                tDContainer = new FrameLayout(this);
                RelativeLayout.LayoutParams tDViewLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
                //tDViewLayoutParams.bottomMargin = bottomMargin;
                //tDViewLayoutParams.addRule(RelativeLayout.BELOW, buttonBar.getId());
                tDViewLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
                tDContainer.setLayoutParams(tDViewLayoutParams);
                mTdView = new PDFView(this, null);
                tDContainer.setId(getNextViewId());
                tDContainer.addView(mTdView);
                tDContainer.setBackgroundColor(Color.WHITE);
                tDLayout.addView(tDContainer);

                /*
                tDContainer = new FrameLayout(this);
                RelativeLayout.LayoutParams tDViewLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
                tDViewLayoutParams.addRule(RelativeLayout.BELOW, buttonBar.getId());
                tDContainer.setLayoutParams(tDViewLayoutParams);

                signImageView = new ImageView(this, null);
                signImageView.setBackgroundColor(Color.parseColor("#eaeaea"));
                signImageView.setAdjustViewBounds(true);

                signImageView.setOnTouchListener(new DocExchangeActivity.OnSwipeTouchListener(this) {
                    @Override
                    public void onSwipeLeft() {
                        // Whatever
                        Log.v(TAG, "SWIPE LEFT");
                        nextImage();
                    }

                    @Override
                    public void onSwipeRight() {
                        // Whatever
                        Log.v(TAG, "SWIPE RIGHT");
                        prevImage();
                    }
                });

                tDContainer.addView(signImageView);
                tDLayout.addView(tDContainer);
                */

            } else {
                tDContainer = new FrameLayout(this);
                RelativeLayout.LayoutParams tDViewLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
                //tDViewLayoutParams.addRule(RelativeLayout.BELOW, buttonBar.getId());
                tDViewLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
                tDContainer.setLayoutParams(tDViewLayoutParams);
                mTdView = new PDFView(this, null);
                tDContainer.setId(getNextViewId());
                tDContainer.addView(mTdView);
                tDContainer.setBackgroundColor(Color.WHITE);
                tDLayout.addView(tDContainer);
            }


        } else {
            Log.v(TAG, "LOAD OTHER");

            tDContainer = new FrameLayout(this);
            RelativeLayout.LayoutParams tDViewLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
            //tDViewLayoutParams.addRule(RelativeLayout.BELOW, buttonBar.getId());
            tDViewLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
            tDContainer.setLayoutParams(tDViewLayoutParams);

            mImgView = new ImageView(this, null);

            int mImgViewImgDrawable = activityRes.getIdentifier("icon_info", "drawable", this.getApplicationContext().getPackageName());
            Drawable mImgViewImgImg = activityRes.getDrawable(mImgViewImgDrawable, this.getApplicationContext().getTheme());
            mImgView.setImageDrawable(mImgViewImgImg);

            mImgView.setScaleType(ImageView.ScaleType.FIT_START);
            mImgView.setAdjustViewBounds(true);

            FrameLayout.LayoutParams mImgViewLayoutParams = new FrameLayout.LayoutParams((getScreenWidth(this) - 200), (getScreenHeight(this) - 380));
            mImgViewLayoutParams.leftMargin = 100;
            tDContainer.addView(mImgView, mImgViewLayoutParams);
            tDContainer.setBackgroundColor(Color.WHITE);
            tDLayout.addView(tDContainer);

            // text
            otherInfoView = new TextView(this);
            otherInfoView.setTextColor(Color.BLACK);
            otherInfoView.setText("Das Dokument kann\nnicht direkt angezeigt\nwerden.\n\n" + filename);
            otherInfoView.setBackgroundColor(Color.WHITE);
            otherInfoView.setGravity(Gravity.CENTER_VERTICAL | Gravity.CENTER_HORIZONTAL);

            Double topMarginDouble = (getScreenHeight(this) / 10.0);
            Integer topMargin = topMarginDouble.intValue();

            Integer otherInfoViewWidth = (getScreenWidth(this) / 10 * 6);

            FrameLayout.LayoutParams paramsX = new FrameLayout.LayoutParams(otherInfoViewWidth, RelativeLayout.LayoutParams.WRAP_CONTENT);
            paramsX.leftMargin = (getScreenWidth(this) - otherInfoViewWidth) / 2;
            paramsX.topMargin  = (topMargin * 4);
            tDLayout.addView(otherInfoView, paramsX);
            // text

            //loadOtherFile();
        }
        /* PDF / OTHER View */

        if(encrypted == 1) {
            Log.v(TAG, "ASK Password");
            askPassword();
        } else {
            if(appendix.contains("pdf")) {
                Log.v(TAG, "LOAD PDF");

                if(signaturable == 1 && user_signed != 1) {
                    loadSignablePDFFile();
                } else {
                    loadPDFFile();
                }
            } else {
                Log.v(TAG, "LOAD OTHER");
                loadOtherFile();
            }
        }

        /* Cancel */
        Double buttonWidthDoubleA = getScreenWidth(this) / 15.5;
        int buttonWidthA = (buttonWidthDoubleA.intValue() * 2);
        Log.e(TAG, "buttonWidthA -> " + buttonWidthA);
        buttonWidthA = buttonWidthA > 140 ? 140 : buttonWidthA;
        Log.e(TAG, "buttonWidthA -> " + buttonWidthA);

        cancelButton = new ImageView(this);
        cancelButton.setBackground(null);
        cancelButton.setBackgroundColor(Color.parseColor("#FFFFFF"));

        int cancelButtonImgDrawable = activityRes.getIdentifier("icon_cancel", "drawable", this.getApplicationContext().getPackageName());
        Drawable cancelButtonImg = activityRes.getDrawable(cancelButtonImgDrawable, this.getApplicationContext().getTheme());
        cancelButton.setImageDrawable(cancelButtonImg);
        cancelButton.setPadding(18, 18, 18, 18);

        GradientDrawable cancelButtonShape =  new GradientDrawable();
        cancelButtonShape.setCornerRadius(buttonWidthA / 2f);
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

        FrameLayout.LayoutParams cancelButtonLayoutParams = new FrameLayout.LayoutParams(buttonWidthA, buttonWidthA);
        cancelButtonLayoutParams.width  = buttonWidthA;
        cancelButtonLayoutParams.height  = buttonWidthA;
        cancelButtonLayoutParams.leftMargin = (getScreenWidth(this) - buttonWidthA) - (buttonWidthA / 3);
        cancelButtonLayoutParams.topMargin  = (buttonWidthA / 3);

        tDLayout.addView(cancelButton, cancelButtonLayoutParams);
        /* Cancel */

        /* Action buttons */
        Double oneTenth = getScreenHeight(this) / 10.0;
        Double oneTwentity = getScreenWidth(this) / 20.0;
        Double oneFifteenth = getScreenHeight(this) / 15.0;

        Integer oneTenthInt = oneTenth.intValue();
        Integer oneFifteenthInt = oneFifteenth.intValue();
        Integer oneTwentityInt = oneTwentity.intValue();

        Double buttonWidthDouble = getScreenWidth(this) / 15.5;
        int buttonWidth = (buttonWidthDouble.intValue() * 2);
        Log.e(TAG, "buttonWidth -> " + buttonWidth);
        buttonWidth = buttonWidth > 140 ? 140 : buttonWidth;
        Log.e(TAG, "buttonWidth -> " + buttonWidth);


/* infoExitButton */
        infoExitButton = new ImageView(this);
        infoExitButton.setBackground(null);
        infoExitButton.setBackgroundColor(Color.parseColor("#FFFFFF"));

        int infoExitButtonImgDrawable = activityRes.getIdentifier("icon_cancel", "drawable", this.getApplicationContext().getPackageName());
        Drawable infoExitButtonImg = activityRes.getDrawable(infoExitButtonImgDrawable, this.getApplicationContext().getTheme());
        infoExitButton.setImageDrawable(infoExitButtonImg);
        infoExitButton.setPadding(18, 18, 18, 18);
        infoExitButton.setVisibility(View.GONE);

        GradientDrawable infoExitButtonShape =  new GradientDrawable();
        infoExitButtonShape.setCornerRadius(buttonWidthA / 2f);
        infoExitButtonShape.setStroke(4, Color.parseColor("#FFFFFF"));
        infoExitButtonShape.setColor(Color.parseColor(bgColor));
        infoExitButton.setBackground(infoExitButtonShape);

        infoExitButton.setScaleType(ImageView.ScaleType.FIT_CENTER);
        infoExitButton.setAdjustViewBounds(true);
        infoExitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.v(TAG, "Clickitty click -> cancel");

                tDContainer.setVisibility(View.VISIBLE);
                pdfInfoView.setVisibility(View.VISIBLE);

                if(signaturable == 1 && user_signed != 1) {
                    signButton.setVisibility(View.VISIBLE);
                }

                cancelButton.setVisibility(View.VISIBLE);
                deleteButton.setVisibility(View.VISIBLE);

                //if(signaturable == 1 && user_signed == 1) {
                //    emailButton.setVisibility(View.GONE);
                //    shareButton.setVisibility(View.GONE);
                //} else {
                //emailButton.setVisibility(View.VISIBLE);
                shareButton.setVisibility(View.VISIBLE);
                //}

                infoButton.setVisibility(View.VISIBLE);
                infoExitButton.setVisibility(View.GONE);

                if(!appendix.contains("pdf")) {
                    otherInfoView.setVisibility(View.VISIBLE);
                }

                listViewELement.setVisibility(View.GONE);

                detailListShown = false;
            }
        });

        FrameLayout.LayoutParams infoExitButtonLayoutParams = new FrameLayout.LayoutParams(buttonWidthA, buttonWidthA);
        infoExitButtonLayoutParams.width  = buttonWidth;
        infoExitButtonLayoutParams.height  = buttonWidth;
        infoExitButtonLayoutParams.leftMargin = (getScreenWidth(this) - buttonWidthA) - (buttonWidthA / 3);
        infoExitButtonLayoutParams.topMargin  = (buttonWidthA / 3);

        tDLayout.addView(infoExitButton, infoExitButtonLayoutParams);
        /* infoExitButton */

        /* Delete Button */
        deleteButton = new ImageView(this);
        deleteButton.setBackground(null);
        deleteButton.setBackgroundColor(Color.parseColor(bgColor));

        int deleteButtonImgDrawable = activityRes.getIdentifier("icon_trash", "drawable", this.getApplicationContext().getPackageName());
        Drawable deleteButtonImg = activityRes.getDrawable(deleteButtonImgDrawable, this.getApplicationContext().getTheme());
        deleteButton.setImageDrawable(deleteButtonImg);
        deleteButton.setPadding(30, 30, 30, 30);

        GradientDrawable deleteButtonShape =  new GradientDrawable();
        deleteButtonShape.setCornerRadius(buttonWidth / 2f);
        deleteButtonShape.setStroke(4, Color.parseColor("#FFFFFF"));
        deleteButtonShape.setColor(Color.parseColor(bgColor));
        //deleteButtonShape.setColor(Color.parseColor(bgColor));
        deleteButton.setBackground(deleteButtonShape);

        deleteButton.setScaleType(ImageView.ScaleType.FIT_START);
        deleteButton.setAdjustViewBounds(true);
        deleteButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.v(TAG, "Clickitty click -> deleteButton");
                deleteDocument();
            }
        });

        FrameLayout.LayoutParams deleteButtonLayoutParams = new FrameLayout.LayoutParams(buttonWidth, buttonWidth);
        deleteButtonLayoutParams.width  = buttonWidth;
        deleteButtonLayoutParams.height  = buttonWidth;
        deleteButtonLayoutParams.leftMargin = (getScreenWidth(this) - buttonWidth - oneTwentityInt);
        deleteButtonLayoutParams.topMargin  = (getScreenHeight(this) - buttonWidth - (buttonWidth/2) - oneTenthInt);

        tDLayout.addView(deleteButton, deleteButtonLayoutParams);
        /* delete Button */

        /* Share Button */
        shareButton = new ImageView(this);
        shareButton.setBackground(null);
        shareButton.setBackgroundColor(Color.parseColor(bgColor));

        int shareButtonImgDrawable = activityRes.getIdentifier("icon_download", "drawable", this.getApplicationContext().getPackageName());
        Drawable shareButtonImg = activityRes.getDrawable(shareButtonImgDrawable, this.getApplicationContext().getTheme());
        shareButton.setImageDrawable(shareButtonImg);
        shareButton.setPadding(24, 24, 24, 24);

        GradientDrawable shareButtonShape =  new GradientDrawable();
        shareButtonShape.setCornerRadius(buttonWidth / 2f);
        shareButtonShape.setStroke(4, Color.parseColor("#FFFFFF"));
        shareButtonShape.setColor(Color.parseColor(bgColor));
        shareButton.setBackground(shareButtonShape);

        shareButton.setScaleType(ImageView.ScaleType.FIT_START);
        shareButton.setAdjustViewBounds(true);
        shareButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.v(TAG, "Clickitty click -> shareButton");
                startShare();
            }
        });

        FrameLayout.LayoutParams shareButtonLayoutParams = new FrameLayout.LayoutParams(buttonWidth, buttonWidth);
        shareButtonLayoutParams.width  = buttonWidth;
        shareButtonLayoutParams.height  = buttonWidth;
        shareButtonLayoutParams.leftMargin = (getScreenWidth(this) - buttonWidth - oneTwentityInt);
       // shareButtonLayoutParams.topMargin  = (getScreenHeight(this) - buttonWidth - (buttonWidth/2) - oneTenthInt);
        shareButtonLayoutParams.topMargin  = (getScreenHeight(this) - (buttonWidth * 2) - ((buttonWidth/2) * 2) - oneTenthInt);

        tDLayout.addView(shareButton, shareButtonLayoutParams);
        /* Share Button */

        /* Info Button */
        infoButton = new ImageView(this);
        infoButton.setBackground(null);
        infoButton.setBackgroundColor(Color.parseColor(bgColor));

        int infoButtonImgDrawable = activityRes.getIdentifier("icon_info", "drawable", this.getApplicationContext().getPackageName());
        Drawable infoButtonImg = activityRes.getDrawable(infoButtonImgDrawable, this.getApplicationContext().getTheme());
        infoButton.setImageDrawable(infoButtonImg);
        infoButton.setPadding(24, 24, 24, 24);

        GradientDrawable infoButtonShape =  new GradientDrawable();
        infoButtonShape.setCornerRadius(buttonWidth / 2f);
        infoButtonShape.setStroke(4, Color.parseColor("#FFFFFF"));
        infoButtonShape.setColor(Color.parseColor(bgColor));
        infoButton.setBackground(infoButtonShape);

        infoButton.setScaleType(ImageView.ScaleType.FIT_START);
        infoButton.setAdjustViewBounds(true);
        infoButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.v(TAG, "Clickitty click -> infoButton");

                    /*if(detailListShown) {
                        tDContainer.setVisibility(View.VISIBLE);
                        pdfInfoView.setVisibility(View.VISIBLE);

                        if(signaturable == 1 && user_signed != 1) {
                            signButton.setVisibility(View.VISIBLE);
                        }
                        emailButton.setVisibility(View.VISIBLE);
                        shareButton.setVisibility(View.VISIBLE);
                        infoButton.setVisibility(View.VISIBLE);
                        infoExitButton.setVisibility(View.GONE);

                        listViewELement.setVisibility(View.GONE);

                        detailListShown = false;
                    } else {
                        */
                tDContainer.setVisibility(View.GONE);
                pdfInfoView.setVisibility(View.GONE);

                signButton.setVisibility(View.GONE);
               // emailButton.setVisibility(View.GONE);
                shareButton.setVisibility(View.GONE);
                infoButton.setVisibility(View.GONE);

                cancelButton.setVisibility(View.GONE);
                deleteButton.setVisibility(View.GONE);

                if(!appendix.contains("pdf")) {
                    otherInfoView.setVisibility(View.GONE);
                }

                listViewELement.setVisibility(View.VISIBLE);
                infoExitButton.setVisibility(View.VISIBLE);

                detailListShown = true;
                //}
            }
        });

        FrameLayout.LayoutParams infoButtonLayoutParams = new FrameLayout.LayoutParams(buttonWidth, buttonWidth);
        //if(user_signed == 1 && signaturable == 1) {
        //    infoButtonLayoutParams.leftMargin = (getScreenWidth(this) - buttonWidth - oneTwentityInt);
        //    infoButtonLayoutParams.topMargin = (getScreenHeight(this) - buttonWidth - (buttonWidth / 2) - oneTenthInt);
        //} else {
        infoButtonLayoutParams.width  = buttonWidth;
        infoButtonLayoutParams.height  = buttonWidth;
        infoButtonLayoutParams.leftMargin = (getScreenWidth(this) - buttonWidth - oneTwentityInt);
        infoButtonLayoutParams.topMargin  = (getScreenHeight(this) - (buttonWidth * 3) - ((buttonWidth/2) * 3) - oneTenthInt);
        //}

        tDLayout.addView(infoButton, infoButtonLayoutParams);
        /* Info Button */

        /* Sign Button */
        signButton = new ImageView(this);
        signButton.setBackground(null);
        signButton.setBackgroundColor(Color.GREEN);

        int signButtonImgDrawable = activityRes.getIdentifier("icon_signature", "drawable", this.getApplicationContext().getPackageName());
        Drawable signButtonImg = activityRes.getDrawable(signButtonImgDrawable, this.getApplicationContext().getTheme());
        signButton.setImageDrawable(signButtonImg);
        signButton.setPadding(24, 24, 24, 24);

        GradientDrawable signButtonShape =  new GradientDrawable();
        signButtonShape.setCornerRadius(buttonWidth / 2f);
        signButtonShape.setStroke(4, Color.parseColor("#FFFFFF"));
        signButtonShape.setColor(Color.parseColor(bgColor));
        signButton.setBackground(signButtonShape);

        signButton.setScaleType(ImageView.ScaleType.FIT_START);
        signButton.setAdjustViewBounds(true);
        signButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.v(TAG, "Clickitty click -> signButton");
                Log.v(TAG, "mCurrentPage -> " + mCurrentPage);

                //signaturesHolder.add(new Pair("signatureId","signatureFILENAME"));
                // check if exists and mark in alert
                try {
                    for (int i = 0; i < signaturable_document_data.length(); ++i) {
                        JSONObject obj = signaturable_document_data.getJSONObject(i);
                        int page_number = obj.getInt("page_number");
                        int page_signatures_count = obj.getInt("page_signatures_count");
                        JSONArray page_signatures = obj.getJSONArray("page_signatures");

                        if ((mCurrentPage + 1) == page_number) {
                            startSignatureForPage(page_signatures);
                        }
                    }
                } catch(JSONException e) {
                    Log.e(TAG, e.getLocalizedMessage());
                }
            }
        });

        FrameLayout.LayoutParams signButtonLayoutParams = new FrameLayout.LayoutParams(buttonWidth, buttonWidth);
        signButtonLayoutParams.width  = buttonWidth;
        signButtonLayoutParams.height  = buttonWidth;
        signButtonLayoutParams.leftMargin = (getScreenWidth(this) - buttonWidth - oneTwentityInt);
        signButtonLayoutParams.topMargin  = (getScreenHeight(this) - (buttonWidth * 4) - ((buttonWidth/2) * 4) - oneTenthInt);

        tDLayout.addView(signButton, signButtonLayoutParams);
        /* Info Button */
        /* Action buttons */

        RelativeLayout layout = new RelativeLayout(this);
        progressBar = new ProgressBar(DocExchangeActivity.this,null,android.R.attr.progressBarStyleLarge);
        progressBar.setIndeterminate(true);
        progressBar.setVisibility(View.GONE);
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(320,320);
        params.addRule(RelativeLayout.CENTER_IN_PARENT, progressBar.getId());
        tDLayout.addView(progressBar, params);

        pdfInfoView = new TextView(this);
        pdfInfoView.setId(getNextViewId());
        pdfInfoView.setBackgroundColor(Color.parseColor(bgColor));
        pdfInfoView.setTextColor(Color.parseColor(textColor));
        pdfInfoView.setText("PDF wird geöffnet");
        pdfInfoView.setPadding(10, 6, 10, 6);
        pdfInfoView.getBackground().setAlpha(128);
        pdfInfoView.setGravity(Gravity.CENTER_VERTICAL | Gravity.CENTER_HORIZONTAL);

        if(!appendix.contains("pdf")) {
            pdfInfoView.setVisibility(View.GONE);
        }
        //if(signaturable == 1 && user_signed != 1) {
        //    pdfInfoView.setVisibility(View.GONE);
        //}

        if(signaturable != 1) {
            signButton.setVisibility(View.GONE);
        }

        if(user_signed == 1 && signaturable == 1) {
            signButton.setVisibility(View.GONE);
            //emailButton.setVisibility(View.GONE);
            //shareButton.setVisibility(View.GONE);
        }

        Integer pdfInfoViewWidth = (getScreenWidth(this) / 10 * 6);

        FrameLayout.LayoutParams paramsX = new FrameLayout.LayoutParams(pdfInfoViewWidth, RelativeLayout.LayoutParams.WRAP_CONTENT);
        paramsX.leftMargin = (getScreenWidth(this) - pdfInfoViewWidth) / 2;
        paramsX.topMargin  = getScreenHeight(this) - 140;
        tDLayout.addView(pdfInfoView, paramsX);

        /* Send Bar */
        sendBar = createSendBar();
        sendBar.setId(getNextViewId());
        sendBar.setVisibility(View.GONE);
        RelativeLayout.LayoutParams sendBarLayoutParams = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        sendBarLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        sendBar.setLayoutParams(sendBarLayoutParams);
        sendBar.setBackgroundColor(Color.parseColor(bgColor));
        tDLayout.addView(sendBar);
        /*
        if(appendix.contains("pdf")) {
            Log.v(TAG, "LOAD PDF");

            if(signaturable == 1 && user_signed != 1) {
                signImageView
            } else {
                mTdView
            }
        } else {
            Log.v(TAG, "LOAD OTHER");
            mImgView
        }
        */
        /* Send Bar */

        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(tDLayout);
    }

    public void startSignatureForPage(JSONArray page_signatures) {
        int page_signatures_count = page_signatures.length();

        if (page_signatures_count == 0) {
            Log.e(TAG, "NO SIGNATURES AT THIS PAGE => " + page_signatures_count);
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(DocExchangeActivity.this, "Keine Unterschriften auf dieser Seite", Toast.LENGTH_LONG).show();
                }
            });
        } else if (page_signatures_count == 1) {
            Log.e(TAG, "START SIGNATURE PAD exact 1 Signature on this page => " + page_signatures_count);
            executeSignature(0, page_signatures);
        } else if (page_signatures_count > 1) {
            Log.e(TAG, "START ALERT ASK more than 1 Signature on this page => " + page_signatures_count);

            List<String> signLabelList = new ArrayList<String>();
            try {
                Log.v(TAG, "page_signatures.length() => " + page_signatures.length());
                for(int i=0;i<page_signatures.length();i++) {
                    JSONObject signa = page_signatures.getJSONObject(i);
                    String signaName = signa.getString("label");
                    String signaId = signa.getString("signatureId");
                    Log.v(TAG, "signa => " + i + " - " + signaName);

                    for (int shi = 0; shi < signaturesHolder.size(); ++shi) {
                        if(signaturesHolder.get(shi).first.toString().equals(signaId)) {
                            signaName += "\n(bereits eingegeben)";
                        }
                    }

                    signLabelList.add(signaName);
                }
            } catch(JSONException e) {
                Log.v(TAG, "page_signatures ERR -> " + e.getLocalizedMessage());
            }

            AlertDialog.Builder builder = new AlertDialog.Builder(DocExchangeActivity.this);
            builder.setTitle("Welche Unterschrift möchten Sie eingeben?");

            //String[] yearList = {prelastYearString, lastYearString, currentYearString, nextYearString};
            //String[] yearList = {"1", "2", "3", "4", "5", "6", "7", "8"};
            //int checkedItem = -1;


            String[] choicesList = signLabelList.toArray(new String[signLabelList.size()]);
            builder.setSingleChoiceItems(choicesList, -1, new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    // user checked an item
                    Log.e(TAG, "item CHECKED -> " + which + " => is " + choicesList[which]);

                    executeSignature(which, page_signatures);
                    dialog.dismiss();
                }
            });

            builder.setNegativeButton("Abbrechen", null);

            AlertDialog dialog = builder.create();
            dialog.show();
        }
    }

    public void executeSignature(int signatureIndex, JSONArray page_signatures) {
        Log.e(TAG, "executeSignature => " + signatureIndex);

        try {
            JSONObject signa = page_signatures.getJSONObject(signatureIndex);
            String signaName = signa.getString("label");
            String signaId = signa.getString("signatureId");
            Log.v(TAG, "executeSignature signaName => " + signaName);
            Log.v(TAG, "executeSignature signaId => " + signaId);

            currentlyUsedSignatureToken = signaId.trim();
            Log.v(TAG, "executeSignature currentlyUsedSignatureToken => " + currentlyUsedSignatureToken);

            DocExchangeActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Log.e(TAG, "run()");
                    Intent makeSignatureIntent = new Intent(DocExchangeActivity.this, MakeSignatureActivity.class);

                    //makeSignatureIntent.putExtra("returnType", "file");
                    makeSignatureIntent.putExtra("trim", true);
                    Integer intStroke = Integer.parseInt(stroke);
                    makeSignatureIntent.putExtra("stroke", intStroke);
                    makeSignatureIntent.putExtra("bgColor", bgColor);
                    makeSignatureIntent.putExtra("textColor", textColor);

                    DocExchangeActivity.this.startActivityForResult(makeSignatureIntent, 901);

                }
            });
        } catch(JSONException e) {
            Log.v(TAG, "executeSignature ERR -> " + e.getLocalizedMessage());
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, final Intent intent) {
        Log.e(TAG, "onActivityResult");
        Log.e(TAG, "requestCode " + requestCode);
        Log.e(TAG, "resultCode " + resultCode);
        Log.e(TAG, "executeSignaturex onActivityResult " + currentlyUsedSignatureToken);

        // Unterschrfit
        if(requestCode == 901) {
            Log.e(TAG, "requestCode 901");
            if (resultCode == Activity.RESULT_OK) {
                String result = intent.getStringExtra("result");
                Log.e(TAG, "result " + result);

                String base64ImageData = result;

                String cleanedResult = result.replace("data:image/png;base64,", "");
                Log.e(TAG, "executeSignaturex onActivityResult currentlyUsedSignatureToken " + currentlyUsedSignatureToken);
                Log.e(TAG, "executeSignaturex onActivityResult cleanedResult " + cleanedResult);

                for (int i = 0; i < signaturesHolder.size(); ++i) {
                    if(signaturesHolder.get(i).first.toString().equals(currentlyUsedSignatureToken)) {
                        signaturesHolder.remove(i);
                    }
                }

                signaturesHolder.add(new Pair(currentlyUsedSignatureToken, cleanedResult));
                signViewImagesIndexReStore = signViewImagesIndex;

                loadSignablePDFFile();

                if(allSignaturesCount == signaturesHolder.size()) {
                    Log.e(TAG, "OKIDLDOKILY ALLE Unterschriften da");
                    sendBar.setVisibility(View.VISIBLE);
                }
            }
        }
    }

    public static File saveImage(final Context context, final String imageData) {
        final byte[] imgBytesData = android.util.Base64.decode(imageData,
                android.util.Base64.DEFAULT);

        final File file;
        try {
            file = File.createTempFile("image", null, context.getCacheDir());
        } catch(IOException e) {
            e.printStackTrace();
            return null;
        }
        final FileOutputStream fileOutputStream;
        try {
            fileOutputStream = new FileOutputStream(file);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return null;
        }

        final BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(
                fileOutputStream);
        try {
            bufferedOutputStream.write(imgBytesData);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        } finally {
            try {
                bufferedOutputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return file;
    }

    public String copy(File src, File dst) {
        try (InputStream in = new FileInputStream(src)) {
            try (OutputStream out = new FileOutputStream(dst)) {
                // Transfer bytes from in to out
                byte[] buf = new byte[1024];
                int len;
                while ((len = in.read(buf)) > 0) {
                    out.write(buf, 0, len);
                }

                return dst.getAbsolutePath();
            } catch(IOException e1) {
                Log.e("IOException", "IOException -> " + e1.getLocalizedMessage());
                return null;
            }
        } catch(IOException e2) {
            Log.e("IOException", "IOException -> " + e2.getLocalizedMessage());
            return null;
        }
    }

    public void startEmail() {
        Log.e(TAG, "startEmail");

        progressBar.setVisibility(View.VISIBLE);

        File file = new File(getCacheDir(), filename);
        if(file.exists()) {
            Log.e(TAG, "startEmail => EXISTS");
            executeEmail();
        } else {
            Log.e(TAG, "startEmail => START DL");
            new Thread(new Runnable() {
                public void run() {
                    DownloadFiles("email");
                }
            }).start();
        }
    }

    public void executeEmail() {
        Log.e(TAG, "executeEmail");

        File newFile = new File(this.getCacheDir(), filename);
        //Uri contentUri = FileProvider.getUriForFile(this, this.getApplicationContext().getPackageName() + ".fileprovider", newFile);
        Uri contentUri = FileProvider.getUriForFile(this, this.getApplicationContext().getPackageName() + ".beleganbei.provider", newFile);

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                progressBar.setVisibility(View.GONE);
            }
        });


        if (contentUri != null) {
            Intent emailIntent = new Intent();
            emailIntent.setAction(Intent.ACTION_SEND);
            emailIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION); // temp permission for receiving app to read this file
            emailIntent.setDataAndType(contentUri, getContentResolver().getType(contentUri));

            emailIntent.setType("message/rfc822");
            emailIntent.putExtra(Intent.EXTRA_SUBJECT, title);
            emailIntent.putExtra(Intent.EXTRA_EMAIL, "");
            emailIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
            emailIntent.putExtra(Intent.EXTRA_TEXT, "");

            startActivity(Intent.createChooser(emailIntent, "E-Mail senden"));
        }
    }

    public void startShare() {
        Log.e(TAG, "startShare");

        progressBar.setVisibility(View.VISIBLE);

        File file = new File(getCacheDir(), filename);
        if(file.exists()) {
            Log.e(TAG, "startShare => EXISTS");
            executeShare();
        } else {
            Log.e(TAG, "startShare => START DL");
            new Thread(new Runnable() {
                public void run() {
                    DownloadFiles("share");
                }
            }).start();
        }
    }

    public void executeShare() {
        Log.e(TAG, "executeShare");

        // https://stackoverflow.com/questions/19096275/share-image-file-from-cache-directory-via-intentandroid
        File newFile = new File(this.getCacheDir(), filename);
        //Uri contentUri = FileProvider.getUriForFile(this, this.getApplicationContext().getPackageName() + ".fileprovider", newFile);
        Uri contentUri = FileProvider.getUriForFile(this, this.getApplicationContext().getPackageName() + ".beleganbei.provider", newFile);

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                progressBar.setVisibility(View.GONE);
            }
        });


        if (contentUri != null) {
            Intent shareIntent = new Intent();
            shareIntent.setAction(Intent.ACTION_SEND);
            shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION); // temp permission for receiving app to read this file
            shareIntent.setDataAndType(contentUri, getContentResolver().getType(contentUri));
            shareIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
            startActivity(Intent.createChooser(shareIntent, "Was möchten Sie machen?"));
        }
    }

    public void DownloadFiles(String taskToDo){
        Log.e(TAG, "taskToDo " + taskToDo);
        Log.e(TAG, "sourceFilePdfUrl " + sourceFilePdfUrl);
        Log.e(TAG, "signedDoneURL " + signedDoneURL);
        try {
            URL u = new URL(sourceFilePdfUrl);
            InputStream is = u.openStream();

            DataInputStream dis = new DataInputStream(is);

            byte[] buffer = new byte[1024];
            int length;

            FileOutputStream fos = new FileOutputStream(new File(getCacheDir() + "/" + filename));
            while ((length = dis.read(buffer))>0) {
                fos.write(buffer, 0, length);
            }

            Log.e(TAG, "REEEEEEADY");
            Log.e(TAG, "REEEEEEADY -> " + getCacheDir() + "/" + filename);

            if(taskToDo.equals("share")) {
                executeShare();
            } else if(taskToDo.equals("email")) {
                executeEmail();
            }

        } catch (MalformedURLException mue) {
            Log.e("SYNC getUpdate", "malformed url error", mue);
        } catch (IOException ioe) {
            Log.e("SYNC getUpdate", "io error", ioe);
        } catch (SecurityException se) {
            Log.e("SYNC getUpdate", "security error", se);
        }
    }
    public void loadSignablePDFFile() {
        Log.e(TAG, "LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOAAAAAAAAAAAAAAAAAAADDDDDDDDD loadSignablePDFFile");
        new loadSignablePDFFileTask().execute();
    }

    private class loadSignablePDFFileTask extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {
            RequestQueue queue = Volley.newRequestQueue(mContext);

            String url = "https://app-backend.beleganbei.de/api/app-bridge/docexchange/document/android/pdf/marriage/";
            Log.d(TAG, "url -> " + url);
            StringRequest postRequest = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {// response
                    Log.d(TAG, "Response -> " + response);

                    try {
                        JSONObject dataJSON = new JSONObject(response);

                        if(dataJSON.has("success")) {
                            sessionHash = dataJSON.getString("success");

                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    // DO something
                                    progressBar.setVisibility(View.VISIBLE);
                                    sourceFilePdfUrl = "https://app-backend.beleganbei.de/api/app-bridge/docexchange/document/android/pdf/preview/" + sessionHash + "/" + UUID.randomUUID().toString() + "/";
                                    Log.e(TAG, "sourceFilePdfUrl: " + sourceFilePdfUrl);
                                    renderPDF(sourceFilePdfUrl);
                                }
                            });
                        } else if(dataJSON.has("error")) {
                            String errorMsg = dataJSON.getString("error");

                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    // DO something
                                    showDocError("Fehler: " + errorMsg);
                                }
                            });
                        } else {
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    // DO something
                                    showDocError("Unbekannter Fehler: " + response);
                                }
                            });
                        }

                    } catch(JSONException e) {
                        Log.v(TAG, e.getLocalizedMessage());

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                // DO something
                                showDocError("Unbekannter Fehler: " + e.getLocalizedMessage());
                            }
                        });
                    }

                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d("Error.Response", ""+error.getLocalizedMessage());

                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            // DO something
                            showDocError("Unbekannter Fehler: " + error.getLocalizedMessage());
                        }
                    });
                }
            }) {
                @Override
                protected Map<String, String> getParams() {
                    Map<String, String>  params = new HashMap<String, String>();
                    params.put("atkn", apiToken);
                    params.put("utkn", fetchToken);
                    params.put("dtkn", token);
                    params.put("hash", sessionHash);
                    params.put("addSignDate", addSignDate);
                    Log.d(TAG, "marriage params " + params.toString());

                    for (int i = 0; i < signaturesHolder.size(); ++i) {
                        Log.d(TAG, "signaturesHolder add param id " + signaturesHolder.get(i).first.toString());
                        Log.d(TAG, "signaturesHolder add param file " + signaturesHolder.get(i).second.toString());
                        params.put(signaturesHolder.get(i).first.toString(), signaturesHolder.get(i).second.toString());
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
        }
    }

    public void loadOtherFile() {
        Log.e(TAG, "LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOAAAAAAAAAAAAAAAAAAADDDDDDDDD OTHER");

        new loadOtherFileTask().execute();
    }

    private class loadOtherFileTask extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {
            RequestQueue queue = Volley.newRequestQueue(mContext);

            String url = "https://app-backend.beleganbei.de/api/app-bridge/docexchange/document/open/";
            Log.d(TAG, "url -> " + url);
            StringRequest postRequest = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {// response
                    Log.d(TAG, "Response -> " + response);

                    if(response.contains("Fehler")) {
                        Log.d(TAG, "Response FEHLER -> " + response);
                        showDocError(response);
                    } else {
                        Log.d(TAG, "Response SUCCESS -> " + response);

                        progressBar.setVisibility(View.GONE);
                        sourceFilePdfUrl = response;
                    }
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d("Error.Response", error.getLocalizedMessage());
                }
            }) {
                @Override
                protected Map<String, String> getParams() {
                    Map<String, String>  params = new HashMap<String, String>();
                    params.put("atkn", apiToken);
                    params.put("utkn", fetchToken);
                    params.put("dtkn", token);

                    return params;
                }
            };
            queue.add(postRequest);

            return null;
        }

        @Override
        protected void onPostExecute(String response) {
            super.onPostExecute(response);
        }
    }

    public void loadPDFFile() {
        Log.e(TAG, "LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOAAAAAAAAAAAAAAAAAAADDDDDDDDD PDF");

        if(user_signed == 1) {
            String signedURL = "https://app-backend.beleganbei.de/tmp/view-final-signed-document.php?p=99999999&ct=" + apiToken + "&dt=" + token;
            //signedDoneURL = signedURL;
            sourceFilePdfUrl = signedURL;
            renderPDF(signedURL);
        } else {
            new loadPDFTask().execute();
        }
    }

    private class loadPDFTask extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {
            RequestQueue queue = Volley.newRequestQueue(mContext);

            String url = "https://app-backend.beleganbei.de/api/app-bridge/docexchange/document/open/";
            Log.d(TAG, "url -> " + url);
            StringRequest postRequest = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {// response
                    Log.d(TAG, "Response -> " + response);

                    if(response.contains("Fehler")) {
                        Log.d(TAG, "Response FEHLER -> " + response);
                        showDocError(response);
                    } else {
                        Log.d(TAG, "Response SUCCESS -> " + response);

                        progressBar.setVisibility(View.VISIBLE);
                        sourceFilePdfUrl = response;
                        renderPDF(response);
                    }
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d("Error.Response", error.getLocalizedMessage());
                }
            }) {
                @Override
                protected Map<String, String> getParams() {
                    Map<String, String>  params = new HashMap<String, String>();
                    params.put("atkn", apiToken);
                    params.put("utkn", fetchToken);
                    params.put("dtkn", token);

                    return params;
                }
            };
            queue.add(postRequest);

            return null;
        }

        @Override
        protected void onPostExecute(String response) {
            super.onPostExecute(response);
        }
    }

    public boolean onTap(MotionEvent evt) {
        /*
        try {
            for (int i = 0; i < signaturable_document_data.length(); ++i) {
                JSONObject obj = signaturable_document_data.getJSONObject(i);
                int page_number = obj.getInt("page_number");
                int page_signatures_count = obj.getInt("page_signatures_count");
                JSONArray page_signatures = obj.getJSONArray("page_signatures");

                if ((mCurrentPage + 1) == page_number) {
                    startSignatureForPage(page_signatures);
                }
            }
        } catch(JSONException e) {
            Log.e(TAG, e.getLocalizedMessage());
        }
        */

        return true;
    }

    public void renderPDF(String url) {
        final AsyncTask<Void, Void, Void> execute = new AsyncTask<Void, Void, Void>() {
            @Override
            protected Void doInBackground(Void... voids) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        progressBar.setVisibility(View.VISIBLE);
                    }
                });

                try {
                    InputStream input = new URL(url).openStream();
                    mTdView.fromStream(input)
                            .enableSwipe(true)
                            .enableDoubletap(true)
                            .enableAntialiasing(true)
                            .enableAnnotationRendering(true)
                            .defaultPage(mCurrentPage)
                            .onPageChange( DocExchangeActivity.this::onPageChanged)
                            //.onTap(DocExchangeActivity.this::onTap)
                            .onRender(new OnRenderListener() {
                                @Override
                                public void onInitiallyRendered(int nbPages) {

                                }

                                public void onInitiallyRendered(int pages, float pageWidth, float pageHeight) {
                                    runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            progressBar.setVisibility(View.GONE);
                                        }
                                    });
                                }
                            })
                            .onLoad(new OnLoadCompleteListener() {
                                public void loadComplete(int nbPages) {
                                    Log.e(TAG, "Pages: " + nbPages);
                                }
                            })
                            .onError(new OnErrorListener() {
                                @Override
                                public void onError(Throwable t) {
                                    Log.d("Error",t.toString());
                                    runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            showDocError("DAS PDF konnte nicht geladen werden: " + t.toString());
                                        }
                                    });
                                }
                            })
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
                //progressBar.setVisibility(View.VISIBLE);
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
    }

    public void showDocError(String errorMsg) {
        AlertDialog alertDialog = new AlertDialog.Builder(DocExchangeActivity.this).create();
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

    public void askPassword() {
        AlertDialog alertDialog = new AlertDialog.Builder(DocExchangeActivity.this).create();
        alertDialog.setCancelable(false);
        alertDialog.setTitle("Passwort notwendig");
        alertDialog.setMessage("Bitte geben Sie das zur Öffnung des Dokuments notwendige Passwort ein");

        LinearLayout askPW = new LinearLayout(DocExchangeActivity.this);
        askPW.setOrientation(LinearLayout.VERTICAL);

        final EditText passwd = new EditText(DocExchangeActivity.this);
        askPW.addView(passwd);

        alertDialog.setButton(AlertDialog.BUTTON_POSITIVE, "OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Log.v(TAG, "YES");
                String xPasswd = passwd.getText().toString();
                Log.v(TAG, "xPasswd -> " + xPasswd);

                progressBar.setVisibility(View.VISIBLE);
                inputPassword = xPasswd;

                new checkPasswordTask().execute();
            }
        });


        alertDialog.setButton(AlertDialog.BUTTON_NEGATIVE, "Abbrechen", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Log.v(TAG, "Nooooooooooooooo");
                alertDialog.dismiss();
                cancel();
            }
        });

        alertDialog.setView(askPW);
        alertDialog.show();
    }


    public void passwordWrong(String errorMsg) {
        AlertDialog alertDialog = new AlertDialog.Builder(DocExchangeActivity.this).create();
        alertDialog.setCancelable(false);
        alertDialog.setTitle("Fehler");
        alertDialog.setMessage(errorMsg);

        alertDialog.setButton(AlertDialog.BUTTON_POSITIVE, "Erneut versuchen", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Log.v(TAG, "YES");
                new android.os.Handler().postDelayed(new Runnable() {
                    public void run() {
                        Log.i("tag", "This'll run 300 milliseconds later");
                        askPassword();
                    }
                },500);
            }
        });


        alertDialog.setButton(AlertDialog.BUTTON_NEGATIVE, "Abbrechen", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Log.v(TAG, "Nooooooooooooooo");
                alertDialog.dismiss();
                cancel();
            }
        });

        alertDialog.show();
    }

    private class checkPasswordTask extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {
            progressBar.setVisibility(View.VISIBLE);

            RequestQueue queue = Volley.newRequestQueue(mContext);

            String url = "https://app-backend.beleganbei.de/api/app-bridge/docexchange/document/verify/";
            StringRequest postRequest = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {// response
                    Log.d(TAG, "Response -> " + response);

                    if(response.contains("Fehler")) {
                        Log.d(TAG, "Response FEHLER -> " + response);
                        passwordWrong(response);
                    } else {
                        Log.d(TAG, "Response SUCCESS -> " + response);
                        loadPDFFile();
                    }
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d("Error.Response", error.getLocalizedMessage());
                }
            }) {
                @Override
                protected Map<String, String> getParams() {
                    Map<String, String>  params = new HashMap<String, String>();
                    params.put("atkn", apiToken);
                    params.put("utkn", fetchToken);
                    params.put("dtkn", token);
                    params.put("pw", inputPassword);

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

    public LinearLayout createSendBar() {
        LinearLayout sendingBar = new LinearLayout(this);

        Button sendExecuteButton = new Button(this);
        sendExecuteButton.setText("Jetzt einsenden");
        sendExecuteButton.setGravity(Gravity.CENTER);
        sendExecuteButton.setPadding(20,20,20,20);
        sendExecuteButton.setBackgroundColor(Color.parseColor(bgColor));
        sendExecuteButton.setTextColor(Color.parseColor(textColor));
        sendExecuteButton.setTextSize(20);

        Double topMarginDouble = (getScreenHeight(this) / 10.0);
        Integer topMargin = topMarginDouble.intValue();

        LinearLayout.LayoutParams sendExecuteButtonLayoutParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, topMargin);
        sendExecuteButton.setLayoutParams(sendExecuteButtonLayoutParams);

        sendExecuteButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                v.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY);
                Log.e(TAG, "SEND OK");

                sendSignedDocument();
            }
        });
        sendingBar.addView(sendExecuteButton);

        return sendingBar;
    }

    public void onPageChanged(int page, int pageCount) {
        mCurrentPage = page;
        Log.e(TAG, "page: " + page);
        Log.e(TAG, "pageCount: " + pageCount);
        //setTitle(String.format("%s %s / %s", "Page Number", page + 1, pageCount));

        String valueString = String.format("%s %s%s%s", "Seite", page + 1, "/", pageCount);


        Boolean foundAtLeastOne = false;
        if(signaturable == 1) {
            int tmpAllSignaturesCount = 0;

            try {
                for (int i = 0; i < signaturable_document_data.length(); ++i) {
                    JSONObject obj = signaturable_document_data.getJSONObject(i);
                    int page_number = obj.getInt("page_number");
                    int page_signatures_count = obj.getInt("page_signatures_count");

                    tmpAllSignaturesCount += page_signatures_count;

                    if (page_signatures_count > 0) {
                        if ((page + 1) == page_number) {
                            valueString += " - " + page_signatures_count + " Unterschrift";

                            if (page_signatures_count > 1) {
                                valueString += "en";
                            }
                            foundAtLeastOne = true;
                        }
                    }
                }
            } catch(JSONException e) {
                Log.e(TAG, e.getLocalizedMessage());
            }

            if(foundAtLeastOne) {
                signButton.setVisibility(View.VISIBLE);
            } else {
                valueString += " - Keine Unterschrift";
                signButton.setVisibility(View.GONE);
            }

            if(user_signed == 1) {
                signButton.setVisibility(View.GONE);
            }


            if(allSignaturesCount == -1) {
                Log.e(TAG, "SET allSignaturesCount with " + tmpAllSignaturesCount);
                allSignaturesCount = tmpAllSignaturesCount;
            }
        }

        pdfInfoView.setText(valueString);
    }


    public LinearLayout createListViewElement() {
        LinearLayout viewElement = new LinearLayout(this);

        detailList = new ListView(this);
        detailList.setBackgroundColor(Color.WHITE);
        detailList.setPadding(0, 120,0,0);

        LinearLayout.LayoutParams detailListLayoutParams = new LinearLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
        detailList.setLayoutParams(detailListLayoutParams);

        detailList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                DocExchangeActivity.ListItem listItem = adapter.getItem(position);

            }
        });

        viewElement.addView(detailList);

        return viewElement;
    }

    public void sendSignedDocument() {
        Log.e(TAG, "sendSignedDocument");

        new handInSignedDocument().execute();
    }


    private class handInSignedDocument extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {

            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    progressBar.setVisibility(View.VISIBLE);
                }
            });

            RequestQueue queue = Volley.newRequestQueue(mContext);

            String url = "https://app-backend.beleganbei.de/api/app-bridge/docexchange/document/android/pdf/hand-in/";
            StringRequest postRequest = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {// response
                    Log.d(TAG, "Response -> " + response);

                    try {
                        JSONObject dataJSON = new JSONObject(response);

                        if(dataJSON.has("success")) {
                            //sessionHash = dataJSON.getString("success");

                            undoSignatureFiles();

                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    // DO something
                                    AlertDialog alertDialog = new AlertDialog.Builder(DocExchangeActivity.this).create();
                                    alertDialog.setCancelable(false);
                                    alertDialog.setTitle("Erfolg");
                                    alertDialog.setMessage("Das unterschriebene Dokument wurde zurück gesendet");

                                    alertDialog.setButton(AlertDialog.BUTTON_POSITIVE, "OK", new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialog, int which) {
                                            Log.v(TAG, "YES");
                                            alertDialog.dismiss();

                                            Intent resultIntent = new Intent();
                                            resultIntent.putExtra("code", 200);
                                            resultIntent.putExtra("title", title);
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
                                    // DO something
                                    showDocError("Fehler: " + errorMsg);
                                }
                            });
                        } else {
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    // DO something
                                    showDocError("Unbekannter Fehler: " + response);
                                }
                            });
                        }

                    } catch(JSONException e) {
                        Log.v(TAG, e.getLocalizedMessage());

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                // DO something
                                showDocError("Unbekannter Fehler: " + e.getLocalizedMessage());
                            }
                        });
                    }

                    /*
                    if(response.contains("SUCCESS")) {
                        Log.d(TAG, "Response SUCCESS -> " + response);

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                for(int i=0;i<signViewImages.size();i++) {
                                    String signatureRemotepageFile = signViewImages.get(i);
                                    Log.e(TAG, "!!invalidateImageCache signatureRemotepageFile => " + signatureRemotepageFile);
                                    Picasso.get().invalidate(signatureRemotepageFile);
                                }

                                AlertDialog alertDialog = new AlertDialog.Builder(DocExchangeActivity.this).create();
                                alertDialog.setCancelable(false);
                                alertDialog.setTitle("Erfolg");
                                alertDialog.setMessage("Das unterschriebene Dokument wurde zurück gesendet");

                                alertDialog.setButton(AlertDialog.BUTTON_POSITIVE, "OK", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        Log.v(TAG, "YES");
                                        alertDialog.dismiss();

                                        Intent resultIntent = new Intent();
                                        resultIntent.putExtra("from", "docexchange");
                                        resultIntent.putExtra("keep", "0");
                                        resultIntent.putExtra("code", 201);
                                        resultIntent.putExtra("result", "SUCCESS");
                                        resultIntent.putExtra("data", "");
                                        setResult(Activity.RESULT_OK, resultIntent);
                                        finish();
                                    }
                                });

                                alertDialog.show();
                            }
                        });
                    } else {
                        Log.d(TAG, "Response FEHLER -> " + response);

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                progressBar.setVisibility(View.GONE);
                                Toast.makeText(DocExchangeActivity.this, response, Toast.LENGTH_LONG).show();
                            }
                        });
                    }
                    */
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d(TAG,"Error.Response " + ""+error.toString());
                    Log.d(TAG,"Error.Response " + ""+error.getLocalizedMessage());

                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            showDocError("Es ist ein Fehler aufgetreten: " + error.getLocalizedMessage());
                        }
                    });
                }
            }) {
                @Override
                protected Map<String, String> getParams() {
                    Map<String, String>  params = new HashMap<String, String>();
                    params.put("atkn", apiToken);
                    params.put("utkn", fetchToken);
                    params.put("dtkn", token);
                    params.put("hash", sessionHash);

                    for(int i=0;i<signViewImages.size();i++) {
                        String signatureRemotepageFile = signViewImages.get(i);
                        Log.e(TAG, "signatureRemotepageFile => " + signatureRemotepageFile);
                        params.put("pages["+i+"]", signatureRemotepageFile);
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

    private void undoSignatureFiles() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                AsyncTask undoSignatureFilesTask = new DocExchangeActivity.UndoSignatureFiles().execute();
            }
        });
    }

    private class UndoSignatureFiles extends AsyncTask<Void, Void, String> {

        @Override
        protected String doInBackground(Void... params) {
            Log.e(TAG, "UndoSignatureFiles");

            RequestQueue queue = Volley.newRequestQueue(mContext);

            String url = "https://app-backend.beleganbei.de/api/app-bridge/document/clean/android/clean/";
            StringRequest postRequest = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {// response
                    Log.d(TAG, "UndoSignatureFiles Response -> " + response);
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d(TAG,"UndoSignatureFiles Error.Response " + ""+error.toString());
                    Log.d(TAG,"UndoSignatureFiles Error.Response " + ""+error.getLocalizedMessage());
                }
            }) {
                @Override
                protected Map<String, String> getParams() {
                    Map<String, String>  params = new HashMap<String, String>();
                    params.put("hash", sessionHash);

                    return params;
                }
            };
            queue.add(postRequest);

            return null;
        }

        @Override
        protected void onPostExecute(String response) {
            super.onPostExecute(response);
            //progressBar.setVisibility(View.GONE);
        }
    }

    public void deleteDocument() {
        Log.e(TAG, "deleteDocument");

        String title = "Achtung";
        String msg = "Das Dokument \"" + title + "\" jetzt löschen? Sie können das Dokument nach der Löschung nicht mehr einsehen bzw. öffnen. Fortfahren?!";

        AlertDialog alertDialog = new AlertDialog.Builder(DocExchangeActivity.this).create();
        alertDialog.setCancelable(false);
        alertDialog.setTitle(title);
        alertDialog.setMessage(msg);

        alertDialog.setButton(AlertDialog.BUTTON_POSITIVE, "Ja, löschen", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Log.v(TAG, "YES");

                new deleteUserDocument().execute();
            }
        });

        alertDialog.setButton(AlertDialog.BUTTON_NEGATIVE, "Abbrechen", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Log.v(TAG, "Nope");
                alertDialog.dismiss();
            }
        });

        alertDialog.show();
    }

    private class deleteUserDocument extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {

            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    progressBar.setVisibility(View.VISIBLE);
                }
            });

            RequestQueue queue = Volley.newRequestQueue(mContext);

            String url = "https://app-backend.beleganbei.de/api/app-bridge/docexchange/user/delete/document/";
            StringRequest postRequest = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {// response
                    Log.d(TAG, "Response -> " + response);

                    if(response.contains("SUCCESS")) {
                        Log.d(TAG, "Response SUCCESS -> " + response);

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Intent resultIntent = new Intent();
                                resultIntent.putExtra("code", 407);
                                resultIntent.putExtra("title", title);
                                setResult(Activity.RESULT_CANCELED, resultIntent);
                                finish();
                            }
                        });
                    } else {
                        Log.d(TAG, "Response FEHLER -> " + response);

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                progressBar.setVisibility(View.GONE);
                                Toast.makeText(DocExchangeActivity.this, response, Toast.LENGTH_LONG).show();
                            }
                        });
                    }
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d("Error.Response", error.getLocalizedMessage());
                }
            }) {
                @Override
                protected Map<String, String> getParams() {
                    Map<String, String>  params = new HashMap<String, String>();
                    params.put("atkn", apiToken);
                    params.put("utkn", fetchToken);
                    params.put("dtkn", token);

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

    private void setAdapterItems() {

        if(encrypted == 1) {
            adapter.add(new DocExchangeActivity.ListItem("Passwortgeschützt", true));
        }

        adapter.add(new DocExchangeActivity.ListItem("Betreff", true));
        adapter.add(new DocExchangeActivity.ListItem(title, false));

        // sign data
        if(signaturable == 1) {
            adapter.add(new DocExchangeActivity.ListItem("Unterschreibares Dokument", true));
            if(user_signed == 1) {
                String signDateInfo = "Eingesendet am " + user_signed_at;
                try {
                    String inputTimeStamp = user_signed_at;
                    final String inputFormat = "yyyy-dd-DD HH:mm:ss";
                    final String outputFormat = "EEEE, dd. MMMM yyyy hh:mm";
                    signDateInfo = "Eingesendet am " + TimeStampConverter(inputFormat, inputTimeStamp, outputFormat);
                } catch (ParseException e) {
                    e.printStackTrace();
                }

                adapter.add(new DocExchangeActivity.ListItem(signDateInfo, false));
            } else {
                try {
                    for (int i = 0; i < signaturable_document_data.length(); ++i) {
                        JSONObject obj = signaturable_document_data.getJSONObject(i);
                        int page_number = obj.getInt("page_number");
                        int page_signatures_count = obj.getInt("page_signatures_count");

                        if (page_signatures_count > 0) {
                            String retVal = page_signatures_count + " ";

                            if (page_signatures_count > 1) {
                                retVal += "Unterschriften";
                            } else {
                                retVal += "Unterschrift";
                            }
                            retVal += " auf Seite " + page_number + "";

                            JSONArray pageInfos = obj.getJSONArray("page_signatures");
                            for (int i2 = 0; i2 < pageInfos.length(); ++i2) {
                                JSONObject obj2 = pageInfos.getJSONObject(i2);
                                String label = obj2.getString("label");
                                retVal += "\n- " + label + "";
                            }

                            adapter.add(new DocExchangeActivity.ListItem(retVal, false));
                        }
                    }
                } catch(JSONException e) {
                    Log.e(TAG, e.getLocalizedMessage());
                }
            }
        }
        // sign data

        if(!text.isEmpty()) {
            adapter.add(new DocExchangeActivity.ListItem("Beschreibung", true));
            adapter.add(new DocExchangeActivity.ListItem(text, false));
        }

        if(!category_name.isEmpty()) {
            adapter.add(new DocExchangeActivity.ListItem("Kategorie", true));
            adapter.add(new DocExchangeActivity.ListItem(category_name, false));
        }

        SimpleDateFormat sdf = new SimpleDateFormat("EEEE, dd.MMM.yyyy hh:mm", Locale.GERMANY);

        if(auto_delete == 1) {
            adapter.add(new DocExchangeActivity.ListItem("Verfügbar bis", true));

            String auto_delete_at_formatted = auto_delete_at;
            try {
                String inputTimeStamp = auto_delete_at;
                final String inputFormat = "yyyy-dd-DD HH:mm:ss";
                final String outputFormat = "EEEE, dd. MMMM yyyy hh:mm";
                auto_delete_at_formatted = TimeStampConverter(inputFormat, inputTimeStamp, outputFormat);
            } catch (ParseException e) {
                e.printStackTrace();
            }

            //auto_delete_at_formatted = sdf.format(auto_delete_at);
            adapter.add(new DocExchangeActivity.ListItem(auto_delete_at_formatted, false));
        }

        adapter.add(new DocExchangeActivity.ListItem("Bereitgestellt am", true));
        String date_formatted = date;
        try {
            String inputTimeStamp = date;
            final String inputFormat = "yyyy-dd-DD HH:mm:ss";
            final String outputFormat = "EEEE, dd. MMMM yyyy";
            date_formatted = TimeStampConverter(inputFormat, inputTimeStamp, outputFormat);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        adapter.add(new DocExchangeActivity.ListItem(date_formatted, false));

        adapter.add(new DocExchangeActivity.ListItem("Zuerst geöffnet", true));
        String open_date_formatted = open_date;
        try {
            String inputTimeStamp = open_date;
            final String inputFormat = "yyyy-dd-DD HH:mm:ss";
            final String outputFormat = "EEEE, dd. MMMM yyyy hh:mm";
            open_date_formatted = TimeStampConverter(inputFormat, inputTimeStamp, outputFormat);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        adapter.add(new DocExchangeActivity.ListItem( open_date_formatted + " - " + open_count + "x", false));

        //adapter.add(new DocExchangeActivity.ListItem("Größe", true));
        //adapter.add(new DocExchangeActivity.ListItem(GetReadableFileSize(size), false));

        //adapter.add(new DocExchangeActivity.ListItem("Datei", true));
        //adapter.add(new DocExchangeActivity.ListItem(filename, false));

        adapter.add(new DocExchangeActivity.ListItem("", false));
        adapter.add(new DocExchangeActivity.ListItem("Legende", true));

        if(signaturable == 1) {
            adapter.add(new DocExchangeActivity.ListItem("legend-sign", false));
        }
        adapter.add(new DocExchangeActivity.ListItem("legend-info", false));
        adapter.add(new DocExchangeActivity.ListItem("legend-download", false));
        adapter.add(new DocExchangeActivity.ListItem("legend-email", false));

        adapter.add(new DocExchangeActivity.ListItem("legend-cancel", false));
        adapter.add(new DocExchangeActivity.ListItem("legend-delete", false));
    }

    private static String TimeStampConverter(final String inputFormat, String inputTimeStamp, final String outputFormat) throws ParseException {
        return new SimpleDateFormat(outputFormat).format(new SimpleDateFormat(inputFormat).parse(inputTimeStamp));
    }

    private static String GetReadableFileSize(int filesize) {
        Double filesizeReadableDouble;
        String filesizeReadable = "";

        if (filesize > 1024 * 1024) {
            filesizeReadableDouble = (double) (filesize/(1024*1024));
            filesizeReadable = String.format(Locale.GERMANY, "%.2f", filesizeReadableDouble) +" MB";
        } else if (filesize > 1024) {
            filesizeReadableDouble = (double) (filesize/1024);
            filesizeReadable = String.format(Locale.GERMANY, "%.2f", filesizeReadableDouble) +" kb";
        } else {
            filesizeReadableDouble = (double) filesize;
            filesizeReadable = String.format(Locale.GERMANY, "%.2f", filesizeReadableDouble) +" Bytes";
        }

        return filesizeReadable;
    }

    public class ListItem {
        public String labelValue;
        public Boolean isHeadline;

        public ListItem(String labelValue, Boolean isHeadline) {
            this.labelValue = labelValue;
            this.isHeadline = isHeadline;
        }
    }

    private class ListDataAdapter extends ArrayAdapter<DocExchangeActivity.ListItem> {

        public ListDataAdapter(Context context, ArrayList<DocExchangeActivity.ListItem> listitems) {
            super(context, 0, listitems);
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            Resources activityRes = DocExchangeActivity.this.getResources();

            DocExchangeActivity.ListItem listItem = getItem(position);

            Log.v(TAG, "labelValue -> " + listItem.labelValue);
            Log.v(TAG, "isHeadline -> " + listItem.isHeadline);

            /* Layout */
            RelativeLayout cellLayout = new RelativeLayout(DocExchangeActivity.this);
            cellLayout.setHapticFeedbackEnabled(true);
            cellLayout.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT));
            /* Layout */

            /* Label */
            if(listItem.labelValue.contains("legend-")) {

                LinearLayout cellLayoutLabel = new LinearLayout(DocExchangeActivity.this);

                TextView label = new TextView(DocExchangeActivity.this);
                label.setPadding(120, 6, 10, 6);
                LinearLayout.LayoutParams labelLayoutParams = new LinearLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
                label.setLayoutParams(labelLayoutParams);

                if(listItem.labelValue.contains("sign")) {
                    label.setText("Sie können das vorliegende Dokument unterschreiben, klicken Sie dazu auf das Unterschriftssymbol (Beispiel links).");
                } else if(listItem.labelValue.contains("info")) {
                    label.setText("Öffnen und schliessen Sie diese Informationen");
                } else if(listItem.labelValue.contains("download")) {
                    label.setText("Laden Sie das Dokument herunter und speichern es z.B. auf Ihrem Smartphone oder \"teilen\" es in eine andere App");
                } else if(listItem.labelValue.contains("email")) {
                    label.setText("Versenden Sie das Dokument an einen E-Mail Empfänger über Ihr Smartphone-E-Mail Programm");
                } else if(listItem.labelValue.contains("cancel")) {
                    label.setText("Ansicht schließen / Abrechen - Bei geöffneten Dokumenteninfos: Dokumenteninfos schließen");
                } else if(listItem.labelValue.contains("delete")) {
                    label.setText("Entfernen Sie dieses Dokument aus Ihrer Ansicht/Liste");
                } else  {
                    label.setText("");
                }

                cellLayoutLabel.addView(label);
                cellLayout.addView(cellLayoutLabel);

                ImageView imageeditImage = new ImageView(DocExchangeActivity.this);
                imageeditImage.setPadding(24, 24, 24, 24);

                GradientDrawable imageeditImageShape =  new GradientDrawable();
                imageeditImageShape.setCornerRadius(90 / 2f);
                imageeditImageShape.setStroke(2, Color.parseColor("#FFFFFF"));
                imageeditImageShape.setColor(Color.parseColor(bgColor));
                imageeditImage.setBackground(imageeditImageShape);

                if(listItem.labelValue.contains("sign")) {
                    int imageeditImageImgDrawable = activityRes.getIdentifier("icon_signature", "drawable", DocExchangeActivity.this.getApplicationContext().getPackageName());
                    Drawable imageeditImageImg = activityRes.getDrawable(imageeditImageImgDrawable, DocExchangeActivity.this.getApplicationContext().getTheme());
                    imageeditImage.setImageDrawable(imageeditImageImg);
                } else if(listItem.labelValue.contains("info")) {
                    int imageeditImageImgDrawable = activityRes.getIdentifier("icon_info", "drawable", DocExchangeActivity.this.getApplicationContext().getPackageName());
                    Drawable imageeditImageImg = activityRes.getDrawable(imageeditImageImgDrawable, DocExchangeActivity.this.getApplicationContext().getTheme());
                    imageeditImage.setImageDrawable(imageeditImageImg);
                } else if(listItem.labelValue.contains("download")) {
                    int imageeditImageImgDrawable = activityRes.getIdentifier("icon_download", "drawable", DocExchangeActivity.this.getApplicationContext().getPackageName());
                    Drawable imageeditImageImg = activityRes.getDrawable(imageeditImageImgDrawable, DocExchangeActivity.this.getApplicationContext().getTheme());
                    imageeditImage.setImageDrawable(imageeditImageImg);
                } else if(listItem.labelValue.contains("email")) {
                    int imageeditImageImgDrawable = activityRes.getIdentifier("icon_email", "drawable", DocExchangeActivity.this.getApplicationContext().getPackageName());
                    Drawable imageeditImageImg = activityRes.getDrawable(imageeditImageImgDrawable, DocExchangeActivity.this.getApplicationContext().getTheme());
                    imageeditImage.setImageDrawable(imageeditImageImg);
                } else if(listItem.labelValue.contains("cancel")) {
                    //imageeditImageShape.setColor(Color.parseColor("#FFFFFF"));
                    //imageeditImage.setBackground(imageeditImageShape);

                    int imageeditImageImgDrawable = activityRes.getIdentifier("icon_cancel", "drawable", DocExchangeActivity.this.getApplicationContext().getPackageName());
                    Drawable imageeditImageImg = activityRes.getDrawable(imageeditImageImgDrawable, DocExchangeActivity.this.getApplicationContext().getTheme());
                    imageeditImage.setImageDrawable(imageeditImageImg);
                } else if(listItem.labelValue.contains("delete")) {
                    //imageeditImageShape.setColor(Color.parseColor("#FFFFFF"));
                    //imageeditImage.setBackground(imageeditImageShape);

                    int imageeditImageImgDrawable = activityRes.getIdentifier("icon_trash", "drawable", DocExchangeActivity.this.getApplicationContext().getPackageName());
                    Drawable imageeditImageImg = activityRes.getDrawable(imageeditImageImgDrawable, DocExchangeActivity.this.getApplicationContext().getTheme());
                    imageeditImage.setImageDrawable(imageeditImageImg);
                }

                imageeditImage.setScaleType(ImageView.ScaleType.FIT_START);
                imageeditImage.setAdjustViewBounds(true);
                FrameLayout.LayoutParams imageeditImageLayoutParams = new FrameLayout.LayoutParams(90, 90);
                imageeditImageLayoutParams.topMargin = 10;
                imageeditImageLayoutParams.leftMargin = 10;
                imageeditImageLayoutParams.bottomMargin = 10;
                cellLayout.addView(imageeditImage, imageeditImageLayoutParams);

            } else {
                LinearLayout cellLayoutLabel = new LinearLayout(DocExchangeActivity.this);
                TextView label = new TextView(DocExchangeActivity.this);
                label.setText(listItem.labelValue);

                if (listItem.isHeadline) {
                    label.setTypeface(null, Typeface.BOLD);
                }

                label.setPadding(20, 20, 20, 20);
                LinearLayout.LayoutParams labelLayoutParams = new LinearLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
                //labelLayoutParams.topMargin = 48;
                label.setLayoutParams(labelLayoutParams);
                cellLayoutLabel.addView(label);
                /* Label */
                cellLayout.addView(cellLayoutLabel);
            }
            return cellLayout;

        }
    }

    /*public void save() {
        Log.e(TAG, "save");
        Intent resultIntent = new Intent();
        resultIntent.putExtra("from", "bewirtungsquittung");
        resultIntent.putExtra("keep", "0");

        resultIntent.putExtra("code", "201");
        resultIntent.putExtra("result", "RRRRRRRRRRRRRRRREEEEEEEEEEEEEEEEEEEEESULT");
        resultIntent.putExtra("data", "");
        setResult(Activity.RESULT_OK, resultIntent);

        super.finish();
    }*/

    public void cancel() {
        Log.e(TAG, "cancel");

        if(signaturable == 1 && user_signed != 1) {
            if(signaturesHolder.size() > 0) {
                if(!signedDocumentSended) {
                    Log.e(TAG, "Nicht gesendet");

                    AlertDialog alertDialog = new AlertDialog.Builder(DocExchangeActivity.this).create();
                    alertDialog.setCancelable(false);
                    alertDialog.setTitle("Achtung");
                    alertDialog.setMessage("Sie haben das unterschriebene Dokument noch nicht eingesendet. Möchten Sie wirklich abbrechen?");

                    alertDialog.setButton(AlertDialog.BUTTON_NEGATIVE, "Ja, abbrechen", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            Log.v(TAG, "YES");
                            alertDialog.dismiss();
                            executeCanel();
                        }
                    });

                    alertDialog.setButton(AlertDialog.BUTTON_POSITIVE, "Nein, bleiben", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            Log.v(TAG, "YES");
                            alertDialog.dismiss();
                        }
                    });

                    alertDialog.show();
                } else {
                    executeCanel();
                }
            } else {
                executeCanel();
            }
        } else {
            executeCanel();
        }
    }

    public void executeCanel() {
        File file = new File(this.getCacheDir(), filename);
        if(file.exists()) {
            boolean b = file.delete();
            Log.e(TAG, "delete: " + b);
        }

        for(int i=0;i<signViewImages.size();i++) {
            String signatureRemotepageFile = signViewImages.get(i);
            Log.e(TAG, "!!invalidateImageCache signatureRemotepageFile => " + signatureRemotepageFile);
            Picasso.get().invalidate(signatureRemotepageFile);
        }

        undoSignatureFiles();

        Intent resultIntent = new Intent();
        resultIntent.putExtra("code", 400);
        resultIntent.putExtra("title", title);
        setResult(Activity.RESULT_CANCELED, resultIntent);

        //super.finish();
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
