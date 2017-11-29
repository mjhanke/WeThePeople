package com.wethepeople;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.content.Intent;
import android.app.Activity;

public class BubbleManager extends ReactContextBaseJavaModule {
    public BubbleManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "BubbleManager";
    }

    @ReactMethod
    public void navigateToTopicBubbles() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            Intent intent = new Intent(activity, BubblesActivity.class);
            activity.startActivity(intent);
        }
    }
}