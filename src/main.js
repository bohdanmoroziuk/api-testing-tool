import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import prettyBytes from 'pretty-bytes';

import httpClient from './http-client';
import setupEditors from './editor';

const { getRequestEditorContent, updateResponseEditorContent } = setupEditors();

const form = document.querySelector('[data-form]');

const methodSelect = document.querySelector('[data-method]');
const urlInput = document.querySelector('[data-url]');

const queryParamsContainer = document.querySelector('[data-query-params]');
const requestHeadersContainer = document.querySelector('[data-request-headers]');

const addQueryParamButton = document.querySelector('[data-add-query-param-btn]');
const addRequestHeaderButton = document.querySelector('[data-add-request-header-btn]');

const keyValueTemplate = document.querySelector('[data-key-value-template]');

const responseSection = document.querySelector('[data-response-section]');
const responseHeadersContainer = document.querySelector('[data-headers]');

const showResponseSection = () => {
  responseSection.classList.remove('d-none');
};

const updateResponseHeaders = (headers) => {
  responseHeadersContainer.innerHTML = '';

  Object.entries(headers).forEach(([key, value]) => {
    const keyElement = document.createElement('div');
    const valueElement = document.createElement('div');

    keyElement.textContent = key;
    valueElement.textContent = value;

    responseHeadersContainer.append(keyElement, valueElement);
  });
};

const updateResponseDetails = (response) => {
  const { 
    data,
    status, 
    headers,
    custom: { time } 
  } = response;

  const size = prettyBytes(
    JSON.stringify(data).length +
    JSON.stringify(headers).length
  );

  document.querySelector('[data-status]').textContent = status;
  document.querySelector('[data-time]').textContent = time;
  document.querySelector('[data-size]').textContent = size;
};

const keyValuePairsToObject = (container) => {
  const pairs = container.querySelectorAll('[data-key-value-pair]');

  return [...pairs].reduce((data, pair) => {
    const key = pair.querySelector('[data-key]').value;
    const value = pair.querySelector('[data-value]').value;

    if (key === '') return data;

    return { ...data, [key]: value };
  }, {})
};

const handleQueryParamAdd = () => {
  queryParamsContainer.append(createKeyValuePair());
};

const handleRequestHeaderAdd = () => {
  requestHeadersContainer.append(createKeyValuePair());
};

const createKeyValuePair = () => {
  const element = keyValueTemplate.content.cloneNode(true);

  const handleElementRemove = (event) => {
    event.target.closest('[data-key-value-pair]').remove();
  };

  element
    .querySelector('[data-remove-btn]')
    .addEventListener('click', handleElementRemove);

  return element;
};

const handleRequestSend = (event) => {
  event.preventDefault();

  let data = null;

  try {
    data = JSON.parse(getRequestEditorContent());
  } catch (error) {
    alert('JSON data is malformed');
    return;
  }

  httpClient.request({
    url: urlInput.value,
    method: methodSelect.value,
    params: keyValuePairsToObject(queryParamsContainer),
    headers: keyValuePairsToObject(requestHeadersContainer),
    data,
  })
    .catch((error) => error)
    .then((response) => {
      showResponseSection();
      updateResponseDetails(response);
      updateResponseHeaders(response.headers);
      updateResponseEditorContent(response.data);
    });
};

queryParamsContainer.append(createKeyValuePair());
requestHeadersContainer.append(createKeyValuePair());

addQueryParamButton.addEventListener('click', handleQueryParamAdd);
addRequestHeaderButton.addEventListener('click', handleRequestHeaderAdd);

form.addEventListener('submit', handleRequestSend);
