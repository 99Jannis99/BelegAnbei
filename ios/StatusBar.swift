//
//  CustomMethods.swift
//  BelegAnbeiDevelopment
//
//  Created by Dieter Stratmann on 03.12.23.
//

import Foundation

@objc(StatusBar) class StatusBar: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool { return true }
  
  @objc public func setColor(_ colorHex: String) -> Void {
    print("setColor: \(colorHex) not needed - for iOS usage of safeViewArea")
  }
}
