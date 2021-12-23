import * as React from 'react';
import { Box, Input, Button, VStack } from 'native-base';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {
  DocumentDirectoryPath,
  mkdir,
  moveFile,
  unlink,
  exists,
} from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import { generatePdf } from 'react-native-static-html-to-pdf';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import type { ParamsList } from './types';

export default function App() {
  const [url, setUrl] = React.useState<string>('');

  const navigation = useNavigation<NavigationProp<ParamsList>>();

  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <Box flex="1" padding={4}>
      <VStack space={3} flex="1">
        <Input
          value={url}
          size="lg"
          isFullWidth
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
          autoCorrect={false}
        />
        <Button
          isLoading={loading}
          onPress={async () => {
            try {
              setLoading(true);
              const res = await ReactNativeBlobUtil.config({
                fileCache: true,
              }).fetch('GET', url);

              const status = res.info().status;

              if (status === 200) {
                const path = res.path();

                const contentType = res.info().headers['Content-Type'];

                await mkdir(`${DocumentDirectoryPath}/public`);

                if (contentType.includes('application/zip')) {
                  const targetPath = `file://${DocumentDirectoryPath}/public`;

                  await unzip(path, targetPath);

                  const pdf = await generatePdf({
                    path: `${DocumentDirectoryPath}/public/export/default/index.html`,
                    target: 'http://finishload.com',
                    documentName: 'file.pdf',
                    width: 612,
                    height: 792,
                  });

                  navigation.navigate('Generated', { uri: pdf });
                } else {
                  const urlObj = new URL(url);

                  const directory = `${DocumentDirectoryPath}/public${urlObj.pathname}`;
                  await mkdir(directory);

                  const targetPath = `file://${directory}/index.html`;

                  if (await exists(targetPath)) {
                    await unlink(targetPath);
                  }
                  console.log({ targetPath });
                  await moveFile(path, targetPath);

                  const pdf = await generatePdf({
                    path: `${DocumentDirectoryPath}/public${urlObj.pathname}/index.html`,
                    target: 'http://finishload.com',
                    documentName: 'file.pdf',
                    width: 592,
                    height: 842,
                  });

                  navigation.navigate('Generated', { uri: pdf });
                }
              }
            } catch (err) {
              console.log(err);
            } finally {
              setLoading(false);
            }
          }}
        >
          Generate
        </Button>
        <Button
          isLoading={loading}
          onPress={async () => {
            try {
              setLoading(true);
              const res = await ReactNativeBlobUtil.config({
                fileCache: true,
              }).fetch('GET', url);

              const status = res.info().status;

              if (status === 200) {
                const path = res.path();

                const contentType = res.info().headers['Content-Type'];
                await mkdir(`${DocumentDirectoryPath}/public`);

                if (contentType.includes('application/zip')) {
                  const targetPath = `file://${DocumentDirectoryPath}/public`;

                  await unzip(path, targetPath);

                  navigation.navigate('Preview', {
                    uri: '/export/default',
                  });
                } else {
                  const urlObj = new URL(url);

                  const directory = `${DocumentDirectoryPath}/public${urlObj.pathname}`;
                  await mkdir(directory);

                  const targetPath = `file://${directory}/index.html`;

                  if (await exists(targetPath)) {
                    await unlink(targetPath);
                  }

                  await moveFile(path, targetPath);

                  navigation.navigate('Preview', {
                    uri: `${urlObj.pathname}`,
                  });
                }
              }
            } catch (err) {
              console.log(err);
            } finally {
              setLoading(false);
            }
          }}
        >
          Preview
        </Button>
      </VStack>
    </Box>
  );
}
