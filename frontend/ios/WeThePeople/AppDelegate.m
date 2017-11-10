/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Firebase.h>
#import "ReactNativeController.h"
#import "WeThePeople-Swift.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];

  ReactNativeController *reactController = [ReactNativeController new];
  UINavigationController *navController = [UINavigationController new];
  [navController pushViewController:reactController animated:false];
  [reactController addReactView];
  navController.navigationBar.hidden = YES;
  self.window.rootViewController = navController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
