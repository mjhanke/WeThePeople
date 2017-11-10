//
//  ReactNativeController.m
//  WeThePeople
//
//  Created by Daniel Bennett on 11/4/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "ReactNativeController.h"
#import "WeThePeople-Swift.h"

@interface ReactNativeController ()

@end

@implementation ReactNativeController

- (void)viewDidLoad {
  [super viewDidLoad];

  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(goBack) name:@"dismissViewController" object:nil];
  self.definesPresentationContext = true;
  self.modalPresentationStyle = UIModalPresentationCurrentContext;

}

- (void)addReactView {
  NSURL *jsCodeLocation;
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"WeThePeople"
                                               initialProperties:nil
                                                   launchOptions:nil];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  [self.view addSubview:rootView];
  rootView.frame = self.view.bounds;
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
  // Dispose of any resources that can be recreated.
}

- (void)goBack {
  //[self dismissViewControllerAnimated:YES completion:nil];
  OnboardingController *topicBubbles = [OnboardingController new];

  dispatch_sync(dispatch_get_main_queue(), ^{
    [self.navigationController.navigationBar setBackgroundImage:[UIImage new] forBarMetrics:UIBarMetricsDefault];
    self.navigationController.navigationBar.shadowImage = [UIImage new];
    self.navigationController.navigationBar.translucent = YES;
    self.navigationController.navigationBar.hidden = NO;
    [self.navigationController pushViewController:topicBubbles animated:true];
  });


}

@end
