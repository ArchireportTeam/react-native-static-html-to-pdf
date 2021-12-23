import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/core';
import React from 'react';
import { generatePdf } from '@archireport/react-native-static-html-to-pdf';
import { WebView } from 'react-native-webview';
import { Box, VStack, Button, Spinner } from 'native-base';
import type { ParamsList } from './types';
import StaticServer from 'react-native-static-server';
import { DocumentDirectoryPath } from 'react-native-fs';

export default function Preview() {
  const route = useRoute<RouteProp<ParamsList, 'Preview'>>();

  const navigation = useNavigation<NavigationProp<ParamsList>>();

  const [url, setUrl] = React.useState<string>('');

  const serverRef = React.useRef<typeof StaticServer>(null);

  const webView = React.useRef<WebView>(null);

  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const server = new StaticServer(
      8084,
      `${DocumentDirectoryPath}/${route.params.uri}`
    );
    serverRef.current = server;

    server.start().then((u: string) => {
      setUrl(u);
      webView.current?.reload();
    });

    return () => {
      if (serverRef.current) {
        serverRef.current.stop();
        serverRef.current = null;
      }
    };
  }, [navigation, route.params.uri]);

  return (
    <Box flex="1" p="4">
      <VStack space={3} flex="1">
        {url ? (
          <WebView
            ref={webView}
            injectedJavaScriptBeforeContentLoaded={`
          window.onerror = function(message, sourcefile, lineno, colno, error) {
            alert("Message: " + message + " - Source: " + sourcefile + " Line: " + lineno + ":" + colno);
            return true;
          };
          true;
        `}
            style={{ flex: 1 }}
            source={{
              uri: url,
            }}
            onShouldStartLoadWithRequest={(request) => {
              // Only allow navigating within this website
              return request.url.startsWith(url);
            }}
            originWhitelist={['*']}
            allowUniversalAccessFromFileURLs
            javaScriptEnabled
          />
        ) : (
          <Box flex="1" alignItems="center" justifyContent="center">
            <Spinner />
          </Box>
        )}
        <Button
          isLoading={loading}
          onPress={async () => {
            try {
              setLoading(true);
              const pdf = await generatePdf({
                path: `${DocumentDirectoryPath}${route.params.uri}/index.html`,
                target: 'http://finishload.com',
                documentName: 'file.pdf',
                width: 612,
                height: 792,
              });

              navigation.navigate('Generated', { uri: pdf });
            } finally {
              setLoading(false);
            }
          }}
        >
          Generate
        </Button>
      </VStack>
    </Box>
  );
}
