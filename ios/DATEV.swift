//
//  CustomMethods.swift
//  BelegAnbeiDevelopment
//
//  Created by Dieter Stratmann on 03.12.23.
//

import Foundation
import DCAL

@objc(DATEV) class DATEV: RCTEventEmitter, DCALapiDelegate, DCALSessionDelegate {
  
  @objc override static func requiresMainQueueSetup() -> Bool { return true }
  
  override func supportedEvents() -> [String]! {
    return ["DATEV_SMARTLOGIN_AVAILABLE", "DATEV_IS_INITIALIZED", "DATEV_AuthState_Changed", "DATEV_AuthState_Error"]
  }
  
  func dcalAuthStateChanged(newState state: DCAL.DCALState, withError error: Error?) {
    print("DCAL DELEGATE dcalAuthStateChanged")
    print("dcalAuthStateChanged state: \(state)")
    print("dcalAuthStateChanged error: \(String(describing: error))")
    
    let currentState = DCAL.getState()
    
    var isLN = false
    
    if currentState.contains(DCALState.loggedOut) {
      isLN = false
    } else {
      isLN = currentState.contains(DCALState.loggedIn)
    }
    
    DispatchQueue.main.async {
      self.sendEvent(withName: "DATEV_AuthState_Changed" , body: isLN)
    }
  }
  
  func dcalSession(totalBytesExpectedToSend: Int, totalBytesSent: Int, totalBytesExpectedToReceive: Int, didReceive: Int) {
    print("DCAL DELEGATE dcalSession")
    print("dcalSession totalBytesExpectedToSend: \(totalBytesExpectedToSend)")
    print("dcalSession totalBytesSent: \(totalBytesSent)")
    print("dcalSession totalBytesExpectedToReceive: \(totalBytesExpectedToReceive)")
    print("dcalSession didReceive: \(didReceive)")
  }
  
  @objc public func initialize(
    _ clientId: String,
    clientSecret: String,
    scope: String,
    redirectUri: String,
    useSandbox: Bool
  ) -> Void {
    print("initialize clientId: \(clientId)")
    print("initialize clientSecret: \(clientSecret)")
    print("initialize scope: \(scope)")
    print("initialize redirectUri: \(redirectUri)")
    print("initialize useSandbox: \(useSandbox)")
    
    DCAL.authDelegate = self;
    DCAL.sessionDelegate = self;

    let initResponse = DCAL.initialize(client_id: clientId, client_secret: clientSecret, scope: scope, redirect_URI: redirectUri, use_Sandbox: useSandbox)
    print("DATEV initResponse: \(initResponse)")
    
    isInitialized();
    isLoggedIn();
    isSmartLoginAvailable();
  }
  
  @objc public func handleURL(_ url: URL){
    print("handleURL url: \(url)")
    
    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
      
      let loginHandled = DCAL.handleURL(url: url);
      
      print("handleURL loginHandled: \(loginHandled)")
      let currentState = DCAL.getState()
      
      var isLN = false
      
      if currentState.contains(DCALState.loggedOut) {
        isLN = false
      } else {
        isLN = currentState.contains(DCALState.loggedIn)
      }
      
      DispatchQueue.main.async {
        self.sendEvent(withName: "DATEV_AuthState_Changed" , body: isLN)
      }
      
      /*
      let currentState = DCAL.getState()
      print("handleURL currentState: \(currentState)")
      
      print("handleURL contains loggedOut: \(currentState.contains(DCALState.loggedOut))")
      print("handleURL contains loggedIn: \(currentState.contains(DCALState.loggedIn))")
      print("handleURL contains uninitialized: \(currentState.contains(DCALState.uninitialized))")
      print("handleURL contains initialized: \(currentState.contains(DCALState.initialized))")
      
      if currentState.contains(DCALState.loggedOut) {
        print("handleURL --> loggedOut: \(currentState.contains(DCALState.loggedOut))")
      } else {
        print("handleURL --> loggedIn: \(currentState.contains(DCALState.loggedIn))")
      }
      */
    }
  }
  
  @objc public func isSmartLoginAvailable() -> Void {
    print("isSmartLoginAvailable")
    
    DispatchQueue.main.async {
      let smartLoginAvailable = DCAL.isSmartLoginAvailable();
      self.sendEvent(withName: "DATEV_SMARTLOGIN_AVAILABLE" , body: smartLoginAvailable)
    }
  }
  
  @objc public func isInitialized() -> Void {
    print("isInitialized")

    let currentState = DCAL.getState()

    var result = false;
    if(!currentState.contains(DCALState.uninitialized)) {
        result = currentState.contains(DCALState.initialized);
    }
    
    DispatchQueue.main.async {
      self.sendEvent(withName: "DATEV_IS_INITIALIZED" , body: result)
    }
  }
  
  @objc public func isLoggedIn() -> Void {
    print("isLoggedIn")
    let currentState = DCAL.getState()
    let result = currentState.contains(DCALState.loggedIn);
    
    DispatchQueue.main.async {
      self.sendEvent(withName: "DATEV_AuthState_Changed" , body: result)
    }
  }
  
  @objc public func requestLogin() -> Void {
    print("requestLogin")
    DCAL.requestLogin()
  }
  
  @objc public func requestLogout() -> Void {
    print("requestLogout")
    //DCAL.revokeToken()
    DCAL.requestLogout()
   
    let clean = DCAL.clean()
    print("requestLogout --> clean: \(clean)")
  }
  
  static func stringify(json: Any, prettyPrinted: Bool = false) -> String {
      var options: JSONSerialization.WritingOptions = []
      if prettyPrinted {
        options = JSONSerialization.WritingOptions.prettyPrinted
      }

      do {
        let data = try JSONSerialization.data(withJSONObject: json, options: options)
        if let string = String(data: data, encoding: String.Encoding.utf8) {
          return string
        }
      } catch {
        print(error)
      }

      return ""
  }
}
