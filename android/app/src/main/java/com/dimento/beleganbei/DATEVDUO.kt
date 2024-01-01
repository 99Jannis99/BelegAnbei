package com.dimento.beleganbei; // replace your-apps-package-name with your app’s package name

import android.util.Log
import com.android.volley.NetworkResponse
import com.android.volley.Response
import com.android.volley.VolleyError
import com.android.volley.toolbox.HttpHeaderParser
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.gson.Gson
import com.google.gson.JsonParser
import com.google.gson.reflect.TypeToken
import datev.de.dcal.*
import org.json.JSONObject
import java.nio.charset.Charset


class DATEVDUO(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "DATEVDUO"

    data class userdataResult(
        val code: Int,
        val data: String
    )

    data class clientsResult(
        val code: Int,
        val skip: Int,
        val top : Int,
        val data: String
    )

    data class clientDocumentTypes(
        val code: Int,
        val data: String
    )

  @ReactMethod
  fun userdata(client_id: String, sandbox: Boolean) {
      Log.d(getName(), "userdata client_id: $client_id")
      Log.d(getName(), "userdata sandbox: $sandbox")

      val gson = Gson()

      val datevConnection: DatevConnection = DatevConnection.getInstance(getReactApplicationContext())

      var requestURL:String = "https://api.datev.de/userinfo";
      if(sandbox) {
          requestURL = "https://sandbox-api.datev.de/userinfo";
      }
      Log.d(getName(), "userdata requestURL: $requestURL")

      // GET-Request
      datevConnection.getData(requestURL, null, Response.Listener { response ->
          Log.d(getName(), "response: $response")

          val resultJson = gson.toJson(userdataResult(201, response))

          reactApplicationContext.getJSModule<DeviceEventManagerModule.RCTDeviceEventEmitter>(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("DATEV_DATA_USERDATA", resultJson.toString())
      }, Response.ErrorListener { error: VolleyError ->
          Log.d(getName(), "error: $error")
          Log.d(getName(), "error: error.networkResponse.statusCode")

          val statusCode: Int = error.networkResponse.statusCode
          val message = error.message?.let { it }.toString()

          val resultJson = gson.toJson(userdataResult(statusCode, message))

          reactApplicationContext.getJSModule<DeviceEventManagerModule.RCTDeviceEventEmitter>(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
              .emit("DATEV_DATA_USERDATA", resultJson.toString())
      });
    }

    @ReactMethod
    fun clients(client_id: String, skip: Int, top: Int, sandbox: Boolean) {
        Log.d(getName(), "clients client_id: $client_id")
        Log.d(getName(), "clients skip: $skip")
        Log.d(getName(), "clients top: $top")
        Log.d(getName(), "clients sandbox: $sandbox")

        val gson = Gson()

        val datevConnection: DatevConnection = DatevConnection.getInstance(getReactApplicationContext());
        val headers = HashMap<String, String>()
        headers.put("X-DATEV-Client-Id", client_id)

        var requestURL:String = "https://accounting-clients.api.datev.de/platform/v2/clients";
        if(sandbox) {
            requestURL = "https://accounting-clients.api.datev.de/platform-sandbox/v2/clients";
        }

        requestURL += "?skip=" + skip;
        requestURL += "&top=" + top;

        Log.d(getName(), "userdata requestURL: $requestURL")

        val res = datevConnection.getData(requestURL, headers, { response: String ->
            Log.d(getName(), "response: $response")

            val resultJson = gson.toJson(clientsResult(201, skip, top, response))

            reactApplicationContext.getJSModule<DeviceEventManagerModule.RCTDeviceEventEmitter>(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("DATEV_DUO_CLIENTS", resultJson.toString())
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

            val resultJson = gson.toJson(clientsResult(statusCode, skip, top, jsonObject.toString()))

            reactApplicationContext.getJSModule<DeviceEventManagerModule.RCTDeviceEventEmitter>(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("DATEV_DUO_CLIENTS", resultJson.toString())
        });

        //val dsfsdf:String = res.toString();
        //println("RRRRRES $dsfsdf")
    }

    @ReactMethod
    fun clientDocumentTypes(client_id: String, client: String, sandbox: Boolean) {
        Log.d(getName(), "clientDocumentTypes client_id: $client_id")
        Log.d(getName(), "clientDocumentTypes client: $client")
        Log.d(getName(), "clientDocumentTypes sandbox: $sandbox")

        val gson = Gson()

        val datevConnection: DatevConnection = DatevConnection.getInstance(getReactApplicationContext());
        val headers = HashMap<String, String>()
        headers.put("X-DATEV-Client-Id", client_id)

        var requestURL:String = "https://accounting-documents.api.datev.de/platform/v2/clients/" + client + "/document-types";
        if(sandbox) {
            requestURL = "https://accounting-documents.api.datev.de/platform-sandbox/v2/clients/" + client + "/document-types";
        }
        Log.d(getName(), "clientDocumentTypes requestURL: $requestURL")

        val res = datevConnection.getData(requestURL, headers, { response ->
            Log.d(getName(), "response: $response")

            val resultJson = gson.toJson(clientDocumentTypes(201, response))

            reactApplicationContext.getJSModule<DeviceEventManagerModule.RCTDeviceEventEmitter>(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("DATEV_DUO_CLIENT_DOCUMENT_TYPES", resultJson.toString())
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

            val resultJson = gson.toJson(clientDocumentTypes(statusCode, jsonObject.toString()))

            reactApplicationContext.getJSModule<DeviceEventManagerModule.RCTDeviceEventEmitter>(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("DATEV_DUO_CLIENT_DOCUMENT_TYPES", resultJson.toString())
        });

        //val dsfsdf:String = res.toString();
        //println("RRRRRES $dsfsdf")
    }
}
