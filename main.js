import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const queryParamsContainer = document.querySelector('[data-query-params]');
const requestHeadersContainer = document.querySelector('[data-request-headers]');

const addQueryParamButton = document.querySelector('[data-add-query-param-btn]');
const addRequestHeaderButton = document.querySelector('[data-add-request-header-btn]');

const keyValueTemplate = document.querySelector('[data-key-value-template]');

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

queryParamsContainer.append(createKeyValuePair());
requestHeadersContainer.append(createKeyValuePair());

addQueryParamButton.addEventListener('click', handleQueryParamAdd);
addRequestHeaderButton.addEventListener('click', handleRequestHeaderAdd);