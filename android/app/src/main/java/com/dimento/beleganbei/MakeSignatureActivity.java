package com.dimento.beleganbei;

import android.graphics.Typeface;
import android.util.Log;

import android.app.Activity;
import android.os.Bundle;
import android.os.Build;

import android.content.Context;
import android.content.Intent;

import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.ImageView;

import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.FrameLayout;

import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import android.content.res.Resources;

import java.util.concurrent.atomic.AtomicInteger;
import android.util.DisplayMetrics;

import android.graphics.Color;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.view.MotionEvent;
import java.util.ArrayList;
import android.graphics.Bitmap;
import java.io.ByteArrayOutputStream;
import	android.util.Base64;
import android.os.AsyncTask;
import android.widget.Spinner;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import java.util.Arrays;

public class MakeSignatureActivity extends Activity {

    public String TAG = "MakeSignatureActivity";

    //private ImageView cancelButton;
    //private ImageView clearButton;
    //private ImageView saveButton;

    //private String mBackgroundColor = "#FFFFFF";
    //private String mBackgroundImageUrl = "";


    private Button cancelBarButton;

    private Button saveBarButton;

    private Button clearBarButton;

    private ImageView signLine;

    private Boolean trim = true;
    private Integer stroke = 5;

    private ProgressBar progressBar;

    private Paint mPaint;
    private int mStrokeWidth = 4;
    final private int mScale = 75;
    private Bitmap mBitmap;
    private DrawView mTdView;

    final private Bitmap.CompressFormat mEncodingType = Bitmap.CompressFormat.PNG;

    private static final String[] STROKE_WIDTH_LABELS = {"schmal", "normal", "breit", "fett"};
    private static final Integer[] STROKE_WIDTH_VALUES = {4,8,12,16};
    private int a, r, g, b; //Decoded ARGB color values for the background and erasing

    private String bgColor;
    private String textColor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Bundle intentExtras = getIntent().getExtras();

        if (intentExtras != null) {
            Log.v(TAG, "intentExtras " + intentExtras);

            trim = intentExtras.getBoolean("trimImage", trim);
            Log.v(TAG, "trim " + trim);

            stroke = intentExtras.getInt("strokeWidth", stroke);
            Log.v(TAG, "stroke " + stroke);
            mStrokeWidth = stroke;

            bgColor = intentExtras.getString("bgColor");
            Log.v(TAG, "bgColor " + bgColor);

            textColor = intentExtras.getString("textColor");
            Log.v(TAG, "textColor " + textColor);
        } else {
            Log.v(TAG, "intentExtras NULL NULL NULL");
        }

        StatusBarHelper sbc = new StatusBarHelper();
        sbc.setColor(this, bgColor);
        sbc.setFullScreen(this);

        RelativeLayout tDLayout = new RelativeLayout(this);
        tDLayout.setHapticFeedbackEnabled(true);
        tDLayout.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT));
        tDLayout.setBackgroundColor(Color.WHITE);

        FrameLayout tDContainer = new FrameLayout(this);
        RelativeLayout.LayoutParams tDViewLayoutParams = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
        tDViewLayoutParams.width = getScreenWidth(this);
        tDViewLayoutParams.height = getScreenHeight(this);
        tDContainer.setLayoutParams(tDViewLayoutParams);
        mTdView = new DrawView(this);
        tDContainer.addView(mTdView);
        tDLayout.addView(tDContainer);

        // NEW
        LinearLayout toolBar = createToolBar();
        toolBar.setId(getNextViewId());
        RelativeLayout.LayoutParams toolBarLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        toolBarLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        toolBar.setBackgroundColor(Color.WHITE);
        toolBar.setLayoutParams(toolBarLayoutParams);
        tDLayout.addView(toolBar);
        // NEW

        Integer buttonWidth = 180;
        Integer marginPixel23rd = 80;

        /* line */
        signLine = new ImageView(this);
        signLine.setBackgroundColor(Color.GRAY);

        Integer signLineMarginLeft = 160;
        Integer signLineWidth = (getScreenWidth(this) - (signLineMarginLeft * 2));
        Integer signLineHeight = 6;

        FrameLayout.LayoutParams signLineLayoutParams = new FrameLayout.LayoutParams(signLineWidth, signLineHeight);
        signLineLayoutParams.leftMargin = signLineMarginLeft;
        signLineLayoutParams.topMargin  = (getScreenHeight(this) - (buttonWidth + marginPixel23rd) - (signLineHeight * 10));

        tDLayout.addView(signLine, signLineLayoutParams);
        /* line */

        /* Spinner */
        progressBar = new ProgressBar(MakeSignatureActivity.this,null,android.R.attr.progressBarStyleLarge);
        progressBar.setIndeterminate(true);
        progressBar.setVisibility(View.GONE);
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(320,320);
        params.addRule(RelativeLayout.CENTER_IN_PARENT, progressBar.getId());
        tDLayout.addView(progressBar, params);
        /* Spinner */

        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(tDLayout);

        mPaint = new Paint();
        mPaint.setAntiAlias(true);
        mPaint.setDither(true);
        mPaint.setColor(Color.BLACK);
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setStrokeJoin(Paint.Join.ROUND);
        mPaint.setStrokeCap(Paint.Cap.ROUND);
        mPaint.setStrokeWidth(mStrokeWidth);

        // round button
        // https://stackoverflow.com/questions/18391830/how-to-programmatically-round-corners-and-set-random-background-colors
    }

    public Spinner createWidthSpinner() {
        final String strokeWidthLabelPrefix = "Stärke";
        Spinner spinner = new Spinner(this);

        Resources activityRes = this.getResources();

        final ArrayAdapter<CharSequence> adapter = new ArrayAdapter<CharSequence>(this, android.R.layout.simple_spinner_dropdown_item, STROKE_WIDTH_LABELS) {
            @Override
            public View getView(int position, View convertView, ViewGroup parent) {
                TextView v = (TextView) super.getView(position, convertView, parent);

                v.setBackgroundColor(Color.WHITE);
                v.setTypeface(null, Typeface.BOLD);
                v.setTextSize(20);
                v.setTextColor(Color.BLACK);
                v.setText(strokeWidthLabelPrefix + mStrokeWidth);
                v.setCompoundDrawablesWithIntrinsicBounds( null, activityRes.getDrawable(activityRes.getIdentifier("signature_clear", "drawable", MakeSignatureActivity.this.getApplicationContext().getPackageName()), MakeSignatureActivity.this.getApplicationContext().getTheme()), null, null);
                return v;
            }

            @Override
            public View getDropDownView(int position, View convertView, ViewGroup parent) {
                TextView v = (TextView) super.getDropDownView(position, convertView,parent);

                v.setTypeface(Typeface.SANS_SERIF);
                v.setText(STROKE_WIDTH_LABELS[position]);
                return v;
            }
        };
        spinner.setAdapter(adapter);

        spinner.setOnItemSelectedListener(new Spinner.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int position, long id) {
                mStrokeWidth = STROKE_WIDTH_VALUES[position];

                ((TextView) view).setBackgroundColor(Color.WHITE);
                ((TextView) view).setTextColor(Color.BLACK);
                ((TextView) view).setTypeface(Typeface.SANS_SERIF);
                //((TextView) view).setText(strokeWidthLabelPrefix + STROKE_WIDTH_LABELS[Arrays.asList(STROKE_WIDTH_VALUES).indexOf(mStrokeWidth)]);
                String concatText = strokeWidthLabelPrefix + mStrokeWidth;
                ((TextView) view).setText(concatText);
                //((TextView) view).setText(strokeWidthLabelPrefix);

                if (mPaint != null) {
                    mPaint.setStrokeWidth(mStrokeWidth);
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
            }
        });
        spinner.setBackgroundColor(Color.WHITE);
        spinner.setTextAlignment(View.TEXT_ALIGNMENT_CENTER);

        spinner.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, (float) 0.25));

        spinner.setSelection(Arrays.asList(STROKE_WIDTH_LABELS).indexOf("normal"));

        return spinner;
    }

    public LinearLayout createToolBar() {
        LinearLayout toolBar = new LinearLayout(this);

        Resources activityRes = this.getResources();

        /* CANCEL Button */
        cancelBarButton = new Button(this);
        cancelBarButton.setText("Abbrechen");
        cancelBarButton.setBackgroundColor(Color.WHITE);
        cancelBarButton.setTypeface(null, Typeface.BOLD);
        cancelBarButton.setTextSize(16);
        cancelBarButton.setCompoundDrawablesWithIntrinsicBounds( null, activityRes.getDrawable(activityRes.getIdentifier("signature_cancel", "drawable", this.getApplicationContext().getPackageName()), this.getApplicationContext().getTheme()), null, null);
        cancelBarButton.setTextColor(Color.RED);
        cancelBarButton.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, (float) 0.3));
        cancelBarButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Log.e(TAG, "cancelBarButton");
                cancel();
            }
        });
        toolBar.addView(cancelBarButton);

        /* CLEAR Button */
        clearBarButton = new Button(this);
        clearBarButton.setText("Zurücksetzen");
        clearBarButton.setBackgroundColor(Color.WHITE);
        clearBarButton.setTypeface(null, Typeface.BOLD);
        clearBarButton.setTextSize(16);
        clearBarButton.setCompoundDrawablesWithIntrinsicBounds( null, activityRes.getDrawable(activityRes.getIdentifier("signature_clear", "drawable", this.getApplicationContext().getPackageName()), this.getApplicationContext().getTheme()), null, null);
        clearBarButton.setTextColor(Color.BLACK);
        clearBarButton.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, (float) 0.3));
        clearBarButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Log.e(TAG, "clearBarButton");
                clear();
            }
        });
        clearBarButton.setVisibility(View.GONE);
        toolBar.addView(clearBarButton);

        /* SAVE Button */
        saveBarButton = new Button(this);
        saveBarButton.setText("Übernehmen");
        saveBarButton.setBackgroundColor(Color.WHITE);
        saveBarButton.setTypeface(null, Typeface.BOLD);
        saveBarButton.setTextSize(20);
        saveBarButton.setCompoundDrawablesWithIntrinsicBounds( null, activityRes.getDrawable(activityRes.getIdentifier("signature_ok", "drawable", this.getApplicationContext().getPackageName()), this.getApplicationContext().getTheme()), null, null);
        saveBarButton.setTextColor(Color.GREEN);
        saveBarButton.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, (float) 0.3));
        saveBarButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Log.e(TAG, "saveBarButton");
                save();
            }
        });
        saveBarButton.setVisibility(View.GONE);
        toolBar.addView(saveBarButton);

        return toolBar;
    }

    public void clear() {
        Log.v(TAG, "clear");

        mBitmap.eraseColor(Color.argb(a, r, g, b));

        mBitmap = Bitmap.createScaledBitmap(mBitmap, mTdView.mCanvas.getWidth(),
                mTdView.mCanvas.getHeight(), false);
        mTdView.mCanvas = new Canvas(mBitmap);
        mTdView.invalidate();

        saveBarButton.setVisibility(View.GONE);
        clearBarButton.setVisibility(View.GONE);
    }

    public void cancel() {
        Log.v(TAG, "cancel");

        Intent resultIntent = new Intent();
        resultIntent.putExtra("message", "cancelled");

        setResult(Activity.RESULT_CANCELED, resultIntent);

        super.finish();
    }

    public void save() {
        Log.v(TAG, "save");

        progressBar.setVisibility(View.VISIBLE);
        cancelBarButton.setVisibility(View.GONE);
        saveBarButton.setVisibility(View.GONE);
        clearBarButton.setVisibility(View.GONE);

        AsyncTask.execute(new Runnable() {
            @Override
            public void run() {
                ByteArrayOutputStream drawing = new ByteArrayOutputStream();

                if(trim) {
                    Bitmap newmBitmap = TrimBitmap(mBitmap);
                    scaleBitmap(newmBitmap).compress(mEncodingType, 100, drawing);
                } else {
                    scaleBitmap(mBitmap).compress(mEncodingType, 100, drawing);
                }

                String encoded = Base64.encodeToString(drawing.toByteArray(), Base64.DEFAULT);

                Intent resultIntent = new Intent();
                resultIntent.putExtra("result", "data:image/png;base64," + encoded);
                setResult(Activity.RESULT_OK, resultIntent);
                finish();
            }
        });
    }

    public Bitmap scaleBitmap(Bitmap bitmap) {
        int origWidth = bitmap.getWidth();
        int origHeight = bitmap.getHeight();
        int newWidth, newHeight;

        if (mScale < 100) {
            newWidth = (int) (origWidth * (mScale / 100.0));
            newHeight = (int)(origHeight * (mScale / 100.0));
        } else {
            return bitmap;
        }

        return Bitmap.createScaledBitmap(bitmap, newWidth, newHeight, true);
    }

    public static Bitmap TrimBitmap(Bitmap bmp) {
        int imgHeight = bmp.getHeight();
        int imgWidth  = bmp.getWidth();


        //TRIM WIDTH - LEFT
        int startWidth = 0;
        for(int x = 0; x < imgWidth; x++) {
            if (startWidth == 0) {
                for (int y = 0; y < imgHeight; y++) {
                    if (bmp.getPixel(x, y) != Color.TRANSPARENT) {
                        startWidth = x;
                        break;
                    }
                }
            } else break;
        }


        //TRIM WIDTH - RIGHT
        int endWidth  = 0;
        for(int x = imgWidth - 1; x >= 0; x--) {
            if (endWidth == 0) {
                for (int y = 0; y < imgHeight; y++) {
                    if (bmp.getPixel(x, y) != Color.TRANSPARENT) {
                        endWidth = x;
                        break;
                    }
                }
            } else break;
        }



        //TRIM HEIGHT - TOP
        int startHeight = 0;
        for(int y = 0; y < imgHeight; y++) {
            if (startHeight == 0) {
                for (int x = 0; x < imgWidth; x++) {
                    if (bmp.getPixel(x, y) != Color.TRANSPARENT) {
                        startHeight = y;
                        break;
                    }
                }
            } else break;
        }



        //TRIM HEIGHT - BOTTOM
        int endHeight = 0;
        for(int y = imgHeight - 1; y >= 0; y--) {
            if (endHeight == 0 ) {
                for (int x = 0; x < imgWidth; x++) {
                    if (bmp.getPixel(x, y) != Color.TRANSPARENT) {
                        endHeight = y;
                        break;
                    }
                }
            } else break;
        }


        return Bitmap.createBitmap(
                bmp,
                startWidth,
                startHeight,
                endWidth - startWidth,
                endHeight - startHeight
        );

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

    class Line {
        float startX, startY, stopX, stopY;
        public Line(float startX, float startY, float stopX, float stopY) {
            this.startX = startX;
            this.startY = startY;
            this.stopX = stopX;
            this.stopY = stopY;
        }
        public Line(float startX, float startY) { // for convenience
            this(startX, startY, startX, startY);
        }
    }

    public class DrawView extends View {
        public Canvas  mCanvas;
        private Path mPath;
        private Paint mBitmapPaint;

        ArrayList<Line> lines = new ArrayList<Line>();

        public DrawView(Context context) {
            super(context);
            Log.v(TAG, "DrawView");
            Log.v(TAG, "mStrokeWidth " + mStrokeWidth);

            int canvasWidth = MakeSignatureActivity.getScreenWidth(MakeSignatureActivity.this);
            int canvasHeight = MakeSignatureActivity.getScreenHeight(MakeSignatureActivity.this);

            mBitmap = Bitmap.createBitmap(canvasWidth, canvasHeight,
                    Bitmap.Config.ARGB_8888);

            //Resources activityRes = this.getResources();
            //int bgImgDrawable = activityRes.getIdentifier("signhere_bg", "drawable", MakeSignatureActivity.this.getApplicationContext().getPackageName());

            //Bitmap bgBitmap = BitmapFactory.decodeResource(getResources(), bgImgDrawable).copy(Bitmap.Config.ARGB_8888, true);

            mCanvas = new Canvas(mBitmap);
            //mCanvas = new Canvas(bgBitmap);

            /*
            // Decode the hex color code for the background to ARGB
            a = 0xFF;       // alpha value (0 -> transparent, FF -> opaque)
            r = Integer.valueOf("" + mBackgroundColor.charAt(1) +
                    mBackgroundColor.charAt(2), 16);
            g = Integer.valueOf("" + mBackgroundColor.charAt(3) +
                    mBackgroundColor.charAt(4), 16);
            b = Integer.valueOf("" + mBackgroundColor.charAt(5) +
                    mBackgroundColor.charAt(6), 16);
            mCanvas.drawARGB(a, r, g, b);
            */
            /*
            mBitmapPaint.setAntiAlias(true);
            mBitmapPaint.setStrokeWidth(6f);
            mBitmapPaint.setColor(Color.BLACK);
            mBitmapPaint.setStyle(Paint.Style.STROKE);
            mBitmapPaint.setStrokeJoin(Paint.Join.ROUND);
            */

            mPath = new Path();
            mBitmapPaint = new Paint(Paint.DITHER_FLAG);
        }

        @Override
        protected void onDraw(Canvas canvas) {
            Log.v(TAG, "onDraw");
            canvas.drawColor(Color.argb(a, r, g, b));
            canvas.drawBitmap(mBitmap, 0, 0, mBitmapPaint);
            canvas.drawPath(mPath, mPaint);
        }

        private float mX, mY;
        private static final float TOUCH_TOLERANCE = 4;

        private void touch_start(float x, float y) {
            mPath.reset();
            mPath.moveTo(x, y);
            mX = x;
            mY = y;

            //saveButton.setVisibility(View.GONE);
            //clearButton.setVisibility(View.GONE);
        }
        private void touch_move(float x, float y) {
            float dx = Math.abs(x - mX);
            float dy = Math.abs(y - mY);
            if (dx >= TOUCH_TOLERANCE || dy >= TOUCH_TOLERANCE) {
                mPath.quadTo(mX, mY, (x + mX)/2, (y + mY)/2);
                mX = x;
                mY = y;
            }
        }
        private void touch_up() {
            mPath.lineTo(mX, mY);
            // commit the path to our offscreen
            mCanvas.drawPath(mPath, mPaint);
            // kill this so we don't double draw
            mPath.reset();

            //saveButton.setVisibility(View.VISIBLE);
            saveBarButton.setVisibility(View.VISIBLE);
            //clearButton.setVisibility(View.VISIBLE);
            clearBarButton.setVisibility(View.VISIBLE);
        }

        @Override
        public boolean onTouchEvent(MotionEvent event) {
            float x = event.getX();
            float y = event.getY();

            switch (event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    touch_start(x, y);
                    invalidate();
                    break;
                case MotionEvent.ACTION_MOVE:
                    touch_move(x, y);
                    invalidate();
                    break;
                case MotionEvent.ACTION_UP:
                    touch_up();
                    invalidate();
                    break;
            }
            return true;
        }
    }
}
