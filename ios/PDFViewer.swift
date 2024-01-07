//
//  PDFViewer.swift
//  BelegAnbeiDevelopment
//
//  Created by Dieter Stratmann on 03.12.23.
//

import Foundation
import UIKit

@objc(PDFViewer) class PDFViewer: NSObject, BAPDFViewerDelegate {
  func resultPDFView(resultCode: NSInteger, resultString: NSString) {
    print("PDFViewer resultPDFView delegate result resultCode \(resultCode) resultString \(resultString)")
  }
  
  @objc static func requiresMainQueueSetup() -> Bool { return true }
  
  @objc public func show(_ pdfSource: String, bgColor: String, textColor: String) {
    print("PDFViewer show pdfSource \(pdfSource)")
    print("PDFViewer show bgColor \(bgColor)")
    print("PDFViewer show textColor \(textColor)")
    
    DispatchQueue.main.async {
      let root = RCTPresentedViewController();
      let pdfViewerVC = BAPDFViewerViewController()

      pdfViewerVC.pdfSource = pdfSource;
      pdfViewerVC.useBackgroundColor = bgColor;
      pdfViewerVC.useTextColor = textColor;

      pdfViewerVC.delegate = self;
      
      root?.present(pdfViewerVC, animated: true)
    }
  }
}
