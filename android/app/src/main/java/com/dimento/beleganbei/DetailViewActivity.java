package com.dimento.beleganbei;

import java.io.File;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Build;

import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;
import android.content.Intent;

import android.util.Log;
import android.view.Gravity;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.FrameLayout;

import android.view.View;
import android.view.ViewGroup;
import android.view.Window;

import android.content.res.Resources;

import java.net.URI;
import java.net.URISyntaxException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import android.graphics.drawable.Drawable;
import android.graphics.Typeface;
import android.graphics.Color;
import android.view.HapticFeedbackConstants;
import android.util.DisplayMetrics;

import java.io.IOException;
import java.io.InputStream;

import android.widget.ProgressBar;

import android.graphics.BitmapFactory;
import android.graphics.Bitmap;
import android.net.Uri;
import android.widget.ArrayAdapter;
import java.util.ArrayList;
import org.json.JSONObject;

import android.widget.Toast;
import android.widget.AdapterView;

import java.text.CharacterIterator;
import 	java.text.StringCharacterIterator;
import java.util.List;
import android.view.View.OnTouchListener;
import android.view.GestureDetector;
import android.view.GestureDetector.SimpleOnGestureListener;
import android.view.MotionEvent;

import android.util.Pair;

public class DetailViewActivity extends Activity {

    public String TAG = "DetailViewActivity";

    private JSONObject belegData;
    private JSONObject options;

    private ArrayList<ListItem> arrayOfListItems = new ArrayList<ListItem>();
    private DetailViewActivity.ListDataAdapter adapter;

    private Integer buttonCount;

    private ImageView pdfViewButton;
    private ImageView imageEditButton;
    private ImageView ekMoveButton;
    private ImageView addPhotoButton;
    private ImageView bewirtungsEditButton;

    private Button cancelButton;
    private Button deleteButton;

    private ImageView mainImage;
    private TextView mainImageInfoView;
    private ListView detailList;
    private ProgressBar progressBar;

    private int activeTableViewCellIndex;

    private String beleg;
    private String method;
    private String folder;
    private String ekallowed;
    private String other;
    private String bgColor;
    private String textColor;

    private String belegData_source;

    private String belegData_beleg_hash;
    private String belegData_filename;
    private String belegData_originalFilename;
    private String belegData_previewFromPDF;
    private String belegData_date;

    private String belegData_common_category_name;
    private String belegData_common_category_id;
    private String belegData_common_comment;
    private String belegData_common_categories;

    private String belegData_datev_client_id;
    private String belegData_datev_client_name;
    private String belegData_datev_document_type;
    private String belegData_datev_comment;
    private String belegData_datev_clients;
    private String belegData_datev_categories;

    private String belegData_datevmytax_client_id;
    private String belegData_datevmytax_client_name;
    private String belegData_datevmytax_year;
    private String belegData_datevmytax_category_id;
    private String belegData_datevmytax_subcategory_id;
    private String belegData_datevmytax_comment;
    private String belegData_datevmytax_clients;
    private String belegData_datevmytax_categories;

    private String belegData_einkommensteuer_comment;
    private String belegData_einkommensteuer_ek_year;

    private String belegData_belegzentrale_comment;
    private String belegData_belegzentrale_category_id;
    private String belegData_belegzentrale_category_name;
    private String belegData_belegzentrale_categories;

    private String belegData_kalkuel_comment;
    private String belegData_kalkuel_category_id;
    private String belegData_kalkuel_category_name;
    private String belegData_kalkuel_categories;

    private String belegData_addison_comment;
    private String belegData_addison_category_id;
    private String belegData_addison_category_name;
    private String belegData_addison_categories;

    private String belegData_bewirtung_anlass;
    private String belegData_bewirtung_anmerkung;
    private String belegData_bewirtung_ort;
    private String belegData_bewirtung_datum;
    private String belegData_bewirtung_signature;
    private Double belegData_bewirtung_aufwand;
    private Double belegData_bewirtung_trinkgeld;
    private String belegData_bewirtung_gastgeber;
    private String belegData_bewirtung_teilnehmer;

    private String belegData_finalPDF_file;
    private String belegData_finalPDF_size;

    public JSONArray belegData_children;

    private String options_cropping;
    private String options_comment;
    private String options_categorize;

    private List<String> imageViewImages;
    private int imageViewImageIndex;

    private Boolean somethingChanged;

    public String jpegQuality;

    List<Pair> deleteFilesOnSuccess = new ArrayList<Pair>();
    List<Pair> deleteFilesOnCancel = new ArrayList<Pair>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //String package_name = getApplication().getPackageName();
        //setContentView(getApplication().getResources().getIdentifier("activity_pdfviewer", "layout", package_name));

        somethingChanged = false;
        jpegQuality = "0.6";

        imageViewImageIndex = 0;
        imageViewImages = new ArrayList<String>();

        Bundle intentExtras = getIntent().getExtras();

        if (intentExtras != null) {
            Log.e("intentExtras", intentExtras.toString());

            beleg = intentExtras.getString("beleg", beleg);
            Log.e("beleg", beleg);

            method = intentExtras.getString("method", method);
            Log.e("method", method);

            folder = intentExtras.getString("folder", folder);
            Log.e("folder", folder);

            ekallowed = intentExtras.getString("ekallowed", ekallowed);
            Log.e("ekallowed", ekallowed);

            other = intentExtras.getString("other", other);
            Log.e("other", other);

            bgColor = intentExtras.getString("bgColor", bgColor);
            Log.e("bgColor", bgColor);

            textColor = intentExtras.getString("textColor", textColor);
            Log.e("textColor", textColor);
        } else {
            Log.e("intentExtras", "NULL");
        }

        try {
            belegData = new JSONObject(beleg);
            Log.v(TAG, belegData.toString(1));

            belegData_source = belegData.getString("source");
            belegData_beleg_hash = belegData.getString("beleg_hash");
            belegData_filename = belegData.getString("filename");
            belegData_originalFilename = belegData.getString("originalFilename");
            belegData_previewFromPDF = belegData.getString("previewFromPDF");
            belegData_date = belegData.getString("date");

            JSONObject belegData_finalPDF = belegData.getJSONObject("finalPDF");
            belegData_finalPDF_file =  belegData_finalPDF.getString("file");
            belegData_finalPDF_size = belegData_finalPDF.getString("size");

            JSONObject belegData_common = belegData.getJSONObject("common");
            belegData_common_category_id = belegData_common.getString("category_id");
            belegData_common_category_name = belegData_common.getString("category_name");
            belegData_common_comment = belegData_common.getString("comment");
            belegData_common_categories = belegData_common.getString("categories");

            JSONObject belegData_datev = belegData.getJSONObject("datev");
            belegData_datev_client_id =  belegData_datev.getString("client_id");
            belegData_datev_client_name = belegData_datev.getString("client_name");
            belegData_datev_document_type = belegData_datev.getString("document_type");
            belegData_datev_comment = belegData_datev.getString("comment");
            belegData_datev_clients = belegData_datev.getString("clients");
            belegData_datev_categories = belegData_datev.getString("categories");

            JSONObject belegData_datevmytax = belegData.getJSONObject("myTax");
            belegData_datevmytax_client_id =  belegData_datevmytax.getString("client_id");
            belegData_datevmytax_client_name = belegData_datevmytax.getString("client_name");
            belegData_datevmytax_category_id = belegData_datevmytax.getString("category_id");
            belegData_datevmytax_year = belegData_datevmytax.getString("year");
            belegData_datevmytax_subcategory_id = belegData_datevmytax.getString("sub_category_id");
            belegData_datevmytax_comment = belegData_datevmytax.getString("comment");
            belegData_datevmytax_clients = belegData_datevmytax.getString("clients");
            belegData_datevmytax_categories = belegData_datevmytax.getString("categories");

            JSONObject belegData_einkommensteuer = belegData.getJSONObject("einkommensteuer");
            belegData_einkommensteuer_comment =  belegData_einkommensteuer.getString("comment");
            belegData_einkommensteuer_ek_year = belegData_einkommensteuer.getString("ek_year");

            JSONObject belegData_belegzentrale = belegData.getJSONObject("belegzentrale");
            belegData_belegzentrale_comment =  belegData_belegzentrale.getString("comment");
            belegData_belegzentrale_category_id = belegData_belegzentrale.getString("category_id");
            belegData_belegzentrale_category_name = belegData_belegzentrale.getString("category_name");
            belegData_belegzentrale_categories = belegData_belegzentrale.getString("categories");

            JSONObject belegData_kalkuel = belegData.getJSONObject("kalkuel");
            belegData_kalkuel_comment =  belegData_kalkuel.getString("comment");
            belegData_kalkuel_category_id = belegData_kalkuel.getString("category_id");
            belegData_kalkuel_category_name = belegData_kalkuel.getString("category_name");
            belegData_kalkuel_categories = belegData_kalkuel.getString("categories");

            JSONObject belegData_addison = belegData.getJSONObject("addisonoc");
            belegData_addison_comment =  belegData_addison.getString("comment");
            belegData_addison_category_id = belegData_addison.getString("category_id");
            belegData_addison_category_name = belegData_addison.getString("category_name");
            belegData_addison_categories = belegData_addison.getString("categories");

            JSONObject belegData_bewirtung = belegData.getJSONObject("bewirtung");
            belegData_bewirtung_anlass =  belegData_bewirtung.getString("anlass");
            belegData_bewirtung_anmerkung =  belegData_bewirtung.getString("anmerkung");
            belegData_bewirtung_ort =  belegData_bewirtung.getString("ort");
            belegData_bewirtung_datum =  belegData_bewirtung.getString("datum");
            belegData_bewirtung_signature =  belegData_bewirtung.getString("signature");
            belegData_bewirtung_aufwand =  belegData_bewirtung.getDouble("aufwand");
            belegData_bewirtung_trinkgeld =  belegData_bewirtung.getDouble("trinkgeld");
            belegData_bewirtung_gastgeber =  belegData_bewirtung.getString("gastgeber");
            belegData_bewirtung_teilnehmer =  belegData_bewirtung.getString("teilnehmer");

            JSONArray belegData_children = belegData.getJSONArray("children");

            /* Images */
            if(belegData_source.contains("pdf")) {
                //String imagePath = folder + "belege/" + belegData_previewFromPDF;
                imageViewImages.add(belegData_previewFromPDF);
            } else {
                //String imagePath = folder + "belege/" + belegData_filename;
                imageViewImages.add(belegData_filename);
            }
            /* Images */

            /* all images / pages */
            try {
                for (int i=0; i<belegData_children.length(); i++) {
                    JSONObject tmp = belegData_children.getJSONObject(i);
                    imageViewImages.add(tmp.getString("filename"));
                }
            } catch(JSONException e) {
                Log.v(TAG, "JSON belegData_children" + e.getLocalizedMessage());
            }
            /* all images / pages */

            Log.v(TAG, "cccbelegData_children as " + belegData_children.toString());

            Log.v(TAG, "belegData_source -> " + belegData_source);
            Log.v(TAG, "belegData_beleg_hash -> " + belegData_beleg_hash);
            Log.v(TAG, "belegData_filename -> " + belegData_filename);
            Log.v(TAG, "belegData_originalFilename -> " + belegData_originalFilename);
            Log.v(TAG, "belegData_previewFromPDF -> " + belegData_previewFromPDF);
            Log.v(TAG, "belegData_date -> " + belegData_date);

            Log.v(TAG, "belegData_finalPDF_file -> " + belegData_finalPDF_file);
            Log.v(TAG, "belegData_finalPDF_size -> " + belegData_finalPDF_size);

            Log.v(TAG, "belegData_bewirtung_anlass -> " + belegData_bewirtung_anlass);
            Log.v(TAG, "belegData_bewirtung_anmerkung -> " + belegData_bewirtung_anmerkung);
            Log.v(TAG, "belegData_bewirtung_ort -> " + belegData_bewirtung_ort);
            Log.v(TAG, "belegData_bewirtung_datum -> " + belegData_bewirtung_datum);
            Log.v(TAG, "belegData_bewirtung_signature -> " + belegData_bewirtung_signature);
            Log.v(TAG, "belegData_bewirtung_aufwand -> " + belegData_bewirtung_aufwand);
            Log.v(TAG, "belegData_bewirtung_trinkgeld -> " + belegData_bewirtung_trinkgeld);
            Log.v(TAG, "belegData_bewirtung_gastgeber -> " + belegData_bewirtung_gastgeber);
            Log.v(TAG, "belegData_bewirtung_teilnehmer -> " + belegData_bewirtung_teilnehmer);

            Log.v(TAG, "belegData_common_category_id -> " + belegData_common_category_id);
            Log.v(TAG, "belegData_common_category_name -> " + belegData_common_category_name);
            Log.v(TAG, "belegData_common_comment -> " + belegData_common_comment);
            Log.v(TAG, "belegData_common_categories -> " + belegData_common_categories);

            Log.v(TAG, "belegData_datev_client_id -> " + belegData_datev_client_id);
            Log.v(TAG, "belegData_datev_client_name -> " + belegData_datev_client_name);
            Log.v(TAG, "belegData_datev_document_type -> " + belegData_datev_document_type);
            Log.v(TAG, "belegData_datev_comment -> " + belegData_datev_comment);
            Log.v(TAG, "belegData_datev_clients -> " + belegData_datev_clients);
            Log.v(TAG, "belegData_datev_categories -> " + belegData_datev_categories);

            Log.v(TAG, "belegData_datevmytax_client_id -> " + belegData_datevmytax_client_id);
            Log.v(TAG, "belegData_datevmytax_client_name -> " + belegData_datevmytax_client_name);
            Log.v(TAG, "belegData_datevmytax_year -> " + belegData_datevmytax_year);
            Log.v(TAG, "belegData_datevmytax_category_id -> " + belegData_datevmytax_category_id);
            Log.v(TAG, "belegData_datevmytax_subcategory_id -> " + belegData_datevmytax_subcategory_id);
            Log.v(TAG, "belegData_datevmytax_comment -> " + belegData_datevmytax_comment);
            Log.v(TAG, "belegData_datevmytax_clients -> " + belegData_datevmytax_clients);
            Log.v(TAG, "belegData_datevmytax_categories -> " + belegData_datevmytax_categories);

            Log.v(TAG, "belegData_einkommensteuer_comment -> " + belegData_einkommensteuer_comment);
            Log.v(TAG, "belegData_einkommensteuer_ek_year -> " + belegData_einkommensteuer_ek_year);

            Log.v(TAG, "belegData_belegzentrale_comment -> " + belegData_belegzentrale_comment);
            Log.v(TAG, "belegData_belegzentrale_category_id -> " + belegData_belegzentrale_category_id);
            Log.v(TAG, "belegData_belegzentrale_category_name -> " + belegData_belegzentrale_category_name);
            Log.v(TAG, "belegData_belegzentrale_categories -> " + belegData_belegzentrale_categories);

            Log.v(TAG, "belegData_kalkuel_comment -> " + belegData_kalkuel_comment);
            Log.v(TAG, "belegData_kalkuel_category_id -> " + belegData_kalkuel_category_id);
            Log.v(TAG, "belegData_kalkuel_category_name -> " + belegData_kalkuel_category_name);
            Log.v(TAG, "belegData_kalkuel_categories -> " + belegData_kalkuel_categories);

            Log.v(TAG, "belegData_addison_comment -> " + belegData_addison_comment);
            Log.v(TAG, "belegData_addison_category_id -> " + belegData_addison_category_id);
            Log.v(TAG, "belegData_addison_category_name -> " + belegData_addison_category_name);
            Log.v(TAG, "belegData_addison_categories -> " + belegData_addison_categories);

            //Log.v(TAG, "xxx -> " + xxx);

        } catch(JSONException e) {
            Log.v(TAG, e.getLocalizedMessage());
        }

        try {
            options = new JSONObject(other);

            options_cropping = options.getString("cropping");
            Log.v(TAG, "options_cropping -> " + options_cropping);

            options_comment = options.getString("comment");
            Log.v(TAG, "options_comment -> " + options_comment);

            options_categorize = options.getString("categorize");
            Log.v(TAG, "options_categorize -> " + options_categorize);

            jpegQuality = options.getString("jpegQuality");
            Log.v(TAG, "options jpegQuality -> " + jpegQuality);

        } catch(JSONException e) {
            Log.v(TAG, e.getLocalizedMessage());
        }

        /* Layout */
        RelativeLayout tDLayout = new RelativeLayout(this);
        tDLayout.setHapticFeedbackEnabled(true);
        tDLayout.setLayoutParams(new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT));

        /* Progress Bar */
        RelativeLayout layout = new RelativeLayout(this);
        progressBar = new ProgressBar(DetailViewActivity.this,null,android.R.attr.progressBarStyleLarge);
        progressBar.setIndeterminate(true);
        progressBar.setVisibility(View.GONE);
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(320,320);
        params.addRule(RelativeLayout.CENTER_IN_PARENT, progressBar.getId());
        tDLayout.addView(progressBar, params);
        /* Progress Bar */

        /* Button Top Bar */
        LinearLayout buttonBar = createButtonBar();
        buttonBar.setId(getNextViewId());
        RelativeLayout.LayoutParams buttonBarLayoutParams = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        buttonBarLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        buttonBar.setLayoutParams(buttonBarLayoutParams);
        tDLayout.addView(buttonBar);
        /* Button Top Bar */

        /* Image Page Info INIT used in listViewELement */
        mainImageInfoView = new TextView(this);
        /* Image Page Info INIT used in listViewELement */

        /* Image View */
        LinearLayout imageViewElement = createImageViewELement();
        imageViewElement.setId(getNextViewId());
        RelativeLayout.LayoutParams imageViewElementLayoutParams = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        imageViewElementLayoutParams.addRule(RelativeLayout.BELOW, buttonBar.getId());
        imageViewElement.setLayoutParams(imageViewElementLayoutParams);
        tDLayout.addView(imageViewElement);
        /* Image View */

        /* List View */
        LinearLayout listViewELement = createListViewElement();
        listViewELement.setId(getNextViewId());
        RelativeLayout.LayoutParams listViewELementLayoutParams = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        listViewELementLayoutParams.addRule(RelativeLayout.BELOW, imageViewElement.getId());
        listViewELement.setLayoutParams(listViewELementLayoutParams);
        tDLayout.addView(listViewELement);
        /* List View */

        /* Image Page Info */
        mainImageInfoView.setBackgroundColor(Color.parseColor(bgColor));
        mainImageInfoView.setTextColor(Color.parseColor(textColor));

        if(imageViewImages.size() > 1) {
            mainImageInfoView.setText("Seite 1 / " + (imageViewImages.size()));
        } else {
            mainImageInfoView.setText("");
        }

        mainImageInfoView.setPadding(10, 6, 10, 6);
        mainImageInfoView.getBackground().setAlpha(128);
        mainImageInfoView.setGravity(Gravity.CENTER_VERTICAL | Gravity.CENTER_HORIZONTAL);
        Integer mainImageInfoViewWidth = 240;
        FrameLayout.LayoutParams paramsX = new FrameLayout.LayoutParams(mainImageInfoViewWidth, RelativeLayout.LayoutParams.WRAP_CONTENT);
        paramsX.leftMargin = 40;
        paramsX.topMargin  = 180;
        tDLayout.addView(mainImageInfoView, paramsX);
        /* Image Page Info */

        Resources activityRes = this.getResources();

        /* Buttons */
        buttonCount = 0;

        // PDF Button
        buttonCount += 1;

        if (!belegData_source.contains("pdf") && options_cropping.contains("1")) {
            // ImageEdit Button
            buttonCount += 1;
        }

        if(ekallowed.contains("1") && !belegData_source.contains("bewirtung")) {
            // TO/FROM EK Button
            buttonCount += 1;
        }

        if (belegData_source.contains("camera") || belegData_source.contains("folder")) {
            // Add Photo Button
            buttonCount += 1;
        }

        if (belegData_source.contains("bewirtung")) {
            // Add Bewirtung Button
            buttonCount += 1;
        }

        //if (self.ocrActive) { NOT USED, ANDROID NO OCR, BASICALLY
        /* OCR Button  buttonCount += 1*/
        //}

        Integer divider = 0;
        Integer halfDivider = 0;

        divider = buttonCount * 2;
        Log.v(TAG,"Button divider -> " + divider);

        halfDivider = divider / 2;
        Log.v(TAG,"Button halfDivider -> " + halfDivider);

        Integer oneThird = (getScreenWidth(this) / divider);
        Integer eachbuttonWidth = (getScreenWidth(this) / halfDivider);

        // PDF Button

        Double width1 = getScreenHeight(this) / 10.0;
        Integer width2 = width1.intValue();
        Double height1 = width2 / 1.5;
        Integer height2 = height1.intValue();

        Integer height = height2;
        Integer width = width2;
        Integer left = oneThird - (width / 2);

        Log.v(TAG, "Button count -> " + buttonCount);

        /* PDF Button */
        pdfViewButton = new ImageView(this);
        pdfViewButton.setBackgroundColor(Color.parseColor(bgColor));

        int pdfViewButtonImgDrawable = activityRes.getIdentifier("icon_pdfzoom", "drawable", this.getApplicationContext().getPackageName());
        Drawable pdfViewButtonImg = activityRes.getDrawable(pdfViewButtonImgDrawable, DetailViewActivity.this.getApplicationContext().getTheme());
        pdfViewButton.setImageDrawable(pdfViewButtonImg);

        pdfViewButton.setScaleType(ImageView.ScaleType.FIT_START);
        pdfViewButton.setAdjustViewBounds(true);
        pdfViewButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.v(TAG, "Clickitty click -> pdfViewButton");

                DetailViewActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Log.e(TAG, "run()");
                        Intent showPDFIntent = new Intent(DetailViewActivity.this, PDFViewerActivity.class);

                        String pdfSource = folder + "belege/" + belegData_finalPDF_file;
                        showPDFIntent.putExtra("sourceType", "file");
                        showPDFIntent.putExtra("pdfSource", pdfSource);
                        showPDFIntent.putExtra("bgColor", bgColor);
                        showPDFIntent.putExtra("textColor", textColor);

                        DetailViewActivity.this.startActivity(showPDFIntent);
                    }
                });

            }
        });

        FrameLayout.LayoutParams pdfViewButtonLayoutParams = new FrameLayout.LayoutParams(width, height);
        pdfViewButtonLayoutParams.leftMargin = left;

        Double pdfButtonTop = getScreenHeight(this) * 0.5;
        Integer pdfButtonTop2 = pdfButtonTop.intValue();

        pdfViewButtonLayoutParams.topMargin  = (pdfButtonTop2 + 60);

        tDLayout.addView(pdfViewButton, pdfViewButtonLayoutParams);
        /* PDF Button */

        Integer nextFromLeft = left + eachbuttonWidth;

        /* ImageEdit Button */
        if(!belegData_source.contains("pdf") && options_cropping.contains("1")) {
            imageEditButton = new ImageView(this);
            imageEditButton.setBackgroundColor(Color.parseColor(bgColor));

            int imageEditButtonImgDrawable = activityRes.getIdentifier("icon_imageedit", "drawable", this.getApplicationContext().getPackageName());
            Drawable imageEditButtonImg = activityRes.getDrawable(imageEditButtonImgDrawable, DetailViewActivity.this.getApplicationContext().getTheme());
            imageEditButton.setImageDrawable(imageEditButtonImg);

            imageEditButton.setScaleType(ImageView.ScaleType.FIT_START);
            imageEditButton.setAdjustViewBounds(true);
            imageEditButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Log.v(TAG, "Clickitty click -> imageEditButton");
                    imageEditStart();
                }
            });

            FrameLayout.LayoutParams imageEditButtonLayoutParams = new FrameLayout.LayoutParams(width, height);
            imageEditButtonLayoutParams.leftMargin = nextFromLeft;

            Double imageEditButtonTop = getScreenHeight(this) * 0.5;
            Integer imageEditButtonTop2 = imageEditButtonTop.intValue();

            imageEditButtonLayoutParams.topMargin  = (imageEditButtonTop2 + 60);

            tDLayout.addView(imageEditButton, imageEditButtonLayoutParams);

            nextFromLeft = nextFromLeft + eachbuttonWidth;
        }
        /* ImageEdit Button */

        /* EK Move Button */
        if(ekallowed.contains("1") && !belegData_source.contains("bewirtung")) {
            ekMoveButton = new ImageView(this);
            ekMoveButton.setBackgroundColor(Color.parseColor(bgColor));

            int ekMoveButtonImgDrawable = activityRes.getIdentifier("icon_ekmove", "drawable", this.getApplicationContext().getPackageName());
            Drawable ekMoveButtonImg = activityRes.getDrawable(ekMoveButtonImgDrawable, DetailViewActivity.this.getApplicationContext().getTheme());
            ekMoveButton.setImageDrawable(ekMoveButtonImg);

            ekMoveButton.setScaleType(ImageView.ScaleType.FIT_START);
            ekMoveButton.setAdjustViewBounds(true);
            ekMoveButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Log.v(TAG, "Clickitty click -> ekMoveButton");

                    String title = "Beleg verschieben?";
                    String msg = "";

                    if(method.contains("einkommenssteuer")) { // to standard
                        msg = "Möchten Sie diesen Beleg jetzt vom Einkommensteuerbereich in den \"normalen\" Bereich verschieben?";
                    } else { // to ek
                        msg = "Möchten Sie diesen Beleg jetzt in den Einkommensteuerbereich verschieben?";
                    }

                    AlertDialog alertDialog = new AlertDialog.Builder(DetailViewActivity.this).create();
                    alertDialog.setCancelable(false);
                    alertDialog.setTitle(title);
                    alertDialog.setMessage(msg);

                    alertDialog.setButton(AlertDialog.BUTTON_POSITIVE, "OK", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            Log.v(TAG, "YES");
                            ekMoveStart();
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
            });

            FrameLayout.LayoutParams ekMoveButtonLayoutParams = new FrameLayout.LayoutParams(width, height);
            ekMoveButtonLayoutParams.leftMargin = nextFromLeft;

            Double ekMoveButtonTop = getScreenHeight(this) * 0.5;
            Integer ekMoveButtonTop2 = ekMoveButtonTop.intValue();

            ekMoveButtonLayoutParams.topMargin  = (ekMoveButtonTop2 + 60);

            tDLayout.addView(ekMoveButton, ekMoveButtonLayoutParams);

            nextFromLeft = nextFromLeft + eachbuttonWidth;
        }
        /* EK Move Button */

        /* Add Photo Button */
        if(belegData_source.contains("bewirtung")) {
            bewirtungsEditButton = new ImageView(this);
            bewirtungsEditButton.setBackgroundColor(Color.parseColor(bgColor));

            int bewirtungsEditButtonImgDrawable = activityRes.getIdentifier("icon_bewirtung", "drawable", this.getApplicationContext().getPackageName());
            Drawable bewirtungsEditButtonImg = activityRes.getDrawable(bewirtungsEditButtonImgDrawable, DetailViewActivity.this.getApplicationContext().getTheme());
            bewirtungsEditButton.setImageDrawable(bewirtungsEditButtonImg);

            bewirtungsEditButton.setScaleType(ImageView.ScaleType.FIT_START);
            bewirtungsEditButton.setAdjustViewBounds(true);
            bewirtungsEditButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Log.v(TAG, "Clickitty click -> bewirtungsEditButton");
                    editBewirtung();
                }
            });

            FrameLayout.LayoutParams bewirtungsEditButtonLayoutParams = new FrameLayout.LayoutParams(width, height);
            bewirtungsEditButtonLayoutParams.leftMargin = nextFromLeft;

            Double bewirtungsEditButtonTop = getScreenHeight(this) * 0.5;
            Integer bewirtungsEditButtonTop2 = bewirtungsEditButtonTop.intValue();

            bewirtungsEditButtonLayoutParams.topMargin  = (bewirtungsEditButtonTop2 + 60);

            tDLayout.addView(bewirtungsEditButton, bewirtungsEditButtonLayoutParams);

            nextFromLeft = nextFromLeft + eachbuttonWidth;
        }
        /* Add Photo Button */

        /* Add Photo Button */
        if(belegData_source.contains("folder") || belegData_source.contains("camera")) {
            addPhotoButton = new ImageView(this);
            addPhotoButton.setBackgroundColor(Color.parseColor(bgColor));

            int addPhotoButtonImgDrawable = activityRes.getIdentifier("icon_addphoto", "drawable", this.getApplicationContext().getPackageName());
            Drawable addPhotoButtonImg = activityRes.getDrawable(addPhotoButtonImgDrawable, DetailViewActivity.this.getApplicationContext().getTheme());
            addPhotoButton.setImageDrawable(addPhotoButtonImg);

            addPhotoButton.setScaleType(ImageView.ScaleType.FIT_START);
            addPhotoButton.setAdjustViewBounds(true);
            addPhotoButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Log.v(TAG, "Clickitty click -> addPhotoButton");
                    addPhotoStart();
                }
            });

            FrameLayout.LayoutParams addPhotoButtonLayoutParams = new FrameLayout.LayoutParams(width, height);
            addPhotoButtonLayoutParams.leftMargin = nextFromLeft;

            Double addPhotoButtonTop = getScreenHeight(this) * 0.5;
            Integer addPhotoButtonTop2 = addPhotoButtonTop.intValue();

            addPhotoButtonLayoutParams.topMargin  = (addPhotoButtonTop2 + 60);

            tDLayout.addView(addPhotoButton, addPhotoButtonLayoutParams);

            nextFromLeft = nextFromLeft + eachbuttonWidth;
        }
        /* Add Photo Button */

        /* Buttons */

        /* Final Data ListItems */
        adapter = new ListDataAdapter(this, arrayOfListItems);
        detailList.setAdapter(adapter);

        collectAndShowList();
        /* Final Data ListItems */

        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(tDLayout);
    }

    public void collectAndShowList() {
        Log.v(TAG, "collectAndShowList");
        adapter.clear();

        adapter.add(new ListItem("Versandmethode", getMethodName(method), ""));

        // standard
        if(method.contains("standard")) {
            if(options_categorize.contains("1") && !belegData_source.contains("bewirtung")) {
                String cleanValue = (belegData_common_category_name.isEmpty() ? "---" : belegData_common_category_name);

                adapter.add(new ListItem("Kategorie", cleanValue, "category-standard"));
            }
            if (options_comment.contains("1") && !belegData_source.contains("bewirtung")) {
                String cleanValue = (belegData_common_comment.isEmpty() ? "---" : belegData_common_comment);

                adapter.add(new ListItem("Kommentar", cleanValue, "comment-standard"));
            }
        } else if(method.equals("datev_mytax")) {
            String clientName = (belegData_datevmytax_client_name.isEmpty() ? "---" : belegData_datevmytax_client_name);
            String year = (belegData_datevmytax_year.isEmpty() ? "---" : belegData_datevmytax_year);

            String category = getMyTaxCategoryName(belegData_datevmytax_category_id, belegData_datevmytax_subcategory_id, false);

            adapter.add(new ListItem("Client Name", clientName, "datevmytax-clientid"));
            adapter.add(new ListItem("Kategorie", category, "datevmytax-category"));
            adapter.add(new ListItem("Jahr", year, "datevmytax-year"));
            //adapter.add(new ListItem("Kommentar", cleanValue3, "datevmytax-comment"));
        } else if(method.contains("datev")) {
            String cleanValue = (belegData_datev_client_name.isEmpty() ? "---" : belegData_datev_client_name);
            String cleanValue2 = (belegData_datev_document_type.isEmpty() ? "---" : belegData_datev_document_type);
            cleanValue2 = (cleanValue2.equals("false") ? "---" : cleanValue2);
            String cleanValue3 = (belegData_datev_comment.isEmpty() ? "---" : belegData_datev_comment);

            adapter.add(new ListItem("Client Name", cleanValue, "datev-clientid"));
            adapter.add(new ListItem("Beleg-Typ", cleanValue2, "datev-category"));
            adapter.add(new ListItem("Kommentar", cleanValue3, "datev-comment"));

        } else if(method.contains("bzupload")) {
            String cleanValue = (belegData_belegzentrale_category_name.isEmpty() ? "---" : belegData_belegzentrale_category_name);
            String cleanValue2 = (belegData_belegzentrale_comment.isEmpty() ? "---" : belegData_belegzentrale_comment);

            adapter.add(new ListItem("Kategorie", cleanValue, "category-bzupload"));
            adapter.add(new ListItem("Kommentar", cleanValue2, "comment-bzupload"));
        } else if(method.contains("kalkuel")) {
            String cleanValue = (belegData_kalkuel_category_name.isEmpty() ? "---" : belegData_kalkuel_category_name);

            adapter.add(new ListItem("Kategorie", cleanValue, "category-kalkuel"));
        } else if(method.contains("addison_oc")) {
            String cleanValue = (belegData_addison_category_name.isEmpty() ? "---" : belegData_addison_category_name);

            adapter.add(new ListItem("Kategorie", cleanValue, "category-addisonoc"));

            String cleanValue2 = (belegData_addison_comment.isEmpty() ? "---" : belegData_addison_comment);
            adapter.add(new ListItem("Kommentar", cleanValue2, "comment-addisonoc"));
        } else if(method.contains("einkommenssteuer")) {
            String cleanValue = (belegData_einkommensteuer_ek_year.isEmpty() ? "---" : belegData_einkommensteuer_ek_year);

            adapter.add(new ListItem("Veranlagungsjahr", cleanValue, "ek_year"));
        }

        if(belegData_source.contains("bewirtung")) {
            adapter.add(new ListItem("Anlass", belegData_bewirtung_anlass, ""));
            adapter.add(new ListItem("Ort", belegData_bewirtung_ort, ""));
            adapter.add(new ListItem("Datum", belegData_bewirtung_datum, ""));
            adapter.add(new ListItem("Gastgeber", belegData_bewirtung_gastgeber, ""));
            adapter.add(new ListItem("Teilnehmer", belegData_bewirtung_teilnehmer, ""));
            adapter.add(new ListItem("Aufwand", belegData_bewirtung_aufwand.toString() + " EUR", ""));
            adapter.add(new ListItem("Trinkgeld", belegData_bewirtung_trinkgeld.toString() + " EUR", ""));
            adapter.add(new ListItem("Anmerkung", belegData_bewirtung_anmerkung, ""));
            adapter.add(new ListItem("Unterschrift", belegData_bewirtung_signature, "signature-image"));
        }

        adapter.add(new ListItem("Stand", belegData_date, ""));
        adapter.add(new ListItem("Quelle", getSourceName(belegData_source), ""));

        long kbsize = Long.parseLong(belegData_finalPDF_size);
        adapter.add(new ListItem("Größe", humanReadableByteCountSI(kbsize), ""));

        adapter.add(new ListItem("Legende", "", ""));
        adapter.add(new ListItem("Legende", "Legende", ""));
        adapter.add(new ListItem("Legende", "pdf", "Öffnen Sie den Beleg in der Vollansicht (PDF)"));

        if (!belegData_source.contains("pdf")) {
            adapter.add(new ListItem("Legende", "imageedit", "Bearbeiten Sie das aktuell sichtbare Belegfoto: Zuschnitt, S/W, Graustufen, Schärfen sowie drehen"));
        }

        if (!belegData_source.contains("bewirtung")) {
            adapter.add(new ListItem("Legende", "moveek", "Verschieben Sie den Beleg vom Standardbereich in den Einkommensteuerbereich oder umgekehrt"));
        }

        if (!belegData_source.contains("bewirtung") && !belegData_source.contains("pdf")) {
            adapter.add(new ListItem("Legende", "addpage", "Fügen Sie eine weitere Seite für den Beleg hinzu"));
        }

        if(belegData_source.contains("bewirtung")) {
            adapter.add(new ListItem("Legende", "bewirtung", "Bearbeiten Sie die Bewirtungsquittung"));
        }

        if (options_categorize.contains("1") && !method.contains("einkommenssteuer")) {
            adapter.add(new ListItem("Legende", "kategorie", "Tippen Sie auf die Kategorie um diese zu wählen/zu ändern"));
        }
        if (options_comment.contains("1") && !method.contains("einkommenssteuer")) {
            adapter.add(new ListItem("Legende", "comment", "Tippen Sie auf den Kommmentar, um diesen zu bearbeiten oder hinzuzufügen"));
        }
        if (method.contains("einkommenssteuer")) {
            adapter.add(new ListItem("Legende", "ekyear", "Tippen Sie auf das Veranlagungsjahr, um dieses zu wählen/zu ändern"));
        }

        adapter.notifyDataSetChanged();
    }

    public LinearLayout createImageViewELement() {
        LinearLayout viewElement = new LinearLayout( this);

        if(imageViewImages != null) {
            for (int i = 0; i < imageViewImages.size(); i++) {
                Log.v(TAG, "imageViewImage -> " + imageViewImages.get(i));
            }
        }

        setPageTextInfo();

        Double iVh = getScreenHeight(this) * 0.5;
        Integer iVh2 = iVh.intValue();

        mainImage = new ImageView(this);
        mainImage.setBackground(null);

        setImageToView();

        mainImage.setBackgroundColor(Color.parseColor("#e3e3e3"));
        mainImage.setScaleType(ImageView.ScaleType.FIT_START);
        mainImage.setAdjustViewBounds(true);
        mainImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.v(TAG, "Clickitty click -> image c");
            }
        });

        mainImage.setOnTouchListener(new OnSwipeTouchListener(this) {
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

        LinearLayout.LayoutParams mainImageLayoutParams = new LinearLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
        mainImageLayoutParams.height = iVh2;
        mainImageLayoutParams.width = getScreenWidth(this);
        mainImage.setLayoutParams(mainImageLayoutParams);

        viewElement.addView(mainImage);

        return viewElement;
    }

    private void setImageToView() {
        try {
            Log.v(TAG, "imageViewImageIndex -> " + imageViewImageIndex);

            String imagePath = folder + "belege/" + imageViewImages.get(imageViewImageIndex);
            Log.v(TAG, "imagePath -> " + imagePath);

            Uri imageUri = Uri.parse(imagePath);
            final InputStream imageStream = getContentResolver().openInputStream(imageUri);
            final Bitmap selectedImage = BitmapFactory.decodeStream(imageStream);
            mainImage.setImageBitmap(selectedImage);
        } catch(IOException e) {
            Log.v(TAG, "image not readable");
            Log.v(TAG, e.getLocalizedMessage());
        }
    }

    public LinearLayout createListViewElement() {
        LinearLayout viewElement = new LinearLayout(this);

        Double lVh = getScreenHeight(this) * 0.4;
        Integer lVh2 = lVh.intValue();

        detailList = new ListView(this);
        detailList.setBackgroundColor(Color.WHITE);

        //ArrayAdapter<String> modeAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, android.R.id.text1, finalData);
        //detailList.setAdapter(modeAdapter);

        //ListDataAdapter adapter = new ListDataAdapter(this, arrayOfListItems);
        //detailList.setAdapter(adapter);

        LinearLayout.LayoutParams detailListLayoutParams = new LinearLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
        detailListLayoutParams.topMargin = 68;
        detailListLayoutParams.height = lVh2;
        detailListLayoutParams.width = getScreenWidth(this);
        detailList.setLayoutParams(detailListLayoutParams);

        detailList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                ListItem listItem = adapter.getItem(position);

                String checkAction = listItem.extraInfo;
                Log.e(TAG, "checkAction => " + checkAction);

                if (checkAction.contains("datev-")) {
                    if (checkAction.contains("datev-clientid")) {
                        Log.v(TAG, "datev-clientid");

                        activeTableViewCellIndex = position;
                        editCategoryStart("datev-clientid");
                    } else if (checkAction.contains("datev-category")) {
                        Log.v(TAG, "datev-category");

                        activeTableViewCellIndex = position;
                        editCategoryStart("datev-category");
                    } else if (checkAction.contains("datev-comment")) {
                        Log.v(TAG, "datev-comment");

                        activeTableViewCellIndex = position;
                        editCommentStart(listItem.label, "datev");
                    }
                } else if (checkAction.contains("datevmytax-")) {
                    if (checkAction.contains("datevmytax-clientid")) {
                        Log.v(TAG, "datevmytax-clientid");

                        activeTableViewCellIndex = position;
                        editCategoryStart("datevmytax-clientid");
                    } else if (checkAction.contains("datevmytax-category")) {
                        Log.v(TAG, "datev-category");

                        activeTableViewCellIndex = position;
                        editCategoryStart("datevmytax-category");
                    } else if (checkAction.contains("datevmytax-year")) {
                        Log.v(TAG, "datev-year");

                        activeTableViewCellIndex = position;
                        editEKYearDatevStart(listItem.label);
                    }
                } else if (checkAction.contains("comment-")) {
                    if (checkAction.contains("comment-standard")) {
                        Log.v(TAG, "comment-standard");

                        activeTableViewCellIndex = position;
                        editCommentStart(listItem.label, "standard");
                    } else if (checkAction.contains("comment-bzupload")) {
                        Log.v(TAG, "comment-bzupload");

                        activeTableViewCellIndex = position;
                        editCommentStart(listItem.label, "bzupload");
                    } else if (checkAction.contains("comment-kalkuel")) {
                        Log.v(TAG, "comment-kalkuel");

                        activeTableViewCellIndex = position;
                        editCommentStart(listItem.label, "kalkuel");
                    } else if (checkAction.contains("comment-addisonoc")) {
                        Log.v(TAG, "comment-addisonoc");

                        activeTableViewCellIndex = position;
                        editCommentStart(listItem.label, "addisonoc");
                    } else if (checkAction.contains("comment-plusadvise")) {
                        Log.v(TAG, "comment-plusadvise");

                        activeTableViewCellIndex = position;
                        editCommentStart(listItem.label, "plusadvise");
                    }
                } else if (checkAction.contains("category-")) {
                    if (checkAction.contains("category-standard")) {
                        Log.v(TAG, "category-standard");

                        activeTableViewCellIndex = position;
                        editCategoryStart("standard");
                    } else if (checkAction.contains("category-bzupload")) {
                        Log.v(TAG, "category-bzupload");

                        activeTableViewCellIndex = position;
                        editCategoryStart( "bzupload");
                    } else if (checkAction.contains("category-kalkuel")) {
                        Log.v(TAG, "category-kalkuel");

                        activeTableViewCellIndex = position;
                        editCategoryStart( "kalkuel");
                    } else if (checkAction.contains("category-addisonoc")) {
                        Log.v(TAG, "category-addisonoc");

                        activeTableViewCellIndex = position;
                        editCategoryStart( "addisonoc");
                    } else if (checkAction.contains("category-plusadvise")) {
                        Log.v(TAG, "category-plusadvise");

                        activeTableViewCellIndex = position;
                        editCategoryStart( "plusadvise");
                    }
                } else if (checkAction.contains("ek_year")) {
                    Log.v(TAG, "ek_year");
                    activeTableViewCellIndex = position;
                    editEKYearStart(listItem.label);
                }

                //Toast.makeText(DetailViewActivity.this, "Ihre Auswahl : " + listItem.headline, Toast.LENGTH_LONG).show();
            }
        });

        viewElement.addView(detailList);

        return viewElement;
    }

    public class ListItem {
        public String headline;
        public String label;
        public String extraInfo;

        public ListItem(String headline, String label, String extraInfo) {
            this.headline = headline;
            this.label = label;
            this.extraInfo = extraInfo;
        }
    }

    private class ListDataAdapter extends ArrayAdapter<ListItem> {

        public ListDataAdapter(Context context, ArrayList<ListItem> listitems) {
            super(context, 0, listitems);
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            Resources activityRes = DetailViewActivity.this.getResources();

            ListItem listItem = getItem(position);

            Log.v(TAG, listItem.headline);
            Log.v(TAG, listItem.label);
            Log.v(TAG, listItem.extraInfo);

            /* Layout */
            RelativeLayout cellLayout = new RelativeLayout(DetailViewActivity.this);
            cellLayout.setHapticFeedbackEnabled(true);
            cellLayout.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT));
            /* Layout */

            if(listItem.headline.contains("Legende")) {
                if(listItem.label.isEmpty()) {
                    /* Leer
                        LinearLayout cellLayoutLabel = new LinearLayout(DetailViewActivity.this);
                        TextView label = new TextView(DetailViewActivity.this);
                        label.setText(" ");
                        label.setPadding(10, 6, 10, 6);
                        LinearLayout.LayoutParams labelLayoutParams = new LinearLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
                        labelLayoutParams.topMargin = 48;
                        label.setLayoutParams(labelLayoutParams);
                        cellLayoutLabel.addView(label);
                        cellLayout.addView(cellLayoutLabel);
                    Leer */
                } else if(listItem.label.contains("Legende")) {
                    /* Headline Legende */
                    LinearLayout cellLayoutHeadline = new LinearLayout(DetailViewActivity.this);
                    TextView headline = new TextView(DetailViewActivity.this);
                    headline.setText(listItem.headline);
                    headline.setTypeface(null, Typeface.BOLD);
                    headline.setTextSize(14);
                    headline.setPadding(10, 6, 10, 6);
                    LinearLayout.LayoutParams headlineLayoutParams = new LinearLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
                    headlineLayoutParams.topMargin = 50;
                    headline.setLayoutParams(headlineLayoutParams);
                    cellLayoutHeadline.addView(headline);
                    /* Headline Legende */
                    cellLayout.addView(cellLayoutHeadline);
                } else {

                    /* Text */
                    LinearLayout cellLayoutLabel = new LinearLayout(DetailViewActivity.this);
                    TextView label = new TextView(DetailViewActivity.this);
                    label.setText(listItem.extraInfo);
                    LinearLayout.LayoutParams labelLayoutParams = new LinearLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
                    label.setLayoutParams(labelLayoutParams);
                    cellLayoutLabel.addView(label);
                    /* Text */

                    if(listItem.label.contains("pdf")) {
                        ImageView legendPDFImage = new ImageView(DetailViewActivity.this);
                        legendPDFImage.setBackgroundColor(Color.parseColor(bgColor));

                        int legendPDFImageImgDrawable = activityRes.getIdentifier("icon_pdfzoom", "drawable", DetailViewActivity.this.getApplicationContext().getPackageName());
                        Drawable legendPDFImageImg = activityRes.getDrawable(legendPDFImageImgDrawable, DetailViewActivity.this.getApplicationContext().getTheme());
                        legendPDFImage.setImageDrawable(legendPDFImageImg);

                        legendPDFImage.setScaleType(ImageView.ScaleType.FIT_START);
                        legendPDFImage.setAdjustViewBounds(true);
                        FrameLayout.LayoutParams legendPDFImageLayoutParams = new FrameLayout.LayoutParams(90, 90);
                        legendPDFImageLayoutParams.topMargin = 10;
                        legendPDFImageLayoutParams.leftMargin = 10;
                        legendPDFImageLayoutParams.bottomMargin = 10;
                        cellLayout.addView(legendPDFImage, legendPDFImageLayoutParams);

                        label.setPadding(120, 6, 10, 6);
                    } else if(listItem.label.contains("imageedit")) {
                        ImageView imageeditImage = new ImageView(DetailViewActivity.this);
                        imageeditImage.setBackgroundColor(Color.parseColor(bgColor));

                        int imageeditImageImgDrawable = activityRes.getIdentifier("icon_imageedit", "drawable", DetailViewActivity.this.getApplicationContext().getPackageName());
                        Drawable imageeditImageImg = activityRes.getDrawable(imageeditImageImgDrawable, DetailViewActivity.this.getApplicationContext().getTheme());
                        imageeditImage.setImageDrawable(imageeditImageImg);

                        imageeditImage.setScaleType(ImageView.ScaleType.FIT_START);
                        imageeditImage.setAdjustViewBounds(true);
                        FrameLayout.LayoutParams imageeditImageLayoutParams = new FrameLayout.LayoutParams(90, 90);
                        imageeditImageLayoutParams.topMargin = 10;
                        imageeditImageLayoutParams.leftMargin = 10;
                        imageeditImageLayoutParams.bottomMargin = 10;
                        cellLayout.addView(imageeditImage, imageeditImageLayoutParams);

                        label.setPadding(120, 6, 10, 6);
                    } else if(listItem.label.contains("moveek")) {
                        ImageView moveekImage = new ImageView(DetailViewActivity.this);
                        moveekImage.setBackgroundColor(Color.parseColor(bgColor));

                        int moveekImageImgDrawable = activityRes.getIdentifier("icon_ekmove", "drawable", DetailViewActivity.this.getApplicationContext().getPackageName());
                        Drawable moveekImageImg = activityRes.getDrawable(moveekImageImgDrawable, DetailViewActivity.this.getApplicationContext().getTheme());
                        moveekImage.setImageDrawable(moveekImageImg);

                        moveekImage.setScaleType(ImageView.ScaleType.FIT_START);
                        moveekImage.setAdjustViewBounds(true);
                        FrameLayout.LayoutParams moveekImageLayoutParams = new FrameLayout.LayoutParams(90, 90);
                        moveekImageLayoutParams.topMargin = 10;
                        moveekImageLayoutParams.leftMargin = 10;
                        moveekImageLayoutParams.bottomMargin = 10;
                        cellLayout.addView(moveekImage, moveekImageLayoutParams);

                        label.setPadding(120, 6, 10, 6);
                    } else if(listItem.label.contains("addpage")) {
                        ImageView addpageImage = new ImageView(DetailViewActivity.this);
                        addpageImage.setBackgroundColor(Color.parseColor(bgColor));

                        int addpageImageImgDrawable = activityRes.getIdentifier("icon_addphoto", "drawable", DetailViewActivity.this.getApplicationContext().getPackageName());
                        Drawable addpageImageImg = activityRes.getDrawable(addpageImageImgDrawable, DetailViewActivity.this.getApplicationContext().getTheme());
                        addpageImage.setImageDrawable(addpageImageImg);

                        addpageImage.setScaleType(ImageView.ScaleType.FIT_START);
                        addpageImage.setAdjustViewBounds(true);
                        FrameLayout.LayoutParams addpageImageLayoutParams = new FrameLayout.LayoutParams(90, 90);
                        addpageImageLayoutParams.topMargin = 10;
                        addpageImageLayoutParams.leftMargin = 10;
                        addpageImageLayoutParams.bottomMargin = 10;
                        cellLayout.addView(addpageImage, addpageImageLayoutParams);

                        label.setPadding(120, 6, 10, 6);
                    } else if(listItem.label.contains("bewirtung")) {
                        ImageView bewirtungImage = new ImageView(DetailViewActivity.this);
                        bewirtungImage.setBackgroundColor(Color.parseColor(bgColor));

                        int bewirtungImgDrawable = activityRes.getIdentifier("icon_bewirtung", "drawable", DetailViewActivity.this.getApplicationContext().getPackageName());
                        Drawable bewirtungImg = activityRes.getDrawable(bewirtungImgDrawable, DetailViewActivity.this.getApplicationContext().getTheme());
                        bewirtungImage.setImageDrawable(bewirtungImg);

                        bewirtungImage.setScaleType(ImageView.ScaleType.FIT_START);
                        bewirtungImage.setAdjustViewBounds(true);
                        FrameLayout.LayoutParams bewirtungImageLayoutParams = new FrameLayout.LayoutParams(90, 90);
                        bewirtungImageLayoutParams.topMargin = 10;
                        bewirtungImageLayoutParams.leftMargin = 10;
                        bewirtungImageLayoutParams.bottomMargin = 10;
                        cellLayout.addView(bewirtungImage, bewirtungImageLayoutParams);

                        label.setPadding(120, 6, 10, 6);
                    } else {
                        label.setPadding(10, 6, 10, 6);
                    }
                    cellLayout.addView(cellLayoutLabel);
                }
            } else {
                /* Headline */
                LinearLayout cellLayoutHeadline = new LinearLayout(DetailViewActivity.this);
                TextView headline = new TextView(DetailViewActivity.this);
                headline.setText(listItem.headline);
                headline.setTypeface(null, Typeface.BOLD);
                headline.setPadding(10, 6, 10, 6);
                LinearLayout.LayoutParams headlineLayoutParams = new LinearLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
                headline.setLayoutParams(headlineLayoutParams);
                cellLayoutHeadline.addView(headline);
                /* Headline */
                cellLayout.addView(cellLayoutHeadline);

                if(listItem.extraInfo.contains("signature-image")) {
                    ImageView signatureImage = new ImageView(DetailViewActivity.this);
                    signatureImage.setBackgroundColor(Color.WHITE);

                    try {
                        Log.v(TAG, "filename -> " + listItem.label);

                        String imagePath = folder + listItem.label;
                        Log.v(TAG, "imagePath -> " + imagePath);

                        Uri imageUri = Uri.parse(imagePath);
                        final InputStream imageStream = getContentResolver().openInputStream(imageUri);
                        final Bitmap selectedImage = BitmapFactory.decodeStream(imageStream);
                        signatureImage.setImageBitmap(selectedImage);
                    } catch(IOException e) {
                        Log.v(TAG, "image not readable");
                        Log.v(TAG, e.getLocalizedMessage());
                    }

                    signatureImage.setScaleType(ImageView.ScaleType.FIT_START);
                    signatureImage.setAdjustViewBounds(true);
                    FrameLayout.LayoutParams signatureImageLayoutParams = new FrameLayout.LayoutParams((getScreenWidth(DetailViewActivity.this) - 20), 180);
                    signatureImageLayoutParams.topMargin = 10;
                    signatureImageLayoutParams.leftMargin = 10;
                    signatureImageLayoutParams.bottomMargin = 10;
                    cellLayout.addView(signatureImage, signatureImageLayoutParams);

                    //label.setPadding(120, 6, 10, 6);
                } else {

                    /* Label */
                    LinearLayout cellLayoutLabel = new LinearLayout(DetailViewActivity.this);
                    TextView label = new TextView(DetailViewActivity.this);
                    label.setText(listItem.label);
                    label.setPadding(10, 6, 10, 6);
                    LinearLayout.LayoutParams labelLayoutParams = new LinearLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
                    labelLayoutParams.topMargin = 48;
                    label.setLayoutParams(labelLayoutParams);
                    cellLayoutLabel.addView(label);
                    /* Label */
                    cellLayout.addView(cellLayoutLabel);
                }
            }

            return cellLayout;

            /*
            LinearLayout convertViewNew = new LinearLayout(DetailViewActivity.this);

            LinearLayout.LayoutParams convertViewParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
            //convertViewParams.width = (int) (getScreenWidth(DetailViewActivity.this)* 0.5);
            convertViewNew.setLayoutParams(convertViewParams);

            TextView headline = new TextView(DetailViewActivity.this);
            headline.setText(listItem.headline);
            headline.setTypeface(null, Typeface.BOLD);
            headline.setPadding(10, 6, 10, 6);
            FrameLayout.LayoutParams headlineParams = new FrameLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
            convertViewNew.addView(headline, headlineParams);

            TextView label = new TextView(DetailViewActivity.this);
            label.setText(listItem.label);
            label.setPadding(10, 6, 10, 6);
            FrameLayout.LayoutParams labelParams = new FrameLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
            convertViewNew.addView(label, labelParams);

            return convertViewNew;
            */
        }
    }

    public void  nextImage() {
        Log.v(TAG, "NextImage");
        Log.v(TAG, "NextImage imageViewImageIndex " + imageViewImageIndex);
        Log.v(TAG, "NextImage Count " + imageViewImages.size());

        int calcAllCount = imageViewImages.size();
        int nextIndex = (imageViewImageIndex+1);

        if (imageViewImageIndex < (imageViewImages.size() - 1)) {
            int next = (imageViewImageIndex + 1);

            if (next >= 0) {
                imageViewImageIndex = next;
                Log.e(TAG, "eins vor " + imageViewImageIndex);

                setImageToView();

                //self.scrollView.setZoomScale(1, animated: true)
                setPageTextInfo();
            }
        } else {
            //Toast.makeText(DetailViewActivity.this, "Letzte Seite", Toast.LENGTH_LONG).show();
        }
    }

    public void prevImage() {
        Log.v(TAG, "prevImage");
        Log.v(TAG, "prevImage imageViewImageIndex " + imageViewImageIndex);
        Log.v(TAG, "prevImage Count " + imageViewImages.size());

        if (imageViewImageIndex > 0) {
            int prev = (imageViewImageIndex - 1);

            if (prev < imageViewImages.size()) {
                imageViewImageIndex = prev;
                Log.e(TAG, "eins zurück " + imageViewImageIndex);

                setImageToView();

                //self.scrollView.setZoomScale(1, animated: true)
                setPageTextInfo();
            }
        } else {
            //Toast.makeText(DetailViewActivity.this, "Erste Seite", Toast.LENGTH_LONG).show();
        }
    }

    private void setPageTextInfo() {
        if(imageViewImages.size() > 1) {
            mainImageInfoView.setText("Seite " + (imageViewImageIndex+1) + " / " + (imageViewImages.size()));
            mainImageInfoView.setVisibility(View.VISIBLE);
        } else {
            mainImageInfoView.setVisibility(View.GONE);
        }
    }

    /**
     * Detects left and right swipes across a view.
     * https://stackoverflow.com/questions/4139288/android-how-to-handle-right-to-left-swipe-gestures
     */
    abstract class OnSwipeTouchListener implements OnTouchListener {

        private final GestureDetector gestureDetector;

        public OnSwipeTouchListener(Context context) {
            gestureDetector = new GestureDetector(context, new GestureListener());
        }

        public void onSwipeLeft() {
        }

        public void onSwipeRight() {
        }

        public boolean onTouch(View v, MotionEvent event) {
            return gestureDetector.onTouchEvent(event);
        }

        private final class GestureListener extends SimpleOnGestureListener {

            private static final int SWIPE_DISTANCE_THRESHOLD = 100;
            private static final int SWIPE_VELOCITY_THRESHOLD = 100;

            @Override
            public boolean onDown(MotionEvent e) {
                return true;
            }

            @Override
            public boolean onFling(MotionEvent e1, MotionEvent e2, float velocityX, float velocityY) {
                float distanceX = e2.getX() - e1.getX();
                float distanceY = e2.getY() - e1.getY();
                if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > SWIPE_DISTANCE_THRESHOLD && Math.abs(velocityX) > SWIPE_VELOCITY_THRESHOLD) {
                    if (distanceX > 0)
                        onSwipeRight();
                    else
                        onSwipeLeft();
                    return true;
                }
                return false;
            }
        }
    }

    public LinearLayout createButtonBar() {
        LinearLayout buttonBar = new LinearLayout(this);

        Resources activityRes = this.getResources();

        cancelButton = new Button(this);
        cancelButton.setText("Ansicht schliessen");
        cancelButton.setGravity(Gravity.LEFT);
        cancelButton.setTextSize(16);
        cancelButton.setPadding(48,40,0,0);
        cancelButton.setBackgroundColor(Color.parseColor(bgColor));
        cancelButton.setTextColor(Color.parseColor(textColor));

        LinearLayout.LayoutParams cancelButtonLayoutParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT);
        cancelButtonLayoutParams.width = (int) (getScreenWidth(this)* 0.5);
        cancelButton.setLayoutParams(cancelButtonLayoutParams);

        cancelButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                v.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY);

                cancel();
            }
        });
        buttonBar.addView(cancelButton);

        deleteButton = new Button(this);
        deleteButton.setText("Löschen");
        //deleteButton.setTypeface(Typeface.SANS_SERIF);
        deleteButton.setGravity(Gravity.RIGHT);
        deleteButton.setTextSize(16);
        deleteButton.setPadding(0,40,48,0);
        deleteButton.setBackgroundColor(Color.parseColor(bgColor));
        deleteButton.setTextColor(Color.parseColor(textColor));

        LinearLayout.LayoutParams deleteButtonLayoutParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT);
        deleteButtonLayoutParams.width = (int) (getScreenWidth(this) * 0.5);
        deleteButton.setLayoutParams(deleteButtonLayoutParams);

        deleteButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                v.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY);

                deleteBelegStart();
            }
        });
        buttonBar.addView(deleteButton);

        return buttonBar;
    }

    public void cancel() {
        Log.e(TAG, "cancel");

        if(somethingChanged) {
            executeSave();

            /*
            String title = "Achtung";
            String msg = "Sie haben Änderungen vorgenommen. Möchten Sie diese übernehmen?";

            AlertDialog alertDialog = new AlertDialog.Builder(DetailViewActivity.this).create();
            alertDialog.setCancelable(false);
            alertDialog.setTitle(title);
            alertDialog.setMessage(msg);

            alertDialog.setButton(AlertDialog.BUTTON_POSITIVE, "Ja, übernehmen", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    Log.v(TAG, "YES");
                    executeSave();
                }
            });

            alertDialog.setButton(AlertDialog.BUTTON_NEGATIVE, "Nein, verwerfen", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    Log.v(TAG, "Nope");
                    executeCancel();
                }
            });

            alertDialog.show();
            */
        } else {
            executeCancel();
        }
    }

    private void executeCancel() {

        for(int i=0;i<deleteFilesOnCancel.size();i++) {
            String reason = deleteFilesOnCancel.get(i).first.toString();
            String file = deleteFilesOnCancel.get(i).second.toString();

            Log.e(TAG, "deleteFilesOnCancel i => " + i + " - reason => " + reason + " - file => " + file);

            String bFolder = folder.replace("file://", "");
            String deletePath = bFolder + "belege/" + file;
            Log.e(TAG, "deleteFilesOnCancel deletePath " + deletePath);
            File deleteFile = new File(deletePath);
            if (deleteFile.exists()) {
                boolean deleted = deleteFile.delete();
                Log.e(TAG, "deleteFilesOnCancel deleted" + deleted);
            } else {
                Log.e(TAG, "deleteFilesOnCancel deleted !! NOT EXISTS");
            }
        }

        Intent resultIntent = new Intent();
        resultIntent.putExtra("from", "detailview");
        resultIntent.putExtra("keep", "0");

        resultIntent.putExtra("code", "101");
        resultIntent.putExtra("result", "ABORTED");
        resultIntent.putExtra("data", "");
        setResult(Activity.RESULT_CANCELED, resultIntent);

        super.finish();
    }

    private void executeSave() {

        for(int i=0;i<deleteFilesOnSuccess.size();i++) {
            String reason = deleteFilesOnSuccess.get(i).first.toString();
            String file = deleteFilesOnSuccess.get(i).second.toString();

            Log.e(TAG, "deleteFilesOnSuccess i => " + i + " - reason => " + reason + " - file => " + file);

            String bFolder = folder.replace("file://", "");
            String deletePath = bFolder + "belege/" + file;
            Log.e(TAG, "deleteFilesOnSuccess deletePath " + deletePath);
            File deleteFile = new File(deletePath);
            if (deleteFile.exists()) {
                boolean deleted = deleteFile.delete();
                Log.e(TAG, "deleteFilesOnSuccess deleted" + deleted);
            } else {
                Log.e(TAG, "deleteFilesOnSuccess deleted !! NOT EXISTS");
            }
        }

        JSONObject returnObject = new JSONObject();

        try {
            returnObject.put("used_method", method);
            returnObject.put("somethingChanged", somethingChanged);

            returnObject.put("mainImage", imageViewImages.get(0));

            // ek data
            JSONObject ekData = new JSONObject();
            //ekData.put("comment", belegData_einkommensteuer_comment);
            ekData.put("ek_year", belegData_einkommensteuer_ek_year);
            returnObject.put("ek", ekData);

            // common data
            JSONObject commonData = new JSONObject();
            commonData.put("comment", belegData_common_comment);
            commonData.put("category_id", belegData_common_category_id);
            returnObject.put("common", commonData);

            // datev data
            JSONObject datevData = new JSONObject();
            datevData.put("comment", belegData_datev_comment);
            datevData.put("client_id", belegData_datev_client_id);
            datevData.put("document_type", belegData_datev_document_type);
            returnObject.put("datev", datevData);

            // datev my tax data
            JSONObject datevmytaxData = new JSONObject();
            datevmytaxData.put("comment", belegData_datevmytax_comment);
            datevmytaxData.put("client_id", belegData_datevmytax_client_id);
            datevmytaxData.put("category_id", belegData_datevmytax_category_id);
            datevmytaxData.put("subcategory_id", belegData_datevmytax_subcategory_id);
            datevmytaxData.put("year", belegData_datevmytax_year);
            returnObject.put("mytax", datevmytaxData);

            // belegzentrale data
            JSONObject belegzentraleData = new JSONObject();
            belegzentraleData.put("comment", belegData_belegzentrale_comment);
            belegzentraleData.put("category_id", belegData_belegzentrale_category_id);
            returnObject.put("belegzentrale", belegzentraleData);

            // kalkuel data
            JSONObject kalkuelData = new JSONObject();
            //kalkuelData.put("comment", belegData_kalkuel_comment);
            kalkuelData.put("category_id", belegData_kalkuel_category_id);
            returnObject.put("kalkuel", kalkuelData);

            // addisonoc data
            JSONObject addisonocData = new JSONObject();
            addisonocData.put("comment", belegData_addison_comment);
            addisonocData.put("category_id", belegData_addison_category_id);
            returnObject.put("addisonoc", addisonocData);

            JSONArray belegChildren = new JSONArray();
            try {
                for(int i=1;i<imageViewImages.size();i++) {
                    JSONObject img = new JSONObject();

                    //img.put("filename", imageViewImages.get(i));

                    Date date = new Date();
                    DateFormat formattedDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
                    String formattedDateString = formattedDate.format(date);

                    JSONArray children = new JSONArray();
                    JSONObject metadata = new JSONObject();

                    metadata.put("modificationTime", formattedDateString);
                    metadata.put("size", 0);

                    img.put("beleg_hash", UUID.randomUUID().toString());
                    img.put("selected", false);
                    img.put("filename", imageViewImages.get(i));
                    img.put("previewFromPDF", "");
                    img.put("originalFilename", imageViewImages.get(i));
                    img.put("source", "camera");
                    img.put("date", formattedDateString);
                    img.put("comment", "");
                    img.put("metadata", metadata);
                    img.put("originalPath", "");
                    img.put("children", children);

                    belegChildren.put(img);
                }
            } catch(JSONException e3) {
                Log.v(TAG, "belegChildren -> " + e3.getLocalizedMessage());
            }
            returnObject.put("children", belegChildren);

        } catch(JSONException e) {
            Log.v(TAG, "common ALL -> " + e.getLocalizedMessage());
        }

        Intent resultIntent = new Intent();
        resultIntent.putExtra("from", "detailview");
        resultIntent.putExtra("keep", "1");

        resultIntent.putExtra("code", 310);
        resultIntent.putExtra("result", "UPDATE_COMPLETE");
        resultIntent.putExtra("data", returnObject.toString());
        setResult(Activity.RESULT_OK, resultIntent);
        finish();
    }

    public void deleteBelegStart() {
        Log.e(TAG, "deleteBelegStart");

        String title = "Beleg löschen?";
        String msg = "Möchten Sie diesen Beleg jetzt löschen? Der Vorgang kann nicht rückgängig gemacht werden!";

        Boolean removeSinglePageActive = false;

        if(imageViewImages.size() > 1) {
            if(imageViewImageIndex > 0) {
                title = "Beleg oder Beleg-Seite löschen?";
                msg = "Möchten Sie diesen Beleg oder die aktuelle Beleg-Seite jetzt löschen?";

                removeSinglePageActive = true;
            }
        }

        AlertDialog alertDialog = new AlertDialog.Builder(DetailViewActivity.this).create();
        alertDialog.setCancelable(false);
        alertDialog.setTitle(title);
        alertDialog.setMessage(msg);

        if(removeSinglePageActive) {
            alertDialog.setButton(AlertDialog.BUTTON_NEGATIVE, "Ja, die aktuelle Beleg-Seite löschen", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    Log.v(TAG, "YES PAGE");

                    deleteFilesOnSuccess.add(new Pair("removed photo",imageViewImages.get(imageViewImageIndex)));

                    imageViewImages.remove(imageViewImageIndex);
                    imageViewImageIndex = (imageViewImageIndex - 1);

                    setImageToView();
                    setPageTextInfo();

                    somethingChanged = true;
                    cancelButton.setText("Speichern");
                }
            });
        }

        String okText = "Ja, löschen";
        if(removeSinglePageActive) {
            okText = "Ja, den kompletten Beleg löschen";
        }
        alertDialog.setButton(AlertDialog.BUTTON_POSITIVE, okText, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Log.v(TAG, "YES");

                Intent resultIntent = new Intent();
                resultIntent.putExtra("from", "delete");
                resultIntent.putExtra("keep", "1");

                resultIntent.putExtra("code", "301");
                resultIntent.putExtra("result", "DELETE");
                resultIntent.putExtra("data", belegData_beleg_hash);
                setResult(Activity.RESULT_OK, resultIntent);
                finish();
            }
        });

        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "Abbrechen", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Log.v(TAG, "Nope");
                alertDialog.dismiss();
            }
        });

        alertDialog.show();
    }

    public void editCommentStart(String comment, String forSection) {
        Log.e(TAG, "editCommentStart");
        Log.e(TAG, "editCommentStart comment " + comment);
        Log.e(TAG, "editCommentStart forSection " + forSection);

        Log.e(TAG, "editCommentStart activeTableViewCellIndex " + activeTableViewCellIndex);

        DetailViewActivity.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.e(TAG, "run()");

                /*Intent commentEditIntent = new Intent(DetailViewActivity.this, CommentEditActivity.class);

                commentEditIntent.putExtra("inputLabel", "Kommentar");
                commentEditIntent.putExtra("existingText", comment);
                commentEditIntent.putExtra("folder", folder);
                commentEditIntent.putExtra("belegPreview", imageViewImages.get(imageViewImageIndex));
                commentEditIntent.putExtra("bgColor", bgColor);
                commentEditIntent.putExtra("textColor", textColor);

                commentEditIntent.putExtra("returnToDetailview", "1");
                commentEditIntent.putExtra("forSection", forSection);

                DetailViewActivity.this.startActivityForResult(commentEditIntent, 900);*/
            }
        });
    }

    public void editCategoryStart(String forSection) {
        Log.e(TAG, "editCategoryStart");
        Log.e(TAG, "editCategoryStart forSection " + forSection);
        Log.e(TAG, "editCategoryStart activeTableViewCellIndex " + activeTableViewCellIndex);

        DetailViewActivity.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.e(TAG, "run()");
                /*Intent editCategoryActivityIntent = new Intent(DetailViewActivity.this, CategoryEditActivity.class);

                editCategoryActivityIntent.putExtra("type", forSection);

                if(forSection.contains("standard")) {
                    Log.e(TAG, "method standard");
                    editCategoryActivityIntent.putExtra("categories", belegData_common_categories);
                    editCategoryActivityIntent.putExtra("current", belegData_common_category_id);
                    editCategoryActivityIntent.putExtra("info", "");
                } else if(forSection.contains("datev-clientid")) {
                    Log.e(TAG, "method datev-clientids");
                    editCategoryActivityIntent.putExtra("categories", belegData_datev_clients);
                    editCategoryActivityIntent.putExtra("current", belegData_datev_client_id);
                    editCategoryActivityIntent.putExtra("info", "");
                } else if(forSection.contains("datevmytax-clientid")) {
                    Log.e(TAG, "method datevmytax-clientids");
                    editCategoryActivityIntent.putExtra("categories", belegData_datevmytax_clients);
                    editCategoryActivityIntent.putExtra("current", belegData_datevmytax_client_id);
                    editCategoryActivityIntent.putExtra("info", "");
                } else if(forSection.contains("datevmytax-category")) {
                    Log.e(TAG, "method datev-category");
                    editCategoryActivityIntent.putExtra("categories", belegData_datevmytax_categories);
                    editCategoryActivityIntent.putExtra("current", belegData_datevmytax_category_id + "-" + belegData_datevmytax_subcategory_id);
                    editCategoryActivityIntent.putExtra("info", belegData_datevmytax_client_id);
                } else if(forSection.contains("datev-category")) {
                    Log.e(TAG, "method datev-category");
                    editCategoryActivityIntent.putExtra("categories", belegData_datev_categories);
                    editCategoryActivityIntent.putExtra("current", belegData_datev_document_type);
                    editCategoryActivityIntent.putExtra("info", belegData_datev_client_id);
                } else if(forSection.contains("bzupload")) {
                    Log.e(TAG, "method bzupload");
                    editCategoryActivityIntent.putExtra("categories", belegData_belegzentrale_categories);
                    editCategoryActivityIntent.putExtra("current", belegData_belegzentrale_category_id);
                    editCategoryActivityIntent.putExtra("info", "");
                } else if(forSection.contains("kalkuel")) {
                    Log.e(TAG, "method kalkuel");
                    editCategoryActivityIntent.putExtra("categories", belegData_kalkuel_categories);
                    editCategoryActivityIntent.putExtra("current", belegData_kalkuel_category_id);
                    editCategoryActivityIntent.putExtra("info", "");
                } else if(forSection.contains("addisonoc")) {
                    Log.e(TAG, "method addisonoc");
                    editCategoryActivityIntent.putExtra("categories", belegData_addison_categories);
                    editCategoryActivityIntent.putExtra("current", belegData_addison_category_id);
                    editCategoryActivityIntent.putExtra("info", "");
                }

                editCategoryActivityIntent.putExtra("folder", folder);
                editCategoryActivityIntent.putExtra("belegPreview", imageViewImages.get(imageViewImageIndex));
                editCategoryActivityIntent.putExtra("bgColor", bgColor);
                editCategoryActivityIntent.putExtra("textColor", textColor);

                editCategoryActivityIntent.putExtra("returnToDetailview", "1");
                editCategoryActivityIntent.putExtra("forSection", forSection);

                DetailViewActivity.this.startActivityForResult(editCategoryActivityIntent, 900);*/
            }
        });
    }

    public void editEKYearStart(String year) {
        Log.e(TAG, "editEKYearStart");
        Log.e(TAG, "editEKYearStart year " + year);
        Log.e(TAG, "editEKYearStart activeTableViewCellIndex " + activeTableViewCellIndex);

        final Calendar cldr = Calendar.getInstance();

        int currentYear = cldr.get(Calendar.YEAR);
        int prelastYear = (currentYear - 2);
        int lastYear = (currentYear - 1);
        //int nextYear = (currentYear + 1);

        String prelastYearString = ""+prelastYear;
        String lastYearString = ""+lastYear;
        String currentYearString = ""+currentYear;
        //String nextYearString = ""+nextYear;

        // setup the alert builder
        AlertDialog.Builder builder = new AlertDialog.Builder(DetailViewActivity.this);
        builder.setTitle("Veranlagungsjahr");

        //String[] yearList = {prelastYearString, lastYearString, currentYearString, nextYearString};
        String[] yearList = {prelastYearString, lastYearString, currentYearString};
        int checkedItem = -1;

        if (year.contains(prelastYearString)) {
            checkedItem = 0;
        } else if (year.contains(lastYearString)) {
            checkedItem = 1;
        } else if (year.contains(currentYearString)) {
            checkedItem = 2;
            //} else if (year.contains(nextYearString)) {
            //    checkedItem = 3;
        }

        builder.setSingleChoiceItems(yearList, checkedItem, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                // user checked an item
                Log.e(TAG, "item CHECKED -> " + which);

                belegData_einkommensteuer_ek_year = yearList[which];

                Toast.makeText(DetailViewActivity.this, "Das Veranlagungsjahr wurde übernommen", Toast.LENGTH_LONG).show();
                collectAndShowList();

                somethingChanged = true;
                cancelButton.setText("Übernehmen");
                cancelButton.setTypeface(null, Typeface.BOLD);

                dialog.dismiss();
            }
        });

        /*
        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                // user clicked OK
                Log.e(TAG, "OK CHECKED -> " + which);
            }
        });
        */
        builder.setNegativeButton("Abbrechen", null);

        AlertDialog dialog = builder.create();
        dialog.show();
    }

    public void editEKYearDatevStart(String year) {
        Log.e(TAG, "editEKYearDatevStart");
        Log.e(TAG, "editEKYearDatevStart year " + year);
        Log.e(TAG, "editEKYearDatevStart activeTableViewCellIndex " + activeTableViewCellIndex);

        final Calendar cldr = Calendar.getInstance();

        int currentYear = cldr.get(Calendar.YEAR);
        int prelastYear = (currentYear - 2);
        int lastYear = (currentYear - 1);
        //int nextYear = (currentYear + 1);

        String prelastYearString = ""+prelastYear;
        String lastYearString = ""+lastYear;
        String currentYearString = ""+currentYear;
        //String nextYearString = ""+nextYear;

        // setup the alert builder
        AlertDialog.Builder builder = new AlertDialog.Builder(DetailViewActivity.this);
        builder.setTitle("Jahr");

        //String[] yearList = {prelastYearString, lastYearString, currentYearString, nextYearString};
        String[] yearList = {prelastYearString, lastYearString, currentYearString};
        int checkedItem = -1;

        if (year.contains(prelastYearString)) {
            checkedItem = 0;
        } else if (year.contains(lastYearString)) {
            checkedItem = 1;
        } else if (year.contains(currentYearString)) {
            checkedItem = 2;
            //} else if (year.contains(nextYearString)) {
            //    checkedItem = 3;
        }

        builder.setSingleChoiceItems(yearList, checkedItem, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                // user checked an item
                Log.e(TAG, "item CHECKED -> " + which);

                belegData_datevmytax_year = yearList[which];

                Toast.makeText(DetailViewActivity.this, "Das Jahr wurde übernommen", Toast.LENGTH_LONG).show();
                collectAndShowList();

                somethingChanged = true;
                cancelButton.setText("Übernehmen");
                cancelButton.setTypeface(null, Typeface.BOLD);

                dialog.dismiss();
            }
        });

        builder.setNegativeButton("Abbrechen", null);

        AlertDialog dialog = builder.create();
        dialog.show();
    }

    public void addPhotoStart() {
        Log.e(TAG, "addPhotoStart");
        DetailViewActivity.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.e(TAG, "run()");
                /*Intent docScannerActivityIntent = new Intent(DetailViewActivity.this, DocScannerActivity.class);

                docScannerActivityIntent.putExtra("folder", folder + "belege/");
                docScannerActivityIntent.putExtra("jpegQuality", jpegQuality);
                //docScannerActivityIntent.putExtra("as_children", "1");
                docScannerActivityIntent.putExtra("bgColor", bgColor);
                docScannerActivityIntent.putExtra("textColor", textColor);

                docScannerActivityIntent.putExtra("returnToDetailview", "1");

                DetailViewActivity.this.startActivityForResult(docScannerActivityIntent, 900);*/
            }
        });
    }

    public void ekMoveStart() {
        Log.e(TAG, "ekMoveStart");

        Intent resultIntent = new Intent();
        resultIntent.putExtra("from", "bewirtung");
        resultIntent.putExtra("keep", "1");

        if(method.contains("einkommenssteuer")) { // to standard
            resultIntent.putExtra("code", 306);
            resultIntent.putExtra("result", "MOVE_TO_STANDARD");
        } else { // to ek
            resultIntent.putExtra("code", 307);
            resultIntent.putExtra("result", "MOVE_TO_EK");
        }

        resultIntent.putExtra("data", "");
        setResult(Activity.RESULT_OK, resultIntent);
        finish();
    }

    public void editBewirtung() {
        Log.e(TAG, "editBewirtung");
        Intent resultIntent = new Intent();
        resultIntent.putExtra("from", "bewirtung");
        resultIntent.putExtra("keep", "1");

        resultIntent.putExtra("code", 309);
        resultIntent.putExtra("result", "BEWIRTUNG_EDIT");
        resultIntent.putExtra("data", "");
        setResult(Activity.RESULT_OK, resultIntent);
        finish();
    }

    public void imageEditStart() {
        Log.e(TAG, "imageEditStart");
        DetailViewActivity.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.e(TAG, "run()");
                Intent imageEditActivityIntent = new Intent(DetailViewActivity.this, ImageEditActivity.class);

                imageEditActivityIntent.putExtra("file", imageViewImages.get(imageViewImageIndex));
                imageEditActivityIntent.putExtra("imageViewImageIndex", imageViewImageIndex);
                imageEditActivityIntent.putExtra("folder", folder + "belege/");
                imageEditActivityIntent.putExtra("jpegQuality", jpegQuality);
                imageEditActivityIntent.putExtra("bgColor", bgColor);
                imageEditActivityIntent.putExtra("textColor", textColor);

                imageEditActivityIntent.putExtra("returnToDetailview", "1");

                DetailViewActivity.this.startActivityForResult(imageEditActivityIntent, 900);
            }
        });
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, final Intent intent) {
        Log.e(TAG, "onActivityResult");
        Log.e(TAG, "requestCode " + requestCode);
        Log.e(TAG, "resultCode " + resultCode);
        Log.e(TAG, "Activity.RESULT_OK " + Activity.RESULT_OK);
        Log.e(TAG, "Activity.RESULT_CANCELED " + Activity.RESULT_CANCELED);

        if(requestCode == 900 && intent != null) {
            Log.e(TAG, "super.onActivityResult");

            //String rCode = intent.getStringExtra("resultCode");
            //String resultString = intent.getStringExtra("resultString");
            //String resultData = intent.getStringExtra("resultData");
            //String keep = intent.getStringExtra("keep");

            String rCode = "-1";
            if(intent.hasExtra("resultCode")) {
                rCode = intent.getStringExtra("resultCode");
            }

            String resultString = "";
            if(intent.hasExtra("resultString")) {
                resultString = intent.getStringExtra("resultString");
            }

            String resultData = "";
            if(intent.hasExtra("resultData")) {
                resultData = intent.getStringExtra("resultData");
            }

            String keep = "0";
            if(intent.hasExtra("keep")) {
                keep = intent.getStringExtra("keep");
            }

            Log.e(TAG, "rCode " + rCode);
            Log.e(TAG, "resultString " + resultString);
            Log.e(TAG, "resultData " + resultData);
            Log.e(TAG, "keep " + keep);

            if(rCode.contains("304")) { // ADD_PHOTO
                Log.e(TAG, "ADD_PHOTO " + rCode);

                deleteFilesOnCancel.add(new Pair("added photo",resultData));

                imageViewImages.add(resultData);

                imageViewImageIndex = (imageViewImages.size() -1);

                setImageToView();
                setPageTextInfo();

                Toast.makeText(DetailViewActivity.this, "Die Beleg-Seite wurde übernommen", Toast.LENGTH_LONG).show();

                somethingChanged = true;
                cancelButton.setText("Übernehmen");
                cancelButton.setTypeface(null, Typeface.BOLD);
            } else if(rCode.contains("601")) { // CATEGORY_UPDATE
                Log.e(TAG, "CATEGORY_UPDATE " + rCode);

                String resultSection = intent.getStringExtra("resultSection");
                String resultId = intent.getStringExtra("resultId");
                String resultName = intent.getStringExtra("resultName");

                Log.e(TAG, "CATEGORY_UPDATE resultSection " + resultSection);
                Log.e(TAG, "CATEGORY_UPDATE resultId " + resultId);
                Log.e(TAG, "CATEGORY_UPDATE resultName " + resultName);

                if(resultSection.contains("standard")) {
                    belegData_common_category_id = (!resultId.isEmpty() ? resultId : "");
                    belegData_common_category_name = (!resultId.isEmpty() ? resultName : "---");
                    //adapter.getItem(activeTableViewCellIndex).label = resultName;
                } else if(resultSection.contains("datev-clientid")) {
                    belegData_datev_client_id = (!resultId.isEmpty() ? resultId : "");
                    belegData_datev_client_name = (!resultId.isEmpty() ? resultName : "---");
                } else if(resultSection.contains("datevmytax-clientid")) {
                    belegData_datevmytax_client_id = (!resultId.isEmpty() ? resultId : "");
                    belegData_datevmytax_client_name = (!resultName.isEmpty() ? resultName : "---");
                } else if(resultSection.contains("datev-category")) {
                    belegData_datev_document_type = (!resultId.isEmpty() ? resultId : "");
                } else if(resultSection.contains("datevmytax-category")) {
                    //String HACKFUCKSTR = resultId.replace("-", "");
                    //belegData_datevmytax_category_id = HACKFUCKSTR;
                    //belegData_datevmytax_subcategory_id = "";

                    if (resultId.contains("-")) {
                        String[] parts = resultId.split("-");
                        Log.e(TAG, "partspartsparts parts" + parts.toString());

                        if(parts.length > 0) {
                            if(!parts[0].isEmpty()) {
                                belegData_datevmytax_category_id = parts[0];
                            } else {
                                belegData_datevmytax_category_id = "";
                            }
                        } else {
                            belegData_datevmytax_category_id = "";
                        }

                        if(parts.length > 1) {
                            if(!parts[1].isEmpty()) {
                                belegData_datevmytax_subcategory_id = parts[1];
                            } else {
                                belegData_datevmytax_subcategory_id = "";
                            }
                        } else {
                            belegData_datevmytax_subcategory_id = "";
                        }
                    } else {
                        belegData_datevmytax_category_id = "";
                        belegData_datevmytax_subcategory_id = "";
                    }
                } else if(resultSection.contains("bzupload")) {
                    belegData_belegzentrale_category_id = (!resultId.isEmpty() ? resultId : "");
                    belegData_belegzentrale_category_name = (!resultId.isEmpty() ? resultName : "---");
                } else if(resultSection.contains("kalkuel")) {
                    belegData_kalkuel_category_id = (!resultId.isEmpty() ? resultId : "");
                    belegData_kalkuel_category_name = (!resultId.isEmpty() ? resultName : "---");
                } else if(resultSection.contains("addisonoc")) {
                    belegData_addison_category_id = (!resultId.isEmpty() ? resultId : "");
                    belegData_addison_category_name = (!resultId.isEmpty() ? resultName : "---");
                }

                Toast.makeText(DetailViewActivity.this, "Die Kategorie wurde geändert", Toast.LENGTH_LONG).show();
                collectAndShowList();

                somethingChanged = true;
                cancelButton.setText("Übernehmen");
                cancelButton.setTypeface(null, Typeface.BOLD);
            } else if(rCode.contains("602")) { // COMMENT_UPDATE
                Log.e(TAG, "COMMENT_UPDATE " + rCode);

                String resultSection = intent.getStringExtra("resultSection");
                Log.e(TAG, "CATEGORY_UPDATE resultSection " + resultSection);

                if(resultSection.contains("standard")) {
                    belegData_common_comment = resultData.trim();
                } else if(resultSection.contains("datev")) {
                    belegData_datev_comment = resultData.trim();
                } else if(resultSection.contains("bzupload")) {
                    belegData_belegzentrale_comment = resultData.trim();
                } else if(resultSection.contains("addisonoc")) {
                    belegData_addison_comment = resultData.trim();
                }

                Toast.makeText(DetailViewActivity.this, "Der Kommentar wurde geändert", Toast.LENGTH_LONG).show();
                collectAndShowList();

                somethingChanged = true;
                cancelButton.setText("Übernehmen");
                cancelButton.setTypeface(null, Typeface.BOLD);
            } else if(rCode.contains("603")) { // IMG_UPDATE
                Log.e(TAG, "IMG_UPDATE " + rCode);

                int imageViewImageIndexUse = intent.getIntExtra("imageindex", -1);

                Log.e(TAG, "resultData " + resultData);
                Log.e(TAG, "imageViewImageIndexUse " + imageViewImageIndexUse);

                String finalFilename = "";
                try {
                    URI uri = new URI(resultData);
                    String path = uri.getPath();
                    finalFilename = path.substring(path.lastIndexOf('/') + 1);
                } catch (URISyntaxException e) {
                    e.printStackTrace();
                }

                Log.e(TAG, "finalFilename " + finalFilename);

                if(!finalFilename.isEmpty()) {

                    deleteFilesOnSuccess.add(new Pair("edited photo",imageViewImages.get(imageViewImageIndexUse)));
                    deleteFilesOnCancel.add(new Pair("edited photo",finalFilename));

                    imageViewImages.set(imageViewImageIndexUse, finalFilename);

                    setImageToView();

                    Toast.makeText(DetailViewActivity.this, "Die bearbeitete Beleg-Seite wurde übernommen", Toast.LENGTH_LONG).show();
                    somethingChanged = true;
                    cancelButton.setText("Übernehmen");
                    cancelButton.setTypeface(null, Typeface.BOLD);
                }
            }
        }
    }

    @Override
    public void onBackPressed() {
        cancel();
    }

    public String getMyTaxCategoryName(String category_id, String sub_category_id, Boolean isSub) {
        Log.v(TAG, category_id);
        Log.v(TAG, sub_category_id);
        Log.v(TAG, ""+isSub);

        String returner = "";
        try {
            JSONObject ttmp = new JSONObject(belegData_datevmytax_categories);
            JSONArray cats = ttmp.getJSONArray("categories");
            Log.v(TAG, cats.toString(1));

            if(cats.length() > 0) {
                for(int i=0;i<cats.length();i++) {
                    JSONObject tmp = cats.getJSONObject(i);
                    String metadata_key = tmp.getString("metadata_key");
                    Log.v(TAG, "metadata_key -> " + metadata_key);

                    if(metadata_key.equals(category_id)) {
                        String name = tmp.getString("name");
                        returner = name;

                        if(isSub) {
                            JSONArray subcats = tmp.getJSONArray("sub_categories");
                            if(subcats.length() > 0) {
                                for(int i2=0;i2<subcats.length();i2++) {
                                    JSONObject tmp2 = subcats.getJSONObject(i2);
                                    String id = tmp2.getString("id");
                                    Log.v(TAG, "id -> " + id);
                                    if(id.equals(sub_category_id)) {
                                        String name2 = tmp.getString("name");
                                        returner = name + " - " + name2;
                                    }
                                }
                            }
                        }
                    }

                    /*
                    JSONArray children = tmp.getJSONArray("children");
                    for(int i2=0;i2<children.length();i2++) {
                        JSONObject tmp2 = children.getJSONObject(i2);

                        String id = tmp2.getString("id");
                        Log.v(TAG, "id -> " + id);

                        String group_name = tmp2.getString("group_name");
                        Log.v(TAG, "group_name -> " + group_name);

                        String name = tmp2.getString("name");
                        Log.v(TAG, "name -> " + name);

                        adapter.add(new CategoryEditActivity.ListItem(id, id, parentName, name, ""));
                    }
                    */
                }
            }

        } catch(JSONException e) {
            Log.v(TAG, e.getLocalizedMessage());

            returner = "xxx" + category_id;
        }

        return returner;
    }

    public String getSourceName(String source) {
        Log.v(TAG, source);

        if (source.contains("camera"))  { return "Foto"; }
        else if (source.contains("bewirtung")) { return "Bewirtungsquittung"; }
        else if (source.contains("pdf")) { return "PDF Smartphone / Import"; }
        else if (source.contains("folder")) { return "Smartphone Foto"; }
        else { return source; }
    }

    public String getMethodName(String method) {
        Log.v(TAG,method);
        if (method.contains("standard"))  { return "Standard"; }
        else if (method.equals("datev_mytax")) { return "DATEV Meine Steuern"; }
        else if (method.contains("datev")) { return "DATEVconnect online"; }
        else if (method.contains("einkommenssteuer")) { return "Einkommensteuer"; }
        else if (method.contains("bzupload")) { return "Belegzentrale"; }
        else if (method.contains( "kalkuel")) { return "Kalkül"; }
        else if (method.contains( "addison_oc")) { return "Addison OneClick"; }
        else if (method.contains("plusadvise")) { return "Plus Advise WebAkte"; }
        else { return method; }
    }

    public static String humanReadableByteCountSI(long bytes) {
        if (-1000 < bytes && bytes < 1000) {
            return bytes + " B";
        }
        CharacterIterator ci = new StringCharacterIterator("kMGTPE");
        while (bytes <= -999_950 || bytes >= 999_950) {
            bytes /= 1000;
            ci.next();
        }
        return String.format("%.1f %cB", bytes / 1000.0, ci.current());
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
