//
//  StatusBar.m
//  BelegAnbeiDevelopment
//
//  Created by Dieter Stratmann on 03.12.23.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(StatusBar, NSObject)
  RCT_EXTERN_METHOD(setColor: (NSString *))
@end
