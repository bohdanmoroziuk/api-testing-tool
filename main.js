import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const form = document.querySelector('[data-form]');

const methodSelect = document.querySelector('[data-method]');
const urlInput = document.querySelector('[data-url]');

const queryParamsContainer = document.querySelector('[data-query-params]');
const requestHeadersContainer = document.querySelector('[data-request-headers]');

const addQueryParamButton = document.querySelector('[data-add-query-param-btn]');
const addRequestHeaderButton = document.querySelector('[data-add-request-header-btn]');

const keyValueTemplate = document.querySelector('[data-key-value-template]');

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
    .then(response => console.log(response.data))
    .catch(console.error);
};

queryParamsContainer.append(createKeyValuePair());
requestHeadersContainer.append(createKeyValuePair());

addQueryParamButton.addEventListener('click', handleQueryParamAdd);
addRequestHeaderButton.addEventListener('click', handleRequestHeaderAdd);

form.addEventListener('submit', handleRequestSend);