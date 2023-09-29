package com.meinprojekt;

import android.app.Activity;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.util.Log;
import android.view.Gravity;
import android.view.HapticFeedbackConstants;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.concurrent.atomic.AtomicInteger;

import androidx.annotation.Nullable;


public class OpenActivity extends Activity {
    private TextView textview;
    private Button cancelButton;

    private String name = "";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Bundle intentExtras = getIntent().getExtras();



        if (intentExtras != null) {
            Log.e("intentExtras", intentExtras.toString());

            if(getIntent().hasExtra("name")) {
                name = intentExtras.getString("name", name);
            }
            Log.e("returnToDetailview", "name INten part read");

        } else {
            Log.e("intentExtras", "Inten Error");
            return;
        }

        Log.i("Info", "Hallo");

        RelativeLayout tDLayout = new RelativeLayout(this);
        tDLayout.setHapticFeedbackEnabled(true);
        tDLayout.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT));

        LinearLayout buttonBar = createButtonBar();
        buttonBar.setId(getNextViewId());
        RelativeLayout.LayoutParams buttonBarLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        buttonBarLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        buttonBar.setLayoutParams(buttonBarLayoutParams);
        tDLayout.addView(buttonBar);

        LinearLayout textViewELement = createTextViewElement();
        textViewELement.setId(getNextViewId());
        RelativeLayout.LayoutParams textViewELementLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        textViewELementLayoutParams.addRule(RelativeLayout.BELOW, buttonBar.getId());
        textViewELement.setLayoutParams(textViewELementLayoutParams);
        tDLayout.addView(textViewELement);


        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(tDLayout);
    }


    public LinearLayout createButtonBar() {
        LinearLayout buttonBar = new LinearLayout(this);

        Resources activityRes = this.getResources();

        cancelButton = new Button(this);
        cancelButton.setText("Abbrechen");
        cancelButton.setTextSize(16);
        //ancelButton.setTypeface(Typeface.SANS_SERIF);
        cancelButton.setBackgroundColor(Color.parseColor("#fa2000"));
        cancelButton.setTextColor(Color.parseColor("#dddddd"));
        cancelButton.setGravity(Gravity.LEFT);
        cancelButton.setPadding(48,40,0,0);

        LinearLayout.LayoutParams cancelButtonLayoutParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        cancelButton.setLayoutParams(cancelButtonLayoutParams);

        cancelButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                v.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY);
                Intent resultIntent = new Intent();
                resultIntent.putExtra("result", "ABORTED");
                setResult(Activity.RESULT_CANCELED, resultIntent);

                finish();

            }
        });
        buttonBar.addView(cancelButton);

        return buttonBar;
    }

    public LinearLayout createTextViewElement() {
        LinearLayout textViewBar = new LinearLayout(this);

        TextView textViewInfo = new TextView(OpenActivity.this);
        textViewInfo.setText("Tippensdfsd sdfsd fdsaf sdfaf sdaf sadf sadf sdtrag");

        LinearLayout.LayoutParams textViewInfoLayoutParams = new LinearLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        textViewInfo.setLayoutParams(textViewInfoLayoutParams);
        textViewInfo.setBackgroundColor(Color.parseColor("#fa2000"));
        textViewInfo.setTextColor(Color.parseColor("#dddddd"));
        textViewInfo.setGravity(Gravity.CENTER);
        textViewInfo.setPadding(24, 24, 24, 24);
        textViewBar.addView(textViewInfo);

        return textViewBar;
    }

    private static final AtomicInteger sNextGeneratedId = new AtomicInteger(1);

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
}
