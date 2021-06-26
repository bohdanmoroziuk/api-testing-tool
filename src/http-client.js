import axios from 'axios';

const updateStartTime = (request) => {
  request.custom = request.custom ?? {};
  request.custom.startTime = new Date().getTime();

  return request;
};

const updateEndTime = (response) => {
  response.custom = response.custom ?? {};
  response.custom.time = new Date().getTime() - response.config.custom.startTime;

  return response;
};

const updateEndTimeOnError = (error) => Promise.reject(updateEndTime(error.response));

axios.interceptors.request.use(updateStartTime);

axios.interceptors.response.use(updateEndTime, updateEndTimeOnError);

export default axios;
