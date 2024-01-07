//
//  DATEVDMS.m
//  BelegAnbeiDevelopment
//
//  Created by Dieter Stratmann on 03.12.23.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(DATEVDMS, NSObject)
RCT_EXTERN_METHOD(clients:
  (NSString *)clientId
  term:(NSString *)term
  skip:(int *)skip
  top:(int *)top
  useSandbox:(BOOL *)useSandbox
)
RCT_EXTERN_METHOD(clientTaxYears:
  (NSString *)clientId
  client:(NSString *)client
  useSandbox:(BOOL *)useSandbox
)
RCT_EXTERN_METHOD(clientTaxYearFolders:
  (NSString *)clientId
  client:(NSString *)client
  year:(int *)year
  useSandbox:(BOOL *)useSandbox
)
@end

