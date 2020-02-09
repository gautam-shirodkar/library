const STORAGE_OPTIONS     = [localStorage, sessionStorage];
export const STORAGE_TYPE = STORAGE_OPTIONS[0];

export enum ToasterPosition {
    topRight     = 'toast-top-right',
    bottomRight  = 'toast-bottom-right',
    bottomCenter = 'toast-bottom-center',
    topCenter    = 'toast-top-center'
    // Other positions you would like
}
