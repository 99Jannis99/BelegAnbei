//
//  CustomMethods.swift
//  BelegAnbeiDevelopment
//
//  Created by Dieter Stratmann on 03.12.23.
//

import Foundation

struct ConfigProps: Decodable, Encodable {
  var datevEnabled: String
  var datevClientId: String
  var datevClientSecret: String
  var datevScopes: String
  var datevRedirectUri: String
  var datevSandbox: Bool
  
  enum CodingKeys: String, CodingKey {
    case datevEnabled = "datev.enabled"
    case datevClientId = "datev.client_id"
    case datevClientSecret = "datev.client_secret"
    case datevScopes = "datev.scopes"
    case datevRedirectUri = "datev.redirect_uri"
    case datevSandbox = "datev.sandbox"
  }
}

extension Encodable {
    func hasKey(for path: String) -> Bool {
        return Mirror(reflecting: self).children.contains { $0.label == path }
    }
    func value(for path: String) -> Any? {
      return Mirror(reflecting: self).children.first { $0.label == path }?.value
    }
}

@objc(ConfigProperties) class ConfigProperties: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool { return true }
  
  @objc public func prop(
    _ param: String,
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) -> Void {
    print("get prop for KEY: \(param)")
    
    if let path = Bundle.main.path(forResource: "configProperties", ofType: "plist") {
      let fileURL = URL(fileURLWithPath: path)
      do {
        let data = try Data(contentsOf: fileURL)
        let decoder = PropertyListDecoder()
        let configProps = try decoder.decode(ConfigProps.self, from: data)
        //print("prop configProps => \(configProps)")
        //print("prop property testprop => \(configProps.testprop)")
        
        var propResultKey = param;

        if propResultKey.contains("datev.") {
          print("DATEV prop => \(propResultKey)")
          if param.elementsEqual("datev.client_id") {
            propResultKey = "datevClientId"
          } else if param.elementsEqual("datev.client_secret") {
            propResultKey = "datevClientSecret"
          } else if param.elementsEqual("datev.scopes") {
            propResultKey = "datevScopes"
          } else if param.elementsEqual("datev.redirect_uri") {
            propResultKey = "datevRedirectUri"
          } else if param.elementsEqual("datev.sandbox") {
            propResultKey = "datevSandbox"
          } else if param.elementsEqual("datev.enabled") {
            propResultKey = "datevEnabled"
          }
          print("DATEV prop FIXED => \(propResultKey)")
        }
        
        let propResult = configProps.value(for: propResultKey)
        print("prop propResultKey => \(propResultKey) - propResult => \(String(describing: propResult))")
        
        resolve(propResult)
      } catch {
        print("prop configProps error => \(error)")
        resolve("")
      }
    } else {
      print("configProps A error")
      resolve("")
    }
    
  }
  
  func getPlist(withName name: String) -> [String]? {
    print("getPlist  name => \(name)")
      if let path = Bundle.main.path(forResource: name, ofType: "plist"),
         let xml = FileManager.default.contents(atPath: path) {
        print("getPlist  path => \(path)")
          let plistData = try? PropertyListSerialization.propertyList(from: xml, options: .mutableContainersAndLeaves, format: nil)
          return (plistData) as? [String]
      }
      return nil
  }
}
