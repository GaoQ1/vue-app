import axios from 'axios'
import Cookies from 'js-cookie'
import { baseUrl } from '@/config/baseConfig'
import { bus } from '@/assets/bus'

/***
	@option object
	{
		method 请求方式
		url 请求路径
		data post请求数据
		params get请求数据
	}
***/
const gq_axios = function(option){
  let { url, method, params, ...config } = option;
  url = baseUrl + buildUrl(url,paramSerializer(params));

  return axios({
    url,
    method,
    headers: {
      'Authorization': Cookies.get('sessionId')
    },
    ...config
  })
  .then(checkStatus)
	.catch(catchError)
}

function paramSerializer(params={}) {
	let parts = [];
	Object.keys(params).forEach((key)=>{
		if(typeof params[key] !== 'object' && params[key] !== undefined)
			parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
	})
	return parts.join('&');
};

function buildUrl(url, serializedParams) {
	if (serializedParams.length > 0) {
		url += ((url.indexOf('?') === -1) ? '?' : '&') + serializedParams;
	}
	return url;
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    if(response.data.errCode == 0){
      return Promise.resolve(response.data)
    }else{
      return Promise.reject(response.data.errMessage)
    }
  } else {
    return Promise.reject(response.error)
  }
}

function catchError(error){
  bus.$emit('error', error)
}

export function get(url, {...config} = {}) {
  return gq_axios({
    url,
    method: 'GET',
    ...config
  })
}

export function post(url, {...config} = {}) {
  return gq_axios({
    url,
    method: 'POST',
    ...config
  })
}

export function put(url, {...config} = {}) {
  return gq_axios({
    url,
    method: 'PUT',
    ...config
  })
}

export function patch(url, {...config} = {}) {
  return gq_axios({
    url,
    method: 'PATCH',
    ...config
  })
}

export function axiosDelete(url, {...config} = {}) {
  return gq_axios({
    url,
    method: 'DELETE',
    ...config
  })
}
