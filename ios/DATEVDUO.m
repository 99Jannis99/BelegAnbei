//
//  DATEVDUO.m
//  BelegAnbeiDevelopment
//
//  Created by Dieter Stratmann on 03.12.23.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(DATEVDUO, NSObject)
RCT_EXTERN_METHOD(userdata:
  (NSString *)clientId
  useSandbox:(BOOL *)useSandbox
)
RCT_EXTERN_METHOD(clients:
  (NSString *)clientId
  skip:(int *)skip
  top:(int *)top
  useSandbox:(BOOL *)useSandbox
)
RCT_EXTERN_METHOD(clientDocumentTypes:
  (NSString *)clientId
  client:(NSString *)client
  useSandbox:(BOOL *)useSandbox
)
@end

