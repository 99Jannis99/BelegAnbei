package com.dimento.beleganbei; // replace your-apps-package-name with your app’s package name

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log
import com.dimento.beleganbei.development.MainApplication
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import datev.de.dcal.*


class DATEV(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "DATEV"

    fun DATEV(context: ReactApplicationContext) {
        // Set Auth Delegate
        DCAL.authDelegate = object : DCALapiDelegate {
            override fun dcalAuthStateChanged(newState: DCALState, error: DCALError?) {
                dcalAuthStateChanged(newState, error)
            }
        }

        // Set Session Delegate (= Progress Upload)
        DCAL.sessionDelegate = object : DCALSessionDelegate {
            override fun dcalSession(totalBytesExpectedToSend: Long, totalBytesSent: Long, totalBytesExpectedToReceive: Long, totalBytesReceived: Long) {
                dcalSession(totalBytesExpectedToSend, totalBytesSent, totalBytesExpectedToReceive, totalBytesReceived)
            }
        }
    }

    companion object {
        @JvmStatic fun handleIntent() {}

        @JvmStatic
        fun onNewIntent(intentString: Uri) {
            println("on NEw intent KT")
            DCAL.handleUrl(intentString)
        }
    }

    // Delegate for LOGIN/LOGOUT State, send to callback
    @ReactMethod
    private fun dcalAuthStateChanged(newState: DCALState, error: DCALError?) {
        Log.e("dcalAuthStateChanged", "")
        if (error != null) {
            println("dcalAuthStateChanged error $error")

            // Emit event to RN
            reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("DATEV_AuthState_Error", error.errorMessage)
        } else {
            println("dcalAuthStateChanged newState $newState")

            // Emit event to RN
            reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("DATEV_AuthState_Changed", isLoggedIn())
        }
    }

    // Delegate for UPLOAD Progress, send to callback
    @ReactMethod
    private fun dcalSession(totalBytesExpectedToSend: Long, totalBytesSent: Long, totalBytesExpectedToReceive: Long, totalBytesReceived: Long) {
        if (totalBytesExpectedToReceive > 0) {
            println("totalBytesExpectedToReceive $totalBytesExpectedToReceive")
            println("totalBytesReceived $totalBytesReceived")
            val percentage = (totalBytesReceived * 100.0 / totalBytesExpectedToReceive + 0.5).toInt()
            println("percentage % $percentage")
        }
        if (totalBytesExpectedToSend > 0) {
            val percentage = (totalBytesSent * 100.0 / totalBytesExpectedToSend + 0.5).toInt()
            println("percentage % $percentage")
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun initialize(client_id: String, client_secret: String, scope: String, redirect_uri: String, use_sandbox: Boolean) {
        println("DATEV DCAL initialize")
        println("DATEV use_sandbox: $use_sandbox")
        println("DATEV client_id: $client_id")
        println("DATEV client_secret: $client_secret")
        println("DATEV scope: $scope")
        println("DATEV redirect_uri: $redirect_uri")

        val initResponse = DCAL.initialize(client_id, client_secret, scope, redirect_uri, use_sandbox, reactApplicationContext)
        println("DATEV initResponse: $initResponse")

        isInitialized();
        isLoggedIn();
        isSmartLoginAvailable();
    }

    @ReactMethod
    fun isSmartLoginAvailable() {
        println("DATEV isSmartLoginAvailable")
        val smartLoginAvailable = DCAL.isSmartLoginAvailable()

        // Emit event to RN
        reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("DATEV_SMARTLOGIN_AVAILABLE", smartLoginAvailable);
    }

    @ReactMethod
    fun isInitialized() {
        println("DATEV isInitialized")
        val currentState = DCAL.getState()

        var result = false;
        if(!currentState.contains(State.uninitialized)) {
            result = currentState.contains(State.initialized);
        }

        // Emit event to RN
        reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("DATEV_IS_INITIALIZED", result);
    }

    @ReactMethod
    fun isLoggedIn() {
        println("DATEV isLoggedIn")
        val currentState = DCAL.getState()
        val result = currentState.contains(State.loggedIn);

        // Emit event to RN
        reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("DATEV_AuthState_Changed", result);
    }

    @ReactMethod
    fun requestLogin() {
        println("DATEV requestLogin")
        DCAL.requestLogin()
    }

    @ReactMethod
    fun requestLogout() {
        println("DATEV requestLogout")
        DCAL.requestLogout()

        Thread.sleep(1000L);
        isLoggedIn();
    }

    fun handleIntent(intentString: String, intentName: String) {
        var intentString = intentString
        println("DATEV handleIntent")
        intentString = intentString.replace("$intentName://datev?data=", "")

        // DEV HACK
        intentString = intentString.replace("beleganbeiopengrahl://datev?data=", "")
        intentString = intentString.replace("beleganbeiopendevelopment://datev?data=", "")
        // DEV HACK

        println("DATEV INTENT_STRING_FIXED $intentString")
        intentString = Uri.decode(intentString)
        println("DATEV INTENT_STRING_FIXED_2 $intentString")

        try {
            val datevCodeURL = Uri.parse(intentString)
            val DCAL = DCAL
            DCAL.handleUrl(datevCodeURL)

            Thread.sleep(1000L);
            isLoggedIn();

        } catch (e: Exception) {
            println("DATEV Exception DATEV Handle URL")
            println(e.localizedMessage)
        }
    }
}
