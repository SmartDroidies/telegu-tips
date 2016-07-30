package com.smart.droid.firebase;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.google.firebase.analytics.FirebaseAnalytics;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.iid.FirebaseInstanceId;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Firebase extends CordovaPlugin {

    private FirebaseAnalytics mFirebaseAnalytics;
    private final String TAG = "SmartFirebase";

    public static final String MSG_RECEIVED_BROADCAST_KEY = "MESSAGE_RECEIVED";
    public static final String LAST_PUSH_KEY = "LAST_PUSH";

    @Override
    protected void pluginInitialize() {
        final Context context = this.cordova.getActivity().getApplicationContext();
        this.cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                //Log.d(TAG, "Starting Firebase plugin");
                mFirebaseAnalytics = FirebaseAnalytics.getInstance(context);
                FirebaseMessaging.getInstance().subscribeToTopic("global");
            }
        });

        if (mMessageReceiver != null) {
            LocalBroadcastManager.getInstance(cordova.getActivity()).registerReceiver(mMessageReceiver,
                    new IntentFilter(MSG_RECEIVED_BROADCAST_KEY));
        }
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("getInstanceId")) {
            this.getInstanceId(callbackContext);
            return true;
        } else if (action.equals("subscribe")) {
            //this.subscribe(callbackContext, args.getString(0));
            return true;
        } else if (action.equals("unsubscribe")) {
            //this.unsubscribe(callbackContext, args.getString(0));
            return true;
        } else if (action.equals("onNotificationOpen")) {
            //this.registerOnNotificationOpen(callbackContext);
            return true;
        } else if (action.equals("trackEvent")) {
            this.trackEvent(callbackContext, args.getString(0), args.getString(1));
            return true;
        }
        return false;
    }


    private void trackEvent(final CallbackContext callbackContext, final String key, final String value) {
        final Bundle params = new Bundle();
        params.putString(key, value);
        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                try {
                    mFirebaseAnalytics.logEvent(key, params);
                    callbackContext.success();
                } catch (Exception e) {
                    callbackContext.error(e.getMessage());
                }
            }
        });
    }

    private void getInstanceId(final CallbackContext callbackContext) {
        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                try {
                    String token = FirebaseInstanceId.getInstance().getToken();
                    callbackContext.success(token);
                } catch (Exception e) {
                    callbackContext.error(e.getMessage());
                }
            }
        });
    }

    private BroadcastReceiver mMessageReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            //Log.d(TAG, "Broadcast Message Recieved. Trigger Java Script");
            sendPushToJavascript(intent.getStringExtra("data"));
        }
    };

    private void sendPushToJavascript(String data) {
        Log.d(TAG, "sendPushToJavascript: " + data);

        if (data != null) {
            //We remove the last saved push since we're sending one.
            SharedPreferences sharedPreferences =
                    PreferenceManager.getDefaultSharedPreferences(cordova.getActivity());
            sharedPreferences.edit().remove(LAST_PUSH_KEY).apply();

            final String js = "javascript:onNotification(" + JSONObject.quote(data).toString() + ")";
            webView.getEngine().loadUrl(js, false);
        }
    }


    @Override
    public Object onMessage(String id, Object data) {
        if (id.equals("onPageFinished")) {
            //This here is to catch throw the notification once the app has been down.
            //TODO: Maybe there is a better place to do this ? or another way to do this ?
            SharedPreferences sharedPreferences =
                    PreferenceManager.getDefaultSharedPreferences(cordova.getActivity());

            String lastPush = sharedPreferences.getString(LAST_PUSH_KEY, null);
            if (lastPush != null) {
                sendPushToJavascript(lastPush);
            }
        }
        return super.onMessage(id, data);
    }

}