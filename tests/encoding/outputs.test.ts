import {outputs} from '../../bitmovin/encoding/outputs';
import {
  assertItCallsCorrectUrl,
  assertItReturnsUnderlyingPromise,
  mockDelete,
  mockGet,
  mockHttp,
  mockPost,
  testSetup
} from '../assertions';
import {getConfiguration} from '../utils';

const testConfiguration = getConfiguration();

describe('encoding', () => {
  describe('outputs', () => {
    beforeEach(testSetup);
    const client = outputs(testConfiguration, mockHttp);

    const testOutputType = type => {
      describe(type, () => {
        describe('list', () => {
          assertItCallsCorrectUrl('GET', `/v1/encoding/outputs/${type}`, client[type].list);
          assertItReturnsUnderlyingPromise(mockGet, client[type].list);
        });
        describe('create', () => {
          assertItCallsCorrectUrl('POST', `/v1/encoding/outputs/${type}`, () => client[type].create({}));
          assertItReturnsUnderlyingPromise(mockPost, client[type].list);
        });
        describe('item', () => {
          describe('details', () => {
            assertItCallsCorrectUrl('GET', `/v1/encoding/outputs/${type}/output-id`, client[type]('output-id').details);
            assertItReturnsUnderlyingPromise(mockPost, client[type]('output-id').details);
          });
          describe('customData', () => {
            assertItCallsCorrectUrl(
              'GET',
              `/v1/encoding/outputs/${type}/output-id/customData`,
              client[type]('output-id').customData
            );
            assertItReturnsUnderlyingPromise(mockPost, client[type]('output-id').customData);
          });
          describe('delete', () => {
            assertItCallsCorrectUrl(
              'DELETE',
              `/v1/encoding/outputs/${type}/output-id`,
              client[type]('output-id').delete
            );
            assertItReturnsUnderlyingPromise(mockDelete, client[type]('output-id').delete);
          });
        });
      });
    };

    testOutputType('azure');
    testOutputType('ftp');
    testOutputType('gcs');
    testOutputType('s3');
    testOutputType('sftp');
    testOutputType('local');

    describe('list', () => {
      describe('un parameterized list call', () => {
        assertItCallsCorrectUrl('GET', '/v1/encoding/outputs', client.list);
        assertItReturnsUnderlyingPromise(mockGet, client.list);
      });

      describe('list call with limit only', () => {
        const limit = 100;
        const expectedGetParameter = 'limit=' + limit;
        assertItCallsCorrectUrl('GET', '/v1/encoding/outputs\\?' + expectedGetParameter, () => client.list(limit));
        assertItReturnsUnderlyingPromise(mockGet, () => client.list(limit));
      });

      describe('list call with offset only', () => {
        const offset = 0;
        const expectedGetParameter = 'offset=' + offset;
        assertItCallsCorrectUrl('GET', '/v1/encoding/outputs\\?' + expectedGetParameter, () =>
          client.list(undefined, offset)
        );
        assertItReturnsUnderlyingPromise(mockGet, () => client.list(undefined, offset));
      });

      describe('list call with sort only', () => {
        const sort = 'createdAt:DESC';
        const expectedGetParameter = 'sort=' + sort;
        assertItCallsCorrectUrl('GET', '/v1/encoding/outputs\\?' + expectedGetParameter, () =>
          client.list(undefined, undefined, sort)
        );
        assertItReturnsUnderlyingPromise(mockGet, () => client.list(undefined, undefined, sort));
      });

      describe('list call with multiple double filter only', () => {
        const filter = {
          type: ['VOD', 'LIVE'],
          status: ['RUNNING', 'QUEUED']
        };

        const expectedGetParameter = 'type=VOD,LIVE&status=RUNNING,QUEUED';
        assertItCallsCorrectUrl('GET', '/v1/encoding/outputs\\?' + expectedGetParameter, () =>
          client.list(undefined, undefined, undefined, filter)
        );
        assertItReturnsUnderlyingPromise(mockGet, () => client.list(undefined, undefined, undefined, filter));
      });

      describe('fully parameterized list call with multiple double filter', () => {
        const limit = 100;
        const offset = 0;
        const sort = 'createdAt:ASC';
        const filter = {
          type: ['VOD', 'LIVE'],
          status: ['RUNNING', 'QUEUED']
        };

        const expectedGetParameter =
          'type=VOD,LIVE&status=RUNNING,QUEUED&limit=' + limit + '&offset=' + offset + '&sort=' + sort;
        assertItCallsCorrectUrl('GET', '/v1/encoding/outputs\\?' + expectedGetParameter, () =>
          client.list(limit, offset, sort, filter)
        );
        assertItReturnsUnderlyingPromise(mockGet, () => client.list(limit, offset, sort, filter));
      });
    });
    describe('getType', () => {
      assertItCallsCorrectUrl('GET', '/v1/encoding/outputs/output-id/type', () => client.getType('output-id'));
      assertItReturnsUnderlyingPromise(mockGet, () => client.getType('output-id'));
    });
  });
});
