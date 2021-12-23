import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-static-html-to-pdf' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const StaticHtmlToPdf = NativeModules.StaticHtmlToPdf
  ? NativeModules.StaticHtmlToPdf
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function generatePdf(params: {
  path: string;
  target: string;
  documentName: string;
  width: number;
  height: number;
}): Promise<string> {
  return StaticHtmlToPdf.generatePdf(params);
}
