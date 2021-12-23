package com.reactnativestatichtmltopdf

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap


import android.os.Handler;


class StaticHtmlToPdfModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "StaticHtmlToPdf"
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun generatePdf(params: ReadableMap, promise: Promise) {
    var path = params.getString("path");
    var targetPath = params.getString("target");
    var documentName = params.getString("documentName");
    var height = params.getDouble("height");
    var width = params.getDouble("width");

    if (path === null || targetPath === null || documentName === null || width === null || height === null) {
      promise.reject("StaticHtmlToPdf", "Please provide a path, a target, a document name, a width and a height");
    } else {
      var converter = StaticHtmlToPdfConverter(getReactApplicationContext(), promise, StaticHtmlToPdfConverterParams(path, targetPath, documentName, width, height));
      var handler = Handler(getReactApplicationContext().getMainLooper());
      handler.post(converter);
    }
  }


}
