import { warn, loadScript } from "./util";
import { getOptions } from "../src/install";
import pageTracker from "./page-tracker";

export default function() {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const {
    enabled,
    globalObjectName,
    config,
    pageTrackerEnabled
  } = getOptions();

  if (!enabled) {
    window[`ga-disable-${config.id}`] = true;
  }

  window.dataLayer = window.dataLayer || [];
  window[globalObjectName] = function() {
    window.dataLayer.push(arguments);
  };

  window[globalObjectName]("js", new Date());
  window[globalObjectName]("config", config.id, config.params);

  if (pageTrackerEnabled) {
    pageTracker();
  }

  return loadScript(`https://www.googletagmanager.com/gtag/js?id=${config.id}`)
    .then(() => window[globalObjectName])
    .catch(error => {
      warn("Ops! Something happened and gtag.js couldn't be loaded", error);
      return error;
    });
}
