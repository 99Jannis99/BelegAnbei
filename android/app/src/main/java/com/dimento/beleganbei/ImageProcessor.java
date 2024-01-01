package com.dimento.beleganbei;

import android.content.Context;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.provider.OpenableColumns;
import android.util.Log;
import android.webkit.MimeTypeMap;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

/* Usage

ImageProcessor imageProcessor = new ImageProcessor();
imageProcessor.initialize(reactContext, useDPI, useJPEGQuality, "jpg");

ImageProcessor.createCacheBitmapFromURI(reactContext, uri) // Uri from Result
ImageProcessor.createCacheBitmapFromPath(reactContext, path) // Path from Result
ImageProcessor.setDirectCacheBitmap(bitmap) // Bitmap from Result
if(bitmapCreated) {
    Bitmap resized = imageProcessor.checkAndSetResize();
    byte[] compressed = imageProcessor.compress(resized);

    String filePath = imageProcessor.createFilePath();
    Boolean saved = imageProcessor.save(compressed, filePath);
    if(saved) {
        // send result

        imageProcessor.getFileMimeType()
        imageProcessor.getFileSize(filePath)
        imageProcessor.getOriginalFileNameFromUri(context, uri);

        resized.getWidth()
        resized.getHeight()

    } else {
        // error save
    }

    resized.recycle();
} else {
    // error create
}

*/

public class ImageProcessor {
    private static String TAG = "ImageProcessor";
    private String belegePath = "";
    final private String belegeSubFolder = "";

    static double widthPixelPerDPI  = 8.263888888;
    static double heightPixelPerDPI = 11.69444444;

    private static String _extension;
    private static int _dpi;
    private static int _jpegQuality;
    private String cacheFilePath;

    private static Bitmap cacheBitmap;

    /**
     * Initialisiert die Schose
     *
     * @param context
     * @param dpi
     * @param jpegQuality
     * @param extension
     */
    public void initialize(Context context, int dpi, Double jpegQuality, String extension) {
        setBelegePath(context);

        _dpi = dpi;
        _jpegQuality = (int) (jpegQuality * 100);
        _extension = extension.toLowerCase();
    }

    public static int[] calculateMaxSizes() {
        int maxWidth = (int) (_dpi * widthPixelPerDPI);
        int maxHeight = (int) (_dpi * heightPixelPerDPI);

        int[] dim = {maxWidth, maxHeight};
        return dim;
    }

    public static Bitmap checkAndSetResize() {
        Log.i(TAG, "DPI -> " + _dpi);
        Log.i(TAG, "JPEGQUALITY -> " + _jpegQuality);

        Bitmap originalBitmap = getCacheBitmap();
        int originalWidth = originalBitmap.getWidth();
        int originalHeight = originalBitmap.getHeight();

        Log.i(TAG, "is originalWidth -> " + originalWidth);
        Log.i(TAG, "is originalHeight -> " + originalHeight);

        int[] sizes = calculateMaxSizes();
        int maxWidth = sizes[0];
        int maxHeight = sizes[1];

        Log.i(TAG, "maxWidth -> " + maxWidth);
        Log.i(TAG, "maxHeight -> " + maxHeight);

        if (maxHeight > 0 && maxWidth > 0) {
            float ratioBitmap = (float) originalWidth / (float) originalHeight;
            float ratioMax = (float) maxWidth / (float) maxHeight;

            int finalWidth = maxWidth;
            int finalHeight = maxHeight;
            if (ratioMax > ratioBitmap) {
                finalWidth = (int) ((float)maxHeight * ratioBitmap);
            } else {
                finalHeight = (int) ((float)maxWidth / ratioBitmap);
            }
            Bitmap newBitmap = Bitmap.createScaledBitmap(originalBitmap, finalWidth, finalHeight, true);
            return newBitmap;
        } else {
            return originalBitmap;
        }
    }

    public static byte[] compress(Bitmap bm) {
        if(_extension.equals("png")) {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            bm.compress(Bitmap.CompressFormat.PNG, _jpegQuality, outputStream);
            return outputStream.toByteArray();
        } else if(_extension.equals("jpg") || _extension.equals("jpeg")) {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            bm.compress(Bitmap.CompressFormat.JPEG, _jpegQuality, outputStream);
            return outputStream.toByteArray();
        } else {
            return null;
        }
    }

    public static Boolean save(byte[] data, String filePath) {
        File file = new File(filePath);
        try {
            FileOutputStream fos = new FileOutputStream(file);
            fos.write(data);
            fos.close();

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static Boolean setDirectCacheBitmap(Bitmap bm) {
        cacheBitmap = bm;
        return true;
    }

    public static Boolean createCacheBitmapFromURI(Context context, Uri uri) {
        try {
            InputStream is = context.getContentResolver().openInputStream(uri);
            cacheBitmap = BitmapFactory.decodeStream(is);
            is.close();

            return true;
        } catch (IOException ioe) {
            ioe.printStackTrace();
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static Boolean createCacheBitmapFromPath(Context context, String filePath) {
        Uri useUri = Uri.parse("file://" + filePath);

        int[] sizes = calculateMaxSizes();

        try {
            cacheBitmap = FileUtils.handleSamplingAndRotationBitmap(context, useUri, sizes[0], sizes[1]);
            //cacheBitmap = BitmapFactory.decodeFile(filePath);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Gibt die CacheBitmap zurück
     */
    public static Bitmap getCacheBitmap() {
        return cacheBitmap;
    }

    /**
     * Gibt den Datei Name des orignals zurück
     */
    public String getOriginalFileNameFromUri(Context context, Uri uri) {
        Cursor returnCursor = context.getContentResolver().query(uri, null, null, null, null);
        int nameIndex = returnCursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
        returnCursor.moveToFirst();

        String filename = returnCursor.getString(nameIndex);

        return filename.replace(".jpg", "").replace("-", " ").replace("_", " ").replace(".", " ");
    }

    /**
     * Gibt den Datei Name des orignals zurück
     */
    public String getOriginalFileNameFromPath(Context context, String path) {
        String[] components = path.split("\\\\|/"); //$NON-NLS-1$
        return components[components.length - 1];
    }

    /**
     * Gibt den Datei Mime Typ zurück
     */
    public String getFileMimeType() {
        return MimeTypeMap.getSingleton().getMimeTypeFromExtension(_extension);
    }

    /**
     * Gibt die Dateigröße zurück
     *
     * @param filePath
     */
    public int getFileSize(String filePath) {
        File tempFile = new File(filePath);
        if (tempFile.exists()) {
            return longToIntCast(tempFile.length());
        } else {
            return 0;
        }
    }
    public static int getBitmapSize(Bitmap bm) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR1) {
            return bm.getByteCount();
        } else {
            return bm.getRowBytes() * bm.getHeight();
        }
    }

    /**
     * Gibt die Dateimaße zurück
     *
     * @param filePath
     */
    public int[] getFileDimensions(String filePath) {
        try {
            File f = new File(filePath);
            if (!f.exists()) {
                int[] dim = {0,0};
                return dim;
            }
            Bitmap bitmap = BitmapFactory.decodeFile(filePath);

            int[] dim = {bitmap.getWidth(),bitmap.getHeight()};
            return dim;
        } catch (Exception e) {
            e.printStackTrace();

            int[] dim = {0,0};
            return dim;
        }
    }

    /**
     * Prüft ob die Datei existiert
     *
     * @param filePath
     */
    public static Boolean fileExists(String filePath) {
        File tempFile = new File(filePath);
        boolean exists = tempFile.exists();

        return exists;
    }

    /**
     * Setzt den Pfad für Belege, ggf. mit Subfolder
     *
     * @param context
     */
    public void setBelegePath(Context context) {
        File filesDir = context.getFilesDir();
        belegePath = filesDir.getAbsolutePath();

        if(!belegeSubFolder.isEmpty()) {
            belegePath += "/" + belegeSubFolder;
        }

        belegePath += "/";

        // Check if (Sub)Folder exists, create
        try {
            checkBelegeFolder(belegePath);
        } catch (IOException e) {
            e.printStackTrace();
            // Fallback to "main" path
            belegePath = filesDir.getAbsolutePath();
        }
    }

    /**
     * Prüft den Pfad aus setBelegePath und erstellt ggf. den Ordner
     *
     * @param path
     * @throws IOException
     */
    private void checkBelegeFolder(String path) throws IOException {
        Log.i(TAG, "checkBelegeFolder");
        if (!Files.exists(Paths.get(path))) {
            Log.i(TAG, "checkBelegeFolder MISSING");
            Files.createDirectories(Paths.get(belegePath));
        }
    }

    /**
     * Gibt den Belege Pfad aus, ggf. inkl. file:// - Default: ohne
     *
     * @param withProtocol true oder false
     */
    public String getBelegePath(Boolean... withProtocol) {
        Boolean hasWithProtocol = (withProtocol.length == 1) ? withProtocol[0] : false;
        Log.i(TAG, "getBelegePath hasWithProtocol " + hasWithProtocol);

        if(hasWithProtocol) {
            return "file://" + belegePath;
        }

        return belegePath;
    }

    /**
     * Gibt den Pfad zum Cachedir zurück
     *
     * @param context
     */
    public String getCachePath(Context context) {
        File cacheDir = context.getCacheDir();
        return cacheDir.getAbsolutePath();
    }

    /**
     * Erstellt einen zufälligen Dateinamen
     */
    public String createFileName() {
        return UUID.randomUUID().toString() + "." + _extension;
    }

    /**
     * Erstellt einen Pfad + Dateinamen
     */
    public String createFilePath(Boolean... withProtocol) {
        Boolean hasWithProtocol = (withProtocol.length == 1) ? withProtocol[0] : false;
        if(hasWithProtocol) {
            return "file://" + getBelegePath() + createFileName();
        }

        return getBelegePath() + createFileName();
    }

    /**
     * Gibt die DPI zurück
     */
    public int getDPI() {
        return _dpi;
    }

    /**
     * Gibt die jpeg Qualität zurück
     */
    public int getJpegQuality() {
        return _jpegQuality;
    }

    /**
     * Gibt die Dateierweiterung zurück
     */
    public String getExtension() {
        return _extension;
    }

    public static int longToIntCast(long number) {
        return (int) number;
    }
}
