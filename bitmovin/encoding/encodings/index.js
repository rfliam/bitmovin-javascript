// @flow

import urljoin from 'url-join';

import http, {utils} from '../../utils/http';
import type {Delete, Details, List, Create, BitmovinConfiguration, CustomData, HttpClient} from '../../utils/types';

import streams, {type Streams} from './streams';
import muxings, {type Muxings} from './muxings';

export const encodings = (configuration: BitmovinConfiguration, http: HttpClient): Encodings => {
  const {get, post, delete_} = http;

  let fn = encodingId => {
    return {
      details: () => {
        let url = urljoin(configuration.apiBaseUrl, 'encoding/encodings', encodingId);
        return get(configuration, url);
      },
      liveDetails: () => {
        let url = urljoin(configuration.apiBaseUrl, 'encoding/encodings', encodingId, 'live');
        return get(configuration, url);
      },
      customData: () => {
        let url = urljoin(configuration.apiBaseUrl, 'encoding/encodings', encodingId, 'customData');
        return get(configuration, url);
      },
      delete: () => {
        let url = urljoin(configuration.apiBaseUrl, 'encoding/encodings', encodingId);
        return delete_(configuration, url);
      },
      start: startConfiguration => {
        let url = urljoin(configuration.apiBaseUrl, 'encoding/encodings', encodingId, 'start');
        return post(configuration, url, startConfiguration);
      },
      stop: () => {
        let url = urljoin(configuration.apiBaseUrl, 'encoding/encodings', encodingId, 'stop');
        return post(configuration, url);
      },
      startLive: startLiveConfiguration => {
        let url = urljoin(configuration.apiBaseUrl, 'encoding/encodings', encodingId, 'live', 'start');
        return post(configuration, url, startLiveConfiguration);
      },
      stopLive: () => {
        let url = urljoin(configuration.apiBaseUrl, 'encoding/encodings', encodingId, 'live', 'stop');
        return post(configuration, url);
      },
      status: () => {
        let url = urljoin(configuration.apiBaseUrl, 'encoding/encodings', encodingId, 'status');
        return get(configuration, url);
      },
      streams: streams(configuration, encodingId),
      muxings: muxings(configuration, encodingId)
    };
  };

  fn.create = encoding => {
    let url = urljoin(configuration.apiBaseUrl, 'encoding/encodings');
    return post(configuration, url, encoding);
  };

  fn.list = (limit, offset, sort, filter) => {
    let url = urljoin(configuration.apiBaseUrl, 'encoding/encodings');

    const filterParams = utils.buildFilterParamString(filter);
    let getParams = utils.buildGetParamString({
      ...filterParams,
      limit: limit,
      offset: offset,
      sort: sort
    });
    if (getParams.length > 0) {
      url = urljoin(url, getParams);
    }

    return get(configuration, url);
  };

  return fn;
};

type Encoding = {
  cloudRegion: string
};

type EncodingDetail = (
  id: string
) => {
  details: Details<Encoding>,
  delete: Delete<{}>,
  customData: CustomData,
  liveDetails: Details<Object>,
  start: Create<Object>,
  stop: Details<Object>,
  startLive: Create<Object>,
  stopLive: Details<Object>,
  status: Details<Object>,
  streams: Streams,
  muxings: Muxings
};

export type Encodings = {
  $call: EncodingDetail,
  create: Create<Encoding>,
  list: List<Encoding>
};

export default (configuration: BitmovinConfiguration): Encodings => {
  return encodings(configuration, http);
};