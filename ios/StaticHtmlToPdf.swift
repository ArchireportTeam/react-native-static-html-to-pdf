import Foundation
import WebKit


extension WKWebView {
    
    // Call this function when WKWebView finish loading
    func exportAsPdfFromWebView(width: Float, height: Float, documentName: String?) -> String {
        let pdfData = createPdfFile(printFormatter: self.viewPrintFormatter(), width: width, height: height)
        return self.saveWebViewPdf(data: pdfData, documentName: documentName)
    }
    
    func createPdfFile(printFormatter: UIViewPrintFormatter, width: Float, height: Float) -> NSMutableData {
        
        let originalBounds = self.bounds
        self.bounds = CGRect(x: originalBounds.origin.x, y: bounds.origin.y, width: self.bounds.size.width, height: self.scrollView.contentSize.height)
        let pdfPageFrame = CGRect(x: 0, y: 0, width: CGFloat(width), height: CGFloat(height))
        let printPageRenderer = UIPrintPageRenderer()
        printPageRenderer.addPrintFormatter(printFormatter, startingAtPageAt: 0)
        printPageRenderer.setValue(NSValue(cgRect: pdfPageFrame), forKey: "paperRect")
        printPageRenderer.setValue(NSValue(cgRect: pdfPageFrame), forKey: "printableRect")
        self.bounds = originalBounds
        return printPageRenderer.generatePdfData()
    }
    
    // Save pdf file in document directory
    func saveWebViewPdf(data: NSMutableData, documentName: String?) -> String {
        
        let paths = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)
        let docDirectoryPath = paths[0]
        let pdfPath = docDirectoryPath.appendingPathComponent(documentName ?? "output.pdf")
        if data.write(to: pdfPath, atomically: true) {
            return pdfPath.path
        } else {
            return ""
        }
    }
}

extension UIPrintPageRenderer {
    
    func generatePdfData() -> NSMutableData {
        let pdfData = NSMutableData()
        UIGraphicsBeginPDFContextToData(pdfData, self.paperRect, nil)
        self.prepare(forDrawingPages: NSMakeRange(0, self.numberOfPages))
        let printRect = UIGraphicsGetPDFContextBounds()
        for pdfPage in 0..<self.numberOfPages {
            UIGraphicsBeginPDFPage()
            self.drawPage(at: pdfPage, in: printRect)
        }
        UIGraphicsEndPDFContext();
        return pdfData
    }
}





@objc(StaticHtmlToPdf)
class StaticHtmlToPdf: RCTView, WKNavigationDelegate {
    
    var target: String = ""
    var documentName: String?
    var height: Float = 0
    var width: Float = 0
    var resolve: RCTPromiseResolveBlock? = nil
    
    
    private var wkWebView: WKWebView?;
    
    
    override init(frame: CGRect){
        super.init(frame:frame)
        
        self.wkWebView = WKWebView(frame:CGRect(x: 0, y: 0, width: 600, height: 800));
        self.wkWebView?.navigationDelegate = self;
        self.wkWebView?.configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        self.addSubview(self.wkWebView!)
        
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        self.wkWebView = WKWebView(frame: self.bounds);
        self.wkWebView?.navigationDelegate = self;
        self.wkWebView?.configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        self.addSubview(self.wkWebView!)
    }
    
    
    
    @objc(generatePdf:withResolver:withRejecter:)
    func generatePdf(params: NSDictionary,   resolve: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        
        if let path = params["path"] as? String, let target = params["target"] as? String, let documentName = params["documentName"] as? String, let width = params["width"] as? Float, let height = params["height"] as? Float {
            self.target = target
            self.documentName = documentName
            self.resolve = resolve
            self.width = width
            self.height = height
            
            let indexFileUrl = URL(fileURLWithPath: path)
            DispatchQueue.global(qos: .background).async {
                DispatchQueue.main.async {
                    self.wkWebView?.loadFileURL(indexFileUrl, allowingReadAccessTo: indexFileUrl.deletingLastPathComponent())
                }
            }
            
        } else {
            reject("E_INVALID_ARGUMENTS", "Expected path, target, documentName, width and height.",  nil)
        }
    }
    
    
    
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        
        var action: WKNavigationActionPolicy?
        
        defer {
            decisionHandler(action ?? .allow)
        }
        
        guard let url = navigationAction.request.url else { return }
        
        
        if url.absoluteString.hasPrefix(self.target) {
            let pdfFilePath = webView.exportAsPdfFromWebView(width: self.width, height: self.height, documentName: self.documentName)
            
            if self.resolve != nil{
                self.resolve!(pdfFilePath)
            }
            
            action = .cancel
        }
    }
    
}



