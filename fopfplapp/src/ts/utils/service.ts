import { HttpMethod, DomainUrl } from "./serviceutil";
import { ServiceName } from "./serviceconfig";

let __LOCAL__: boolean;
let __LOCAL_FUN__: Function;
let __LM__: string;
function invokeAPIWithCallbacks(
  url: ServiceName,
  method: HttpMethod,
  options: {
    queryParams?: string;
    headers?: {};
    setttingsAttrs?: object;
    data?: object;
    hideSpinner?: boolean;
  },

  onSuccess: Function,
  onError: Function
): void {
  if (!options.hideSpinner) $("#spinner-fade").show();
  let headers = { "Content-Type": "application/json", charset: "utf-8" };

  let svcEndPoint = `${DomainUrl.SERVICE_DOMAIN}${url}`;
  if (__LOCAL__) {
    const localFnct = __LOCAL_FUN__;
    svcEndPoint = localFnct(headers, url);
  }
  if (options.headers) headers = Object.assign(headers, options.headers);
  let requestSettings = {
    type: method,
    url: options.queryParams
      ? `${svcEndPoint}${options.queryParams}`
      : svcEndPoint,
    data: options.data ? JSON.stringify(options.data) : null,
    headers,
    ...(HttpMethod.GET === method && { cache: false })
  };
  if (options.setttingsAttrs)
    requestSettings = Object.assign(requestSettings, options.setttingsAttrs);
  $.ajax(requestSettings)
    .then((data, textStatus, jqXHR) => {
      if (!options.hideSpinner) $("#spinner-fade").hide();
      let responseText = jqXHR.responseText
        ? JSON.parse(jqXHR.responseText)
        : null;

      if (responseText) {
        if (
          responseText.Header &&
          responseText.Header.statusCode &&
          JSON.stringify(responseText.Header.statusCode).includes("ORA")
        ) {
          alert(responseText.Header.statusMessage);
          onError(responseText.Header.statusMessage);
          throw responseText.Header.statusMessage;
        } else {
          onSuccess(data);
        }
      } else {
        onSuccess(data);
      }
    })
}

export function invokeAPI(
  url: ServiceName,
  method: HttpMethod,
  options: {
    queryParams?: string;
    headers?: {};
    setttingsAttrs?: object;
    data?: object;
    hideSpinner?: boolean;
  }
): Promise<any> {
  return new Promise((resolve, reject) => {
    invokeAPIWithCallbacks(url, method, options, resolve, reject);
  });
}
