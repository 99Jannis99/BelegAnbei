//
//  DATEVDUO.swift
//  BelegAnbeiDevelopment
//
//  Created by Dieter Stratmann on 03.12.23.
//

import Foundation
import DCAL

@objc(DATEVDMS) class override: RCTEventEmitter {
  @objc override static func requiresMainQueueSetup() -> Bool { return true }
  
  override func supportedEvents() -> [String]! {
    return ["DATEV_DMS_CLIENTS", "DATEV_DMS_CLIENT_TAX_YEARS", "DATEV_DMS_CLIENT_TAX_YEAR_FOLDERS"]
  }
  
  @objc public func clients(
    _ clientId: String,
    term: String,
    skip: Int,
    top: Int,
    useSandbox: Bool
  ) -> Void {
    print("clients clientId: \(clientId)")
    print("clients term: \(term)")
    print("clients skip: \(skip)")
    print("clients top: \(top)")
    print("clients useSandbox: \(useSandbox)")
    
    var clientResult:String = ""
    var requestURL:String = "https://mytax-income-tax-documents.api.datev.de/platform/v1/clients"

    if(useSandbox) {
        requestURL = "https://mytax-income-tax-documents.api.datev.de/platform-sandbox/v1/clients";
    }
    
    requestURL.append("?skip=")
    requestURL.append(String(skip))
    requestURL.append("&top=")
    requestURL.append(String(top))
    requestURL.append("&search-text=")
    requestURL.append(String(term))
    
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
              self.sendEvent(withName: "DATEV_DMS_CLIENTS" , body: DATEV.stringify(json: result))
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
                self.sendEvent(withName: "DATEV_DMS_CLIENTS" , body: DATEV.stringify(json: result))
              }
              
              print("userdata userinfoResult: \(String(describing: json))")
            } else {
              
              let result: [String: Any] = [
                "code": httpResponse.statusCode,
                "data": json!
              ]
              
              DispatchQueue.main.async {
                self.sendEvent(withName: "DATEV_DMS_CLIENTS" , body: DATEV.stringify(json: result))
              }
            }
          } else {
            print("userdata userinfoResult500: Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!")
            
            let result: [String: Any] = [
              "code": 500,
              "data": "Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!"
            ]
            
            DispatchQueue.main.async {
              self.sendEvent(withName: "DATEV_DMS_CLIENTS" , body: DATEV.stringify(json: result))
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
        self.sendEvent(withName: "DATEV_DMS_CLIENTS" , body: DATEV.stringify(json: result))
      }
    }
  }
  
  @objc public func clientTaxYears(
    _ clientId: String,
    client: String,
    useSandbox: Bool
  ) -> Void {
    print("clientTaxYears clientId: \(clientId)")
    print("clientTaxYears client: \(client)")
    print("clientTaxYears useSandbox: \(useSandbox)")
    
    var clientResult:String = ""
    var requestURL:String = "https://mytax-income-tax-documents.api.datev.de/platform/v1/clients/" + client + "/tax-years"
    
    if(useSandbox) {
        requestURL = "https://mytax-income-tax-documents.api.datev.de/platform-sandbox/v1/clients/" + client + "/tax-years";
    }
    
    print("clientTaxYears requestURL: \(requestURL)")
    
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
              self.sendEvent(withName: "DATEV_DMS_CLIENT_TAX_YEARS" , body: DATEV.stringify(json: result))
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
                "years": json!
              ]
              
              let result: [String: Any] = [
                "code": 201,
                "data": resultBody
              ]
              
              DispatchQueue.main.async {
                self.sendEvent(withName: "DATEV_DMS_CLIENT_TAX_YEARS" , body: DATEV.stringify(json: result))
              }
              
              print("userdata userinfoResult: \(String(describing: json))")
            } else {
              
              let result: [String: Any] = [
                "code": httpResponse.statusCode,
                "data": json!
              ]
              
              DispatchQueue.main.async {
                self.sendEvent(withName: "DATEV_DMS_CLIENT_TAX_YEARS" , body: DATEV.stringify(json: result))
              }
            }
          } else {
            print("userdata userinfoResult500: Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!")
            
            let result: [String: Any] = [
              "code": 500,
              "data": "Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!"
            ]
            
            DispatchQueue.main.async {
              self.sendEvent(withName: "DATEV_DMS_CLIENT_TAX_YEARS" , body: DATEV.stringify(json: result))
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
        self.sendEvent(withName: "DATEV_DMS_CLIENT_TAX_YEARS" , body: DATEV.stringify(json: result))
      }
    }
  }
  
  @objc public func clientTaxYearFolders(
    _ clientId: String,
    client: String,
    year: Int,
    useSandbox: Bool
  ) -> Void {
    print("clientTaxYears clientId: \(clientId)")
    print("clientTaxYears client: \(client)")
    print("clientTaxYears year: \(year)")
    print("clientTaxYears useSandbox: \(useSandbox)")
    
    var clientResult:String = ""
    var requestURL:String = "https://mytax-income-tax-documents.api.datev.de/platform/v1/clients/";

    if(useSandbox) {
        requestURL = "https://mytax-income-tax-documents.api.datev.de/platform-sandbox/v1/clients/";
    }
    
    requestURL.append(client)
    requestURL.append("/tax-years/")
    requestURL.append(String(year))
    requestURL.append("/folders")
    
    print("clientTaxYearFolders requestURL: \(requestURL)")
    
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
              self.sendEvent(withName: "DATEV_DMS_CLIENT_TAX_YEAR_FOLDERS" , body: DATEV.stringify(json: result))
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
                "year": year,
                "folders": json!
              ]
              
              let result: [String: Any] = [
                "code": 201,
                "data": resultBody
              ]
              
              DispatchQueue.main.async {
                self.sendEvent(withName: "DATEV_DMS_CLIENT_TAX_YEAR_FOLDERS" , body: DATEV.stringify(json: result))
              }
              
              print("userdata userinfoResult: \(String(describing: json))")
            } else {
              
              let result: [String: Any] = [
                "code": httpResponse.statusCode,
                "data": json!
              ]
              
              DispatchQueue.main.async {
                self.sendEvent(withName: "DATEV_DMS_CLIENT_TAX_YEAR_FOLDERS" , body: DATEV.stringify(json: result))
              }
            }
          } else {
            print("userdata userinfoResult500: Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!")
            
            let result: [String: Any] = [
              "code": 500,
              "data": "Anfrage abgelehnt. Wahrscheinlich nicht angemeldet!"
            ]
            
            DispatchQueue.main.async {
              self.sendEvent(withName: "DATEV_DMS_CLIENT_TAX_YEAR_FOLDERS" , body: DATEV.stringify(json: result))
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
        self.sendEvent(withName: "DATEV_DMS_CLIENT_TAX_YEAR_FOLDERS" , body: DATEV.stringify(json: result))
      }
    }
  }
}
