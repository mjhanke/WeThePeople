//
//  DismissViewControllerManager.m
//  WeThePeople
//
//  Created by Daniel Bennett on 11/4/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "DismissViewControllerManager.h"

@implementation DismissViewControllerManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(goBack)
{
  [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:@"dismissViewController" object:nil]];
}

@end
