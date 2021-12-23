package com.reactnativestatichtmltopdf

import android.content.Context
import com.facebook.react.bridge.Promise
import android.webkit.WebView
import androidx.webkit.WebViewAssetLoader
import java.io.File
import android.net.Uri
import android.os.Build
import android.print.CustomLayoutCallback
import android.print.CustomWriteResultCallback
import android.print.PageRange

import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import androidx.annotation.RequiresApi
import android.webkit.WebViewClient
import android.print.PrintAttributes
import android.print.PrintAttributes.Resolution
import android.os.ParcelFileDescriptor


class StaticHtmlToPdfConverterParams(private var path: String, private var target: String, private var documentName: String, private var height: Double, private var width: Double) {

  fun getPath(): String {
    return path
  }

  fun getTarget(): String {
    return target
  }

  fun getDocumentName(): String {
    return documentName
  }

  fun getWidth(): Double {
    return width
  }

  fun getHeight(): Double {
    return height
  }
}


open class StaticHtmlToPdfConverter(private var context: Context, private var promise: Promise, private var params: StaticHtmlToPdfConverterParams) : Runnable {

  fun outputFile(): File {
    val outputDir = context.cacheDir
    val result = File(outputDir, params.getDocumentName())
    result.createNewFile()
    return result
  }

  override fun run() {

    val webView = WebView(context)
    val publicDir = File(context.filesDir, "public")
    val assetLoader = WebViewAssetLoader.Builder().addPathHandler("/public/", WebViewAssetLoader.InternalStoragePathHandler(context, publicDir)).build()

    webView.webViewClient = object : WebViewClient() {
      @RequiresApi(21)
      override fun shouldInterceptRequest(view: WebView,
                                          request: WebResourceRequest): WebResourceResponse? {
        return assetLoader.shouldInterceptRequest(request.url)
      }

      // for API < 21
      override fun shouldInterceptRequest(view: WebView,
                                          request: String): WebResourceResponse? {
        return assetLoader.shouldInterceptRequest(Uri.parse(request))
      }

      @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
      override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {

        if (request.url.toString().contains(params.getTarget())) {

          val documentAdapter = webView.createPrintDocumentAdapter(params.getDocumentName())
          val printAttributes = PrintAttributes.Builder().setMediaSize(PrintAttributes.MediaSize.ISO_A4)
            .setResolution(Resolution("RESOLUTION_ID", "RESOLUTION_ID", 600, 600)).setMinMargins(PrintAttributes.Margins.NO_MARGINS).build()
          with(documentAdapter) {
            onLayout(null,
              printAttributes,
              null,
              CustomLayoutCallback(),
              null)
            val pdfOutputFile = outputFile()


            onWrite(Array(1) { PageRange.ALL_PAGES }, ParcelFileDescriptor.open(pdfOutputFile,
              ParcelFileDescriptor.MODE_TRUNCATE or ParcelFileDescriptor.MODE_READ_WRITE),
              null, CustomWriteResultCallback(promise, pdfOutputFile))
          }

        }
        return true
      }

      // for API < 21
      @RequiresApi(Build.VERSION_CODES.KITKAT)
      override fun shouldOverrideUrlLoading(view: WebView, request: String): Boolean {

        if (request.contains(params.getTarget())) {

          val documentAdapter = webView.createPrintDocumentAdapter()
          val printAttributes = PrintAttributes.Builder().setMediaSize(PrintAttributes.MediaSize("custom", "CUSTOM",
            (params.getWidth() * 1000 / 72.0).toInt(),
            (params.getHeight() * 1000 / 72.0).toInt()))
            .setResolution(Resolution("RESOLUTION_ID", "RESOLUTION_ID", 600, 600)).build()
          with(documentAdapter) {
            onLayout(null,
              printAttributes,
              null,
              CustomLayoutCallback(),
              null)
            val pdfOutputFile = outputFile()


            onWrite(Array(1) { PageRange.ALL_PAGES }, ParcelFileDescriptor.open(pdfOutputFile,
              ParcelFileDescriptor.MODE_TRUNCATE or ParcelFileDescriptor.MODE_READ_WRITE),
              null, CustomWriteResultCallback(promise, pdfOutputFile))
          }

        }

        return false
      }

    }


    val settings = webView.settings
    settings.textZoom = 100
    settings.defaultTextEncodingName = "utf-8"
    settings.javaScriptEnabled = true
    webView.loadUrl("https://" + WebViewAssetLoader.DEFAULT_DOMAIN + params.getPath().replace(context.filesDir.path, "").replace("file://", ""))

  }
}
