import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import prettyBytes from 'pretty-bytes';

import setupEditors from './editor';

const { requestEditor, updateResponseEditor } = setupEditors();

const updateEndTime = (response) => {
  response.custom = response.custom ?? {};
  response.custom.time = new Date().getTime() - response.config.custom.startTime;

  return response;
};

const updateEndTimeOnError = (error) => Promise.reject(updateEndTime(error.response));

axios.interceptors.request.use((request) => {
  request.custom = request.custom ?? {};
  request.custom.startTime = new Date().getTime();

  return request;
});

axios.interceptors.response.use(
  updateEndTime,
  updateEndTimeOnError
);

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

  axios({
    url: urlInput.value,
    method: methodSelect.value,
    params: keyValuePairsToObject(queryParamsContainer),
    headers: keyValuePairsToObject(requestHeadersContainer),
  })
    .catch((error) => error)
    .then((response) => {
      showResponseSection();
      updateResponseDetails(response);
      updateResponseEditor(response.data);
      updateResponseHeaders(response.headers);
    });
};

queryParamsContainer.append(createKeyValuePair());
requestHeadersContainer.append(createKeyValuePair());

addQueryParamButton.addEventListener('click', handleQueryParamAdd);
addRequestHeaderButton.addEventListener('click', handleRequestHeaderAdd);

form.addEventListener('submit', handleRequestSend);