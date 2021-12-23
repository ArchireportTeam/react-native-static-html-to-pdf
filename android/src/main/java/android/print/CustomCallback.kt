package android.print

import android.os.Build
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.Promise
import java.io.File
import java.lang.Exception
import java.lang.RuntimeException


@RequiresApi(Build.VERSION_CODES.KITKAT)
class CustomLayoutCallback: PrintDocumentAdapter.LayoutResultCallback()

@RequiresApi(Build.VERSION_CODES.KITKAT)
class CustomWriteResultCallback(private var promise: Promise,
                                private var file: File): PrintDocumentAdapter.WriteResultCallback(){
  override fun onWriteFinished(pages: Array<out PageRange>?) = try {
    promise.resolve(file.getAbsolutePath());
  }catch (err: Exception){
    promise.reject(err)
  }

  override fun onWriteFailed(error: CharSequence?) {
    promise.reject(RuntimeException(error.toString()))
  }
}
