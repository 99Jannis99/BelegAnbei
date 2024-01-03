package com.dimento.beleganbei.development;

import android.app.Application;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

import com.dimento.beleganbei.DocExchangePackage;
import com.dimento.beleganbei.StatusBarPackage;
import com.dimento.beleganbei.ConfigPropertiesPackage;
import com.dimento.beleganbei.DATEVPackage;
import com.dimento.beleganbei.DATEVDUOPackage;
import com.dimento.beleganbei.DATEVDMSPackage;
import com.dimento.beleganbei.SpinnerPackage;
import com.dimento.beleganbei.PDFViewerPackage;
//import com.dimento.beleganbei.BelegeStorePackage;
//import com.dimento.beleganbei.SendMailPackage;
//import com.dimento.beleganbei.MakeSignaturePackage;
//import com.dimento.beleganbei.PDFPickerPackage;
//import com.dimento.beleganbei.ImagePickerPackage;
//import com.dimento.beleganbei.FormularePackage;
//import com.dimento.beleganbei.PDFCreatorPackage;
//import com.dimento.beleganbei.PreviewFromPDFPackage;
//import com.dimento.beleganbei.DocScannerPackage;
//import com.dimento.beleganbei.ImageEditPackage;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost =
            new DefaultReactNativeHost(this) {
                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    @SuppressWarnings("UnnecessaryLocalVariable")
                    List<ReactPackage> packages = new PackageList(this).getPackages();
                    // Packages that cannot be autolinked yet can be added manually here, for example:
                    // packages.add(new MyReactNativePackage());

                    // HELPER
                    packages.add(new ConfigPropertiesPackage());

                    // DOCEXCHANGE
                    packages.add(new DocExchangePackage());

                    // StatusBar
                    packages.add(new StatusBarPackage());

                    // DATEV
                    packages.add(new DATEVPackage());
                    packages.add(new DATEVDUOPackage());
                    packages.add(new DATEVDMSPackage());

                    // Spinner
                    packages.add(new SpinnerPackage());

                    // PDFViewer
                    packages.add(new PDFViewerPackage());

                    // MakeSignature
                    //packages.add(new MakeSignaturePackage());

                    // PDFPicker
                    //packages.add(new PDFPickerPackage());

                    // PreviewFromPDF
                    //packages.add(new PreviewFromPDFPackage());

                    // PDFCreator
                    //packages.add(new PDFCreatorPackage());

                    // ImagePicker
                    //packages.add(new ImagePickerPackage());

                    // DocScanner
                    //packages.add(new DocScannerPackage());

                    // ImageEdit
                    //packages.add(new ImageEditPackage());

                    // Formulare
                    //packages.add(new FormularePackage());

                    // SendMail
                    //packages.add(new SendMailPackage());

                    // BelegeStore
                    //packages.add(new BelegeStorePackage());

                    return packages;
                }

                @Override
                protected String getJSMainModuleName() {
                    return "index";
                }

                @Override
                protected boolean isNewArchEnabled() {
                    return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
                }

                @Override
                protected Boolean isHermesEnabled() {
                    return BuildConfig.IS_HERMES_ENABLED;
                }
            };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            DefaultNewArchitectureEntryPoint.load();
        }
        com.dimento.beleganbei.development.ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    }
}
