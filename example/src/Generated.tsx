import React from 'react';
import Share from 'react-native-share';
import { Box, Button, VStack, Input } from 'native-base';
import Pdf from 'react-native-pdf';
import { RouteProp, useRoute } from '@react-navigation/core';
import type { ParamsList } from './types';

export default function Generated() {
  const route = useRoute<RouteProp<ParamsList, 'Generated'>>();

  return (
    <Box flex={1} padding="4">
      <Input value={route.params.uri || ''} />
      <VStack space={3} flex="1">
        <Pdf source={{ uri: route.params.uri }} style={{ flex: 1 }} />
        <Button
          onPress={async () => {
            console.log(route.params.uri);
            const shareOptions = {
              title: 'Share via',
              message: 'Generated pdf',
              url: `file://${route.params.uri}`,
              failOnCancel: false,
            };

            await Share.open(shareOptions);
          }}
        >
          Download
        </Button>
      </VStack>
    </Box>
  );
}
