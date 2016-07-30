package com.smart.droid.firebase;

import android.app.Activity;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

/**
 * Created by prasathbasuvaraj on 17/07/16.
 */

public class FCMActivity extends Activity {

    private static final String TAG = "SmartFirebase";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Bundle extras = getIntent().getExtras();

        if (extras != null) {
            String notificationExtras = extras.getString("extras");

            Intent intent = new Intent(Firebase.MSG_RECEIVED_BROADCAST_KEY);
            intent.putExtra("data", notificationExtras);

            //Log.d(TAG, "Booting FCMActivity with data: " + notificationExtras);

            SharedPreferences sharedPreferences =
                    PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
            sharedPreferences.edit().putString(Firebase.LAST_PUSH_KEY, notificationExtras).commit();

            LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
        }
        finish();
        forceMainActivityReload();
    }

    private void forceMainActivityReload() {
        PackageManager pm = getPackageManager();
        Intent launchIntent = pm.getLaunchIntentForPackage(getApplicationContext().getPackageName());
        startActivity(launchIntent);
    }

    @Override
    protected void onResume() {
        super.onResume();
        final NotificationManager notificationManager = (NotificationManager) this.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancelAll();
    }

}
