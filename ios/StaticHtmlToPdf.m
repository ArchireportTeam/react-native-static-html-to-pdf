#import <React/RCTBridgeModule.h>
#import <React/RCTView.h>
#import <WebKit/WebKit.h>

@interface RCT_EXTERN_MODULE(StaticHtmlToPdf, RCTView)

RCT_EXTERN_METHOD(generatePdf:(NSDictionary *)params
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

@end
