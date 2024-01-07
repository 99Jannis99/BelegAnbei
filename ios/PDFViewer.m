//
//  PDFViewer.m
//  BelegAnbeiDevelopment
//
//  Created by Dieter Stratmann on 03.12.23.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(PDFViewer, NSObject)
RCT_EXTERN_METHOD(show:
  (NSString *)pdfSource
  bgColor:(NSString *)bgColor
  textColor:(NSString *)textColor
)
@end
