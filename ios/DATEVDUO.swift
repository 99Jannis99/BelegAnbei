//
//  DATEVDUO.swift
//  BelegAnbeiDevelopment
//
//  Created by Dieter Stratmann on 03.12.23.
//

import Foundation
import DCAL

@objc(DATEVDUO) class DATEVDUO: RCTEventEmitter {
  @objc override static func requiresMainQueueSetup() -> Bool { return true }
  
  override func supportedEvents() -> [String]! {
    return ["DATEV_DATA_USERDATA", "DATEV_DUO_CLIENTS", "DATEV_DUO_CLIENT_DOCUMENT_TYPES"]
  }
  
  @objc public func userdata(
    _ clientId: String,
    useSandbox: Bool
  ) -> Void {
    print("initialize clientId: \(clientId)")
    print("initialize useSandbox: \(useSandbox)")
    
    var clientResult:String = ""
    var requestURL:String = "https://api.datev.de/userinfo"
    
    if(useSandbox) {
        requestURL = "https://sandbox-api.datev.de/userinfo";
    }
    print("userdata requestURL: \(requestURL)")
    
    
    do {
      let session = try DCAL.createSession()
      if let url = URL(string: requestURL) {
        let task = session.dataTask(with: url) {(data, response, error) in
          guard let data = data, error == nil else {
            print("Fehler beim Laden von \(requestURL)", String(describing: error))

            let result: [String: Any] = [
              "code": 404,
              "data": error ?? ""
            ]
            
            DispatchQueue.main.async {
              self.sendEvent(withName: "DATEV_DATA_USERDATA" , body: DATEV.stringify(json: result))
            }

            return
          }

          clientResult = String(data: data, encoding: .utf8)!

          if let httpResponse = response as? HTTPURLResponse {

            let dataJson = clientResult.data(using: .utf8)!
            let json = try? JSONSerialization.jsonObject(with: dataJson, options: [])

            if httpResponse.statusCode == 200 {
              
              let result: [String: Any] = [
                "code": 201,
                "data": json!
              ]
              
              DispatchQueue.main.async {
                self.sendEvent(withName: "DATEV_DATA_USERDATA" , body: DATEV.stringify(json: result))
              }
              
              print("userdata userinfoResult: \(String(describing: json))")
            } else {
              
              let result: [String: Any] = [
                "code": httpResponse.statusCode,
                "data": json!
              ]
              
              DispatchQueue.main.async {
                self.sendEvent(withName: "DATEV_DATA_USERDATA" , body: DATEV.stringify(json: result))
              }
            }
          } else {
            print("userdata userinfoResult500: Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!")
            
            let result: [String: Any] = [
              "code": 500,
              "data": "Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!"
            ]
            
            DispatchQueue.main.async {
              self.sendEvent(withName: "DATEV_DATA_USERDATA" , body: DATEV.stringify(json: result))
            }
          }
        }
        
        task.resume()
      }
    } catch {
      print("Get Userdata ERROR");
      print("userdata userinfoResult500x: Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!")
      
      let result: [String: Any] = [
        "code": 501,
        "data": "Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!"
      ]
      
      DispatchQueue.main.async {
        self.sendEvent(withName: "DATEV_DATA_USERDATA" , body: DATEV.stringify(json: result))
      }
    }
  }
  
  @objc public func clients(
    _ clientId: String,
    skip: Int,
    top: Int,
    useSandbox: Bool
  ) -> Void {
    print("initialize clientId: \(clientId)")
    print("initialize skip: \(skip)")
    print("initialize top: \(top)")
    print("initialize useSandbox: \(useSandbox)")
    
    var clientResult:String = ""
    var requestURL:String = "https://accounting-clients.api.datev.de/platform/v2/clients"
    
    if(useSandbox) {
        requestURL = "https://accounting-clients.api.datev.de/platform-sandbox/v2/clients";
    }
    
    requestURL.append("?skip=")
    requestURL.append(String(skip))
    requestURL.append("&top=")
    requestURL.append(String(top))
    
    print("clients requestURL: \(requestURL)")
    
    do {
      let session = try DCAL.createSession()
      if let url = URL(string: requestURL) {
        
        let headers = [
          "X-DATEV-Client-Id": clientId,
          "accept": "application/json;charset=utf-8"
        ]

        let request = NSMutableURLRequest(url: url, cachePolicy: .useProtocolCachePolicy, timeoutInterval: 10.0)
        request.httpMethod = "GET"
        request.allHTTPHeaderFields = headers
        
        //var request = URLRequest(url: url)
        //request.setValue(clientId, forHTTPHeaderField: "X-DATEV-Client-Id")
        //request.addValue(clientId, forHTTPHeaderField: "X-DATEV-Client-Id")
        
        let task = session.dataTask(with: request as URLRequest) {(data, response, error) in
          guard let data = data, error == nil else {
            print("Fehler beim Laden von \(requestURL)", String(describing: error))

            let result: [String: Any] = [
              "code": 404,
              "data": error ?? ""
            ]
            
            DispatchQueue.main.async {
              self.sendEvent(withName: "DATEV_DUO_CLIENTS" , body: DATEV.stringify(json: result))
            }

            return
          }

          clientResult = String(data: data, encoding: .utf8)!

          if let httpResponse = response as? HTTPURLResponse {
            print("allHeaderFields \(httpResponse.allHeaderFields)")
            let totalItems = httpResponse.value(forHTTPHeaderField: "Total-Items")
            print("totalItems \(String(describing: totalItems))")
            
            let dataJson = clientResult.data(using: .utf8)!
            let json = try? JSONSerialization.jsonObject(with: dataJson, options: [])

            if httpResponse.statusCode == 200 {
              let resultBody: [String: Any] = [
                "total": Int(totalItems!) ?? 0,
                "items": json!
              ]
              
              let result: [String: Any] = [
                "code": 201,
                "data": resultBody
              ]
              
              DispatchQueue.main.async {
                self.sendEvent(withName: "DATEV_DUO_CLIENTS" , body: DATEV.stringify(json: result))
              }
              
              print("userdata userinfoResult: \(String(describing: json))")
            } else {
              
              let result: [String: Any] = [
                "code": httpResponse.statusCode,
                "data": json!
              ]
              
              DispatchQueue.main.async {
                self.sendEvent(withName: "DATEV_DUO_CLIENTS" , body: DATEV.stringify(json: result))
              }
            }
          } else {
            print("userdata userinfoResult500: Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!")
            
            let result: [String: Any] = [
              "code": 500,
              "data": "Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!"
            ]
            
            DispatchQueue.main.async {
              self.sendEvent(withName: "DATEV_DUO_CLIENTS" , body: DATEV.stringify(json: result))
            }
          }
        }
        
        task.resume()
      }
    } catch {
      print("Get Userdata ERROR");
      print("userdata userinfoResult500x: Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!")
      
      let result: [String: Any] = [
        "code": 501,
        "data": "Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!"
      ]
      
      DispatchQueue.main.async {
        self.sendEvent(withName: "DATEV_DUO_CLIENTS" , body: DATEV.stringify(json: result))
      }
    }
  }
  
  @objc public func clientDocumentTypes(
    _ clientId: String,
    client: String,
    useSandbox: Bool
  ) -> Void {
    print("clientDocumentTypes clientId: \(clientId)")
    print("clientDocumentTypes client: \(client)")
    print("clientDocumentTypes useSandbox: \(useSandbox)")
    
    var clientResult:String = ""
    var requestURL:String = "https://accounting-documents.api.datev.de/platform/v2/clients/" + client + "/document-types"
    
    if(useSandbox) {
        requestURL = "https://accounting-documents.api.datev.de/platform-sandbox/v2/clients/" + client + "/document-types";
    }
    
    print("clients requestURL: \(requestURL)")
    
    do {
      let session = try DCAL.createSession()
      if let url = URL(string: requestURL) {
        
        let headers = [
          "X-DATEV-Client-Id": clientId,
          "accept": "application/json;charset=utf-8"
        ]

        let request = NSMutableURLRequest(url: url, cachePolicy: .useProtocolCachePolicy, timeoutInterval: 10.0)
        request.httpMethod = "GET"
        request.allHTTPHeaderFields = headers
        
        //var request = URLRequest(url: url)
        //request.setValue(clientId, forHTTPHeaderField: "X-DATEV-Client-Id")
        //request.addValue(clientId, forHTTPHeaderField: "X-DATEV-Client-Id")
        
        let task = session.dataTask(with: request as URLRequest) {(data, response, error) in
          guard let data = data, error == nil else {
            print("Fehler beim Laden von \(requestURL)", String(describing: error))

            let result: [String: Any] = [
              "code": 404,
              "data": error ?? ""
            ]
            
            DispatchQueue.main.async {
              self.sendEvent(withName: "DATEV_DUO_CLIENT_DOCUMENT_TYPES" , body: DATEV.stringify(json: result))
            }

            return
          }

          clientResult = String(data: data, encoding: .utf8)!

          if let httpResponse = response as? HTTPURLResponse {
            print("allHeaderFields \(httpResponse.allHeaderFields)")
            
            let dataJson = clientResult.data(using: .utf8)!
            let json = try? JSONSerialization.jsonObject(with: dataJson, options: [])

            if httpResponse.statusCode == 200 {
              let resultBody: [String: Any] = [
                "client": client,
                "items": json!
              ]
              
              let result: [String: Any] = [
                "code": 201,
                "data": resultBody
              ]
              
              DispatchQueue.main.async {
                self.sendEvent(withName: "DATEV_DUO_CLIENT_DOCUMENT_TYPES" , body: DATEV.stringify(json: result))
              }
              
              print("userdata userinfoResult: \(String(describing: json))")
            } else {
              
              let result: [String: Any] = [
                "code": httpResponse.statusCode,
                "data": json!
              ]
              
              DispatchQueue.main.async {
                self.sendEvent(withName: "DATEV_DUO_CLIENT_DOCUMENT_TYPES" , body: DATEV.stringify(json: result))
              }
            }
          } else {
            print("userdata userinfoResult500: Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!")
            
            let result: [String: Any] = [
              "code": 500,
              "data": "Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!"
            ]
            
            DispatchQueue.main.async {
              self.sendEvent(withName: "DATEV_DUO_CLIENT_DOCUMENT_TYPES" , body: DATEV.stringify(json: result))
            }
          }
        }
        
        task.resume()
      }
    } catch {
      print("Get Userdata ERROR");
      print("userdata userinfoResult500x: Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!")
      
      let result: [String: Any] = [
        "code": 501,
        "data": "Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!"
      ]
      
      DispatchQueue.main.async {
        self.sendEvent(withName: "DATEV_DUO_CLIENTS" , body: DATEV.stringify(json: result))
      }
    }
  }
}
