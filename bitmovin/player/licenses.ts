import * as urljoin from 'url-join';

import http, {utils} from '../utils/http';
import {HttpClient} from '../utils/types';

import domains from './domains';
import thirdPartyLicensing from './thirdPartyLicensing';

export const licenses = (configuration, httpClient: HttpClient) => {
  const {get, put} = httpClient;
  const resourceDetails = licenseId => {
    return {
      details: () => {
        const url = urljoin(configuration.apiBaseUrl, 'player/licenses', licenseId);
        return get(configuration, url);
      },
      update: license => {
        const url = urljoin(configuration.apiBaseUrl, 'player/licenses', licenseId);
        return put(configuration, url, license);
      },
      domains: domains(configuration, licenseId),
      thirdPartyLicensing: thirdPartyLicensing(configuration, licenseId)
    };
  };

  const list = utils.buildListCallFunction(
    httpClient,
    configuration,
    urljoin(configuration.apiBaseUrl, 'player/licenses')
  );

  const resource = Object.assign(resourceDetails, {list});
  return resource;
};

export default configuration => {
  return licenses(configuration, http);
};
