const dynamicComponentCommonProps = [{
    key: 'gridSize',
    displaylabel: 'Size',
    value: 6
}];
const apiCallFileds = [{
    key: 'url',
    displaylabel: 'Url',
    value: "",
}, {
    key: 'method',
    displaylabel: 'Method',
    value: "",
}, {
    key: 'paramas',
    displaylabel: 'paramas',
    value: [],
}, {
    key: 'stateKey',
    displaylabel: 'State',
    value: "",
}, {
    key: 'triggerpoint',
    displaylabel: 'Trigger on',
    options: [{
        id: 1,
        value: "onload"
    }, {
        id: 2,
        value: "change"
    }],
    value: "",
}];
const FiledProperitedList = {
    "SLTextField": {
        "label": 'Text filed',
        "icon":'text_fields',
        "type": 'SLTextField',
        "props": [{
            key: 'name',
            displaylabel: 'Name',
            value: 'Sample1'
        }, {
            key: 'placeholder',
            displaylabel: 'Place Holder',
            value: 'Sample1'
        }, {
            key: 'label',
            displaylabel: 'Label',
            value: 'Sample1'
        }],
        "dynamicComponentProps": dynamicComponentCommonProps
    },
    "SLTitle": {
        "label": 'Title',
        "icon":'titlecase',
        "type": 'SLTitle',
        "props": [{
            key: 'variant',
            displaylabel: 'Variant',
            value: 'h1'
        }, {
            key: 'title',
            displaylabel: 'Heading',
            value: 'Heading'
        }, {
            key: 'justifyContent',
            displaylabel: 'Allign',
            value: 'left'
        }],
        "dynamicComponentProps": dynamicComponentCommonProps
    },
    "SLSelectDropDown": {
        "label": 'Drop Down',
        "icon":'open_in_new',
        "type": 'SLSelectDropDown',
        "props": [{
            key: 'name',
            displaylabel: 'Name',
            value: 'Sample'
        }, {
            key: 'label',
            displaylabel: 'label',
            value: 'Sample'
        }, {
            key: 'options',
            displaylabel: 'Options State',
            value: []
        }, {
            key: 'mapvalues',
            displaylabel: 'Map values',
            value: {},
        }, {
            key: 'onchangeEventCallBack',
            displaylabel: 'Call Back After Select',
            value: "",
        }],
        "apiCall": apiCallFileds,
        "dynamicComponentProps": dynamicComponentCommonProps
    },
    "SLRadioButton": {
        "label": 'Radio',
        "icon":'radio_button_checked',
        "type": 'SLRadioButton',
        "props": [{
            key: 'name',
            displaylabel: 'Name',
            value: 'Sample'
        }, {
            key: 'label',
            displaylabel: 'label',
            value: 'Sample'
        },  {
            key: 'options',
            isApiCall:'NO',
            displaylabel: 'Options',
            value: ""
        }],
        "dynamicComponentProps": dynamicComponentCommonProps
    },
    "SLAutocomplete": {
        "label": 'Auto Complte ',
        "icon":'library_add',
        "type": 'SLAutocomplete',
        "props": [{
            key: 'name',
            displaylabel: 'Name',
            value: 'Sample'
        }, {
            key: 'label',
            displaylabel: 'label',
            value: 'Sample'
        },  {
            key: 'options',
            isDisplay:'no',
            displaylabel: 'Options',
            value: []
        },{
            key: 'mapvalues',
            displaylabel: 'Map values',
            value: {},
        }, {
            key: 'onchangeEventCallBack',
            isDisplay:'no',
            displaylabel: 'Onchange values',
            value: {},
        },{
            key: 'apiEndpoint',
            displaylabel: 'API',
            value: {},
        } ],
        //"apiCall": apiCallFileds,
        "dynamicComponentProps": dynamicComponentCommonProps
    },
}


export default FiledProperitedList;