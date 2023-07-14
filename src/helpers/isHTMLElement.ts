export const isHTMLElement = (candidate: any): candidate is HTMLElement => {
  return candidate instanceof HTMLElement;
};
