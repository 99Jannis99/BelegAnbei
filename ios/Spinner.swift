//
//  Spinner.swift
//  BelegAnbeiDevelopment
//
//  Created by Dieter Stratmann on 03.12.23.
//

import Foundation
import UIKit

@objc(Spinner) class Spinner: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool { return true }
  
  @objc public func show() -> Void {
    print("showSpinner")
  }
  
  @objc public func hide() -> Void {
    print("hideSpinner")
  }
}
