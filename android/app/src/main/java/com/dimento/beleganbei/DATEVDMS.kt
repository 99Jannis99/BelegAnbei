package com.dimento.beleganbei; // replace your-apps-package-name with your app’s package name
import android.util.Log
import com.android.volley.VolleyError
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.gson.Gson
import com.google.gson.JsonParser
import datev.de.dcal.*

class DATEVDMS(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "DATEVDMS"

    data class clientsResult(
            val code: Int,
            val skip: Int,
            val top : Int,
            val data: String
    )


    @ReactMethod
    fun clients(client_id: String, searchText: String, skip: Int, top: Int, sandbox: Boolean) {
        Log.d(getName(), "clients client_id: $client_id")
        Log.d(getName(), "clients skip: $skip")
        Log.d(getName(), "clients skip: $searchText")
        Log.d(getName(), "clients top: $top")
        Log.d(getName(), "clients sandbox: $sandbox")

        val gson = Gson()

        val datevConnection: DatevConnection = DatevConnection.getInstance(getReactApplicationContext());
        val headers = HashMap<String, String>()
        headers.put("X-DATEV-Client-Id", client_id)

        var requestURL:String = "https://mytax-income-tax-documents.api.datev.de/platform/v1/clients";
        if(sandbox) {
            requestURL = "https://mytax-income-tax-documents.api.datev.de/platform-sandbox/v1/clients";
        }

        requestURL += "?skip=" + skip;
        requestURL += "&top=" + top;

        if(searchText.isNotEmpty()) {
            requestURL += "&search-text=" + searchText;
        }

        Log.d(getName(), "clients requestURL: $requestURL")

        val res = datevConnection.getData(requestURL, headers, { response: String ->
            Log.d(getName(), "response: $response")

            val resultJson = gson.toJson(DATEVDMS.clientsResult(201, skip, top, response))

            reactApplicationContext.getJSModule<DeviceEventManagerModule.RCTDeviceEventEmitter>(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("DATEV_DMS_CLIENTS", resultJson.toString())
        }, { error: VolleyError ->
            Log.d(getName(), "error: $error")
            Log.d(getName(), "error: error.networkResponse.statusCode")

            val statusCode: Int = error.networkResponse.statusCode
            Log.d(getName(), "statusCode $statusCode")

            val allHeaders = error.networkResponse.allHeaders
            val allHeaders2 = allHeaders.toString()
            Log.d(getName(), "allHeaders2 $allHeaders2")

            val response = error.networkResponse
            val jsonError = String(response.data)
            println("jsonError $jsonError")

            val jsonParser = JsonParser()
            val jsonObject = jsonParser.parse(jsonError).asJsonObject
            println("jsonObject $jsonObject")

            val resultJson = gson.toJson(DATEVDMS.clientsResult(statusCode, skip, top, jsonObject.toString()))

            reactApplicationContext.getJSModule<DeviceEventManagerModule.RCTDeviceEventEmitter>(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("DATEV_DMS_CLIENTS", resultJson.toString())
        });
        Log.d(getName(), "clients res: $res")
    }
}
