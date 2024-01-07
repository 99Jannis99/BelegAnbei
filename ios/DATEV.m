//
//  DATEV.m
//  BelegAnbeiDevelopment
//
//  Created by Dieter Stratmann on 03.12.23.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(DATEV, NSObject)
RCT_EXTERN_METHOD(initialize:
  (NSString *)clientId
  clientSecret:(NSString *)clientSecret
  scope:(NSString *)scope
  redirectUri:(NSString *)redirectUri
  useSandbox:(BOOL *)useSandbox
)
RCT_EXTERN_METHOD(isSmartLoginAvailable)
RCT_EXTERN_METHOD(isInitialized)
RCT_EXTERN_METHOD(isLoggedIn)
RCT_EXTERN_METHOD(handleURL:
  (NSURL *)url
)
RCT_EXTERN_METHOD(requestLogin)
RCT_EXTERN_METHOD(requestLogout)
@end

